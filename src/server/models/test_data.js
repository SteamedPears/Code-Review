// includes
var Sequelize = require("sequelize");
var DB_Info = require(__dirname + "/db_info");

// make the db connection
var sequelize = new Sequelize(DB_Info.db,DB_Info.user,DB_Info.pw);

// import the models
var Code = sequelize.import(__dirname + "/code");
var Comment = sequelize.import(__dirname + "/comment");

// create some test data
Code.build({
	text: 'print "Hello, world!"',
	language_id : 39
}).save().success(function(helloCode) {
	Comment.build({
		user: 'sdp',
		code_id: helloCode.id,
		line_start: 1,
		line_end: 1,
		text: 'Nice job.'
	}).save();
});
