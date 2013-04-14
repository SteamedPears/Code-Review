// Libraries
var https = require('https');
var url = require('url');
var uuid = require('node-uuid');
var querystring = require('querystring');
var util = require('util');
var db = require('redis').createClient();

// The methods on this object will be exported as the public api
var public_api = {};

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
    'Content-Type': 'application/json'
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
public_api.codeByID = function codeByID(request, response) {
  var query = url.parse(request.url, true).query;
  var id = query.id;
  if (id === undefined) {
    return error(response, 400, 'Invalid code id');
  }
  db.get('code:' + id, function(err, reply) {
    if (err !== null) {
      return error(response, 500, 'Error while reading from database');
    }
    if (reply === null) {
      return error(response, 404, 'Code not found');
    }
    try {
      var data = JSON.parse(reply);
    } catch(err) {
      return error(response, 500, 'Error while parsing database reply');
    }
    return success(response, data);
  });
};

public_api.commentsOnLine = function commentsOnLine(request, response) {
  var query = url.parse(request.url, true).query;
  var code_id = query.code_id;
  var line = query.line;
  if (code_id === undefined) {
    return error(response, 400, 'Invalid code id');
  }
  if (line === undefined) {
    return error(response, 400, 'Invalid line number');
  }
  db.lrange('comment:' + code_id + ':' + line, 0, -1, function(err, reply) {
    if (err !== null) {
      return error(response, 500, 'Error while reading from database');
    }
    if (reply === null) {
      return error(response, 404, 'Comment not found');
    }
    var out = [];
    reply.forEach(function(value) {
      try {
        out.push(JSON.parse(value));
      } catch(err) {
        return error(response, 500, 'Error while parsing database reply');
      }
    });
    return success(response, out);
  });
};

// Retrieves from the database the hashtable mapping line numbers to number of
// comments that start on that line
public_api.commentCount = function commentCount(request, response) {
  var query = url.parse(request.url, true).query;
  var code_id = query.code_id;
  if(code_id === undefined) {
    return error(response, 400, 'Invalid code id');
  }
  db.hgetall('comment:' + code_id + ':indices', function(err, indices) {
    if (err !== null) {
      return error(response, 500, 'Error while reading from database');
    }
    if (indices === null) {
      return error(response, 404, 'Comments not found');
    }
    return success(response, indices);
  });
};

/******************************************************************************
* Setters                                                                     *
******************************************************************************/

// Return the anti-CSRF token the client needs to send with POST requests. Since
// this URI is not CORS-whitelisted, only same-origin scripts can get it.
// Intended to respond to GET requests (but Connect dependencies put it here).
public_api.anticsrf = function anticsrf(request, response) {
  return success(response, {csrf_token: request.session._csrf});
}

public_api.newcode = function newcode(request, response) {
  // do some basic validation
  var fields = request.body;
  if (!fields || !fields.text || !isValidString(fields.text)) {
    return error(response, 400, 'Invalid code text.');
  }
  if(!fields.lang || !isValidString(fields.lang)) {
    return error(response, 400, 'Invalid code lang.');
  }
  var id=uuid.v4();
  // whitelist the data fields
  var data = {
    text: fields.text,
    lang: fields.lang
  };
  db.set('code:' + id, JSON.stringify(data), function(err) {
    if (err !== null) {
      return error(response, 500, 'Error while writing code to database.');
    }
    return success(response, {id:id});
  });
};

// Add the comment to the database and also update the hashtable that maps line
// numbers to number of comments that start on that line
public_api.newcomment = function newcomment(request, response) {
  // reject if no referer
  if (!request.headers || !request.headers.referer) {
    return error(response, 400, 'Invalid referer');
  }
  // do some basic validation
  var fields = request.body;
  if (!(fields &&
        isValidString(fields.text) &&
        isValidPositiveIntegerString(fields.line_start) &&
        isValidPositiveIntegerString(fields.line_end))) {
    return error(response, 400, 'Invalid field');
  }
  // make sure the line numbers are sane
  if (Number(fields.line_start) > Number(fields.line_end)) {
    return error(response, 400, 'Invalid line numbers');
  }
  // whitelist the data fields
  var data = {
    user: 'Anonymous',
    code_id: fields.code_id,
    text: fields.text,
    line_start: parseInt(fields.line_start),
    line_end: parseInt(fields.line_end),
    diffs: fields.diffs
  };
  if(request.session.email) {
    data.user = request.session.email;
  }
  var comment_key = 'comment:' + data.code_id + ':' + data.line_start;
  var transaction = db.multi();
  transaction.rpush(comment_key, JSON.stringify(data));
  var indices_key = 'comment:' + data.code_id + ':indices';
  transaction.hincrby(indices_key, data.line_start, 1);
  return transaction.exec(function(err) {
    if (err !== null) {
      return error(response, 500, 'Error writing comment to database.');
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
  public_api.login = function login(request, response) {
    if ( !( request.body && request.body.assertion )) {
      return error(response, 400, 'Invalid assertion');
    }
    var assertion = request.body.assertion;
    var content = querystring.stringify({
      assertion: assertion,
      audience: util.format('http://%s:%s',host,clientPort)
    });
    var auth_request = https.request({
      host: 'verifier.login.persona.org',
      port: 443,
      path: '/verify',
      method: 'POST',
      headers: {'Content-Length': content.length,
                'Content-Type': 'application/x-www-form-urlencoded'}
    },function(auth_response) {
      var data_str = '';
      // assume uft8
      auth_response.setEncoding('utf8');
      auth_response.on('data',function(data) {
        data_str += data;
      });
      auth_response.on('end',function() {
        try {
          var data_ob = JSON.parse(data_str);
        } catch(err) {
          return error(response, 500, 'Invalid verification server response');
        }
        if (auth_response.statusCode === 200 &&
            data_ob && data_ob.status === 'okay') {
          request.session.email = data_ob.email;
          return success(response, {email: data_ob.email});
        } else {
          return error(response,401,'Error validating assertion');
        }
      });
    });

    auth_request.write(content);
    auth_request.end();
  };

  public_api.logout = function logout(request, response) {
    delete request.session.email;
    return success(response, {});
  };

  return public_api;
};

/* vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80: */
