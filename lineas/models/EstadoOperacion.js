/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('EstadoOperacion', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		Nombre: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Operacion_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		schema: 'scl', timestamps: false, tableName: 'EstadoOperacion'
	});
};
