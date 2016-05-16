/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('UsrRol', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'User',
        key: 'uid'
      }
    },
    rid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Rol',
        key: 'id'
      }
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
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
