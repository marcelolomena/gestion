
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('ajuste', {
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
        software: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cantidadinstalada: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        observacion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        borrado: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
            schema: 'lic', timestamps: false, tableName: 'ajuste'
        });
};
