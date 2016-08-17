// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')

module.exports = function (passport) {

    /* GET login page. */
    router.get('/', function (req, res) {
        // Display the Login page with any flash message, if any
        console.log("--->>" + req.flash('message'))
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

    router.post('/login', passport.authenticate('login', redirectsTwo),
        function (req, res) {
            // Explícitamente guardar la sesión antes de redirigir!
            req.session.save(() => {
                res.redirect('/home');
            })
        });


    /* GET Home Page */
    router.get('/home', isAuthenticated, function (req, res) {
        res.render('home', { user: req.user });
    });

    /* Handle Logout */
    router.get('/signout', function (req, res) {
        req.session.destroy(function (err) {
            if (err) {
                console.log(err);
            } else {
                req.logout();
                res.redirect('/');
            }
        });

    });

    return router;

}