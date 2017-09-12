module.exports = function (sequelize, DataTypes) {
    return sequelize.define('clasificacion', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DateTypes.STRING,
            allowNull: false

        },
        borrado: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
            schema: 'lic',
            timestamps: false,
            tableName: 'clasificacion'
        });
};