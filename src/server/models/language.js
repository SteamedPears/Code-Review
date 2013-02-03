/******************************************************************************
* Language Object Model                                                       *
******************************************************************************/

module.exports = function(sequelize, DataTypes) {
    var Language = sequelize.define('Language',{
	id: {
	    type: DataTypes.INTEGER,
	    primaryKey: true,
	    autoIncrement: true
	},
	mode: {
	    type: DataTypes.TEXT,
	    validate: {
		notNull: true,
		notEmpty: true
	    }
	},
	description: {
	    type: DataTypes.TEXT,
	    validate: {
		notNull: true,
		notEmpty: true
	    }
	}
    });

    return Language;
};