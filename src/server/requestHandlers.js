// Libraries
var url = require("url");
var querystring = require("querystring");
var formidable = require("formidable");
var Sequelize = require("sequelize");
var DB_Info = require("./models/db_info");
var uuid = require('node-uuid');

// make the db connection
var sequelize = new Sequelize(DB_Info.db,
                              DB_Info.user,
                              DB_Info.pw,
                              DB_Info.options);

// import the models
var Code = sequelize.import(__dirname + "/models/code");
var Comment = sequelize.import(__dirname + "/models/comment");
var langs = require('./languageList.js');

// set the associations
Code.hasMany(Comment, {as: 'Comments', foreignKey: 'code_id'});

/******************************************************************************
* Helper Functions                                                            *
******************************************************************************/
function success(response,ob) {
	response.writeHead(200, {
		"Content-Type" : "application/json", 
		"Access-Control-Allow-Origin" : "*"
	});
	response.write(JSON.stringify(ob));
	response.end();
}

function error(response,errno,errtext) {
	response.writeHead(errno, {"Content-Type": "application/json"});
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
function code(request,response) {
	var query = url.parse(request.url).query;
	var params = querystring.parse(query);
	var id = params["id"];
	if(id === undefined) {
		return error(response,400,'Invalid code id');
	}
	console.log('Finding code with id '+id);
	Code
		.find({where:{uuid:id}})
		.success(function(code) {
			if(code === null) {
				return error(response,404,'Code not found');
			}
			return success(response,code);
		});
}

function comment(request,response) {
	var query = url.parse(request.url).query;
	var params = querystring.parse(query);
	var id = params["id"];
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
}

function comments(request,response) {
	var query = url.parse(request.url).query;
	var params = querystring.parse(query);
	var code_id = params["code_id"];
	Comment.findAll({where: {code_id: code_id}}).success(function(comments) {
		return success(response,{code_id:code_id,comments:comments});
	});
}

/******************************************************************************
* Setters                                                                     *
******************************************************************************/
function newcode(request,response) {

	//On validation or parsing success
	var writetodb = function(err,obj, files) {
			// do some basic validation

			if( obj === null || !isValidString(obj['text'])) {
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
				console.log('===ERROR===');
				console.log(err);
				return error(response,500,'Error writing code to database');
			});
	}
	if (request.method && request.method.toUpperCase() === 'OPTIONS') {
		response.writeHead(
				"204",
				"No Content",
				{
					"access-control-allow-origin": "*",
					"access-control-allow-methods": "POST, OPTIONS",
					"access-control-allow-headers": "content-type, accept",
					"access-control-max-age": 10, // Seconds.
					"content-length": 0
				});

		return response.end();
	}

	//Test if request is a form or a json object
	var content_type = request.headers['content-type'];
	if (content_type && content_type.indexOf('x-www-form-urlencoded') >= 0) {
		var form = new formidable.IncomingForm();
		form.type = 'multipart';
		form.parse(request, writetodb );
	}
	//Handle JSON
	else if (content_type && content_type.indexOf('application/json') >= 0) {
		
		request.setEncoding('utf8');
		var json_str = '';

		request.on('data', function(chunk) {
			json_str += chunk;
		});

		request.on('end', function() {
			var json_obj = JSON.parse(json_str);
			writetodb(undefined,json_obj, undefined);
		});
	}
	//Otherwise, fail gracefully
	else {
		return error(response,400,'Invalid content type header.');
	}
}

function newcomment(request,response) {
	// reject if no referer
	if(request === null ||
	   request.headers === undefined ||
	   request.headers.referer === undefined) {
		return error(response,400,'Invalid referer');
	}
	var query = url.parse(request.headers.referer).query;
	var params = querystring.parse(query);
	// otherwise, go ahead
	var form = new formidable.IncomingForm();
	form.type = 'multipart';
	form.parse(request, function(err, fields, files) {
		// do some basic validation
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
						console.log('===ERROR===');
						console.log(err);
						return error(response,502,'Error while saving comment');
					});
			});
	});
}

/******************************************************************************
* Errors                                                                      *
******************************************************************************/
function not_found(request,response) {
	return error(response,404,'Path not found');
}

/******************************************************************************
* Exports                                                                     *
******************************************************************************/
exports.code = code;
exports.comment = comment;
exports.comments = comments;
exports.newcode = newcode;
exports.newcomment = newcomment;
exports.not_found = not_found;
