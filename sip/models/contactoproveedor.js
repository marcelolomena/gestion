/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('contactoproveedor', {
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
        model: 'proveedor',
        key: 'id'
      }
    },
    contacto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fono: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'contactoproveedor'
  });
};
