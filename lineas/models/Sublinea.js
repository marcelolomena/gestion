/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Sublinea', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Numero: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Riesgo: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Descripcion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Moneda: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Aprobado: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Utilizado: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Reservado: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Condicion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Disponible: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Estado: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Linea_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		schema: 'scl', timestamps: false, tableName: 'Sublinea'
	});
};
