/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Producto', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Operacion_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		Operacion_IdSublimite: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		schema: 'dbo', timestamps: false, tableName: 'Producto'
	});
};
