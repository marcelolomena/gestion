/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Operacion', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		TipoOperacion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		NumeroProducto: {
			type: DataTypes.STRING,
			allowNull: true
		},
		FechaOtorgamiento: {
			type: DataTypes.STRING,
			allowNull: true
		},
		FechaProxVenc: {
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
		MontoActual: {
			type: DataTypes.STRING,
			allowNull: true
		},
		MontoActualMLinea: {
			type: DataTypes.STRING,
			allowNull: true
		},
		MontoActualMNac: {
			type: DataTypes.STRING,
			allowNull: true
		},
		EstadoOperacion_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		NumeroOperacion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		DescripcionProducto: {
			type: DataTypes.STRING,
			allowNull: true
		},
		FechaDesembolso: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		schema: 'scl', timestamps: false, tableName: 'Operacion'
	});
};
