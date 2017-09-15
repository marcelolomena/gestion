/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('compra', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idlicencia: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'licencia',
        key: 'id'
      }
    },
    contrato: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ordencompra: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idcui: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'estructuracui',
        key: 'id'
      }
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
    idfabricante: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'fabricante',
        key: 'id'
      }
    },
    software: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fechacompra: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechaexpiracion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    liccompradas: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cantidadsoporte: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idmoneda: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'moneda',
        key: 'id'
      }
    },
    valorlicencia: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    valorsoporte: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    fecharenovasoporte: {
      type: DataTypes.DATE,
      allowNull: true
    },
    factura: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    comprador: {
      type: DataTypes.STRING,
      allowNull: true
    },
    correocomprador: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    schema: 'lic',timestamps: false,tableName: 'compra'
  });
};
