/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('InformacionCliente', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		}
	}, {
		schema: 'scl', timestamps: false, tableName: 'InformacionCliente'
	});
};
