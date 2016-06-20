/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('conceptospresupuestarios', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    conceptopresupuestario: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    glosaconcepto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'conceptospresupuestarios'
  });
};
