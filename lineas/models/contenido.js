/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('contenido', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    plantilla: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'lin',timestamps: false,tableName: 'contenido'
  });
};
