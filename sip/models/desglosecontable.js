/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('desglosecontable', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idsolicitud: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'solicitudaprobacion',
        key: 'id'
      }
    },
    idcui: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'estructuracui',
        key: 'id'
      }
    },
    idcuentacontable: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cuentascontables',
        key: 'id'
      }
    },
    porcentaje: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip', timestamps: false, tableName: 'desglosecontable'
  });
};
