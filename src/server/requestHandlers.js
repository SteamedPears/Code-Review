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
function success(response) {
	response.writeHead(200, {"Content-Type": "application/json"});
}

function error(response,errno,content) {
	response.writeHead(errno, {"Content-Type": content});
}

function redirect(response,location) {
	response.writeHead(302, {"Location":location});
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
		error(response,404);
		response.write('{"id":-1,"text":"Code not found"}');
		response.end();
		return;
	}
	console.log('Finding code with id '+id);
	Code
		.find({where:{uuid:id}})
		.success(function(code) {
			if(code === null) {
				error(response,404,"text/plain");
				response.write("Code with id ");
				response.write(id);
				response.write(" not found.");
				response.end();
				return;
			}
			success(response);
            code.id = code.uuid;
			response.write(JSON.stringify(code));
			response.end();
		})
		.error(function(error) {
			error(response,404,"text/plain");
			response.write("An error occured while finding code with id ");
			response.write(id); response.write("\n");
			response.write("Error object: ");
			response.write(JSON.stringify(error));
			response.end();
		});
}

function comment(request,response) {
	var query = url.parse(request.url).query;
	var params = querystring.parse(query);
	var id = params["id"];
	if(id === undefined) {
		error(response,404);
		response.write('{"id":-1,"text":"Comment not found"}');
		response.end();
		return;
	}
	Comment.find(Number(id)).success(function(comment) {
		if(comment === null) {
			error(response,404,"text/plain");
			response.write("Comment with id ");
			response.write(id);
			response.write(" not found.");
			response.end();
			return;
		}
		success(response);
		response.write(JSON.stringify(comment));
		response.end();
	});
}

function comments(request,response) {
	var query = url.parse(request.url).query;
	var params = querystring.parse(query);
	var code_id = params["code_id"];
	Comment.findAll({where: {code_id: code_id}}).success(function(comments) {
		success(response);
		response.write('{"code_id":"'+code_id+
					   '","comments":'+JSON.stringify(comments)+'}');
		response.end();
	});
}

function language(request,response) {
	function responseError(id) {
		error(response,404);
		response.write('{"id":'+id+' ,"text":"Language not found"}');
		response.end();
	}


	var query = url.parse(request.url).query;
	var params = querystring.parse(query);
	var idString = params["id"];
	var id;

	// Check if numeric
	// http://stackoverflow.com/questions/18082/validate-numbers-in-javascript-isnumeric
	if (!isNaN(parseFloat(idString)) && isFinite(idString)) {
		id = parseFloat(idString,10);

	}
	else {
		responseError(idString);
		return;
	}

	// Within bounds
	if (id >= langs.length + 1 || id < 1) {
		responseError(id);
		return;
	}

	id--; // Convert to zero index for langs array
	var returnLang = langs[id];

	success(response);
	response.write(JSON.stringify(returnLang));
	response.end();
}

function languages(request,response) {
	success(response);
	response.write('{"languages":'+JSON.stringify(langs)+'}');
	response.end();
}

/******************************************************************************
* Setters                                                                     *
******************************************************************************/
function newcode(request,response) {
	var form = new formidable.IncomingForm();
	form.type = 'multipart';
	form.parse(request, function(error, fields, files) {
		// do some basic validation
		if(fields === null || !isValidString(fields.text)) {
			redirect(response,"/index.html?error=Can't review empty code");
            console.log("Invalid new code submission")
			return;
		}
		var id=uuid.v4();
		Code.build({
			uuid: id,
			text: fields.text,
			language_id: 0 + new Number(fields.language_id)
		}).save().success(function(code){
			redirect(response,"/view.html?id="+id);
		}).error(function(error){
			console.log('===ERROR===');
			console.log(error);
			redirect(response,"/index.html?error=Invalid code");
		});
	});
}

function newcomment(request,response) {
	// reject if no referer
	if(request === null ||
	   request.headers === undefined ||
	   request.headers.referer === undefined) {
		redirect(response,"/index.html?error=No referer");
		return;
	}
	var query = url.parse(request.headers.referer).query;
	var params = querystring.parse(query);
	// otherwise, go ahead
	var form = new formidable.IncomingForm();
	form.type = 'multipart';
	form.parse(request, function(error, fields, files) {
		console.log('============================================================');
		console.log('NEW COMMENT');
		console.log('============================================================');
		console.log(error);
		console.log('============================================================');
		// do some basic validation
		if(fields === null ||
		   !isValidString(fields.user) ||
		   !isValidString(fields.text) ||
		   !isValidPositiveIntegerString(fields.line_start) ||
		   !isValidPositiveIntegerString(fields.line_end)) {
			redirect(response,'/view.html?id='+params.id+"&error=Invalid field");
			return;
		}
		// make sure the line numbers are sane
		if(Number(fields.line_start) > Number(fields.line_end)) {
			redirect(response,'/view.html?id='+params.id+"&error=Invalid line numbers");
		}
		// first find the code associated with the new comment
		Code.find({where:{uuid:fields.code_id}})
			.success(function (code) {
				if(code === null) {
					redirect(response,
							 "/view.html?id="+params.id+"&error=Invalid code id");
					return;
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
						redirect(response,"/view.html?id="+fields.code_id);
					}).error(function(error) { // invalid comment
						console.log('===ERROR===');
						console.log(error);
						redirect(response,
								 "/view.html?id="+params.id+"&error=Invalid comment");
					});
			}).error(function(error) { // couldn't find associated code
				redirect(response,
						 "/view.html?id="+params.id+"&error=Invalid code id");
			});
	});
}

/******************************************************************************
* Errors                                                                      *
******************************************************************************/
function not_found(request,response) {
	error(response,404);
	response.write('{"id":-1,"text":"Path not found"}');
	response.end();
}

/******************************************************************************
* Exports                                                                     *
******************************************************************************/
exports.code = code;
exports.comment = comment;
exports.comments = comments;
exports.language = language;
exports.languages = languages;
exports.newcode = newcode;
exports.newcomment = newcomment;
exports.not_found = not_found;
