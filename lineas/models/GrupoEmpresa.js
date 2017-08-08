/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('GrupoEmpresa', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		Empresa_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		Grupo_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		MacGrupo_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		schema: 'scl', timestamps: false, tableName: 'GrupoEmpresa'
	});
};
