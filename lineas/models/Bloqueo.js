/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Bloqueo', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		Monto: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Activo: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		Sublinea_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		schema: 'scl', timestamps: false, tableName: 'Bloqueo'
	});
};
