/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Erogacionproyecto', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    iddetalleproyecto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'detalleproyecto',
        key: 'id'
      }
    },
    sap: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idproveedor: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    numerotarea: {
      type: DataTypes.STRING,
      allowNull: true
    },    
    rutproveedor: {
      type: DataTypes.STRING,
      allowNull: true
    },
    razonsocial: {
      type: DataTypes.STRING,
      allowNull: true
    },
    factura: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fechafactura: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechagl: {
      type: DataTypes.DATE,
      allowNull: true
    },
    contrato: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    anexo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    codigoart: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    partida: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idcuenta: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cuentacontable: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idcui: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cui: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idservicio: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tarea: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idmoneda: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    moneda: {
      type: DataTypes.STRING,
      allowNull: true
    },
    periodo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    montoporperiodo: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    montosum: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    toriginalactual: {
      type: DataTypes.STRING,
      allowNull: true
    }    
  }, {
    schema: 'sip',timestamps: false,tableName: 'erogacionproyecto'
  });
};
