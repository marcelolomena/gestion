module.exports = function (sequelize, DataTypes) {
    return sequelize.define('tipoInstalacion', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: true,
            unique: true
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