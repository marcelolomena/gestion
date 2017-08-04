/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('GrupoEmpresa', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		Empresa_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		Grupo_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		AComite: {
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
		}
	}, {
		schema: 'scl', timestamps: false, tableName: 'GrupoEmpresa'
	});
};
