/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('TipoAprobacion', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		Nombre: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		schema: 'scl', timestamps: false, tableName: 'TipoAprobacion'
	});
};
