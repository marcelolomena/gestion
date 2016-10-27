/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('detallecargas', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idlogcargas: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'logcargas',
        key: 'id'
      }
    },
    fechaarchivo: {
      type: DataTypes.DATE,
      allowNull: true
    },
    fechaproceso: {
      type: DataTypes.DATE,
      allowNull: true
    },
    usuario: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nroregistros: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombre1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    control1: {
      type: DataTypes.STRING,
      allowNull: true
    },        
    nombre2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    control2: {
      type: DataTypes.STRING,
      allowNull: true
    },       
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'detallecargas'
  });
};