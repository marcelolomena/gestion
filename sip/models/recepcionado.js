/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('recepcionado', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        idDetalleCompraTramite: {
            field: 'iddetallecompratramite',
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'detallecompratramite',
                key: 'id'
            }
        },
        numSolicitud: {
            field: 'numsolicitud',
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'detallerecepcion',
                key: 'id'
            }
        }
    }, {
        schema: 'lic',
        timestamps: false,
        tableName: 'recepcionado'
    });
};