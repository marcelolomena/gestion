/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('registro', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    query: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: true
    }
  }, {
      schema: 'sip', timestamps: false, tableName: 'registro'
    });
};
