/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('sublimite', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idlimite: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'limite',
        key: 'id'
      }
    },
    numero: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tipolimite: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tiporiesgo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    plazoresidual: {
      type: DataTypes.STRING,
      allowNull: true
    },
    abrobactual: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    deudaactual: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    someaprob: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    moneda: {
      type: DataTypes.STRING,
      allowNull: true
    },
    garantiaestatal: {
      type: DataTypes.STRING,
      allowNull: true
    },
    aprobacionpuntual: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fechavencimiento: {
      type: DataTypes.STRING,
      allowNull: true
    },
    comentario: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    schema: 'dbo', timestamps: false, tableName: 'sublimite'
  });
};
