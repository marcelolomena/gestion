/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('MacGrupalMacIndividual', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		MacIndividual_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		MacGrupal_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		schema: 'dbo', timestamps: false, tableName: 'MacGrupalMacIndividual'
	});
};
