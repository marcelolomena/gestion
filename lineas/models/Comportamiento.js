/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Comportamiento', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Comportamiento: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		schema: 'scl', timestamps: false, tableName: 'Comportamiento'
	});
};
