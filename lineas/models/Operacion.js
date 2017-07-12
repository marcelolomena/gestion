/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Operacion', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Plazo: {
			type: DataTypes.STRING,
			allowNull: true
		},
		TipoCredito: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Moneda: {
			type: DataTypes.STRING,
			allowNull: true
		},
		MontoInicial: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Tasa: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Vencimiento: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Curse: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Sublinea_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		MontoActual: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Otorgamiento: {
			type: DataTypes.STRING,
			allowNull: true
		},
		FechaIngreso: {
			type: DataTypes.STRING,
			allowNull: true
		},
		VencimientoCurse: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Citidoc: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		schema: 'dbo', timestamps: false, tableName: 'Operacion'
	});
};
