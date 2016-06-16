// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var troyaController = require('../controllers/troya');

module.exports = function (passport) {

    router.get('/consultatroya', isAuthenticated, function (req, res) {
        res.render('troya', { user: req.user });
    });
    
    router.route('/cuiuser')
        .get(isAuthenticated, troyaController.getcui);
    
    router.route('/troyacui/:id')
        .get(isAuthenticated, troyaController.cuitroya);
        
    router.route('/proveedorcui/:id')
        .get(isAuthenticated, troyaController.proveedorcui);

    router.route('/troyafacturas')
        .get(isAuthenticated, troyaController.getfacturas);

    router.route('/troyadetalle/:id')
        .get(isAuthenticated, troyaController.getDetalle);
        
    return router;

}