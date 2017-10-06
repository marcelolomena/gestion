/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('detallecompratramite', {
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
        nombre: {
            type: DataTypes.STRING,
            allowNull: true
        },
        fechaInicio: {
            field:'fechainicio',
            type: DataTypes.DATE,
            allowNull: true
          },
          fechaTermino: {
            field:'fechatermino',
            type: DataTypes.DATE,
            allowNull: true
          },
          fechaControl: {
            field:'fechacontrol',
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
        }

    }, {
        schema: 'lic',
        timestamps: false,
        tableName: 'detallecompratramite'
    });
};