/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Iniciativa', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    codigoart: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nombreproyecto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    divisionsponsor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sponsor1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sponsor2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    gerenteresponsable: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pmoresponsable: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    categoria: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ano: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    q1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    q2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    q3: {
      type: DataTypes.STRING,
      allowNull: true
    },
    q4: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fechacomite: {
      type: DataTypes.DATE,
      allowNull: true
    },
    pptoestimadousd: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    tableName: 'INICIATIVAS'
  });
};
