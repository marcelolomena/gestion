/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('respuestaobservacion', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idsolicitudobservacion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'solicitudobservacion',
        key: 'id'
      }
    },
    idusrorigen: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'uid'
      }
    },
    iddocumento: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'documentoscotizacion',
        key: 'id'
      }
    },
    asunto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'respuestaobservacion'
  });
};
