/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('detalleplan', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    iddetallepre: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'detallepre',
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
    presupuestoorigen: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    presupuestopesos: {
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
    },
    caja: {
      type: DataTypes.FLOAT,
      allowNull: true
    },   
    costo: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    cajacomprometido: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    costocomprometido: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    totalcaja: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    totalcosto: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    disponible: {
      type: DataTypes.FLOAT,
      allowNull: true
    }        
  }, {
    schema: 'sip',timestamps: false,tableName: 'detalleplan'
  });
};
