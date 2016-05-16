/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('Rol', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    rid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    glosarol: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
      schema: 'sip', timestamps: false, tableName: 'rol'
    }, {
      classMethods: {
        associate: function (models) {

          //UsrRol.belongsTo(models.User, { foreignKey: 'uid' })
        }
      }
    });
};
