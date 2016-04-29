var models = require('../models');
var proveedorController = require('../controllers/proveedor');
var iniciativaController = require('../controllers/iniciativa');
var contratoController = require('../controllers/contrato');
var proyectoController = require('../controllers/proyecto');
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

	/* GET Registration Page */
	router.get('/signup', function (req, res) {
		res.render('register', { message: req.flash('message') });
	});

	/* Handle Registration POST */
	router.post('/signup', passport.authenticate('signup', {
		successRedirect: '/home',
		failureRedirect: '/signup',
		failureFlash: true
	}));

	/* GET Home Page */
	router.get('/home', isAuthenticated, function (req, res) {
		res.render('home', { user: req.user });
	});

	/* Handle Logout */
	router.get('/signout', function (req, res) {
		req.logout();
		res.redirect('/');
	});

	router.get('/proveedores', isAuthenticated, function (req, res) {
		res.render('proveedores');
	});

	router.route('/proveedoreslist')
		.post(isAuthenticated, proveedorController.postProveedores)
		.get(isAuthenticated, proveedorController.getProveedoresPaginados);

	// Create endpoint handlers for /proveedores/:id
	router.route('/proveedores/:id')
		.get(isAuthenticated, proveedorController.getProveedor)
		.put(isAuthenticated, proveedorController.putProveedor)
		.delete(isAuthenticated, proveedorController.deleteProveedor);

    router.get('/iniciativas', isAuthenticated, function (req, res) {
        res.render('iniciativas');
    });

    router.route('/iniciativaslist')
        .get(isAuthenticated, iniciativaController.getIniciativasPaginados);

    router.get('/contratos', isAuthenticated, function (req, res) {
        res.render('contratos');
    });

    router.route('/contratoslist')
        .get(isAuthenticated, contratoController.getContratosPaginados);
		
    router.get('/proyectos', isAuthenticated, function (req, res) {
        res.render('proyectos');
    });

    router.route('/proyectoslist')
        .get(isAuthenticated, proyectoController.getProyectosPaginados);
		

	return router;
}