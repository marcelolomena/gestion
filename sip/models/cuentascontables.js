/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cuentascontables', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    cuentacontable: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombrecuenta: {
      type: DataTypes.STRING,
      allowNull: true
    },
    invgasto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idconcepto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'conceptospresupuestarios',
        key: 'id'
      }
    },
    cuentaorigen: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'cuentascontables'
  });
};
