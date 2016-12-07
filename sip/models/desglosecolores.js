module.exports = function(sequelize, DataTypes) {
  return sequelize.define('desglosecolores', {
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
    notainicial: {
      type: DataTypes.FLOAT,
      allowNull: true
    },    
    notafinal: {
      type: DataTypes.FLOAT,
      allowNull: true
    },
    idcolor: {
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
    schema: 'sic',timestamps: false,tableName: 'desglosecolores'
  });
};