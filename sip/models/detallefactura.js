/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('detallefactura', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idfactura: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'factura',
        key: 'id'
      }
    },
    idprefactura: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'prefactura',
        key: 'id'
      }
    },
    idfacturacion: {
      type: DataTypes.STRING,
      allowNull: true,
      references: {
        model: 'solicitudaprobacion',
        key: 'idfacturacion'
      }
    },
    idmoneda: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'moneda',
        key: 'id'
      }
    },
    glosaservicio: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cantidad: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    montonetoorigen: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    montoneto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    impuesto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    ivanorecuperable: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    montocosto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    ivacredito: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    montototal: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'detallefactura'
  });
};
