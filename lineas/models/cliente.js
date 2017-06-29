/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cliente', {
    rut: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: false
    },
    razonsocial: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    schema: 'dbo', timestamps: false, tableName: 'cliente'
  });
};
