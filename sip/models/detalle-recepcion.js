module.exports = function (sequelize, DataTypes) {
    return sequelize.define('detalleRecepcion', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        }, idRecepcion: {
            field: 'idrecepcion',
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'recepcion',
                key: 'id'
            }
        }, nombre: {
            type: DataTypes.STRING(250),
            allowNull: true
        },  cui: {
            type: DataTypes.INTEGER,
            allowNull: true
        }, sap: {
            type: DataTypes.INTEGER,
            allowNull: true
        }, numContrato: {
            field: 'numcontrato',
            type: DataTypes.INTEGER,
            allowNull: true
        }, ordenCompra: {
            field: 'ordencompra',
            type: DataTypes.INTEGER,
            allowNull: true
        }, idProveedor: {
            field: 'idproveedor',
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'proveedor',
                key: 'id'
            }
        }, comprador: {
            type: DataTypes.STRING(250),
            allowNull: true
        }, idFabricante: {
            field: 'idfabricante',
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'fabricante',
                key: 'id'
            }
        }, idProducto: {
            field: 'idproducto',
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'producto',
                key: 'id'
            }
        }, fechaInicio: {
            field: 'fechainicio',
            type: DataTypes.DATE,
            allowNull: true
        }, fechaTermino: {
            field: 'fechatermino',
            type: DataTypes.DATE,
            allowNull: true
        }, fechaControl: {
            field: 'fechacontrol',
            type: DataTypes.DATE,
            allowNull: true
        }, idMoneda: {
            field: 'idmoneda',
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'moneda',
                key: 'id'
            }
        }, monto: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: true
        }, cantidad: {
            type: DataTypes.INTEGER,
            allowNull: true
        }, comentario: {
            type: DataTypes.STRING,
            allowNull: true
        }, numsolicitud: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
            schema: 'lic',
            timestamps: false,
            tableName: 'detallerecepcion'
        });
};