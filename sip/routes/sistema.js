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

                        models.pagina.belongsTo(models.contenido, { foreignKey: 'idtipo' });
                        return models.pagina.findOne({
                            where: { nombre: 'home' + idsistema },
                            include: [{
                                model: models.contenido
                            }
                            ]
                        }).then(function (pagina) {
                            var tmpl

                            if (pagina.contenido.nombre === 'dashboard')
                                tmpl = pug.renderFile('views/page_dash_1.pug', {
                                    title: pagina.title
                                });
                            else if (pagina.contenido.nombre === 'static')
                                tmpl = pug.renderFile('views/page_home' + idsistema + '.pug', {
                                    title: pagina.title
                                });
                            else if (pagina.contenido.nombre === 'grafico')
                                tmpl = pug.renderFile('views/page_grafico.pug', {
                                    title: pagina.title
                                });
                            else if (pagina.contenido.nombre === 'grid')
                                tmpl = pug.renderFile('views/page_grid.pug', {
                                    title: pagina.title
                                });

                            return res.render('home' + idsistema, {
                                user: req.user,
                                data: data,
                                page: 'home' + idsistema,
                                title: pagina.title,
                                type: pagina.contenido.nombre,
                                idtype: pagina.contenido.id,
                                html: tmpl
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

    router.get('/menu/:opt', isAuthenticated, function (req, res) {
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
                var tmpl
                if (pagina.contenido.nombre === 'dashboard')
                    tmpl = pug.renderFile('views/page_dash_1.pug', {
                        title: pagina.title
                    });
                else if (pagina.contenido.nombre === 'static')
                    tmpl = pug.renderFile('views/page_home' + req.session.passport.sidebar[0].sistema + '.pug', {
                        title: pagina.title
                    });
                else if (pagina.contenido.nombre === 'grafico')
                    tmpl = pug.renderFile('views/page_grafico.pug', {
                        title: pagina.title
                    });
                else if (pagina.contenido.nombre === 'grid')
                    tmpl = pug.renderFile('views/page_grid.pug', {
                        title: pagina.title
                    });
                else if (pagina.contenido.nombre === 'tabs')
                    tmpl = pug.renderFile('views/page_tab.pug', {
                        title: pagina.title
                    });

                return res.render('home' + req.session.passport.sidebar[0].sistema, {
                    user: req.user,
                    data: req.session.passport.sidebar,
                    page: req.params.opt,
                    title: pagina.title,
                    type: pagina.contenido.nombre,
                    idtype: pagina.contenido.id,
                    html: tmpl
                });

            }).catch(function (err) {
                logger.error(err);
            });
        }
    });

    return router;
}