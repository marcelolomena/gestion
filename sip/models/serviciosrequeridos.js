/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('serviciosrequeridos', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idsolicitudcotizacion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'solicitudcotizacion',
        key: 'id'
      }
    },
    idservicio: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'servicio',
        key: 'id'
      }
    },
    idclasecriticidad: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'clasecriticidad',
        key: 'id'
      }
    },
    glosaservicio: {
      type: DataTypes.STRING,
      allowNull: true
    },
    iddoctotecnico: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'documentoscotizacion',
        key: 'id'
      }
    },
    glosareferencia: {
      type: DataTypes.STRING,
      allowNull: true
    },
    notacriticidad: {
      type: DataTypes.STRING,
      allowNull: true
    },
    colornota: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idsegmento: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'segmentoproveedor',
        key: 'id'
      }
    },
    porcentajeservicio: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    porcentajeeconomico: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    claseevaluaciontecnica: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'claseevaluaciontecnica',
        key: 'id'
      }
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    codigosic: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    schema: 'sic',timestamps: false,tableName: 'serviciosrequeridos'
  });
};
