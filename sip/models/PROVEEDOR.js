/* jshint indent: 2 */
"use strict";
module.exports = function(sequelize, DataTypes) {
  var Proveedor=sequelize.define('PROVEEDOR', {
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
  
  return Proveedor;
};
