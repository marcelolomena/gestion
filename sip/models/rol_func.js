/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('RolFunc', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    rid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Rol',
        key: 'id'
      }
    },
    fid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Menu',
        key: 'id'
      }
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'rol_func'
  });
};
