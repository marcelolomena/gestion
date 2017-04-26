/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('dashboard', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idtipo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'contenido',
        key: 'id'
      }
    },
    div: {
      type: DataTypes.STRING,
      allowNull: false
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: false
    },
    ano: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    mes: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    serie: {
      type: DataTypes.STRING,
      allowNull: true
    },
    secuencia: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    valorx: {
      type: DataTypes.STRING,
      allowNull: true
    },
    valory: {
      type: DataTypes.FLOAT,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'dashboard'
  });
};
