/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('erogacionproyectobase', {
    sap: {
      type: DataTypes.STRING,
      allowNull: true
    },
    proyecto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombreproveedor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rutproveedor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    factura: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fechagl: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fechapa: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fechafactura: {
      type: DataTypes.STRING,
      allowNull: true
    },
    glosafactura: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tareaajustada: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tareaoriginal: {
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
    total: {
      type: DataTypes.STRING,
      allowNull: true
    },
    totalmonedaorigen: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'erogacionproyectobase'
  });
};