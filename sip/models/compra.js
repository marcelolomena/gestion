/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('compra', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idLicencia: {
      field:'idlicencia',
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
    ordenCompra: {
      field:'ordencompra',
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idCui: {
      field:'idcui',
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
    idProveedor: {
      field:'idproveedor',
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'proveedor',
        key: 'id'
      }
    },
    fechaCompra: {
      field:'fechacompra',
      type: DataTypes.DATE,
      allowNull: true
    },
    fechaExpiracion: {
      field:'fechaexpiracion',
      type: DataTypes.DATE,
      allowNull: true
    },
    licCompradas: {
      field:'liccompradas',
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cantidadSoporte: {
      field:'cantidadsoporte',
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idmoneda: {
      field:'idMoneda',
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'moneda',
        key: 'id'
      }
    },
    valorLicencia: {
      field:'valorlicencia',
      type: DataTypes.FLOAT,
      allowNull: true
    },
    valorSoporte: {
      field:'valorsoporte',
      type: DataTypes.FLOAT,
      allowNull: true
    },
    fechaRenovaSoporte: {
      field:'fecharenovasoporte',
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
    correoComprador: {
      field:'correocomprador',
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    schema: 'lic',timestamps: false,tableName: 'compra'
  });
};
