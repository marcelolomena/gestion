/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('DetalleServicioCto', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idcontrato: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Contrato',
        key: 'id'
      }
    },
    anexo: {
      type: DataTypes.STRING,
      allowNull: true
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
    servicio: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idcuenta: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'CuentasContables',
        key: 'id'
      }
    },
    cuentacontable: {
      type: DataTypes.STRING,
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
    codigoart: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fechainicio: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechatermino: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechacontrol: {
      type: DataTypes.DATE,
      allowNull: true
    },
    valorcuota: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    idmoneda: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Moneda',
        key: 'id'
      }
    },
    idfrecuencia: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    frecuenciafacturacion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idplazocontrato: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    plazocontrato: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idcondicion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    condicionnegociacion: {
      type: DataTypes.STRING,
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
    idcontactoproveedor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'ContactoProveedor',
        key: 'id'
      }
    },
    idestadocto: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    estadocontrato: {
      type: DataTypes.STRING,
      allowNull: true
    },
    glosaservicio: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'detalleserviciocto'
  });
};
