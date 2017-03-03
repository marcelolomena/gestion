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
        idcolor: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'valores',
                key: 'id'
            }
        },
        comentario: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fecha: {
            type: DataTypes.DATE,
            allowNull: true
        },
        borrado: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
            schema: 'sic', timestamps: false, tableName: 'estadosolicitud'
        });
};
