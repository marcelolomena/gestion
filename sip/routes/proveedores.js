var models = require('../models');
var proveedorController = require('../controllers/proveedor');
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
	/* GET proveedores listing. */
	// Create endpoint handlers for /proveedores
		/* GET Home Page */
	router.get('/proveedores', isAuthenticated, function (req, res) {

		res.render('proveedores');
	});

	/* GET Home Page */
	/*
	router.get('/proveedores/list', isAuthenticated, function (req, res) {
		var proveedoresData = proveedorController.getProveedores;
		res.render('proveedores', { proveedoresData: proveedoresData });
	});
	*/

router.route('/proveedoreslist')
	.post(isAuthenticated, proveedorController.postProveedores)
	.get(isAuthenticated, proveedorController.getProveedoresPaginados);

	// Create endpoint handlers for /proveedores/:id
	router.route('/proveedores/:id')
		.get(isAuthenticated, proveedorController.getProveedor)
		.put(isAuthenticated, proveedorController.putProveedor)
		.delete(isAuthenticated, proveedorController.deleteProveedor);

	//module.exports = router;
	return router;
}