/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('reserva', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        idProducto: {
            field: 'idproducto',
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'producto',
                key: 'id'
            }
        },
        numero: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        fechaEstimada: {
            field: 'fechaestimada',
            type: DataTypes.DATE,
            allowNull: true
        },
        idCui: {
            field: 'idcui',
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'estructuracuibch',
                key: 'id'
            }
        },
        comentario: {
            type: DataTypes.STRING,
            allowNull: true
        },
        estado: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1
        }
    }, {
        schema: 'lic',
        timestamps: false,
        tableName: 'reserva'
    });
};