/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('fechaenvuelo', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idpresupuestoenvuelo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'presupuestoenvuelo',
        key: 'id'
      }
    },
    tipofecha: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    comentario: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'fechaenvuelo'
  });
};
