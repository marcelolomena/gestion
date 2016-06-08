/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('servicio', {
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
    criticidad: {
      type: DataTypes.STRING,
      allowNull: true
    },
    idcuenta: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'cuentascontables',
        key: 'id'
      }
    },
    tarea: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'servicio'
  });
};
