/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('GrupoEmpresa', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Empresa_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		Grupo_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		Vigente: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		schema: 'scl', timestamps: false, tableName: 'GrupoEmpresa'
	});
};
