/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('GarantiasEstatales', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Porcentajecobertura: {
			type: DataTypes.STRING,
			allowNull: true
		},
		FogapeFogain: {
			type: DataTypes.STRING,
			allowNull: true
		},
		DestinoFondos: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		schema: 'scl', timestamps: false, tableName: 'GarantiasEstatales'
	});
};
