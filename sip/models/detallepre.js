/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('DetallePre', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idpresupuesto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Presupuesto',
        key: 'id'
      }
    },
    idcui: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'EstructuraCui',
        key: 'id'
      }
    },
    idservicio: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Servicio',
        key: 'id'
      }
    },
    glosaservicio: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idproveedor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Proveedor',
        key: 'id'
      }
    },
    idmoneda: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Moneda',
        key: 'id'
      }
    },
    montoforecast: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    montoanual: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    comentario: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'detallepre'
  });
};
