/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('detalleproyectobase', {
    sap: {
      type: DataTypes.STRING,
      allowNull: true
    },
    proyecto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tarea: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombretarea: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cuentacontable: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombrecuenta: {
      type: DataTypes.STRING,
      allowNull: true
    },
    proveedor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombreproveedor: {
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
    estado: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'detalleproyectobase'
  });
};