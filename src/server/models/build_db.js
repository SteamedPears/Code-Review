// includes
var Sequelize = require("sequelize");
var DB_Info = require("./db_info");

// make the db connection
var sequelize = new Sequelize(DB_Info.db,
                              DB_Info.user,
                              DB_Info.pw,
                              DB_Info.options);

// import the models
var Code = sequelize.import(__dirname + "/code");
var Comment = sequelize.import(__dirname + "/comment");

// do it
Code.sync();
Comment.sync();
