/* jshint indent: 1 */

module.exports = function(sequelize, DataTypes) {
	return sequelize.define('Linea', {
		Id: {
			type: DataTypes.INTEGER,
			allowNull: false,
			primaryKey: true,
			autoIncrement: true
		},
		Numero: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Riesgo: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Descripcion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Moneda: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Aprobado: {
			type: DataTypes.FLOAT,
			allowNull: true
		},
		Utilizado: {
			type: DataTypes.FLOAT,
			allowNull: true
		},
		Reservado: {
			type: DataTypes.FLOAT,
			allowNull: true
		},
		ColorCondicion: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Disponible: {
			type: DataTypes.FLOAT,
			allowNull: true
		},
		Bloqueado: {
			type: DataTypes.FLOAT,
			allowNull: true
		},
		Plazo: {
			type: DataTypes.STRING,
			allowNull: true
		},
		FechaVencimiento: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Padre_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		Estado: {
			type: DataTypes.FLOAT,
			allowNull: true
		},
		Cuotas: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		CalendarioPago: {
			type: DataTypes.STRING,
			allowNull: true
		},
		OpcionCompra: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		Financiamiento: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		Alzamiento: {
			type: DataTypes.STRING,
			allowNull: true
		},
		AportePrevio: {
			type: DataTypes.FLOAT,
			allowNull: true
		},
		AportePariPasu: {
			type: DataTypes.FLOAT,
			allowNull: true
		},
		Anticipo: {
			type: DataTypes.FLOAT,
			allowNull: true
		},
		DestinoFondo: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Cleanup: {
			type: DataTypes.STRING,
			allowNull: true
		},
		CondicionesGTA: {
			type: DataTypes.STRING,
			allowNull: true
		},
		VctoLinea: {
			type: DataTypes.STRING,
			allowNull: true
		},
		VctoCurse: {
			type: DataTypes.STRING,
			allowNull: true
		},
		PlazoMaxOP: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		PeriodoGracia: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		Prorrogas: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Tipo_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		Riesgo_Id: {
			type: DataTypes.INTEGER,
			allowNull: true
		},
		MonedaSometido: {
			type: DataTypes.STRING,
			allowNull: true
		},
		MonedaDisponible: {
			type: DataTypes.STRING,
			allowNull: true
		},
		Sometido: {
			type: DataTypes.FLOAT,
			allowNull: true
		}
	}, {
		schema: 'scl', timestamps: false, tableName: 'Linea'
	});
};
