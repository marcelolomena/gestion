/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('SetAprobacion', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		FichaFinanciera: {
			type: DataTypes.STRING,
			allowNull: true
		},
		MacGrupal: {
			type: DataTypes.STRING,
			allowNull: true
		},
		MallaSocietaria: {
			type: DataTypes.STRING,
			allowNull: true
		},
		ResumenEjectivo: {
			type: DataTypes.STRING,
			allowNull: true
		},
		MacIndividual: {
			type: DataTypes.STRING,
			allowNull: true
		},
		InformeAnalisis: {
			type: DataTypes.STRING,
			allowNull: true
		},
		FichaFinancieraConsolidada: {
			type: DataTypes.STRING,
			allowNull: true
		},
		ResumenCifrasFinancieras: {
			type: DataTypes.STRING,
			allowNull: true
		},
		DetalleCuenta: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		schema: 'dbo', timestamps: false, tableName: 'SetAprobacion'
	});
};
