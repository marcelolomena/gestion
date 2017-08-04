/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Aprobacion', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		Nombre: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Rut: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Actividad: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Oficina: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Ejecutivo: {
			type: DataTypes.STRING,
			allowNull: true
		},
		FechaCreacion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		FechaVenc: {
			type: DataTypes.STRING,
			allowNull: true
		},
		FechaVencAnt: {
			type: DataTypes.STRING,
			allowNull: true
		},
		RatingInd: {
			type: DataTypes.STRING,
			allowNull: true
		},
		RatingGrupo: {
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
		FechaInfFin: {
			type: DataTypes.STRING,
			allowNull: true
		},
		PromSaldoVista: {
			type: DataTypes.STRING,
			allowNull: true
		},
		DeudaSbifDirecta: {
			type: DataTypes.STRING,
			allowNull: true
		},
		DeudaSbifIndirecta: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Penetracion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Leasing: {
			type: DataTypes.STRING,
			allowNull: true
		},
		NivelAtribucion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Empresa_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		TipoAprobacion_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		EstadoAprobacion_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		schema: 'scl', timestamps: false, tableName: 'Aprobacion'
	});
};
