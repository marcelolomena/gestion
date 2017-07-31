/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('menu', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    url: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nivel: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idsistema: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'sistema',
        key: 'id'
      }
    }
  }, {
    schema: 'lin',timestamps: false,tableName: 'menu'
  });
};
