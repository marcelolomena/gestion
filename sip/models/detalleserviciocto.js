/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('detalleserviciocto', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    iddetallecto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'contrato',
        key: 'id'
      }
    },
    idcui: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    partida: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idservicio: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    servicio: {
      type: DataTypes.STRING,
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
    idmoneda: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    valorcuota: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    impuesto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    iva: {
      type: DataTypes.STRING,
      allowNull: true
    },
    factoriva: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    montototal: {
      type: DataTypes.FLOAT,
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
