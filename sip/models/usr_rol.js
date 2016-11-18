/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('usrrol', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
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
    },
    idsistema: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sistema',
        key: 'id'
      }
    }
  }, {
      schema: 'sip', timestamps: false, tableName: 'usr_rol'
    }, {
      classMethods: {
        associate: function (models) {
         }
      }
    });
};
