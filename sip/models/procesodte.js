/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('procesodte', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idcarga: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cargadte',
        key: 'id'
      }
    },
    glosa: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idfactura: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'factura',
        key: 'id'
      }
    },
    archivo: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'procesodte'
  });
};
