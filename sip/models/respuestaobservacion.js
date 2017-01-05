/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('respuestaobservacion', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
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
        model: 'art_user',
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
    tableName: 'respuestaobservacion'
  });
};
