/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('erogacionproyecto', {
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
    nombre: {
      type: DataTypes.STRING,
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
    numerotarea: {
      type: DataTypes.STRING,
      allowNull: true
    },
    grupo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tipoerogacion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    empresa: {
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
    idcui: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cui: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    empresarelacionada: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sucursalcontable: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sucursalorigen: {
      type: DataTypes.STRING,
      allowNull: true
    },
    usofuturo1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    usofuturo2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    razonsocial: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fechafactura: {
      type: DataTypes.DATE,
      allowNull: true
    },
    factura: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombretarea: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fuentetransaccion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    transaccionorig: {
      type: DataTypes.STRING,
      allowNull: true
    },
    numerolinea: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    montosum: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    cantidadsum: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    indicadorinversion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fechapa: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechagl: {
      type: DataTypes.DATE,
      allowNull: true
    },
    anno: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tipo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    clase: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tipo2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    mes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    toriganterior: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tproviant: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    tfinalant: {
      type: DataTypes.STRING,
      allowNull: true
    },
    toriginalactual: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tproviactual: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tajustadaactual: {
      type: DataTypes.STRING,
      allowNull: true
    },
    toriginalactualfinal: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tproviactfinal: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tajustadaactualfinal: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cadena: {
      type: DataTypes.STRING,
      allowNull: true
    },
    abierto: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    comentario: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    detalle: {
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
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'erogacionproyecto'
  });
};
