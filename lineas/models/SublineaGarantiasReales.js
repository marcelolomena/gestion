/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('SublineaGarantiasReales', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		GarantiasReales_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		Sublinea_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		schema: 'scl', timestamps: false, tableName: 'SublineaGarantiasReales'
	});
};
