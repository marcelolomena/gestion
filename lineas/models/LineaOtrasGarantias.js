/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('LineaOtrasGarantias', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Linea_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		OtrasGarantias_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		schema: 'scl', timestamps: false, tableName: 'LineaOtrasGarantias'
	});
};
