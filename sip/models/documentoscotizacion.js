/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('documentoscotizacion', {
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
    idtipodocumento: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nombrecorto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    descripcionlarga: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombreresponsable: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombrearchivo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sic',timestamps: false,tableName: 'documentoscotizacion'
  });
};
