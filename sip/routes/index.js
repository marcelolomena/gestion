var models = require('../models');
var proveedorController = require('../controllers/proveedor');
var iniciativaController = require('../controllers/iniciativa');
var contratoController = require('../controllers/contrato');
var proyectoController = require('../controllers/proyecto');
var proyectoTareasController = require('../controllers/proyectotareas');
var erogacionesController = require('../controllers/erogaciones');
var programaController = require('../controllers/programa');
var iniciativaprogramaController = require('../controllers/iniciativaprograma');

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
        .get(isAuthenticated, iniciativaController.getIniciativasPaginados);

	// Create endpoint handlers for /iniciativas/:id
	router.route('/iniciativas/:id')
		.get(isAuthenticated, iniciativaController.get)

	router.route('/iniciativas/add')
		.post(isAuthenticated, iniciativaController.add);

	router.route('/iniciativas/update')
		.post(isAuthenticated, iniciativaController.update);

	router.route('/iniciativas/del')
		.post(isAuthenticated, iniciativaController.del);

    router.get('/contratos', isAuthenticated, function (req, res) {
        res.render('contratos', { user: req.user });
    });

    router.route('/contratos/list')
        .get(isAuthenticated, contratoController.getContratosPaginados);

    router.get('/proyectos', isAuthenticated, function (req, res) {
        res.render('proyectos', { user: req.user });
    });

    router.route('/proyectoslist')
        .get(isAuthenticated, proyectoController.getProyectosPaginados);

    router.route('/proyectostareas/:id')
        .get(isAuthenticated, proyectoTareasController.getProyectosTareas);
		
	router.route('/proyectosexcel')
		.get(isAuthenticated, proyectoController.getExcel);

	router.route('/personal')
		.get(isAuthenticated, iniciativaController.getPersonal);

	router.route('/iniciativasexcel')
		.get(isAuthenticated, iniciativaController.getExcel);

	router.route('/iniciativasprograma/add/:id')
		.post(isAuthenticated, iniciativaprogramaController.add);
		
	router.route('/iniciativasprograma/update')
		.post(isAuthenticated, iniciativaprogramaController.update);

	router.route('/iniciativasprograma/del')
		.post(isAuthenticated, iniciativaprogramaController.del);		

	router.route('/usuarios_por_rol/:rol')
		.get(isAuthenticated, iniciativaController.getUsersByRol);

	router.route('/categorias')
		.get(isAuthenticated, iniciativaController.getCategoria);

	router.route('/programas')
		.get(isAuthenticated, iniciativaController.getProgramas);

	router.route('/iniciativaestado')
		.get(isAuthenticated, iniciativaController.getEstado);

	router.route('/divisiones')
		.get(isAuthenticated, iniciativaController.getDivisiones);

    router.get('/erogaciones', isAuthenticated, function (req, res) {
        res.render('erogaciones');
    });

    router.route('/erogacioneslist/:id')
        .get(isAuthenticated, erogacionesController.getErogacionesPaginados);

	router.route('/programa/:id')
		.get(isAuthenticated, iniciativaprogramaController.getIniciativaPrograma)


	return router;
}