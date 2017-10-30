/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('compra', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idProducto: {
      field:'idproducto',
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'producto',
        key: 'id'
      }
    },
    contrato: {
      type: DataTypes.STRING(10),
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
      allowNull: true
    },
    sap: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idProveedor: {
      field:'idproveedor',
      type: DataTypes.INTEGER,
      allowNull: false,
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
      allowNull: false,
      defaultValue:0
    },
    cantidadSoporte: {
      field:'cantidadsoporte',
      type: DataTypes.INTEGER,
      allowNull: true,
      defaultValue:0
    },
    idMoneda: {
      field:'idmoneda',
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'moneda',
        key: 'id'
      }
    },
    valorLicencia: {
      field:'valorlicencia',
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    valorSoporte: {
      field:'valorsoporte',
      type: DataTypes.DECIMAL(10,2),
      allowNull: true
    },
    fechaRenovaSoporte: {
      field:'fecharenovasoporte',
      type: DataTypes.DATE,
      allowNull: true
    },
    factura: {
      type: DataTypes.BIGINT,
      allowNull: true
    },
    comprador: {
      type: DataTypes.STRING(60),
      allowNull: true
    },
    correoComprador: {
      field:'correocomprador',
      type: DataTypes.STRING(120),
      allowNull: true
    }
  }, {
    schema: 'lic',timestamps: false,tableName: 'compra'
  });
};
