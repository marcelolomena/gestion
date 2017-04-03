// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var logController = require('../controllers/consultalog');

module.exports = function (passport) {

    router.get('/consultalog', isAuthenticated, function (req, res) {
        res.render('consultalog', { user: req.user, data: req.session.passport.sidebar });
    });

    router.route('/funciones')
        .get(isAuthenticated, logController.funciones);
    
    router.route('/transaccioneslog/:id')
        .get(isAuthenticated, logController.transacciones);
        
    router.route('/consultalog/usuarios')
        .get(isAuthenticated, logController.usuarios);        
          
    router.route('/consultalog/list')
        .get(isAuthenticated, logController.list);
        
    router.route('/consultalog/detalle/:id')
        .get(isAuthenticated, logController.getDetalle);        
        
    router.route('/consultalog/excel')
        .get(isAuthenticated, logController.getExcel);              
        
    return router;    

}