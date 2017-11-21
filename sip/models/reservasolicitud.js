/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('reservaSolicitud', {
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
        numlicencia: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        fechaUso: {
            field: 'fechauso',
            type: DataTypes.DATE,
            allowNull: true
        },
        fechaSolicitud: {
            field: 'fechasolicitud',
            type: DataTypes.DATE,
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
        comentario: {
            type: DataTypes.STRING,
            allowNull: true
        },
        idEstado: {
            field: 'idestado',
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'parametro',
                key: 'id'
            }
        },
        idUsuario: {
            field: 'idusuario',
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'art_user',
                key: 'id'
            }
        }
    }, {
        schema: 'lic',
        timestamps: false,
        tableName: 'reservasolicitud'
    });
};