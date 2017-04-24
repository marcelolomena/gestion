/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('pagina', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: false
    },
    contenido: {
      type: DataTypes.TEXT,
      allowNull: false
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'pagina'
  });
};
