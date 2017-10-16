var express = require('express');
var router = express.Router();
var isAuthenticated = require('../policies/isAuthenticated');

var clasificacionController = require('../controllers/lic/clasificacion');
var fabricanteController = require('../controllers/lic/fabricante');
var tipoInstalacionController = require('../controllers/lic/tipoInstalacion');
var tipoLicenciamientoController = require('../controllers/lic/tipoLicenciamiento');
var proveedorController = require('../controllers/lic/proveedor');
var cuiController = require('../controllers/lic/cui');
var cuiBchController = require('../controllers/lic/cuibch');
var monedaController = require('../controllers/lic/moneda');
var tipoController = require('../controllers/lic/tipo');

var productoController = require('../controllers/lic/producto');
var compraController = require('../controllers/lic/compra');
var traduccionController = require('../controllers/lic/traduccion');

var planillaController = require('../controllers/lic/planilla');

var instalacionController = require('../controllers/lic/instalacion');
var ajusteController = require('../controllers/lic/ajuste');

var compraTramiteController = require('../controllers/lic/compratramite');
var detalleCompraTramiteController = require('../controllers/lic/detallecompratramite');

var recepcionController = require('../controllers/lic/recepcion');
var detalleRecepcionController = require('../controllers/lic/detalle-recepcion');

module.exports = function (passport) {
    router.get('/lic/getsession', function (req, res) {
        return req.session.passport.sidebar[0].rol ?
            res.json(req.session.passport.sidebar[0].rol) :
            res.send("no session value stored in DB ");
    });

    router.get('/lic/fabricantes', fabricanteController.listAll);
    router.route('/lic/fabricante')
        .get(isAuthenticated, fabricanteController.list)
        .post(isAuthenticated, fabricanteController.action);

    router.get('/lic/clasificaciones', clasificacionController.listAll);
    router.route('/lic/clasificacion')
        .get(isAuthenticated, clasificacionController.list)
        .post(isAuthenticated, clasificacionController.action);

    router.get('/lic/tiposInstalacion', tipoInstalacionController.listAll);
    router.route('/lic/tipoInstalacion')
        .get(isAuthenticated, tipoInstalacionController.list)
        .post(isAuthenticated, tipoInstalacionController.action);

    router.get('/lic/tiposLicenciamiento', tipoLicenciamientoController.listAll);
    router.route('/lic/tipoLicenciamiento')
        .get(isAuthenticated, tipoLicenciamientoController.list)
        .post(isAuthenticated, tipoLicenciamientoController.action);

    router.get('/lic/proveedor', proveedorController.listAll);
    router.get('/lic/cui', cuiController.listAll);

    router.route('/getNombreCui/:cui')
        .get(isAuthenticated, cuiBchController.getNombreCui);

    router.get('/lic/cuibch', cuiController.listAll);
    router.get('/lic/moneda', monedaController.listAll);
    router.get('/lic/tipo', tipoController.listAll);
    router.get('/lic/producto', productoController.listAll);

    router.route('/lic/grid_inventario')
        .get(isAuthenticated, productoController.list)
        .post(isAuthenticated, productoController.action);

    router.route('/lic/getFabricante/:idProducto')
        .get(isAuthenticated, productoController.getFabricante);

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

    router.route('/lic/exportplanilla')
        .get(isAuthenticated, planillaController.excel);

    router.route('/lic/traduccion')
        .get(isAuthenticated, traduccionController.list);

    router.route('/lic/instalacion')
        .get(isAuthenticated, instalacionController.list)
        .post(isAuthenticated, instalacionController.action);

    router.route('/lic/ajuste')
        .get(isAuthenticated, ajusteController.list)
        .post(isAuthenticated, ajusteController.action);

    router.route('/lic/compratramite')
        .get(isAuthenticated, compraTramiteController.list)
        .post(isAuthenticated, compraTramiteController.action);

    router.route('/lic/detallecompratramite/:pId')
        .get(isAuthenticated, detalleCompraTramiteController.listChilds)
        .post(isAuthenticated, detalleCompraTramiteController.action);

    router.route('/lic/recepcion')
        .get(isAuthenticated, recepcionController.list)
        .post(isAuthenticated, recepcionController.action);

    router.route('/lic/detallerecepcion/:pId')
        .get(isAuthenticated, detalleRecepcionController.listChilds)
        .post(isAuthenticated, detalleRecepcionController.action);

    return router;
};