/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CONTRATO', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idproveedor: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    contrato: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    anexo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    solicitudcontrato: {
      type: DataTypes.STRING,
      allowNull: true
    },
    solicitudcontratoes: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombrecontrato: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idsap: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idpmo: {
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
    criticidad: {
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
    }
  }, {
    tableName: 'CONTRATO'
  });
};
