/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('solicitudaprobacion', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    periodo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iddetallecompromiso: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'detallecompromiso',
        key: 'id'
      }
    },
    idprefactura: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'prefactura',
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
    idproveedor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'proveedor',
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
    glosaservicio: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idcontrato: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'contrato',
        key: 'id'
      }
    },
    montoapagar: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    montoaprobado: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    montomulta: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    idcausalmulta: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    glosamulta: {
      type: DataTypes.STRING,
      allowNull: true
    },
    aprobado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    glosaaprobacion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idcalificacion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'solicitudaprobacion'
  });
};
