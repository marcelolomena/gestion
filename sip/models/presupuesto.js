/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('presupuesto', {
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
    idcui: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: true
    },
    version: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'presupuesto'
  });
};
