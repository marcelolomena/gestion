/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('respuestacotizacion', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    /*
    idsolicitudcotizacion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'solicitudcotizacion',
        key: 'id'
      }
    },
    */
    idproveedor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'proveedor',
        key: 'id'
      }
    },
    idpregunta: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'preguntacotizacion',
        key: 'id'
      }
    },
    respuesta: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
      schema: 'sic', timestamps: false, tableName: 'respuestacotizacion'
    });
};
