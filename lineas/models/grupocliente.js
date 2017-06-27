/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('grupocliente', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idgrupo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'grupo',
        key: 'id'
      }
    },
    rutcliente: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cliente',
        key: 'rut'
      }
    }
  }, {
    schema: 'dbo', timestamps: false, tableName: 'grupodesglose'
  });
};
