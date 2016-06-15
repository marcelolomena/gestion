/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('tareasnuevosproyectos', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idnuevosproyectos: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'nuevosproyectos',
        key: 'id'
      }
    },
    idservicio: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'servicio',
        key: 'id'
      }
    },
    idproveedor: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'proveedor',
        key: 'id'
      }
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'tareasnuevosproyectos'
  });
};
