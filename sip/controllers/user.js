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
    sequelize.query('SELECT uid,first_name,last_name FROM art_user WHERE CAST(user_profile AS VARCHAR) = :user_profile ORDER BY first_name,last_name',
        { replacements: { user_profile: req.params.rol }, type: sequelize.QueryTypes.SELECT }
    ).then(function (user) {
        res.json(user);
    }).catch(function (err) {
        console.log(err)
        res.json({ error_code: 1 });
    });
}

exports.getUsersProgramMember = function (req, res) {
    sequelize.query('select d.uid, d.first_name, d.last_name from art_program_members a join art_program b on a.program_id=b.program_id join art_user d on a.member_id=d.uid where b.program_code=(select c.codigoart from sip.iniciativaprograma c where c.id= :idiniciativaprograma) and a.is_active=0',
        { replacements: { idiniciativaprograma: req.params.idiniciativaprograma }, type: sequelize.QueryTypes.SELECT }
    ).then(function (user) {
        res.json(user);
    }).catch(function (err) {
        console.log(err)
        res.json({ error_code: 1 });
    });
}