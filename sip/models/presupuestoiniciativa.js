/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('presupuestoiniciativa', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idiniciativaprograma: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'iniciativaprograma',
        key: 'id'
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
    fechaconversion: {
      type: DataTypes.DATE,
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
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'presupuestoiniciativa'
  });
};
