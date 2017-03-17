/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('solicitudaprobacion', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true      
    },
    periodo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    iddetallecompromiso: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'detallecompromiso',
        key: 'id'
      }
    },
    idprefactura: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'prefactura',
        key: 'id'
      }
    },
    idfactura: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idcui: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'estructuracui',
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
    idcontrato: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'contrato',
        key: 'id'
      }
    },
    idfacturacion: {
      type: DataTypes.STRING,
      allowNull: false,
      primaryKey: true
    },
    montoneto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    montoaprobado: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    montomulta: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    montoimpuesto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    montoapagar: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    idcausalmulta: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    glosamulta: {
      type: DataTypes.STRING,
      allowNull: true
    },
    glosaabono: {
      type: DataTypes.STRING,
      allowNull: true
    },
    aprobado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    glosaaprobacion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idcalificacion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idcalificacion2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    montoaprobadopesos: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    montomultapesos: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    montoapagarpesos: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    montototalpesos: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    factorconversion: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    impuesto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    factorimpuesto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    montoabono: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    montoabonopesos: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    sap: {
      type: DataTypes.INTEGER,
      allowNull: true
    },   
    tarea: {
      type: DataTypes.STRING,
      allowNull: true
    },    
  }, {
    schema: 'sip',timestamps: false,tableName: 'solicitudaprobacion'
  });
};
