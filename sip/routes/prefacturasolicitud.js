// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var prefacturasolicitudController = require('../controllers/prefacturasolicitud');
var facturasController = require('../controllers/facturas');

module.exports = function (passport) {

    router.get('/prefacturasolicitud', isAuthenticated, function (req, res) {
        res.render('prefacturasolicitud', { user: req.user, data: req.session.passport.sidebar });
    });
    
    router.route('/prefacturasolicitud/:cui/:periodo/:proveedor')
        .get(isAuthenticated, prefacturasolicitudController.getSolicitudAprob);
        
    router.route('/prefacturasolicitud/causalmulta')
        .get(isAuthenticated, prefacturasolicitudController.getCausalMulta);        

    router.route('/prefacturasolicitud/calificacion')
        .get(isAuthenticated, prefacturasolicitudController.getCalificacion);  

    router.route('/prefacturasolicitud/estadosolicitud')
        .get(isAuthenticated, prefacturasolicitudController.getEstadoSolicitud);   

    router.route('/cuisprefactura/:id/:periodo')
        .get(isAuthenticated, prefacturasolicitudController.cuisprefactura);         
        
    router.route('/prefactura/proveedores/:cui/:periodo')
        .get(isAuthenticated, prefacturasolicitudController.getProveedores);  
        
    router.route('/prefacturasolicitud/action')
        .post(isAuthenticated, prefacturasolicitudController.action);        

    router.get('/facturas', isAuthenticated, function (req, res) {
        res.render('facturas', { user: req.user, data: req.session.passport.sidebar });
    });
    
    router.route('/facturaslist')
        .get(isAuthenticated, facturasController.getFacturas);
        
    router.route('/facturas/proveedores')
        .get(isAuthenticated, facturasController.getProveedores);       

    router.route('/facturas/action')
        .post(isAuthenticated, facturasController.action);          

    router.route('/facturas/actionDetalle/:id')
        .post(isAuthenticated, facturasController.actionDetalle);             
        
    router.route('/facturasdetalle/:id')
        .get(isAuthenticated, facturasController.getDetalleFacturas);   

    router.route('/getsolicitud/:id/:idproveedor')
        .get(isAuthenticated, facturasController.getSolicitudAprob);           

    router.route('/getdesglosecontable/:id')
        .get(isAuthenticated, facturasController.getDesglose); 
        
    return router;

}