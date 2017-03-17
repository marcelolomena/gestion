/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('flujopagoenvuelo', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true,
    },
    idtareaenvuelo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tareaenvuelo',
        key: 'id'
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
    idsubtarea: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'art_sub_task',
        key: 'sub_task_id'
      }
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    estadopago: {
      type: DataTypes.STRING,
      allowNull: true
    },
    saldopago: {
      type: DataTypes.FLOAT,
      allowNull: true
    }    
  }, {
    schema: 'sip',timestamps: false,tableName: 'flujopagoenvuelo'
  });
};
