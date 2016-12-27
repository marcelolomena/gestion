/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('toc', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idtipoclausula: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'tipoclausula',
        key: 'id'
      }
    },
    idclase: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'clase',
        key: 'id'
      }
    },
    idplanillaclausula: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'plantillaclausula',
        key: 'id'
      }
    },
    secuencia: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sic',timestamps: false,tableName: 'toc'
  });
};
