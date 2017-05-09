var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");

module.exports = function (passport) {

    router.get('/menu/:opt', isAuthenticated, function (req, res) {
        //console.dir(req.params)
        console.dir(req.params.opt)
        if (req.params.opt === 'signout') {
            req.session.destroy(function (err) {
                if (err) {
                    logger.error(err);
                } else {
                    req.logout();
                    res.redirect('/');
                }
            });
        } else {
            models.pagina.belongsTo(models.contenido, { foreignKey: 'idtipo' });
            return models.pagina.findOne({
                where: { nombre: req.params.opt },
                include: [{
                    model: models.contenido
                }
                ]
            }).then(function (pagina) {
                return res.render('home' + req.session.passport.sidebar[0].sistema, {
                    user: req.user,
                    data: req.session.passport.sidebar,
                    page: req.params.opt,
                    title: req.params.opt,
                    type: pagina.contenido.nombre,
                    idtype: pagina.contenido.id
                });
            }).catch(function (err) {
                logger.error(err);
            });
        }
    });


    return router;

}