/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('factura', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    numero: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idproveedor: {
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
    fecha: {
      type: DataTypes.DATE,
      allowNull: true
    },
    montonetoorigen: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    factorconversion: {
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
    schema: 'sip',timestamps: false,tableName: 'factura'
  });
};
