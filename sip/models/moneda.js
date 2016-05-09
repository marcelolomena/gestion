/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('moneda', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    moneda: {
      type: DataTypes.STRING,
      allowNull: true
    },
    glosamoneda: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'moneda'
  });
};
