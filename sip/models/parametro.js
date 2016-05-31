/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Parametro', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    }, valor: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
      schema: 'sip', timestamps: false, tableName: 'parametro'
    });
};
