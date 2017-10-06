module.exports = function (sequelize, DataTypes) {
    return sequelize.define('detalleRecepcion', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        idRecepcion: {
            field: 'idrecepcion',
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'recepcion',
                key: 'id'
            }
        },
        comentario: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        schema: 'lic',
        timestamps: false,
        tableName: 'detallerecepcion'
    });
};