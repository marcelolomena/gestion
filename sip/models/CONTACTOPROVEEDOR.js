/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('CONTACTOPROVEEDOR', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    contactoproveedor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fonoproveedor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    correoproveedor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idproveedor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'PROVEEDOR',
        key: 'id'
      }
    }
  }, {
    tableName: 'CONTACTOPROVEEDOR'
  });
};
