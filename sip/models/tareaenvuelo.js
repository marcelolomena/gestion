/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
  return sequelize.define('tareaenvuelo', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    glosa: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idpresupuestoenvuelo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'presupuestoenvuelo',
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
    idproveedor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'proveedor',
        key: 'id'
      }
    },
    tarea: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idtipopago: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'parametro',
        key: 'id'
      }
    },
    fechainicio: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechafin: {
      type: DataTypes.DATE,
      allowNull: true
    },
    reqcontrato: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idmoneda: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'moneda',
        key: 'id'
      }
    },
    costounitario: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    coniva: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    numerocontrato: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    numerosolicitudcontrato: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },

  }, {
      schema: 'sip', timestamps: false, tableName: 'tareaenvuelo'
    });
};
