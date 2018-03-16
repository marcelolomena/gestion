/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('MacIndividual', {
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
		Rut: {
			type: DataTypes.STRING,
			allowNull: true
		},
		ActividadEconomica: {
			type: DataTypes.STRING,
			allowNull: true
		},
		RatingGrupal: {
			type: DataTypes.STRING,
			allowNull: true
		},
		NivelAtribucion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		RatingIndividual: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Clasificacion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Vigilancia: {
			type: DataTypes.STRING,
			allowNull: true
		},
		FechaInformacionFinanciera: {
			type: DataTypes.STRING,
			allowNull: true
		},
		PromedioSaldoVista: {
			type: DataTypes.STRING,
			allowNull: true
		},
		DeudaSbif: {
			type: DataTypes.STRING,
			allowNull: true
		},
		AprobadoVinculado: {
			type: DataTypes.STRING,
			allowNull: true
		},
		EquipoCobertura: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Oficina: {
			type: DataTypes.STRING,
			allowNull: true
		},
		FechaCreacion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		FechaVencimiento: {
			type: DataTypes.STRING,
			allowNull: true
		},
		FechaVencimientoMacAnterior: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Empresa_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		schema: 'dbo', timestamps: false, tableName: 'MacIndividual'
	});
};
