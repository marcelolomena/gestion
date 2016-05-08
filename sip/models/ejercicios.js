/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('ejercicios', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    ejercicio: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    glosaejercicio: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fechainiejercicio: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechaterejercicio: {
      type: DataTypes.DATE,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'ejercicios'
  });
};
