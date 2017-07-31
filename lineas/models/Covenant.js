/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Covenant', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Indicador: {
			type: DataTypes.STRING,
			allowNull: true
		},
		RatioExigido: {
			type: DataTypes.STRING,
			allowNull: true
		},
		PeriodicidadControl: {
			type: DataTypes.STRING,
			allowNull: true
		},
		EstadoFinanciero: {
			type: DataTypes.STRING,
			allowNull: true
		},
		RatioActual: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Notas: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		schema: 'scl', timestamps: false, tableName: 'Covenant'
	});
};
