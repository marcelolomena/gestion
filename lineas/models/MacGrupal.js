/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('MacGrupal', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		FechaPresentacion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		EjecutivoControl: {
			type: DataTypes.STRING,
			allowNull: true
		},
		FechaVencimiento: {
			type: DataTypes.STRING,
			allowNull: true
		},
		RatingGrupo: {
			type: DataTypes.STRING,
			allowNull: true
		},
		NivelAtribucion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		SometidoAprobacion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Plazos: {
			type: DataTypes.STRING,
			allowNull: true
		},
		AprobadoTotal: {
			type: DataTypes.STRING,
			allowNull: true
		},
		NombreAprobacion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		FirmaAprobacion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		ValorMonedaUf: {
			type: DataTypes.STRING,
			allowNull: true
		},
		ValorMonedaDolares: {
			type: DataTypes.STRING,
			allowNull: true
		},
		TotalAprobacionPesos: {
			type: DataTypes.STRING,
			allowNull: true
		},
		TotalAprobacionUf: {
			type: DataTypes.STRING,
			allowNull: true
		},
		ObservacionComiteRiesgo: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Grupo_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		schema: 'dbo', timestamps: false, tableName: 'MacGrupal'
	});
};
