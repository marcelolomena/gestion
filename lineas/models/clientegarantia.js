/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('clientegarantia', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    rutcliente: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cliente',
        key: 'rut'
      }
    },
    idgarantia: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'garantia',
        key: 'id'
      }
    }
    
  }, {
    schema: 'dbo', timestamps: false, tableName: 'clientegarantia'
  });
};
