/******************************************************************************
* Code Object Model                                                           *
******************************************************************************/

module.exports = function(sequelize, DataTypes) {
	var Code = sequelize.define('Code',{
	id: {
		type: DataTypes.STRING,
		primaryKey: true,
		notNull: true,
		notEmpty: true
	},
	text: {
		type: DataTypes.TEXT,
		validate: {
		notNull: true,
		notEmpty: true
		}
	},
	language_id: {
		type: DataTypes.INTEGER,
		validate: {
		notNull: true,
		notEmpty: true,
		isNumeric: true,
		isInt: true
		}
	}
	},{
	// don't pluralize code
	freezeTableName: true
	});

	return Code;
};