/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('usr_rol', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'art_user',
        key: 'uid'
      }
    },
    rid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'rol',
        key: 'id'
      }
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'usr_rol'
  });
};
