/* jshint indent: 2 */

module.exports = function(sequelize, DataTypes) {
  return sequelize.define('estructuracentro', {
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
    iddivision: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    division: {
      type: DataTypes.STRING,
      allowNull: true
    },
    niveles: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    glosanivel1: {
      type: DataTypes.STRING,
      allowNull: true
    },
    glosanivel2: {
      type: DataTypes.STRING,
      allowNull: true
    },
    glosanivel3: {
      type: DataTypes.STRING,
      allowNull: true
    },
    glosanivel4: {
      type: DataTypes.STRING,
      allowNull: true
    },
    glosanivel5: {
      type: DataTypes.STRING,
      allowNull: true
    },
    glosanivel6: {
      type: DataTypes.STRING,
      allowNull: true
    },
    glosanivel7: {
      type: DataTypes.STRING,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sip',timestamps: false,tableName: 'estructuracentro'
  });
};
