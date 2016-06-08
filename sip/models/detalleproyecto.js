/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('detalleproyecto', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idproyecto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'proyecto',
        key: 'id'
      }
    },
    tarea: {
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
    idproveedor: {
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
    nombre: {
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
    presupuesto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    presupuestopesos: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    compromiso: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    compromisopesos: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    realacumulado: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    realacumuladopesos: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    realperiodo: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    saldo: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    saldopesos: {
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
    saldo2: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    clase: {
      type: DataTypes.STRING,
      allowNull: true
    },
    llave: {
      type: DataTypes.STRING,
      allowNull: true
    },
    divotabiertos: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    realajustado: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    saldoajustado: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    idcodex: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ddd: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'detalleproyecto'
  });
};
