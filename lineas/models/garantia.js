/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('garantia', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    numerofolio: {
      type: DataTypes.STRING,
      allowNull: true
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    valorizacion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tipogarantia: {
      type: DataTypes.STRING,
      allowNull: true
    },
    secuencia: {
      type: DataTypes.STRING,
      allowNull: true
    },
    moneda: {
      type: DataTypes.STRING,
      allowNull: true
    },
    valorcomercial: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    valorliquidacion: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    clausula: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notas: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    schema: 'dbo', timestamps: false, tableName: 'garantia'
  });
};
