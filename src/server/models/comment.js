/******************************************************************************
* Comment Object Model                                                        *
******************************************************************************/

module.exports = function(sequelize, DataTypes) {
	var Comment = sequelize.define('Comment',{
		user: {
			type: DataTypes.STRING,
			validate: {
				notNull: true,
				notEmpty: true
			}
		},
		code_id: {
			type: DataTypes.STRING,
			validate: {
				notNull: true,
				notEmpty: true,
			}
		},
		line_start: {
			type: DataTypes.INTEGER,
			validate: {
				notNull: true,
				notEmpty: true,
				isNumeric: true,
				isInt: true
			}
		},
		line_end: {
			type: DataTypes.INTEGER,
			validate: {
				notNull: true,
				notEmpty: true,
				isNumeric: true,
				isInt: true
			}
		},
		text: {
			type: DataTypes.TEXT,
			validate: {
				notNull: true,
				notEmpty: true
			}
		},
		diffs: {
			type: DataTypes.TEXT,
			validate: {
				notNull: true,
			}
		}
	});

	return Comment;
};