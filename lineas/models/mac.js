/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('mac', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    rut: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    actividad: {
      type: DataTypes.STRING,
      allowNull: true
    },
    oficina: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ejecutivo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fecha: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fechaproxvenc: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fechavencant: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ratinggrupo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nivelatr: {
      type: DataTypes.STRING,
      allowNull: true
    },
    ratingind: {
      type: DataTypes.STRING,
      allowNull: true
    },
    clasificacion: {
      type: DataTypes.STRING,
      allowNull: true
    },
    vigilancia: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fechainf: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    schema: 'dbo', timestamps: false, tableName: 'mac'
  });
};
