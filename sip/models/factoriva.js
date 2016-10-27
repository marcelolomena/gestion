/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('factoriva', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    periodo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    factorrecuperacion:{
      type: DataTypes.FLOAT,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'factoriva'
  });
};
