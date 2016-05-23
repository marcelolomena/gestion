/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('EstructuraCui', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    cui: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idgerencia: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    gerencia: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombregerente: {
      type: 'CHAR',
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'estructuracui'
  });
};
