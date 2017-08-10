/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Linea', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
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
		ColorCondicion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Disponible: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Bloqueado: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Plazo: {
			type: DataTypes.STRING,
			allowNull: true
		},
		FechaVencimiento: {
			type: DataTypes.STRING,
			allowNull: true
		},
		BORRARCOMEN: {
			type: DataTypes.STRING,
			allowNull: true
		},
		BORRARCOND: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		schema: 'scl', timestamps: false, tableName: 'Linea'
	});
};
