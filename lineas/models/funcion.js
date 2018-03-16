/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('funcion', {
		id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		glosafuncion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		actualizar: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		agregar: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		borrar: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		borrado: {
			type: DataTypes.INTEGER,
			allowNull: true
		}
	}, {
		tableName: 'funcion'
	});
};
