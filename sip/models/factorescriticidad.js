/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('factorescriticidad', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idserviciorequerido: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'serviciosrequeridos',
        key: 'id'
      }
    },
    iddesglosefactores: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'desglosefactores',
        key: 'id'
      }
    },
    porcentaje: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    nota: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    valor: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    observacion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sic',timestamps: false,tableName: 'factorescriticidad'
  });
};
