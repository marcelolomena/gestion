module.exports = function(sequelize, DataTypes) {
  return sequelize.define('preguntaforo', {
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
    glosapregunta: {
      type: DataTypes.STRING,
      allowNull: true
    },
    usuariopregunta: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'art_user',
        key: 'id'
      }
    },
    fechapregunta: {
      type: DataTypes.DATE,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, {
    schema: 'sic',timestamps: false,tableName: 'preguntaforo'
  });
};
