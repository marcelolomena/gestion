
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('traductor', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idlicencia: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: 'licencia',
        key: 'id'
      }
    },
    nombre: {
      type: DataTypes.STRING,
      allowNull: true
    },
    tipo: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    schema: 'lic',timestamps: false,tableName: 'traductor'
  });
};
