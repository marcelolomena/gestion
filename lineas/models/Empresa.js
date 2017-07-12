/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Empresa', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Nombre: {
			type: DataTypes.STRING,
			allowNull: true
		},
		RazonSocial: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Rut: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		schema: 'dbo', timestamps: false, tableName: 'Empresa'
	});
};
