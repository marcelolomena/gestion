/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('cuerpoclausula', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idplantillaclausula: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'plantillaclausula',
        key: 'id'
      }
    },
    titulo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    glosa: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    idgrupo: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'valores',
        key: 'id'
      }
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sic',timestamps: false,tableName: 'cuerpoclausula'
  });
};
