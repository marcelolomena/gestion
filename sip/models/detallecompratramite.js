/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('detalleCompraTramite', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        idCompraTramite: {
            field: 'idcompratramite',
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'compratramite',
                key: 'id'
            }
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
        monto: {
            type: DataTypes.INTEGER,
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
        comentario: {
            type: DataTypes.STRING,
            allowNull: true
        },
        numsolicitud: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        nombre: {
            type: DataTypes.STRING,
            allowNull: true
        },
        numero: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        idProducto: {
            field: 'idproducto',
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'producto',
                key: 'id'
            }
        }
    }, {
        schema: 'lic',
        timestamps: false,
        tableName: 'detallecompratramite'
    });
};