// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var prefacturasolicitudController = require('../controllers/prefacturasolicitud');

module.exports = function (passport) {

    router.get('/prefacturasolicitud', isAuthenticated, function (req, res) {
        res.render('prefacturasolicitud', { user: req.user });
    });
    
    router.route('/prefacturasolicitud/:cui/:periodo')
        .get(isAuthenticated, prefacturasolicitudController.getSolicitudAprob);
        
    router.route('/prefacturasolicitud/causalmulta')
        .get(isAuthenticated, prefacturasolicitudController.getCausalMulta);        

    router.route('/prefacturasolicitud/calificacion')
        .get(isAuthenticated, prefacturasolicitudController.getCalificacion);  

    router.route('/prefacturasolicitud/estadosolicitud')
        .get(isAuthenticated, prefacturasolicitudController.getEstadoSolicitud);          
        
    router.route('/prefacturasolicitud/action')
        .post(isAuthenticated, prefacturasolicitudController.action);        
        
    return router;

}