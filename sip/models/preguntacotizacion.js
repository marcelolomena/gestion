/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('preguntacotizacion', {
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
    pregunta: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
      schema: 'sic', timestamps: false, tableName: 'preguntacotizacion'
    });
};
