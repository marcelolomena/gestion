/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('GarantiasPersonas', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
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
		FechaEstadoSituacion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Notas: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		schema: 'dbo', timestamps: false, tableName: 'GarantiasPersonas'
	});
};
