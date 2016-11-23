module.exports = function(sequelize, DataTypes) {
  return sequelize.define('clasecriticidad', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    glosaclase: {
      type: DataTypes.STRING,
      allowNull: true
    },    
    factor: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    borrado: {
      type: DataTypes.INTEGER,
      allowNull: true
    }
  }, {
    schema: 'sic',timestamps: false,tableName: 'clasecriticidad'
  });
};
