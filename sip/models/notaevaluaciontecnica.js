/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('notaevaluaciontecnica', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    
    idserviciorequerido: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'serviciosrequeridos',
        key: 'id'
      }
    },
    idcriterioevaluacion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'criterioevaluacion',
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
      schema: 'sic', timestamps: false, tableName: 'notaevaluaciontecnica'
    });
};
