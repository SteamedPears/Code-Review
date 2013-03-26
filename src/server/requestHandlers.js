// Libraries
var url = require('url');
var uuid = require('node-uuid');
var redis = require('redis').createClient();

/******************************************************************************
* Handle DB errors                                                            *
******************************************************************************/
redis.on('error', function (err) {
  console.log('DB Error: ' + err);
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
  console.log('===ERROR===', errno, errtext);
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
exports.codeByID = function codeByID(request, response) {
  var query = url.parse(request.url, true).query;
  var id = query.id;
  if (id === undefined) {
    return error(response, 400, 'Invalid code id');
  }
  redis.get('code:' + id, function(err, reply) {
    if (err !== null) {
      return error(response, 500, 'Error while reading from database.');
    }
    if (reply === null) {
      return error(response, 404, 'Code not found');
    }
    return success(response, JSON.parse(reply));
  });
};

exports.commentsOnLine = function commentsOnLine(request, response) {
  var query = url.parse(request.url, true).query;
  var id = query.code_id;
  var line = query.line;
  if (id === undefined) {
    return error(response, 400, 'Invalid comment id');
  }
  if (line === undefined) {
    return error(response, 400, 'Invalid line number');
  }
  redis.lrange('comment:' + id + ':' + line, 0, -1, function(err, reply) {
    if (err !== null) {
      return error(response, 500, 'Error while reading from database.');
    }
    if (reply === null) {
      return error(response, 404, 'Comment not found');
    }
    var out = [];
    for (var i in reply) {
      out.push(JSON.parse(reply[i]));
    }
    return success(response, out);
  });
};

exports.countComments = function countComments(request, response) {
  var query = url.parse(request.url, true).query;
  var code_id = query.code_id;
  redis.smembers('comment:' + code_id + ':indices', function(err, reply) {
    if (err !== null) {
      return error(response, 500, 'Error while reading from database.');
    }
    if (reply === null) {
      return error(response, 404, 'Comments not found.');
    }
    var multi = redis.multi();
    for (var i in reply) {
      if (reply.hasOwnProperty(i)) {
        console.log(i, reply[i]);
        multi.llen('comment:' + code_id + ':' + reply[i]);
      }
    }
    multi.exec(function(err, replies) {
      var out = {};
      replies.forEach(function(value, index) {
        console.log(index, reply[index], value);
        out[reply[index]] = value;
      });
      return success(response, out);
    });
  });
};

/******************************************************************************
* Setters                                                                     *
******************************************************************************/
exports.newcode = function newcode(request, response) {
  // do some basic validation
  var obj = request.body;
  if (obj === null || !isValidString(obj.text)) {
    return error(response, 400, 'Invalid code text.');
  }
  var id=uuid.v4();
  redis.set('code:' + id, JSON.stringify(obj), function(err) {
    if (err !== null) {
      return error(response, 500, 'Error while writing to database.');
    }
    return success(response, {id:id});
  });
};

exports.newcomment = function newcomment(request, response) {
  // reject if no referer
  if (request === null ||
     request.headers === undefined ||
     request.headers.referer === undefined) {
    return error(response, 400, 'Invalid referer');
  }
  // do some basic validation
  var fields = request.body;
  if (fields === null ||
     !isValidString(fields.user) ||
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
  redis.multi()
    .lpush('comment:' + fields.code_id + ':' + fields.line_start,
           JSON.stringify(fields))
    .sadd('comment:' + fields.code_id + ':indices', fields.line_start)
    .exec(function(err) {
      if (err !== null) {
        return error(response, 500, 'Error while writing to database.');
      }
      return success(response, fields);
    });
};

/* vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80: */
