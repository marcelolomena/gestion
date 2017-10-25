module.exports = function (sequelize, DataTypes) {
    return sequelize.define('bitacoraCarga', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            primaryKey: true,
            autoIncrement: true
        }, accion: {
            type: DataTypes.STRING(250),
            allowNull: false
        }, archivo: {
            type: DataTypes.STRING(250),
            allowNull: false
        }, idUsuario: {
            field:'idusuario',
            type: DataTypes.INTEGER,
            allowNull: false,
            references: {
                model: 'art_user',
                key: 'id'
            }
        }, fecha: {
            type: DataTypes.DATE,
            allowNull: false
        }
    }, {
            schema: 'lic', timestamps: false, tableName: 'bitacoracarga'
        });
};
