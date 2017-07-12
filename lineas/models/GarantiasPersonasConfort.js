/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('GarantiasPersonasConfort', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		RutSuscriptor: {
			type: DataTypes.STRING,
			allowNull: true
		},
		NombreSuscriptor: {
			type: DataTypes.STRING,
			allowNull: true
		},
		PatrimonioSuscriptor: {
			type: DataTypes.STRING,
			allowNull: true
		},
		TipoConfortLetter: {
			type: DataTypes.STRING,
			allowNull: true
		},
		FechaEmisionConfort: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Notas: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		schema: 'dbo', timestamps: false, tableName: 'GarantiasPersonasConfort'
	});
};
