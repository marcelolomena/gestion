/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ContactoProveedor', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idproveedor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Proveedor',
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
    schema: 'sip',timestamps: false,tableName: 'contactoproveedor'
  });
};
