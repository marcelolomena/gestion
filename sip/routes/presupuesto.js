var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated');
var presupuestoController = require('../controllers/presupuesto');
var presupuestoServiciosController = require('../controllers/presupuestoservicio');
var presupuestoperiodosController = require('../controllers/presupuestoperiodos');


module.exports = function (passport) {

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
        
     return router;       

}        