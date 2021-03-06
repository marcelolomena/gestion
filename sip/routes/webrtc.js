var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')

module.exports = function (passport) {

    router.get('/video', isAuthenticated, function (req, res) {
        res.render('video', { user: req.user, data: req.session.passport.sidebar });
    });

    router.get('/conferencia', isAuthenticated, function (req, res) {
        res.render('conferencia', { user: req.user, data: req.session.passport.sidebar });
    });

    return router;

}