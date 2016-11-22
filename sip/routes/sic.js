var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')

module.exports = function(passport) {
    router.get('/sic/acordeon', isAuthenticated, function(req, res) {
        res.render('sic/acordeon', { user: req.user, data: req.session.passport.sidebar });
    });

    router.get('/sic/getsession', function(req, res) {
        console.log(req.session.passport.sidebar[0].rol)
        if (req.session.passport.sidebar[0].rol)
            res.json(req.session.passport.sidebar[0].rol);
        else
            res.send("no session value stored in DB ");
    });

    return router;
}