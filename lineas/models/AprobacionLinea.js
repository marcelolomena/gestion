/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('AprobacionLinea', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		Aprobacion_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		Linea_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		schema: 'scl', timestamps: false, tableName: 'AprobacionLinea'
	});
};
