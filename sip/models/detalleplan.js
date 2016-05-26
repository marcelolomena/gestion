/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('DetallePlan', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    iddetallepre: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    periodo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idmoneda: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'Moneda',
        key: 'id'
      }
    },
    presupuestoorigen: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    presupuestopesos: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    presupuestobaseorigen: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    presupuestobasepesos: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    compromisoorigen: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    compromisopesos: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    provisionorigen: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    provisionpesos: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'detalleplan'
  });
};
