/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('proyecto', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    sap: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    numerotarea: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nombretarea: {
      type: DataTypes.STRING,
      allowNull: true
    },
    presupuestooriginal: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    presupuestoactual: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    estado: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tipoproyecto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    presupuestogasto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    presupuestoinversion: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    compromisogasto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    compromisoinversion: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    realacumuladogasto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    realacumuladoinversion: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    realperiodo: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    saldogasto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    saldoinversion: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    wbslevel: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    fechacreacion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechainicio: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechacierre: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cui: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    saldo2gasto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    saldo2inversion: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    avance: {
      type: 'NUMERIC',
      allowNull: true
    },
    llave: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tareanum: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    creacion: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tarea: {
      type: DataTypes.STRING,
      allowNull: true
    },
    categoria2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    primerpago: {
      type: DataTypes.DATE,
      allowNull: true
    },
    ultimopago: {
      type: DataTypes.DATE,
      allowNull: true
    },
    estado2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fechavigencia: {
      type: DataTypes.DATE,
      allowNull: true
    },
    contabgasto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    cep: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    acoplado: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    gtodiferido: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    divotabiertos: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    papcomprometido: {
      type: DataTypes.DATE,
      allowNull: true
    },
    abierto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    pmo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'proyecto'
  });
};
