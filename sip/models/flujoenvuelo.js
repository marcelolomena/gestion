/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('flujoenvuelo', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true      
    },
    iddetalleenvuelo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'detalleenvuelo',
        key: 'id'
      }
    },
    periodo: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idmoneda: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    presupuestoorigen: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    presupuestopesos: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'flujoenvuelo'
  });
};
