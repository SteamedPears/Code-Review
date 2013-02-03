// includes
var Sequelize = require("sequelize");
var DB_Info = require("./db_info");

// make the db connection
var sequelize = new Sequelize(DB_Info.db,DB_Info.user,DB_Info.pw);

// import the models
var Code = sequelize.import(__dirname + "/code");
var Comment = sequelize.import(__dirname + "/comment");
var Language = sequelize.import(__dirname + "/language");

// do it
Code.drop();
Comment.drop();
Language.drop();
