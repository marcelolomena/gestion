/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('rol_clase', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    rid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'rol',
        key: 'id'
      }
    },
    cid: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'clase',
        key: 'id'
      }
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sic',timestamps: false,tableName: 'rol_clase'
  });
};
