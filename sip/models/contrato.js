/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('contrato', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    tipocontrato: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tipooc: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    solicitudcontrato: {
      type: DataTypes.STRING,
      allowNull: true
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    anexo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    solicitudcontratoes: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sap: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idproveedor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'proveedor',
        key: 'id'
      }
    },
    uidpmo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    codigoart: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fechainicontrato: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechatercontrato: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechacontrol: {
      type: DataTypes.DATE,
      allowNull: true
    },
    meses: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: true
    },
    plazocontrato: {
      type: DataTypes.STRING,
      allowNull: true
    },
    montototal: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    condicionnegociacion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    frecuenciafacturacion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'contrato'
  });
};
