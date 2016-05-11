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
    numerotarea: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombre: {
      type: DataTypes.STRING,
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
    idcui: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cui: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idproveedor: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idcuentacontable: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    tarea: {
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
    saldo: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    saldopesos: {
      type: DataTypes.FLOAT,
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