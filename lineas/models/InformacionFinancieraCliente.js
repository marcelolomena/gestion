/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('InformacionFinancieraCliente', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		VaciandoBalance: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Iva: {
			type: DataTypes.STRING,
			allowNull: true
		},
		DeudaDirectaIndirecta: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		schema: 'scl', timestamps: false, tableName: 'InformacionFinancieraCliente'
	});
};
