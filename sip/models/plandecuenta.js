/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('plandecuenta', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nivel: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nodo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idcuenta: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cuentascontables',
        key: 'id'
      }
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'plandecuenta'
  });
};
