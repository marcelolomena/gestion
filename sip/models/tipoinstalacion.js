module.exports = function (sequelize, DataTypes) {
    return sequelize.define('tipoinstalacion', {
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
        borrado: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
            schema: 'lic',
            timestamps: false,
            tableName: 'tipoinstalacion' 
        });
};