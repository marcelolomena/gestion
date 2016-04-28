/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('DETALLECOMPROMISO', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    iddetalleserviciocto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'DETALLESERVICIOCTO',
        key: 'id'
      }
    },
    idperiodo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idmoneda: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    montoorigen: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    montopesos: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'DETALLECOMPROMISO'
  });
};
