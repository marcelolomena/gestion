var express = require('express');
var router = express.Router();
var isAuthenticated = require('../policies/isAuthenticated');

var clasificacionController = require('../controllers/lic/clasificacion');
var fabricanteController = require('../controllers/lic/fabricante');
var tipoInstalacionController = require('../controllers/lic/tipoInstalacion');
var tipoLicenciamientoController = require('../controllers/lic/tipoLicenciamiento');
var proveedorController = require('../controllers/lic/proveedor');
var cuiController = require('../controllers/lic/cui');
var monedaController = require('../controllers/lic/moneda');
var tipoController = require('../controllers/lic/tipo');

var productoController = require('../controllers/lic/producto');
var compraController = require('../controllers/lic/compra');
var traduccionController = require('../controllers/lic/traduccion');

var planillaController = require('../controllers/lic/planilla');

var instalacionController = require('../controllers/lic/instalacion');
var ajusteController = require('../controllers/lic/ajuste');


module.exports = function (passport) {
    router.get('/lic/getsession', function (req, res) {
        return req.session.passport.sidebar[0].rol 
            ? res.json(req.session.passport.sidebar[0].rol) 
            : res.send("no session value stored in DB ");
    });
    router.get('/lic/clasificacion', clasificacionController.listAll);
    router.get('/lic/fabricante', fabricanteController.listAll);
    router.get('/lic/tipoInstalacion', tipoInstalacionController.listAll);
    router.get('/lic/tipoLicenciamiento', tipoLicenciamientoController.listAll);
    router.get('/lic/proveedor', proveedorController.listAll);
    router.get('/lic/cui', cuiController.listAll);
    router.get('/lic/moneda', monedaController.listAll);
    router.get('/lic/tipo', tipoController.listAll);

    router.route('/lic/grid_inventario')
        .get(isAuthenticated, productoController.list)
        .post(isAuthenticated, productoController.action);

    router.route('/lic/compra/:pId')
        .get(isAuthenticated, compraController.listChilds)
        .post(isAuthenticated, compraController.action);

    router.route('/lic/compra')
        .get(isAuthenticated, compraController.list);

    router.route('/lic/traduccion/:pId')
        .get(isAuthenticated, traduccionController.listChilds) 
        .post(isAuthenticated, traduccionController.action);

    router.route('/lic/planilla')
        .get(isAuthenticated, planillaController.list) 
        .post(isAuthenticated, planillaController.action);
        
    router.route('lic/exportplanilla' )
        .get(isAuthenticated, planillaController.excel);

    // router.route('/lic/alerta')
    //     .get(isAuthenticated, planillaController.alerta);
        
    router.route('/lic/traduccion')
        .get(isAuthenticated, traduccionController.list);

    router.route('/lic/instalacion')
        .get(isAuthenticated, instalacionController.list)
        .post(isAuthenticated, instalacionController.action);

    router.route('/lic/ajuste')
        .get(isAuthenticated, ajusteController.list)
        .post(isAuthenticated, ajusteController.action);

    return router;
};