
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('instalaciones', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idcui: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'estructuracui',
        key: 'id'
      }
    },
    usuario: {
      type: DataTypes.STRING,
      allowNull: true
    },
    equipo: {
      type: DataTypes.STRING,
      allowNull: true
    },
    fecha: {
      type: DataTypes.DATE,
      allowNull: true
    },
    cantidad: {
      type: DataTypes.INTEGER,
      allowNull: true
    },
    idlicencia: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'licencia',
        key: 'id'
      }
    }
  }, {
    schema: 'lic',timestamps: false,tableName: 'instalaciones'
  });
};
