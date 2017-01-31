/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('clase', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    anexo: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sic',timestamps: false,tableName: 'clase'
  });
};
