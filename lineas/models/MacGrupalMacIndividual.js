/* jshint indent: 1 */

module.exports = function (sequelize, DataTypes) {
	return sequelize.define('MacGrupalMacIndividual', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		MacIndividual_Id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'MacIndividual',
				key: 'Id'
			}
		},
		MacGrupal_Id: {
			type: DataTypes.INTEGER,
			allowNull: true,
			references: {
				model: 'MacGrupal',
				key: 'Id'
			}
		}
	}, {
			schema: 'scl', timestamps: false, tableName: 'MacGrupalMacIndividual'
		});
};
