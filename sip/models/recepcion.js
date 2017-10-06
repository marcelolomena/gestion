module.exports = function (sequelize, DataTypes) {
    return sequelize.define('recepcion', {
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
        cui: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        sap: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
		fechaInicio: {
            field: 'fechainicio',
            type: DataTypes.DATE,
            allowNull: true
        },
        fechaTermino: {
            field: 'fechatermino',
            type: DataTypes.DATE,
            allowNull: true
        },
        fechaControl: {
            field: 'fechacontrol',
            type: DataTypes.DATE,
            allowNull: true
        },
        idMoneda: {
            field: 'idmoneda',
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'moneda',
                key: 'id'
            }
        },
        monto: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        comentario: {
            type: DataTypes.STRING,
            allowNull: true
        },
        numsolicitud: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
        schema: 'lic',
        timestamps: false,
        tableName: 'recepcion'
    });
};