/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('detalleplanproyecto', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    iddetalleproyecto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'detalleproyecto',
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
    presupuesto: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    presupuestopesos: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    realacumulado: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    realacumuladopesos: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    compromiso: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    compromisopesos: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    borrado: {
      type: 'BIT',
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'detalleplanproyecto'
  });
};
