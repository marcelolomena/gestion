/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('criterioevaluacion2', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idcriterioevaluacion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'criterioevaluacion',
        key: 'id'
      }
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    comentario: {
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
    schema: 'sic',timestamps: false,tableName: 'criterioevaluacion2'
  });
};
