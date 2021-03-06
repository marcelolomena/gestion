module.exports = function (sequelize, DataTypes) {
    return sequelize.define('estadosolicitud', {
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
        comentario: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fechaCierre: {
            field: 'fecha',
            type: DataTypes.DATE,
            allowNull: true
        },
        borrado: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        fechaestadoesperada: {
            type: DataTypes.DATE,
            allowNull: true
        },
        colorestado: {
            type: DataTypes.STRING,
            allowNull: true
        },
        estado: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        idclasificacionsolicitud: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'valores',
                key: 'id'
            }
        },
        fechaInicio: {
            field: 'fechainicio',
            type: DataTypes.DATE,
            allowNull: true
        }
    }, {
        schema: 'sic',
        timestamps: false,
        tableName: 'estadosolicitud'
    });
};