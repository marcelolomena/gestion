/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pagina', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    idcontenido: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'contenido',
        key: 'id'
      }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idsistema: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'sistema',
        key: 'id'
      }
    },
    script: {
      type: DataTypes.STRING,
      allowNull: true
    },borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'pagina'
  });
};