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
      allowNull: true
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
    },
    estado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cuota: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    numerocuota: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idfrecuencia: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    desde: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    masiva: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    ivarecuperable: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    gastodiferido: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mesesdiferido: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    desdediferido: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mesesentrecuotas: {
      type: DataTypes.INTEGER,
      allowNull: true
    }    
  }, {
    schema: 'sip',timestamps: false,tableName: 'detallepre'
  });
};
