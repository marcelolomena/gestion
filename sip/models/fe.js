/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('fe', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true
    },
    descripcion: {
      type: 'CHAR',
      allowNull: true
    },
    porcentajeasig: {
      type: DataTypes.FLOAT,
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
    idcui: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    tableName: 'fe'
  });
};
