/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('notaevaluaciontecnica2', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    
    idnotaevaluaciontecnica: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'notaevaluaciontecnica',
        key: 'id'
      } 
    },
    idcriterioevaluacion2: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'criterioevaluacion2',
        key: 'id'
      }
    },
    
    idproveedor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'proveedor',
        key: 'id'
      }
    },
    nota: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    comentario: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
    
  }, {
      schema: 'sic', timestamps: false, tableName: 'notaevaluaciontecnica2'
    });
};
