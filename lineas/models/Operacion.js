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
		Monto: {
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
		Linea_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		
	}, {
		schema: 'scl', timestamps: false, tableName: 'Operacion'
	});
};
