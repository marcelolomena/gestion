/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('participanteproveedor', {
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
    
    idproveedor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'proveedor',
        key: 'id'
      }
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cargo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    correo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    telefono: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
      schema: 'sic', timestamps: false, tableName: 'participanteproveedor'
    });
};
