/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('SublineaOperacion', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		Sublinea_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		Operacion_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		schema: 'scl', timestamps: false, tableName: 'SublineaOperacion'
	});
};
