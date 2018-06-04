/* jshint indent: 2 */

module.exports = function (sequelize, DataTypes) {
    return sequelize.define('etaparol', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        },
        idetapa: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'valores',
                key: 'id'
            }
        },
        idrol: {
            type: DataTypes.INTEGER,
            allowNull: true,
            references: {
                model: 'rol',
                key: 'id'
            }
        },
        borrado: {
            type: DataTypes.INTEGER,
            allowNull: true
        }
    }, {
            schema: 'sic', timestamps: false, tableName: 'etaparol'
        });
};
