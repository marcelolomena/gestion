/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('usr_login', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		uid: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: true
		},
		hora: {
			type: DataTypes.DATE,
			allowNull: true
		},
		idsistema: {
			type: DataTypes.INTEGER,
			allowNull: true,
			primaryKey: true
		},
		dia: {
			type: DataTypes.STRING,
			allowNull: true
		},
		borrado: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		tableName: 'usr_login'
	});
};
