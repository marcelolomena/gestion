// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var logger = require("../utils/logger");
var menu = require('../utils/menu');
var bCrypt = require('bcryptjs');
var models = require('../models');

module.exports = function (passport) {

    /* GET login page. */
    router.get('/', function (req, res) {
        // Display the Login page with any flash message, if any
        //console.log("--->>" + req.flash('message'))
        //console.dir(req.flash)
        res.render('index', { message: req.flash('message') });
    });

    /* Handle Login POST */
    const redirectsOne = {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    };
    const redirectsTwo = {
        failureRedirect: '/',
        failureFlash: true
    };

    //router.post('/login', passport.authenticate('login', redirects));

    router.post('/login', passport.authenticate('local', redirectsTwo),
        function (req, res) {
            if (req.body.sistema) {
                menu.builUserdMenu(req, function (err, data) {
                    if (data) {
                        // Explícitamente guardar la sesión antes de redirigir!
                        //req.flash('message', 'Please check your email to confirm it.');
                        //req.session.passport.sidebar.rid
                        req.session.save(() => {
                            req.session.passport.sidebar = data
                            if (parseInt(req.body.sistema) === 1) {

                                models.pagina.belongsTo(models.contenido, { foreignKey: 'idtipo' });
                                return models.pagina.findOne({
                                    where: { nombre: 'home' },
                                    include: [{
                                        model: models.contenido
                                    }
                                    ]
                                }).then(function (pagina) {

                                    return res.render('home', {
                                        user: req.user,
                                        data: data,
                                        page: 'home',
                                        title: '',
                                        type: pagina.contenido.nombre
                                    });
                                }).catch(function (err) {
                                    logger.error(err);
                                });

                            } else {
                                //res.render('sic/home2', { data: data });
                                models.pagina.belongsTo(models.contenido, { foreignKey: 'idtipo' });
                                return models.pagina.findOne({
                                    where: { nombre: 'home2' },
                                    include: [{
                                        model: models.contenido
                                    }
                                    ]
                                }).then(function (pagina) {

                                    return res.render('home2', {
                                        user: req.user,
                                        data: data,
                                        page: 'home2',
                                        title: '',
                                        type: pagina.contenido.nombre
                                    });
                                }).catch(function (err) {
                                    logger.error(err);
                                });                                
                            }
                        })
                    } else {
                        res.render('index', { message: err });
                    }
                });
            } else {
                req.body.sistema = 1
                menu.builUserdMenu(req, function (err, data) {
                    if (data) {
                        // Explícitamente guardar la sesión antes de redirigir!
                        //req.flash('message', 'Please check your email to confirm it.');
                        //req.session.passport.sidebar.rid
                        req.session.save(() => {
                            req.session.passport.sidebar = data
                            if (parseInt(req.body.sistema) === 1) {
                                models.pagina.belongsTo(models.contenido, { foreignKey: 'idtipo' });
                                return models.pagina.findOne({
                                    where: { nombre: 'home' },
                                    include: [{
                                        model: models.contenido
                                    }
                                    ]
                                }).then(function (pagina) {

                                    return res.render('home', {
                                        user: req.user,
                                        data: data,
                                        page: 'home',
                                        title: '',
                                        type: pagina.contenido.nombre
                                    });
                                }).catch(function (err) {
                                    logger.error(err);
                                });
                            } else {
                                //res.render('sic/home2', { data: data });
                                models.pagina.belongsTo(models.contenido, { foreignKey: 'idtipo' });
                                return models.pagina.findOne({
                                    where: { nombre: 'home2' },
                                    include: [{
                                        model: models.contenido
                                    }
                                    ]
                                }).then(function (pagina) {

                                    return res.render('home2', {
                                        user: req.user,
                                        data: data,
                                        page: 'home2',
                                        title: '',
                                        type: pagina.contenido.nombre
                                    });
                                }).catch(function (err) {
                                    logger.error(err);
                                });                                
                            }
                        })
                    } else {
                        res.render('index', { message: err });
                    }
                });
            }
        });

    /*
        router.post('/logon', function (req, res, next) {
            passport.authenticate('daniel', function (err, user, info) {
                if (err) { return next(err); }
                if (!user) { return res.json(401, {nada:'si'}); }
                req.logIn(user, function (err) {
                    if (err) { return next(err); }
                    return res.json(user);
                });
            })(req, res, next);
        });
    */


    /* GET Home Page */
    router.get('/home', isAuthenticated, function (req, res) {
        //res.render('home', { user: req.user, data: req.session.passport.sidebar, page: 'home' });
        models.pagina.belongsTo(models.contenido, { foreignKey: 'idtipo' });
        return models.pagina.findOne({
            where: { nombre: 'home' },
            include: [{
                model: models.contenido
            }
            ]
        }).then(function (pagina) {

            return res.render('home', {
                user: req.user,
                data: req.session.passport.sidebar,
                page: 'home',
                title: '',
                type: pagina.contenido.nombre
            });
        }).catch(function (err) {
            logger.error(err);
        });

    });

    router.get('sic/home2', isAuthenticated, function (req, res) {
        //res.render('sic/home2', { user: req.user, data: req.session.passport.sidebar });
        models.pagina.belongsTo(models.contenido, { foreignKey: 'idtipo' });
        return models.pagina.findOne({
            where: { nombre: 'home2' },
            include: [{
                model: models.contenido
            }
            ]
        }).then(function (pagina) {

            return res.render('home2', {
                user: req.user,
                data: req.session.passport.sidebar,
                page: 'home2',
                title: '',
                type: pagina.contenido.nombre
            });
        }).catch(function (err) {
            logger.error(err);
        });
    });

    /* Handle Logout */
    router.get('/signout', function (req, res) {
        req.session.destroy(function (err) {
            if (err) {
                logger.error(err);
            } else {
                req.logout();
                res.redirect('/');
            }
        });

    });

    /* Handle Logout */
    router.get('/sic/signout', function (req, res) {
        req.session.destroy(function (err) {
            if (err) {
                logger.error(err);
            } else {
                req.logout();
                res.redirect('/');
            }
        });

    });

    return router;

}