/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('solicitudcontrato', {
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
    
    idserviciorequerido: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'serviciosrequeridos',
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
    fechaadjudicacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    descripcion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
      schema: 'sic', timestamps: false, tableName: 'solicitudcontrato'
    });
};
