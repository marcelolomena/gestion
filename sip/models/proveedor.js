/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('proveedor', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    numrut: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    dvrut: {
      type: DataTypes.STRING,
      allowNull: true
    },
    razonsocial: {
      type: DataTypes.STRING,
      allowNull: true
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    negociadordivot: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
      schema: 'sip', timestamps: false, tableName: 'proveedor'
    });
};
