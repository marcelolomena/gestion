/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('detallepre', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idpresupuesto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'presupuesto',
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
    idservicio: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'servicio',
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
        model: 'proveedor',
        key: 'id'
      }
    },
    idmoneda: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'moneda',
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
