/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('periodos', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idejercicio: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'ejercicios',
        key: 'id'
      }
    },
    periodo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fechainicio: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechatermino: {
      type: DataTypes.DATE,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'periodos'
  });
};
