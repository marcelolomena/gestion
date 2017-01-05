/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('solicitudobservacion', {
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
        model: 'solicitudcotizacion',
        key: 'id'
      }
    },
    idtipoobservacion: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'valores',
        key: 'id'
      }
    },
    idregistroobseracuerdotipo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'valores',
        key: 'id'
      }
    },
    idrevelancia: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'valores',
        key: 'id'
      }
    },
    idusrorigen: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'uid'
      }
    },
    idusrdestino: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'uid'
      }
    },
    idestado: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'valores',
        key: 'id'
      }
    },
    glosacorta: {
      type: DataTypes.STRING,
      allowNull: true
    },
    glosalarga: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'solicitudobservacion'
  });
};
