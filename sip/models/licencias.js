module.exports = function (sequelize, DataTypes) {
    return sequelize.define('licencias', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        idfabricante: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'fabricante',
                key: 'id'
            }
        },
        idtipoinstalacion: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'tipoinstalacion',
                key: 'id'
            }
        },
        idclasificacion: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'clasificacion',
                key: 'id'
            }
        },
        idtipolicenciamiento: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'tipolicenciamiento',
                key: 'id'
            }
        },
        licstock: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        licdisponible: {
            type: DataTypes.INTEGER,
            allowNull: true
        },
        idalertarenovacion: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'parametro',
                key: 'id'
            }
        },
        utilidad: {
            type: DataTypes.STRING,
            allowNull: true
        },
        comentarios: {
            type: DataTypes.STRING,
            allowNull: true
        },
        borrado: {
            type: DataTypes.STRING,
            allowNull: true
        }
    }, {
            schema: 'lic', timestamps: false, tableName: 'licencias'
        });
};
