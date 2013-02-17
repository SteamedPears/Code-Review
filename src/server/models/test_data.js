// includes
var Sequelize = require("sequelize");
var DB_Info = require(__dirname + "/db_info");

// make the db connection
var sequelize = new Sequelize(DB_Info.db,
                              DB_Info.user,
                              DB_Info.pw,
                              DB_Info.options);

// import the models
var Code = sequelize.import(__dirname + "/code");
var Comment = sequelize.import(__dirname + "/comment");

// create some test data
Code.build({
    uuid: '1',
	text: 'print "Hello, world!"',
	lang : 'python3'
}).save().success(function(helloCode) {
	Comment.build({
		user: 'sdp',
		code_id: helloCode.uuid,
		line_start: 0,
		line_end: 0,
		text: 'Nice job.'
	}).save();
});
