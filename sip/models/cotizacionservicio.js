/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('cotizacionservicio', {
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
    
    idproveedor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'proveedor',
        key: 'id'
      }
    },
    idmoneda: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'moneda',
        key: 'id'
      }
    },
    fecha: {
      type: DataTypes.DATE,
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
      schema: 'sic', timestamps: false, tableName: 'cotizacionservicio'
    });
};
