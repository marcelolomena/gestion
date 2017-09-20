
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('ajuste', {
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
        cantidadInstalada: {
            field:'cantidadinstalada',
            type: DataTypes.INTEGER,
            allowNull: false
        },
        observacion: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
            schema: 'lic', timestamps: false, tableName: 'ajuste'
        });
};
