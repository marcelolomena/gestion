/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('estructuracuibch', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        cui: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        unidad: {
            type: DataTypes.STRING,
            allowNull: true
        },
        nivel: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        cuipadre: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        estado: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        schema: 'sip',
        timestamps: false,
        tableName: 'estructuracuibch'
    });
};