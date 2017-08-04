/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Operacion', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
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
		Sublinea_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		Linea_Id: {
			type: DataTypes.INTEGER,
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
		
	}, {
		schema: 'scl', timestamps: false, tableName: 'Operacion'
	});
};
