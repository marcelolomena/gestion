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
    },
    rutrepresentante: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombrerepresentante: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fonorepresentante: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    correorepresentante: {
      type: DataTypes.STRING,
      allowNull: true
    },
    razonsocialcontractual: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fechaescritura: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notariaescritura: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rutapoderado1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombreapoderado1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    rutapoderado2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombreapoderado2: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
      schema: 'sip', timestamps: false, tableName: 'proveedor'
    });
};
