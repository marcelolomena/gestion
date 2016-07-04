// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var hyperionController = require('../controllers/hyperion');

module.exports = function (passport) {

    router.get('/hyperion', isAuthenticated, function (req, res) {
        res.render('hyperion', { user: req.user });
    });

    router.route('/hyperion/list/:ano')
        .post(isAuthenticated, hyperionController.list)
        .get(isAuthenticated, hyperionController.colnames)   
        
    router.route('/hyperion/excel')
        .get(isAuthenticated, hyperionController.excel)        

    return router;

}