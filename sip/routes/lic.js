var express = require('express');
var router = express.Router();
var isAuthenticated = require('../policies/isAuthenticated');

var clasificacionController = require('../controllers/lic/clasificacion');
var fabricanteController = require('../controllers/lic/fabricante');
var tipoInstalacionController = require('../controllers/lic/tipoInstalacion');
var tipoLicenciamientoController = require('../controllers/lic/tipoLicenciamiento');
var proveedorController = require('../controllers/lic/proveedor');
var monedaController = require('../controllers/lic/moneda');
var tipoController = require('../controllers/lic/tipo');

var productoController = require('../controllers/lic/producto');
var compraController = require('../controllers/lic/compra');
var instalacionController = require('../controllers/lic/instalacion');
var ajusteController = require('../controllers/lic/ajuste');
var traduccionController = require('../controllers/lic/traduccion');



module.exports = function (passport) {
    router.get('/lic/getsession', function (req, res) {
        return req.session.passport.sidebar[0].rol ? res.json(req.session.passport.sidebar[0].rol) : res.send("no session value stored in DB ");
    });
    router.get('/lic/clasificacion', clasificacionController.listAll);
    router.get('/lic/fabricante', fabricanteController.listAll);
    router.get('/lic/tipoInstalacion', tipoInstalacionController.listAll);
    router.get('/lic/tipoLicenciamiento', tipoLicenciamientoController.listAll);

    router.route('/lic/grid_inventario')
        .get(isAuthenticated, productoController.list)
        .post(isAuthenticated, productoController.action);


    router.get('/lic/proveedor', proveedorController.listAll);
    router.get('/lic/moneda', monedaController.listAll);
    router.get('/lic/tipo', tipoController.listAll);


    router.route('/lic/compra')
        .get(isAuthenticated, compraController.list)
        .post(isAuthenticated, compraController.action);

    router.route('/lic/instalacion')
        .get(isAuthenticated, instalacionController.list)
        .post(isAuthenticated, instalacionController.action);

    router.route('/lic/ajuste')
        .get(isAuthenticated, ajusteController.list)
        .post(isAuthenticated, ajusteController.action);


    router.route('/lic/traduccion')
        .get(isAuthenticated, traduccionController.list)
        .post(isAuthenticated, traduccionController.action);

    return router;
};