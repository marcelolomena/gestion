module.exports = function(sequelize, DataTypes) {
  return sequelize.define('desglosefactores', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idclasecriticidad: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'clasecriticidad',
        key: 'id'
      }
    },
    nombrefactor: {
      type: DataTypes.STRING,
      allowNull: true
    },    
    porcentaje: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sic',timestamps: false,tableName: 'desglosefactores'
  });
};