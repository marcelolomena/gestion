/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('monedasconversion', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    moneda: {
      type: DataTypes.STRING,
      allowNull: true
    },
    periodo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    valorconversion: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ejercicio: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idmoneda: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'moneda',
        key: 'id'
      }
    },
    idejercicio: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'ejercicios',
        key: 'id'
      }
    }
  }, {
    schema: 'sip', timestamps: false, tableName: 'monedasconversion'
  });
};
