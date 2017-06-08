/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('notaevaluaciontecnica3', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    
    idnotaevaluaciontecnica2: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'notaevaluaciontecnica2',
        key: 'id'
      } 
    },
    idcriterioevaluacion3: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'criterioevaluacion3',
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
    respuesta: {
      type: DataTypes.STRING,
      allowNull: true
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
      schema: 'sic', timestamps: false, tableName: 'notaevaluaciontecnica3'
    });
};
