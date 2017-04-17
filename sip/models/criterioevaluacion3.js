/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('criterioevaluacion3', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idcriterioevaluacion2: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'criterioevaluacion2',
        key: 'id'
      }
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    pregunta: {
      type: DataTypes.STRING,
      allowNull: true
    },
    porcentaje: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sic',timestamps: false,tableName: 'criterioevaluacion3'
  });
};
