/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('aprobaciondocumento', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    iddocumentocotizacion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'documentoscotizacion',
        key: 'id'
      }
    },
    idusuario: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'uid'
      }
    },
    tipoaprobacion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    observacion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sic',timestamps: false,tableName: 'aprobaciondocumento'
  });
};
