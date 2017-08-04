/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('EmpresaSublinea', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		Empresa_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		Sublinea_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		schema: 'scl', timestamps: false, tableName: 'EmpresaSublinea'
	});
};
