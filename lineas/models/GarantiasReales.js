/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('GarantiasReales', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Descripcion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Valorizacion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		NumeroFolio: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Estados: {
			type: DataTypes.STRING,
			allowNull: true
		},
		TipoGarantia: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Secuencia: {
			type: DataTypes.STRING,
			allowNull: true
		},
		TipoMoneda: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Tasacion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		ValorLiquidacion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		ValorComercial: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Notas: {
			type: DataTypes.STRING,
			allowNull: true
		},
		ClausulaGarantias: {
			type: DataTypes.STRING,
			allowNull: true
		},
		RutGarante: {
			type: DataTypes.STRING,
			allowNull: true
		},
		NombreGarante: {
			type: DataTypes.STRING,
			allowNull: true
		},
		PatrimonioAval: {
			type: DataTypes.STRING,
			allowNull: true
		},
		EstadoSituacion: {
			type: DataTypes.STRING,
			allowNull: true
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
		EmisionConfort: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		schema: 'scl', timestamps: false, tableName: 'GarantiasReales'
	});
};
