/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('DetalleCompromiso', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    iddetalleserviciocto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'DetalleServicioCto',
        key: 'id'
      }
    },
    periodo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idmoneda: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'moneda',
        key: 'id'
      }
    },
    montoorigen: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    montopesos: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'detallecompromiso'
  });
};
