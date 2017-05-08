// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var logger = require("../utils/logger");
var menu = require('../utils/menu');
var bCrypt = require('bcryptjs');
var models = require('../models');

module.exports = function (passport) {

    router.get('/', function (req, res) {
        res.render('index', { message: req.flash('message') });
    });

    const redirectsOne = {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    };
    const redirectsTwo = {
        failureRedirect: '/',
        failureFlash: true
    };

    router.post('/login', passport.authenticate('local', redirectsTwo),
        function (req, res) {
            if (req.body.sistema) {
                menu.builUserdMenu(req, function (err, data) {
                    if (data) {
                        req.session.save(() => {
                            req.session.passport.sidebar = data

                            models.pagina.belongsTo(models.contenido, { foreignKey: 'idtipo' });
                            return models.pagina.findOne({
                                where: { nombre: 'home' + req.body.sistema },
                                include: [{
                                    model: models.contenido
                                }
                                ]
                            }).then(function (pagina) {

                                return res.render('home' + req.body.sistema, {
                                    user: req.user,
                                    data: data,
                                    page: 'home' + req.body.sistema,
                                    title: pagina.title,
                                    type: pagina.contenido.nombre,
                                    idtype: pagina.contenido.id
                                });
                            }).catch(function (err) {
                                logger.error(err);
                            });
                        })
                    } else {
                        res.render('index', { message: err });
                    }
                });
            } else {
                req.body.sistema = 1
                menu.builUserdMenu(req, function (err, data) {
                    if (data) {
                        req.session.save(() => {
                            req.session.passport.sidebar = data
                            models.pagina.belongsTo(models.contenido, { foreignKey: 'idtipo' });
                            return models.pagina.findOne({
                                where: { nombre: 'home' + req.body.sistema },
                                include: [{
                                    model: models.contenido
                                }
                                ]
                            }).then(function (pagina) {

                                return res.render('home' + req.body.sistema, {
                                    user: req.user,
                                    data: data,
                                    page: 'home' + req.body.sistema,
                                    title: pagina.title,
                                    type: pagina.contenido.nombre,
                                    idtype: pagina.contenido.id
                                });
                            }).catch(function (err) {
                                logger.error(err);
                            });

                        })
                    } else {
                        res.render('index', { message: err });
                    }
                });
            }
        });

    return router;

}