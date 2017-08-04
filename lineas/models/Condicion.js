/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Condicion', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		Descripcion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Sublinea_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		schema: 'scl', timestamps: false, tableName: 'Condicion'
	});
};
