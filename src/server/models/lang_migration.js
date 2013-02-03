// includes
var Sequelize = require("sequelize");
var DB_Info = require(__dirname + "/db_info");

// make the db connection
var sequelize = new Sequelize(DB_Info.db,DB_Info.user,DB_Info.pw);

// import the models
var Code = sequelize.import(__dirname + "/code");

Code.find(1).success(function(code) {
    code.language_id = 38; // python 2
    code.save();
});

Code.find(2).success(function(code) {
    code.language_id = 21; // javascript
    code.save();
});

Code.find(3).success(function(code) {
    code.language_id = 21; // javascript
    code.save();
});

Code.find(4).success(function(code) {
    code.language_id = 21; // javascript
    code.save();
});

Code.find(5).success(function(code) {
    code.language_id = 21; // javascript
    code.save();
});

Code.find(6).success(function(code) {
    code.language_id = 21; // javascript
    code.save();
});

Code.find(7).success(function(code) {
    code.language_id = 38; // python 2
    code.save();
});

Code.find(8).success(function(code) {
    code.language_id = 1; // plain text
    code.save();
});

Code.find(9).success(function(code) {
    code.language_id = 29; // mysql
    code.save();
});

Code.find(10).success(function(code) {
    code.language_id = 38; // python 2 
    code.save();
});

Code.find(11).success(function(code) {
    code.language_id = 1; // plain text
    code.save();
});

Code.find(12).success(function(code) {
    code.language_id = 4; // C++
    code.save();
});

Code.find(13).success(function(code) {
    code.language_id = 4; // C++
    code.save();
});

Code.find(14).success(function(code) {
    code.language_id = 1; // plain text
    code.save();
});

Code.find(15).success(function(code) {
    code.language_id = 1; // plain text
    code.save();
});

Code.find(16).success(function(code) {
    code.language_id = 21; // javascript
    code.save();
});

Code.find(17).success(function(code) {
    code.language_id = 1; // plain text
    code.save();
});

Code.find(18).success(function(code) {
    code.language_id = 1; // plain text
    code.save();
});

Code.find(19).success(function(code) {
    code.language_id = 21; // javascript
    code.save();
});

Code.find(20).success(function(code) {
    code.language_id = 1; // plain text
    code.save();
});

Code.find(21).success(function(code) {
    code.language_id = 1; // plain text
    code.save();
});

Code.find(22).success(function(code) {
    code.language_id = 21; // javascript
    code.save();
});

Code.find(23).success(function(code) {
    code.language_id = 1; // plain text
    code.save();
});

Code.find(24).success(function(code) {
    code.language_id = 47; // scheme
    code.save();
});

Code.find(25).success(function(code) {
    code.language_id = 38; // python 2 
    code.save();
});

Code.find(26).success(function(code) {
    code.language_id = 38; // python 2 
    code.save();
});

Code.find(27).success(function(code) {
    code.language_id = 1; // plain text
    code.save();
});

Code.find(28).success(function(code) {
    code.language_id = 21; // javascript
    code.save();
});

Code.find(29).success(function(code) {
    code.language_id = 1; // plain text
    code.save();
});

Code.find(30).success(function(code) {
    code.language_id = 38; // python 2 
    code.save();
});

Code.find(31).success(function(code) {
    code.language_id = 21; // javascript
    code.save();
});

Code.find(32).success(function(code) {
    code.language_id = 24; // jsp
    code.save();
});

Code.find(33).success(function(code) {
    code.language_id = 38; // python 2 
    code.save();
});

Code.find(34).success(function(code) {
    code.language_id = 1; // plain text
    code.save();
});

Code.find(35).success(function(code) {
    code.language_id = 21; // javascript
    code.save();
});

Code.find(36).success(function(code) {
    code.language_id = 21; // javascript
    code.save();
});
