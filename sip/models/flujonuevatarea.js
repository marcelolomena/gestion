/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('flujonuevatarea', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idtareasnuevosproyectos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tareasnuevosproyectos',
        key: 'id'
      }
    },
    idsubtarea: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'art_sub_task',
        key: 'sub_task_id'
      }
    },
    periodo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    glosaitem: {
      type: DataTypes.STRING,
      allowNull: true
    },
    porcentaje: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    idtipopago: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'parametro',
        key: 'id'
      }
    },
    fechainicio: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechafin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    montoorigen: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    montopesos: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    costoorigen: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    costopesos: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'flujonuevatarea'
  });
};
