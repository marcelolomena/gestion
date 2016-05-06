/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('funcion', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    fid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    glosafuncion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'funcion'
  });
};
