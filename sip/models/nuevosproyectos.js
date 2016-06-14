/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('nuevosproyectos', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idiniciativaprograma: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'iniciativaprograma',
        key: 'id'
      }
    },
    idmoneda: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'moneda',
        key: 'id'
      }
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'nuevosproyectos'
  });
};
