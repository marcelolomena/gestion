/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sistema', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    sistema: {
      type: DataTypes.STRING,
      allowNull: true
    },
    glosasistema: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip', timestamps: false, tableName: 'sistema'
  });
};
