/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('controlusuario', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        idproducto: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'producto',
                key: 'id'
            }
        },
        contacto: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fechaactualizacion: {
            type: DataTypes.DATE,
            allowNull: true
        },
        observaciones: {
            type: DataTypes.STRING,
            allowNull: true
        },
        cantidad: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        codigointerno: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
        schema: 'lic',
        timestamps: false,
        tableName: 'controlusuario'
    });
};