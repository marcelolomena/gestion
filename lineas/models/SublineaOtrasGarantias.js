/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('SublineaOtrasGarantias', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		OtrasGarantias_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		Sublinea_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		schema: 'dbo', timestamps: false, tableName: 'SublineaOtrasGarantias'
	});
};
