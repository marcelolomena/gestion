/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('plantillaclausula', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    cid: {
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
    glosaclausula: {
      type: DataTypes.TEXT,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    nombrecorto: {
      type: DataTypes.STRING,
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
    obligatorio: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sic',timestamps: false,tableName: 'plantillaclausula'
  });
};
