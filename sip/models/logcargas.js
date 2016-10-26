/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('logcargas', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    archivo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fechaarchivo: {
      type: DataTypes.DATE,
      allowNull: true
    },
    frecuencia: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tipocarga: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'logcargas'
  });
};
