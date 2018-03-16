/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('presupuestoenvuelo', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nombreproyecto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    sap: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    program_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'art_program',
        key: 'program_id'
      }
    },
    cuifinanciamiento1: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    porcentaje1: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    cuifinanciamiento2: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    porcentaje2: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    beneficioscuantitativos: {
      type: DataTypes.STRING,
      allowNull: true
    },
    beneficioscualitativos: {
      type: DataTypes.STRING,
      allowNull: true
    },
    uidlider: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    uidjefeproyecto: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    uidpmoresponsable: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    dolar: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    uf: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    fechaconversion: {
      type: DataTypes.DATE,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'presupuestoenvuelo'
  });
};
