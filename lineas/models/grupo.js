/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('grupo', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    rut: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    razonsocial: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    schema: 'dbo', timestamps: false, tableName: 'grupo'
  });
};
