/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Grupo', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Nombre: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		schema: 'scl', timestamps: false, tableName: 'Grupo'
	});
};
