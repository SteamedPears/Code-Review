// Libraries
var https = require('https');
var url = require('url');
var uuid = require('node-uuid');
var db = require('redis').createClient();

/******************************************************************************
* Handle DB errors                                                            *
******************************************************************************/
db.on('error', function (err) {
  console.error('DB Error: ' + err);
});

/******************************************************************************
* Helper Functions                                                            *
******************************************************************************/
function success(response, ob) {
  response.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  response.write(JSON.stringify(ob));
  response.end();
}

function error(response, errno, errtext) {
  console.error('===ERROR===', errno, errtext);
  response.writeHead(errno, {'Content-Type': 'application/json'});
  response.write(JSON.stringify({error:errtext}));
  response.end();
}

function isUndefined(x) {
  return x === undefined;
}

function isString(x) {
  return (typeof x) === 'string';
}

function isBlank(str) {
  return str.trim() === '';
}

function isValidString(x) {
  return !isUndefined(x) && isString(x) && !isBlank(x);
}

function isValidPositiveIntegerString(x) {
  return isValidString(x) && x.trim().match(/^\d+$/) !== null;
}

/******************************************************************************
* Getters                                                                     *
******************************************************************************/
function codeByID(request, response) {
  var query = url.parse(request.url, true).query;
  var id = query.id;
  if (id === undefined) {
    return error(response, 400, 'Invalid code id');
  }
  db.get('code:' + id, function(err, reply) {
    if (err !== null) {
      return error(response, 500, 'Error while reading from database.');
    }
    if (reply === null) {
      return error(response, 404, 'Code not found');
    }
    return success(response, JSON.parse(reply));
  });
};

function commentsOnLine(request, response) {
  var query = url.parse(request.url, true).query;
  var id = query.code_id;
  var line = query.line;
  if (id === undefined) {
    return error(response, 400, 'Invalid comment id');
  }
  if (line === undefined) {
    return error(response, 400, 'Invalid line number');
  }
  db.lrange('comment:' + id + ':' + line, 0, -1, function(err, reply) {
    if (err !== null) {
      return error(response, 500, 'Error while reading from database.');
    }
    if (reply === null) {
      return error(response, 404, 'Comment not found');
    }
    var out = [];
    reply.forEach(function(value) {
      out.push(JSON.parse(value));
    });
    return success(response, out);
  });
};

function commentCount(request, response) {
  var query = url.parse(request.url, true).query;
  var code_id = query.code_id;
  db.smembers('comment:' + code_id + ':indices', function(err, indices) {
    if (err !== null) {
      return error(response, 500, 'Error while reading from database.');
    }
    if (indices === null) {
      return error(response, 404, 'Comments not found.');
    }
    var multi = db.multi();
    indices.forEach(function(index) {
      multi.llen('comment:' + code_id + ':' + index);
    });
    multi.exec(function(err, lengths) {
      var out = {};
      lengths.forEach(function(length, i) {
        out[indices[i]] = length;
      });
      return success(response, out);
    });
  });
};

/******************************************************************************
* Setters                                                                     *
******************************************************************************/
function newcode(request, response) {
  // do some basic validation
  var obj = request.body;
  if (obj === null || !isValidString(obj.text)) {
    return error(response, 400, 'Invalid code text.');
  }
  var id=uuid.v4();
  db.set('code:' + id, JSON.stringify(obj), function(err) {
    if (err !== null) {
      return error(response, 500, 'Error while writing to database.');
    }
    return success(response, {id:id});
  });
};

function newcomment(request, response) {
  // reject if no referer
  if (request === null ||
     request.headers === undefined ||
     request.headers.referer === undefined) {
    return error(response, 400, 'Invalid referer');
  }
  // do some basic validation
  var fields = request.body;
  if (fields === null ||
     !isValidString(fields.text) ||
     !isValidPositiveIntegerString(fields.line_start) ||
     !isValidPositiveIntegerString(fields.line_end)) {
    return error(response, 400, 'Invalid field');
  }
  // make sure the line numbers are sane
  if (Number(fields.line_start) > Number(fields.line_end)) {
    return error(response, 400, 'Invalid line numbers');
  }
  // upon successfully saving comment, this function will update comment indices
  var data = {
    user: 'Anonymous',
    code_id: fields.code_id,
    text: fields.text,
    line_start: fields.line_start,
    line_end: fields.line_end,
    diffs: fields.diffs
  };
  if(request.session.email) {
    console.log('new comment by ' + request.session.email);
    data.user = request.session.email;
  }
  db.multi()
    .rpush('comment:' + data.code_id + ':' + data.line_start,
           JSON.stringify(data))
    .sadd('comment:' + data.code_id + ':indices', data.line_start)
    .exec(function(err) {
      if (err !== null) {
        return error(response, 500, 'Error while writing to database.');
      }
      return success(response, data);
    });
};

/******************************************************************************
* Authentication                                                              *
*                                                                             *
* In the event of implementing more than just persona for authentication, you *
* should replace most of the following code with a library like               *
*                                                                             *
* passport           http://passportjs.org/                                   *
* passport-browserid https://github.com/jaredhanson/passport-browserid        *
*                                                                             *
******************************************************************************/

module.exports = function(host, clientPort) {
  var exports = {};
  
  exports.login = function login(request, response) {
    if(request === null ||
       request.body === null ||
       request.body.assertion === null) {
      return error(response, 400, 'Invalid assertion');
    }
    var assertion = request.body.assertion;
    var content = 'assertion=' + assertion + '&audience=http://';
    content += host + ':' + clientPort;
    var auth_request = https.request({
      host: 'verifier.login.persona.org',
      port: 443,
      path: '/verify',
      method: 'POST',
      headers: {'Content-Length': content.length,
                'Content-Type': 'application/x-www-form-urlencoded'}
    },function(auth_response) {
      var data_ob = null;
      // assume uft8
      auth_response.setEncoding('utf8');
      auth_response.on('data',function(data) {
        data_ob = JSON.parse(data);
      });
      auth_response.on('end',function() {
        if (auth_response.statusCode === 200 &&
            data_ob !== null &&
            data_ob.status === 'okay') {
          request.session.email = data_ob.email;
          return success(response, {email: data_ob.email});
        } else {
          return error(response,
                       auth_response.statusCode,
                       'Error validating assertion');
        }
      });
    });

    auth_request.write(content);
    auth_request.end();
  };

  exports.logout = function logout(request, response) {
    delete request.session.email;
    return success(response, {});
  };

  exports.codeByID = codeByID;
  exports.commentsOnLine = commentsOnLine;
  exports.commentCount = commentCount;
  exports.newcode = newcode;
  exports.newcomment = newcomment;

  return exports;
};

/* vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80: */
