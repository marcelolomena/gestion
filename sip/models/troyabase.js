/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('troyabase', {
    cuenta: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombrecuenta: {
      type: DataTypes.STRING,
      allowNull: true
    },
    agrupacion1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    agrupacion2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cuiseccion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    seccion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cuidepto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    depto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cuigerencia: {
      type: DataTypes.STRING,
      allowNull: true
    },
    gerencia: {
      type: DataTypes.STRING,
      allowNull: true
    },
    monto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fecha: {
      type: DataTypes.STRING,
      allowNull: true
    },
    matriz: {
      type: DataTypes.STRING,
      allowNull: true
    },
    montommusd: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nuevocuidepartamento: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nuevodepartamento: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nuevagerencia: {
      type: DataTypes.STRING,
      allowNull: true
    },
    planeamiento: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sistemas: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ops: {
      type: DataTypes.STRING,
      allowNull: true
    },
    goe: {
      type: DataTypes.STRING,
      allowNull: true
    },
    numerocuentaorigen: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombrecuentaorigen: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tipocuenta: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tipogerencia: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cuinuevagerencia: {
      type: DataTypes.STRING,
      allowNull: true
    },
    quienpresupuesta: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'troyabase'
  });
};
