// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var prefacturasolicitudController = require('../controllers/prefacturasolicitud');
var facturasController = require('../controllers/facturas');
var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");

module.exports = function (passport) {

    router.get('/prefacturasolicitud', isAuthenticated, function (req, res) {
        return models.pagina.findOne({
            where: { nombre: 'prefacturasolicitud' },
            include: [{
                model: models.contenido
            }
            ]
        }).then(function (pagina) {

            return res.render('home', {
                user: req.user,
                data: req.session.passport.sidebar,
                page: 'prefacturasolicitud',
                title: 'Solicitud de Aprobación',
                type: pagina.contenido.nombre,
                idtype: pagina.contenido.id
            });
        }).catch(function (err) {
            logger.error(err);
        });           
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
        return models.pagina.findOne({
            where: { nombre: 'facturas' },
            include: [{
                model: models.contenido
            }
            ]
        }).then(function (pagina) {

            return res.render('home', {
                user: req.user,
                data: req.session.passport.sidebar,
                page: 'facturas',
                title: 'Ingreso de Facturas',
                type: pagina.contenido.nombre,
                idtype: pagina.contenido.id
            });
        }).catch(function (err) {
            logger.error(err);
        });           
        
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

    router.route('/getresumencontable/:id')
        .get(isAuthenticated, facturasController.getResumenContable); 
        
    return router;

}