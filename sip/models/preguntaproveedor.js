/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
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
    idresponsable: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'user',
        key: 'uid'
      }
    },
    idtipo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'valores',
        key: 'id'
      }
    },
    pregunta: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    respuesta: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sic',timestamps: false,tableName: 'preguntaproveedor'
  });
};
