var models = require('../models');
var proveedorController = require('../controllers/proveedor');
var contactoController = require('../controllers/contacto')
var iniciativaController = require('../controllers/iniciativa');
var parametroController = require('../controllers/parametro');
var contratoController = require('../controllers/contrato');
var proyectoController = require('../controllers/proyecto');
var proyectoTareasController = require('../controllers/proyectotareas');
var erogacionesController = require('../controllers/erogaciones');
var programaController = require('../controllers/programa');
//var contratoproyectoController = require('../controllers/contratoproyecto');
var contratoservicioController = require('../controllers/contratoservicio');
var iniciativaprogramaController = require('../controllers/iniciativaprograma');
var iniciativafechaController = require('../controllers/iniciativafecha');
var paramController = require('../controllers/param');
var presupuestoController = require('../controllers/presupuesto');
var presupuestoServiciosController = require('../controllers/presupuestoservicio');
var presupuestoperiodosController = require('../controllers/presupuestoperiodos');
var cuiController = require('../controllers/estructuracui');
var cuentaController = require('../controllers/cuenta');
var servicioController = require('../controllers/servicio');
var monedaController = require('../controllers/moneda');
var compromisoController = require('../controllers/detallecompromiso');
var plantillaController = require('../controllers/plantilla');

var express = require('express');
var router = express.Router();

var isAuthenticated = function (req, res, next) {
    // if user is authenticated in the session, call the next() to call the next request handler 
    // Passport adds this method to request object. A middleware is allowed to add properties to
    // request and response objects
    if (req.isAuthenticated())
        return next();
    // if the user is not authenticated then redirect him to the login page
    res.redirect('/');
}

module.exports = function (passport) {

    /* GET login page. */
    router.get('/', function (req, res) {
        // Display the Login page with any flash message, if any
        res.render('index', { message: req.flash('message') });
    });

    /* Handle Login POST */
    router.post('/login', passport.authenticate('login', {
        successRedirect: '/home',
        failureRedirect: '/',
        failureFlash: true
    }));

    /* GET Home Page */
    router.get('/home', isAuthenticated, function (req, res) {
        res.render('home', { user: req.user });
    });

    /* Handle Logout */
    router.get('/signout', function (req, res) {
        req.session.destroy(function (err) {
            if (err) {
                console.log(err);
            } else {
                req.logout();
                res.redirect('/');
            }
        });

    });

    router.get('/proveedores', isAuthenticated, function (req, res) {
        res.render('proveedores', { user: req.user });
    });

    router.route('/proveedores/combobox')
        .get(isAuthenticated, proveedorController.combobox);

    router.route('/proveedores/list')
        .post(isAuthenticated, proveedorController.list);

    router.route('/proveedores/action')
        .post(isAuthenticated, proveedorController.action);

    router.route('/proveedoresexcel')
        .get(isAuthenticated, proveedorController.getExcel);

    router.route('/contactos/list/:id')
        .get(isAuthenticated, contactoController.list);

    router.route('/contactos/action')
        .post(isAuthenticated, contactoController.action);

    router.get('/iniciativas', isAuthenticated, function (req, res) {
        res.render('iniciativas', { user: req.user });
    });

    router.get('/parametros', isAuthenticated, function (req, res) {
        res.render('parametros', { user: req.user });
    });
    router.route('/parametros/list')
        .post(isAuthenticated, parametroController.list);

    router.route('/parametros/list')
        .post(isAuthenticated, parametroController.list);

    router.route('/parametros/action')
        .post(isAuthenticated, parametroController.action);

    router.route('/iniciativas/list')
        .post(isAuthenticated, iniciativaController.list);

    router.route('/iniciativas/:id')
        .get(isAuthenticated, iniciativaController.get)

    router.route('/iniciativas/action')
        .post(isAuthenticated, iniciativaController.action);

    router.get('/contratos', isAuthenticated, function (req, res) {
        res.render('contratos', { user: req.user });
    });

    router.route('/contratos/list')
        .post(isAuthenticated, contratoController.list);

    router.route('/contratos/action')
        .post(isAuthenticated, contratoController.action);
/*
    router.route('/contratoproyecto/:id')
        .post(isAuthenticated, contratoproyectoController.list);

    router.route('/contratoproyecto/action/:id')
        .post(isAuthenticated, contratoproyectoController.action);
*/        
    router.route('/sap')
        .get(isAuthenticated, contratoservicioController.sap);        

    router.route('/tarea/:id')
        .get(isAuthenticated, contratoservicioController.tarea);        

    router.route('/contratoservicio/:id')
        .post(isAuthenticated, contratoservicioController.list);

    router.route('/contratoservicio/action/:id')
        .post(isAuthenticated, contratoservicioController.action);
        
    router.route('/contratoproyecto/action/:id')
        .post(isAuthenticated, contratoservicioController.oper);        

    router.route('/parameters/:param')
        .get(isAuthenticated, paramController.getListParam);

    router.get('/proyectos', isAuthenticated, function (req, res) {
        res.render('proyectos', { user: req.user });
    });

    router.route('/proyectoslist')
        .get(isAuthenticated, proyectoController.getProyectosPaginados);

    router.route('/proyectostareas/:id')
        .get(isAuthenticated, proyectoTareasController.getProyectosTareas);

    router.route('/proyectostareasexcel/:id')
        .get(isAuthenticated, proyectoTareasController.getExcel);

    router.route('/proyectosexcel')
        .get(isAuthenticated, proyectoController.getExcel);

    router.route('/personal')
        .get(isAuthenticated, iniciativaController.getPersonal);

    router.route('/iniciativasexcel')
        .get(isAuthenticated, iniciativaController.getExcel);

    router.route('/iniciativasprograma/codigoart/:id')
        .get(isAuthenticated, iniciativaprogramaController.codigoart);

    router.route('/iniciativaprograma/action')
        .post(isAuthenticated, iniciativaprogramaController.action);

    router.route('/iniciativaprograma/:id')
        .post(isAuthenticated, iniciativaprogramaController.list);

    router.route('/iniciativafecha/action')
        .post(isAuthenticated, iniciativafechaController.action);

    router.route('/iniciativafecha/:id')
        .post(isAuthenticated, iniciativafechaController.list);

    router.route('/actualizaduracion/:id')
        .get(isAuthenticated, iniciativafechaController.actualizaDuracion);

    router.route('/usuarios_por_rol/:rol')
        .get(isAuthenticated, iniciativaController.getUsersByRol);

    router.route('/programa/:id')
        .get(isAuthenticated, programaController.getPrograma);

    router.route('/programas/:id')
        .get(isAuthenticated, programaController.getProgramasId);

    router.route('/programas')
        .get(isAuthenticated, programaController.getProgramas);

    router.route('/tipos')
        .get(isAuthenticated, parametroController.getTipos);

    router.route('/divisiones')
        .get(isAuthenticated, iniciativaController.getDivisiones);

    router.get('/erogaciones', isAuthenticated, function (req, res) {
        res.render('erogaciones');
    });

    router.route('/erogacioneslist/:id')
        .get(isAuthenticated, erogacionesController.getErogacionesPaginados);

    router.route('/erogacionesexcel/:id')
        .get(isAuthenticated, erogacionesController.getExcel);

    router.get('/presupuestocontinuidad', isAuthenticated, function (req, res) {
        res.render('presupuesto', { user: req.user });
    });

    router.get('/plantillapresupuestaria', isAuthenticated, function (req, res) {
        res.render('plantilla', { user: req.user });
    });
    
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

    router.route('/servicios')
        .get(isAuthenticated, servicioController.getServicios);

    router.route('/cui')
        .get(isAuthenticated, cuiController.getEstructuraCui);

    router.route('/cuentas')
        .get(isAuthenticated, cuentaController.getCuentas);

    router.route('/compromisos/:id')
        .post(isAuthenticated, compromisoController.list);

    router.route('/compromisos/:idd/action')
        .post(isAuthenticated, compromisoController.action);

    router.route('/monedas')
        .get(isAuthenticated, monedaController.getMonedas);

    router.route('/contactos/:id')
        .get(isAuthenticated, contactoController.getContactos);

    router.route('/presupuestoperiodoslist/:id')
        .get(isAuthenticated, presupuestoperiodosController.getPresupuestoPeriodos);

    router.route('/presupuestoperiodos/action')
        .post(isAuthenticated, presupuestoperiodosController.action);

    router.get('/serviciosext', isAuthenticated, function (req, res) {
        res.render('servicios', { user: req.user });
    });
    
    router.route('/serviciosext/list')
        .post(isAuthenticated, servicioController.list);

    router.route('/serviciosext/action')
        .post(isAuthenticated, servicioController.action);
        
    router.route('/serviciosext/cuentas')
        .get(isAuthenticated, servicioController.cuentas);
    
    return router;

}