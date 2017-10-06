/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('compraTramite', {
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
        idProveedor: {
            field: 'idproveedor',
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'proveedor',
                key: 'id'
            }
        },
        numContrato: {
            field: 'numcontrato',
            type: DataTypes.INTEGER,
            allowNull: true
        },
        ordenCompra: {
            field: 'ordencompra',
            type: DataTypes.INTEGER,
            allowNull: true
        },
        comprador: {
            type: DataTypes.STRING,
            allowNull: true
        },
        origen: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        borrado: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        schema: 'lic',
        timestamps: false,
        tableName: 'compratramite'
    });
};