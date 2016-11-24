/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('bitacora', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idsolicitudcotizacion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tabla: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idregistro: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    accion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    dataold: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idusuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'art_user',
        key: 'uid'
      }
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sic',timestamps: false,tableName: 'bitacora'
  });
};
