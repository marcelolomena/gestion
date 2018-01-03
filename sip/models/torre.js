module.exports = function (sequelize, DataTypes) {
  return sequelize.define('torre', {
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
    correo: {
      type: DataTypes.STRING,
      allowNull: true
    }
  }, {
    schema: 'lic',
    timestamps: false,
    tableName: 'torre'
  });
};