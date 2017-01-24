/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tipodocumento', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nombrecorto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    descripcionlarga: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombrearchivo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sic',timestamps: false,tableName: 'tipodocumento'
  });
};
