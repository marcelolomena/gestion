/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('estructuracui', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    idestructura: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'estructuracentro',
        key: 'id'
      }
    },
    secuencia: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    cui: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    cuipadre: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    uid: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nombreresponsable: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idgerencia: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    gerencia: {
      type: DataTypes.STRING,
      allowNull: true
    },
    nombregerente: {
      type: 'CHAR',
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'estructuracui'
  });
};
