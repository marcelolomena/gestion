/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('Erogaciones', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sap: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idproveedor: {
      type: DataTypes.INTEGER,
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
    fechacontabilizacion: {
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
    cuentacontable: {
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
    codigotarea: {
      type: DataTypes.STRING,
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
    montopesos: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    tableName: 'EROGACIONES'
  });
};
