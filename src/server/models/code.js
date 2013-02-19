/******************************************************************************
* Code Object Model                                                           *
******************************************************************************/

module.exports = function(sequelize, DataTypes) {
	var Code = sequelize.define('Code',{
	    uuid: {
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
	    lang: {
		    type: DataTypes.STRING,
		    validate: {
		        notNull: true,
		        notEmpty: true,
		    }
	    }
	},{
	    // don't pluralize code
	    freezeTableName: true
	});

	return Code;
};