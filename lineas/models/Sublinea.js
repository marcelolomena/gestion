/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Sublinea', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Linea_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		Numero: {
			type: DataTypes.STRING,
			allowNull: true
		},
		TipoRiesgo: {
			type: DataTypes.STRING,
			allowNull: true
		},
		PlazoResudual: {
			type: DataTypes.STRING,
			allowNull: true
		},
		MontoAprobado: {
			type: DataTypes.STRING,
			allowNull: true
		},
		DeudaActual: {
			type: DataTypes.STRING,
			allowNull: true
		},
		MontoAprobacion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Moneda: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Comentario: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Tipolimite: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Garantiaestatal: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		schema: 'dbo', timestamps: false, tableName: 'Sublinea'
	});
};
