/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('calendariosolicitud', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        idsolicitudcotizacion: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'solicitudcotizacion',
                key: 'id'
            }
        },
        descripcion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fechaesperada: {
            type: DataTypes.DATE,
            allowNull: true
        },
        observacion: {
            type: DataTypes.STRING,
            allowNull: true
        },
        idtiporesponsable: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'valores',
                key: 'id'
            }
        },
        borrado: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        fechareal: {
            type: DataTypes.DATE,
            allowNull: true
        },
        horaesperada: {
            type: DataTypes.TIME,
            allowNull: true
        },
        horareal: {
            type: DataTypes.TIME,
            allowNull: true
        }
    }, {
            schema: 'sic', timestamps: false, tableName: 'calendariosolicitud'
        });
};
