var models = require('../models');
var proveedorController = require('../controllers/proveedor');
var iniciativaController = require('../controllers/iniciativa');
var contratoController = require('../controllers/contrato');
var proyectoController = require('../controllers/proyecto');
var proyectoTareasController = require('../controllers/proyectotareas');
var erogacionesController = require('../controllers/erogaciones');
var programaController = require('../controllers/programa');
var contratoproyectoController = require('../controllers/contratoproyecto');
var contratoservicioController = require('../controllers/contratoservicio');
var iniciativaprogramaController = require('../controllers/iniciativaprograma');
var paramController = require('../controllers/param');
var presupuestoController = require('../controllers/presupuesto');
var presupuestoServiciosController = require('../controllers/presupuestoservicio');
var cuiController = require('../controllers/estructuracui');
var servicioController = require('../controllers/servicio');

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

	router.route('/proveedores/list')
		.post(isAuthenticated, proveedorController.postProveedores)
		.get(isAuthenticated, proveedorController.getProveedores)
		.get(isAuthenticated, proveedorController.getProveedoresPaginados);

	// Create endpoint handlers for /proveedores/:id
	router.route('/proveedores/:id')
		.get(isAuthenticated, proveedorController.getProveedor)
		.put(isAuthenticated, proveedorController.putProveedor)
		.delete(isAuthenticated, proveedorController.deleteProveedor);

    router.get('/iniciativas', isAuthenticated, function (req, res) {
        res.render('iniciativas', { user: req.user });
    });

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

    router.route('/contratoproyecto/:id')
        .post(isAuthenticated, contratoproyectoController.list);

    router.route('/contratoproyecto/action/:id')
        .post(isAuthenticated, contratoproyectoController.action);

    router.route('/contratoservicio/:id')
        .post(isAuthenticated, contratoservicioController.list);

    router.route('/contratoservicio/action/:id')
        .post(isAuthenticated, contratoservicioController.action);

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
		.post(isAuthenticated, iniciativaprogramaController.list)

	router.route('/usuarios_por_rol/:rol')
		.get(isAuthenticated, iniciativaController.getUsersByRol);

	router.route('/programa/:id')
		.get(isAuthenticated, programaController.getPrograma);

	router.route('/programas')
		.get(isAuthenticated, programaController.getProgramas);

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
        res.render('presupuesto');
    });
    router.route('/presupuestolist')
        .get(isAuthenticated, presupuestoController.getPresupuestoPaginados);

    router.route('/presupuestosexcel')
        .get(isAuthenticated, presupuestoController.getExcel);

    router.route('/presupuestoservicios/:id')
        .get(isAuthenticated, presupuestoServiciosController.getPresupuestoServicios);

    router.route('/presupuestoserviciosexcel/:id')
        .get(isAuthenticated, presupuestoServiciosController.getExcel);

    router.route('/servicios')
        .get(isAuthenticated, servicioController.getServicios);
		
    router.route('/cui')
        .get(isAuthenticated, cuiController.getEstructuraCui);		

	return router;
}