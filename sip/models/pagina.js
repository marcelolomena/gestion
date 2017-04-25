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
    idtipo: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'contenido',
        key: 'id'
      }
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'pagina'
  });
};