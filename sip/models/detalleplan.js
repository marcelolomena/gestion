/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('detalleplan', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    iddetallepre: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idperiodo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'periodos',
        key: 'id'
      }
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
      type: DataTypes.INTEGER,
      allowNull: true
    },
    montopesos: {
      type: DataTypes.INTEGER,
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
