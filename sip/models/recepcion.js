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
        fecha:{
            field:'fecha',
            type: DataTypes.DATE,
            allowNull:false
        }
    }, {
        schema: 'lic',
        timestamps: false,
        tableName: 'recepcion'
    });
};



