module.exports = function (sequelize, DataTypes) {
    return sequelize.define('tipolicenciemiento', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DateTypes.STRING(120),
            allowNull:false

        },
        borrado: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        schema: 'lic',
        timestamps: false,
        tableName: 'tipolicenciemiento'
    });
};