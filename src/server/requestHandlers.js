// Libraries
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
exports.codeByID = function codeByID(request, response) {
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

exports.commentCount = function commentCount(request, response) {
  var query = url.parse(request.url, true).query;
  var code_id = query.code_id;
  db.hgetall('comment:' + code_id + ':indices', function(err, indices) {
    if (err !== null) {
      return error(response, 500, 'Error while reading from database.');
    }
    if (indices === null) {
      return error(response, 404, 'Comments not found.');
    }
    return success(response, indices);
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
  db.set('code:' + id, JSON.stringify(obj), function(err) {
    if (err !== null) {
      return error(response, 500, 'Error while writing code to database.');
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
  var comment_key = 'comment:' + fields.code_id + ':' + fields.line_start;
  return db.lpush(comment_key, JSON.stringify(fields), function(err) {
    if (err !== null) {
      return error(response, 500, 'Error writing comment to database.');
    }
    var indices_key = 'comment:' + fields.code_id + ':indices';
    return db.hincrby(indices_key, fields.line_start, 1, function(err) {
      if (err !== null) {
        return error(response, 500, 'Error incrementing count in database.');
      }
      return success(response, fields);
    });
  });
};

/* vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80: */
