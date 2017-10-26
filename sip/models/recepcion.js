module.exports = function (sequelize, DataTypes) {
    return sequelize.define('recepcion', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        }, nombre: {
            type: DataTypes.STRING(120),
            allowNull: true
        }, cui: {
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
            type: DataTypes.STRING(120),
            allowNull: true
        }, comentario: {
            type: DataTypes.STRING,
            allowNull: true
        }, fecha: {
            field: 'fecha',
            type: DataTypes.DATE,
            allowNull: false
        }, idCompraTramite: {
            field:'idcompratramite',
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
            schema: 'lic',
            timestamps: false,
            tableName: 'recepcion'
        });
};



