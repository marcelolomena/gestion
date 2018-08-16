/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('ubicacioninstalacion', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idinstalacion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'instalacion',
        key: 'id'
      }
    },
    nombre: {
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