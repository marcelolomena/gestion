var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated');
var presupuestoController = require('../controllers/presupuesto');
var presupuestoServiciosController = require('../controllers/presupuestoservicio');
var presupuestoperiodosController = require('../controllers/presupuestoperiodos');
var presupuestoapruebaController = require('../controllers/presupuestoaprueba');


module.exports = function (passport) {

    router.get('/presupuestocontinuidad', isAuthenticated, function (req, res) {
        res.render('presupuesto', { user: req.user, data: req.session.passport.sidebar });
    });

    router.get('/presupuestoaprobacion', isAuthenticated, function (req, res) {
        res.render('presupuestoaprueba', { user: req.user, data: req.session.passport.sidebar });
    });
    
    router.route('/presupuestoperiodoslist/:id')
        .get(isAuthenticated, presupuestoperiodosController.getPresupuestoPeriodos);

    router.route('/presupuestoperiodos/action')
        .post(isAuthenticated, presupuestoperiodosController.action);

    router.route('/presupuestoservicios/:id')
        .get(isAuthenticated, presupuestoServiciosController.getPresupuestoServicios);

    router.route('/presupuestoserviciosexcel/:id')
        .get(isAuthenticated, presupuestoServiciosController.getExcel);

    router.route('/presupuestoservicios/action/:id')
        .post(isAuthenticated, presupuestoServiciosController.action);

    router.route('/monedas')
        .get(isAuthenticated, presupuestoServiciosController.getMonedas);

    router.route('/serviciospre/:id')
        .get(isAuthenticated, presupuestoServiciosController.getServicios);

    router.route('/proveedorespre/:id')
        .get(isAuthenticated, presupuestoServiciosController.getProveedores);
        
    router.route('/proveedorespreserv/:id/:id2')
        .get(isAuthenticated, presupuestoServiciosController.getProveedoresServ);        

    router.route('/presupuestolist')
        .get(isAuthenticated, presupuestoController.getPresupuestoPaginados);

    router.route('/presupuestosexcel')
        .get(isAuthenticated, presupuestoController.getExcel);

    router.route('/CUIs')
        .get(isAuthenticated, presupuestoController.getCUIs);

    router.route('/presupuesto/action')
        .post(isAuthenticated, presupuestoController.action);

    router.route('/ejercicios')
        .get(isAuthenticated, presupuestoController.getEjercicios);       
        
    router.route('/getversion/:cui/:ejercicio')
        .get(isAuthenticated, presupuestoController.getVersion);           

    router.route('/actualizaTotales/:id')
        .get(isAuthenticated, presupuestoController.updateTotales);   

    router.route('/presupuestoconfirma/:id/:estado/:idcui/:ideje')
        .get(isAuthenticated, presupuestoController.confirma);   

    router.route('/presupuestosconfirmados')
        .get(isAuthenticated, presupuestoapruebaController.getPresupuestosConfirmados);   
        
    router.route('/aprueba/:ids')
        .get(isAuthenticated, presupuestoapruebaController.aprueba);           

    router.route('/desaprueba/:ids')
        .get(isAuthenticated, presupuestoapruebaController.desaprueba);   

    router.route('/serviciosfrecuencia')
        .get(isAuthenticated, presupuestoServiciosController.getFrecuencia);  

    router.route('/serviciosperiodos')
        .get(isAuthenticated, presupuestoServiciosController.getPeriodos);  

    router.route('/tiporecupera')
        .get(isAuthenticated, presupuestoServiciosController.getTipoRecupera);         

    router.get('/presupuestoeditcosto', isAuthenticated, function (req, res) {
        res.render('presupuestoeditcosto', { user: req.user, data: req.session.passport.sidebar });
    });        
    
    router.route('/presupuestoperiodoscosto/action')
        .post(isAuthenticated, presupuestoperiodosController.actioncosto);    

    router.route('/presupuestogetrol')
        .get(isAuthenticated, presupuestoController.getRolNegocio);   
        
    router.get('/presupuestoreadonly', isAuthenticated, function (req, res) {
        res.render('presupuestolectura', { user: req.user, data: req.session.passport.sidebar });
    });
    
    router.route('/presupuestolistro')
        .get(isAuthenticated, presupuestoController.getPresupuestoReadOnly);  
        
     return router;       

}        