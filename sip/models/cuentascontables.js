/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cuentascontables', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    cuentacontable: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombrecuenta: {
      type: DataTypes.STRING,
      allowNull: true
    },
    invgasto: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idconcepto: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'conceptospresupuestarios',
        key: 'id'
      }
    },
    cuentaorigen: {
      type: DataTypes.STRING,
      allowNull: true
    },
    agrupacion1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    agrupacion2: {
      type: DataTypes.STRING,
      allowNull: true
    }, 
    tipocuenta: {
      type: DataTypes.STRING,
      allowNull: true
    }, 
    conceptogasto: {
      type: DataTypes.STRING,
      allowNull: true
    }, 
    quienpresupuesta: {
      type: DataTypes.STRING,
      allowNull: true
    },                  
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'cuentascontables'
  });
};
