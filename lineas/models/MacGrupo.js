/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('MacGrupo', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Acomite: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		FechaCreacion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		FechaPresentacion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Comentario: {
			type: DataTypes.STRING,
			allowNull: true
		},
		PromSaldoVista: {
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
		TotalSometidoAprobacion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		GrupoEmpresa_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		EstadoAprobacion_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		MacGrupo_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
			schema: 'scl', timestamps: false, tableName: 'MacGrupo'
		});
};
