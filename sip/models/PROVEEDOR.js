/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('PROVEEDOR', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    numrut: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    dvrut: {
      type: 'CHAR',
      allowNull: true
    },
    razonsocial: {
      type: DataTypes.STRING,
      allowNull: true
    },
    negociadordivot: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    tableName: 'PROVEEDOR'
  });
};
