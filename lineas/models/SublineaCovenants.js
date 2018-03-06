/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('SublineaCovenants', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Covenants_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		Sublinea_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		schema: 'dbo', timestamps: false, tableName: 'SublineaCovenants'
	});
};
