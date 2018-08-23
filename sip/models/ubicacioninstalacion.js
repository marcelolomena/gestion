/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('ubicacioninstalacion', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idproducto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'producto',
        key: 'id'
      }
    },
    usuario: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ubicacion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    codigoInterno: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    schema: 'lic',
    timestamps: false,
    tableName: 'ubicacioninstalacion'
  });
};