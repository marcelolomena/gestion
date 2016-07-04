/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('presupuesto', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
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
      allowNull: true,
      references: {
        model: 'estructuracui',
        key: 'id'
      }
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
    },
    montoforecast: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    montoanual: {
      type: DataTypes.FLOAT,
      allowNull: true
    } 
  }, {
    schema: 'sip',timestamps: false,tableName: 'presupuesto'
  });
};
