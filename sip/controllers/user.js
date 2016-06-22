var models = require('../models');
var sequelize = require('../models/index').sequelize;

exports.getUsersByRol = function (req, res) {
    models.user.belongsToMany(models.rol, { foreignKey: 'uid', through: models.usrrol });
    models.rol.belongsToMany(models.user, { foreignKey: 'rid', through: models.usrrol });

    models.user.findAll({
        attributes: ['uid', 'first_name', 'last_name'],
        order: ['[user].first_name', '[user].last_name'],
        include: [{
            model: models.rol,
            where: { 'glosarol': req.params.rol }, attributes: ['id', 'glosarol']
        }]
    }).then(function (gerentes) {
        res.json(gerentes);
    }).catch(function (err) {
        res.json({ error_code: 1 });
    });
}

exports.getUsersByRolART = function (req, res) {
    /*
    models.user.findAll({
        attributes: ['uid', 'first_name', 'last_name'],
        order: ['first_name', 'last_name'],
        where: { user_profile: req.params.rol }
    }).then(function (gerentes) {
        res.json(gerentes);
    }).catch(function (err) {
        console.log(err)
        res.json({ error_code: 1 });
    });
    */

    sequelize.query('SELECT uid,first_name,last_name FROM art_user WHERE CAST(user_profile AS VARCHAR) = :user_profile ORDER BY first_name,last_name',
        { replacements: { user_profile: req.params.rol }, type: sequelize.QueryTypes.SELECT }
    ).then(function (user) {
        //console.log(user)
        res.json(user);
    }).catch(function (err) {
        console.log(err)
        res.json({ error_code: 1 });
    });
}