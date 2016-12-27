/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('plantillaclausula', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idclase: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'clase',
        key: 'id'
      }
    },
    codigo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    criticidad: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sic',timestamps: false,tableName: 'plantillaclausula'
  });
};
