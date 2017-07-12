/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('OtrasGarantias', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Folio: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Titulo: {
			type: DataTypes.STRING,
			allowNull: true
		},
		NumeroAcciones: {
			type: DataTypes.STRING,
			allowNull: true
		},
		FechaValorizacion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		PrecioUnitario: {
			type: DataTypes.STRING,
			allowNull: true
		},
		MontoTotalM: {
			type: DataTypes.STRING,
			allowNull: true
		},
		CoberturaMinima: {
			type: DataTypes.STRING,
			allowNull: true
		},
		CoberturaRepocision: {
			type: DataTypes.STRING,
			allowNull: true
		},
		CoberturaAlzamiento: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Notas: {
			type: DataTypes.STRING,
			allowNull: true
		},
		ForgapeForgain: {
			type: DataTypes.STRING,
			allowNull: true
		},
		DestinoFondos: {
			type: DataTypes.STRING,
			allowNull: true
		}
	}, {
		schema: 'dbo', timestamps: false, tableName: 'OtrasGarantias'
	});
};
