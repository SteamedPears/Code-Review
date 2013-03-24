// Libraries
var url = require('url');
var Sequelize = require('sequelize');
var DB_Info = require('./models/db_info');
var uuid = require('node-uuid');

// make the db connection
var sequelize = new Sequelize(DB_Info.db,
                              DB_Info.user,
                              DB_Info.pw,
                              DB_Info.options);

// import the models
var Code = sequelize.import(__dirname + '/models/code');
var Comment = sequelize.import(__dirname + '/models/comment');

// set the associations
Code.hasMany(Comment, {as: 'Comments', foreignKey: 'code_id'});

/******************************************************************************
* Helper Functions                                                            *
******************************************************************************/
function success(response,ob) {
  response.writeHead(200, {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*'
  });
  response.write(JSON.stringify(ob));
  response.end();
}

function error(response,errno,errtext) {
  console.log('===ERROR===',errno,errtext);
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
exports.code = function code(request,response) {
  var query = url.parse(request.url, true).query;
  var id = query.id;
  if(id === undefined) {
    return error(response,400,'Invalid code id');
  }
  Code
    .find({where:{uuid:id}})
    .success(function(code) {
      if(code === null) {
        return error(response,404,'Code not found');
      }
      return success(response,code);
    });
};

exports.comment = function comment(request,response) {
  var query = url.parse(request.url, true).query;
  var id = query.id;
  if(id === undefined) {
    return error(response,400,'Invalid comment id');
  }
  Comment
    .find(Number(id))
    .success(function(comment) {
      if(comment === null) {
        return error(response,404,'Comment not found');
      }
      return success(response,comment);
    });
};

exports.comments = function comments(request,response) {
  var query = url.parse(request.url, true).query;
  var code_id = query.code_id;
  Comment.findAll({where: {code_id: code_id}}).success(function(comments) {
    return success(response,{code_id:code_id,comments:comments});
  });
};

/******************************************************************************
* Setters                                                                     *
******************************************************************************/
exports.newcode = function newcode(request,response) {
  // do some basic validation
  var obj = request.body;
  if(obj === null || !isValidString(obj.text)) {
    return error(response,400,'Invalid code text.');
  }
  var id=uuid.v4();
  Code.build({
    uuid: id,
    text: obj.text,
    lang: obj.lang
  }).save().success(function(code){
    return success(response,code);
  }).error(function(err){
    return error(response,500,'Error writing code to database');
  });
};

exports.newcomment = function newcomment(request,response) {
  // reject if no referer
  if(request === null ||
     request.headers === undefined ||
     request.headers.referer === undefined) {
    return error(response,400,'Invalid referer');
  }
  // do some basic validation
  var fields = request.body;
  if(fields === null ||
     !isValidString(fields.user) ||
     !isValidString(fields.text) ||
     !isValidPositiveIntegerString(fields.line_start) ||
     !isValidPositiveIntegerString(fields.line_end)) {
    return error(response,400,'Invalid field');
  }
  // make sure the line numbers are sane
  if(Number(fields.line_start) > Number(fields.line_end)) {
    return error(response,400,'Invalid line numbers');
  }
  // first find the code associated with the new comment
  Code.find({where:{uuid:fields.code_id}})
    .success(function (code) {
      if(code === null) {
        return error(response,400,'Invalid code id');
      }
      // Once we've established it's legit, build the comment
      Comment.build({
        user: fields.user,
        code_id: fields.code_id,
        line_start: fields.line_start,
        line_end: fields.line_end,
        text: fields.text,
        diffs: fields.diffs
      }).save()
        .success(function(comment){ // success!!
          return success(response,comment);
        }).error(function(err) { // invalid comment
          return error(response,502,'Error while saving comment');
        });
    });
};

/* vim: set softtabstop=2 shiftwidth=2 tabstop=8 expandtab textwidth=80: */
