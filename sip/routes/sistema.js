var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var logger = require("../utils/logger");
var menu = require('../utils/menu');
var models = require('../models');
var pug = require('pug');

module.exports = function (passport) {

    router.get('/', function (req, res) {
        res.render('index', { message: req.flash('message') });
    });

    const redirects = {
        //successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    };

    router.post('/login', passport.authenticate('local', redirects),
        function (req, res) {
            var idsistema
            if (req.body.sistema) {
                idsistema = req.body.sistema
            } else {
                idsistema = 1
            }

            menu.builUserdMenu(req, function (err, data) {
                if (data) {
                    req.session.save(() => {
                        req.session.passport.sidebar = data
                        models.pagina.belongsTo(models.sistema, { foreignKey: 'idsistema' });
                        models.pagina.belongsTo(models.contenido, { foreignKey: 'idcontenido' });

                        return models.sistema.findOne({
                            where: { id: idsistema }
                        }).then(function (home) {

                            return models.pagina.findOne({
                                where: { nombre: home.pagina },
                                include: [
                                    {
                                        model: models.sistema
                                    },
                                    {
                                        model: models.contenido
                                    }
                                ]
                            }).then(function (pagina) {
                                var tmpl = pug.renderFile(pagina.contenido.plantilla, {
                                    title: pagina.title
                                });

                                return res.render(home.pagina, {
                                    user: req.user,
                                    data: data,
                                    page: home.pagina,
                                    title: pagina.title,
                                    type: pagina.contenido.nombre,
                                    idtype: pagina.contenido.id,
                                    html: tmpl
                                });
                            }).catch(function (err) {
                                logger.error(err);
                            });

                        }).catch(function (err) {
                            logger.error(err);
                        });
                    })
                } else {
                    res.render('index', { message: err });
                }
            });
        });

    router.get('/menu/:opt', isAuthenticated, function (req, res, next) {
        var idsistema = req.session.passport.sidebar[0].sistema
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
            models.pagina.belongsTo(models.sistema, { foreignKey: 'idsistema' });
            models.pagina.belongsTo(models.contenido, { foreignKey: 'idcontenido' });

            return models.sistema.findOne({
                where: { id: idsistema }
            }).then(function (home) {

                return models.pagina.findOne({
                    where: { nombre: req.params.opt },
                    include: [
                        {
                            model: models.sistema
                        },
                        {
                            model: models.contenido
                        }
                    ]
                }).then(function (pagina) {

                    if (idsistema != pagina.idsistema)
                        throw new Error("No tiene permiso para ver una página de otro sistema")

                    var tmpl = pug.renderFile(pagina.contenido.plantilla, {
                        title: pagina.title
                    });

                    return res.render(home.pagina, {
                        user: req.user,
                        data: req.session.passport.sidebar,
                        page: req.params.opt,
                        title: pagina.title,
                        type: pagina.contenido.nombre,
                        idtype: pagina.contenido.id,
                        html: tmpl
                    });

                }).catch(function (err) {
                    throw err;
                });

            }).catch(function (err) {
                logger.error(err);
                return next(err)
            });
        }
    });

    return router;
}