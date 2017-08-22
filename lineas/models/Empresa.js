/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Empresa', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true
		},
		Nombre: {
			type: DataTypes.STRING,
			allowNull: true
		},
		RazonSocial: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Rut: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Riesgo: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Rating: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Ejecutivo: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Banca: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Pep: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Oficina: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Vigilancia: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Dv: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Comportamiento: {
			type: DataTypes.STRING,
			allowNull: true
		}


	}, {
		schema: 'scl', timestamps: false, tableName: 'Empresa'
	});
};
