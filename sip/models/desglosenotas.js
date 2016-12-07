module.exports = function(sequelize, DataTypes) {
  return sequelize.define('desglosenotas', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    iddesglosefactores: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'desglosefactores',
        key: 'id'
      }
    },
    nombrenota: {
      type: DataTypes.STRING,
      allowNull: true
    },    
    idnota: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sic',timestamps: false,tableName: 'desglosenotas'
  });
};