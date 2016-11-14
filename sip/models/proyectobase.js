/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('proyectobase', {
    sap: {
      type: DataTypes.STRING,
      allowNull: true
    },
    proyecto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tipoproyecto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cui: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombrecui: {
      type: DataTypes.STRING,
      allowNull: true
    },
    codpriorizado: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pmo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fechacreacion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fechavigencia: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estadovigencia: {
      type: DataTypes.STRING,
      allowNull: true
    },
    avance: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fechaultimopago: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fechapasoprod: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fechainicio: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cep: {
      type: DataTypes.STRING,
      allowNull: true
    },
    acoplado: {
      type: DataTypes.STRING,
      allowNull: true
    },
    gasto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    inversion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    gasto1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    inversion1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    gasto2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    inversion2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    gasto3: {
      type: DataTypes.STRING,
      allowNull: true
    },
    inversion3: {
      type: DataTypes.STRING,
      allowNull: true
    },
    presupuesto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    compromisos: {
      type: DataTypes.STRING,
      allowNull: true
    },
    realacumulado: {
      type: DataTypes.STRING,
      allowNull: true
    },
    saldo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    observaciones: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'proyectobase'
  });
};
