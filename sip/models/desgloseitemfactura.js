/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('desgloseitemfactura', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    iddetallefactura: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'detallefactura',
        key: 'id'
      }
    },
    idcui: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'estructuracui',
        key: 'id'
      }
    },
    idcuentacontable: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cuentascontables',
        key: 'id'
      }
    },
    porcentaje: {
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
    schema: 'sip',timestamps: false,tableName: 'desgloseitemfactura'
  });
};
