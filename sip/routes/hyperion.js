// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var hyperionController = require('../controllers/hyperion');


module.exports = function (passport) {

    router.get('/hyperion', isAuthenticated, function (req, res) {
        res.render('hyperion', { user: req.user });
    });

    router.route('/hyperion/list')
        .post(isAuthenticated, hyperionController.list)
        
    router.route('/hyperion/colnames/:ano')
        .get(isAuthenticated, hyperionController.colnames)        

    return router;

}