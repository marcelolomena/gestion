/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('proveedorsugerido', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idserviciorequerido: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'serviciosrequeridos',
        key: 'id'
      }
    },
    idproveedor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'proveedor',
        key: 'id'
      }
    },
    indicadorunico: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idmotivounico: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sic',timestamps: false,tableName: 'proveedorsugerido'
  });
};
