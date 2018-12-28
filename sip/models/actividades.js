/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
    return sequelize.define('actividades', {
      id: {
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true
      },
      nombre: {
        type: DataTypes.STRING,
        allowNull: true
      },
      id_empleado: {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
        model: 'empleado',
        key: 'id'
      }},
      fecha_nacimiento: {
        type: DataTypes.DATE,
        allowNull: true
      },
      rut: {
        type: DataTypes.STRING,
        allowNull: true
      },
      borrado: {
        type: DataTypes.INTEGER,
        allowNull: true
      }
    }, {
      schema: 'dbo',timestamps: false,tableName: 'persona'
    });
  };

