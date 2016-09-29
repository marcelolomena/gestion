/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('troya', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cuentacontable: {
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
      type: DataTypes.FLOAT,
      allowNull: true
    },
    seccion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cuidepto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    departamento: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cuigerencia: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    gerencia: {
      type: DataTypes.STRING,
      allowNull: true
    },
    monto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: true
    },
    matriz: {
      type: DataTypes.STRING,
      allowNull: true
    },
    montomilesusd: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    nuevocuidepartamento: {
      type: DataTypes.FLOAT,
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
    cuentaorigen: {
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
    presupuesta: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cuinuevagerencia: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    schema: 'sip', timestamps: false, tableName: 'troya'
  });
};
