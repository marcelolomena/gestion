
module.exports = function(sequelize, DataTypes) {
  return sequelize.define('traduccion', {
    id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      primaryKey: true,
      autoIncrement: true
    },
    idProducto: {
      field:'idproducto',
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: 'producto',
        key: 'id'
      }
    },
    nombre: {
      type: DataTypes.STRING(120),
      allowNull: false
    },
    tipo: {
      type: DataTypes.INTEGER,
      allowNull: false
    }
  }, {
    schema: 'lic',timestamps: false,tableName: 'traduccion'
  });
};
