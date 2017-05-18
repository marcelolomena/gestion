/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('preguntaproveedor', {
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
    tipo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    pregunta: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    respuesta: {
      type: DataTypes.TEXT,
      allowNull: false
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    responsable: {
      type: DataTypes.STRING,
      allowNull: false
    }
  }, {
      schema: 'sic', timestamps: false, tableName: 'preguntaproveedor'
    });
};
