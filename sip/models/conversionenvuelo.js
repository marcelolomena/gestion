/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('conversionenvuelo', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idpresupuestoenvuelo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'presupuestoenvuelo',
        key: 'id'
      }
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
    extension: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }

  }, {
    schema: 'sip',timestamps: false,tableName: 'conversionenvuelo'
  });
};
