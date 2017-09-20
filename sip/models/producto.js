'use strict'; 
var Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
    return sequelize.define('producto', {
        id: {
            type:DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        idFabricante: {
            field:'idfabricante',
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'fabricante',
                key: 'id'
            }
        },
        nombre: {
            type: DataTypes.STRING(120),
            allowNull: false
        },
        idTipoInstalacion: {
            field:'idtipoinstalacion',
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'tipoInstalacion',
                key: 'id'
            }
        },
        idClasificacion: {
            field:'idclasificacion',
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'clasificacion',
                key: 'id'
            }
        },
        idTipoLicenciamiento: {
            field:'idtipolicenciamiento',
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'tipoLicenciamiento',
                key: 'id'
            }
        },
        licStock: {
            field:'licstock',
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue:0
        },
        licOcupadas: {
            field:'licocupadas',
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue:0
        },
        alertaRenovacion: {
            field:'alertarenovacion',
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue:0
        },
        utilidad: {
            type: DataTypes.STRING(255),
            allowNull: true
        },
        comentarios: {
            type: DataTypes.STRING(255),
            allowNull: true
        }
    }, {
            schema: 'lic', timestamps: false, tableName: 'producto'
        });
};
