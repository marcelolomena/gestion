/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('lineas', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idmac: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'mac',
        key: 'id'
      }
    },
    numero: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tiporiesgo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    plazoresidual: {
      type: DataTypes.STRING,
      allowNull: true
    },
    aprobactualmoneda: {
      type: DataTypes.STRING,
      allowNull: true
    },
    abrobactualmonto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    deudaactualmoneda: {
      type: DataTypes.STRING,
      allowNull: true
    },
    deudaactualmonto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    someaprobmoneda: {
      type: DataTypes.STRING,
      allowNull: true
    },
    someaprobmonto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    someaprobmm: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    schema: 'dbo', timestamps: false, tableName: 'lineas'
  });
};
