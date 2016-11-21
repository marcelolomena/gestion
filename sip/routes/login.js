// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var logger = require("../utils/logger");
var menu = require('../utils/menu');

module.exports = function(passport) {

    /* GET login page. */
    router.get('/', function(req, res) {
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
        function(req, res) {
            menu.builUserdMenu(req, function(err, data) {
                if (data) {
                    // Explícitamente guardar la sesión antes de redirigir!
                    //req.flash('message', 'Please check your email to confirm it.');
                    //req.session.passport.sidebar.rid
                    req.session.save(() => {
                        req.session.passport.sidebar = data
                        if (parseInt(req.body.sistema) === 1) {
                            res.render('home', { data: data });
                        } else {
                            res.render('sic/home2', { data: data });
                        }
                    })
                } else {
                    res.render('index', { message: err });
                }
            });
        });

    /* GET Home Page */
    router.get('/home', isAuthenticated, function(req, res) {
        res.render('home', { user: req.user, data: req.session.passport.sidebar });
    });

    router.get('/home2', isAuthenticated, function(req, res) {
        res.render('home2', { user: req.user, data: req.session.passport.sidebar });
    });

    /* Handle Logout */
    router.get('/signout', function(req, res) {
        req.session.destroy(function(err) {
            if (err) {
                logger.error(err);
            } else {
                req.logout();
                res.redirect('/');
            }
        });

    });

    /* Handle Logout */
    router.get('/sic/signout', function(req, res) {
        req.session.destroy(function(err) {
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