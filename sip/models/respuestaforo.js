module.exports = function(sequelize, DataTypes) {
  return sequelize.define('respuestaforo', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idpreguntaforo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'preguntaforo',
        key: 'id'
      }
    },
    glosarespuesta: {
      type: DataTypes.STRING,
      allowNull: true
    },
    usuariorespuesta: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'art_user',
        key: 'id'
      }
    },
    iddocumento: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'documentoscotizacion',
        key: 'id'
      }
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
  }, {
    schema: 'sic',timestamps: false,tableName: 'respuestaforo'
  });
};
