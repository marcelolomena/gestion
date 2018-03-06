/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('LineaCovenants', {
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
		Covenants_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		schema: 'dbo', timestamps: false, tableName: 'LineaCovenants'
	});
};
