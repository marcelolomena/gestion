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
var sapController = require('../controllers/lic/sap');
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
var recepcionadoController = require('../controllers/lic/recepcionado');

var recepcionController = require('../controllers/lic/recepcion');
var detalleRecepcionController = require('../controllers/lic/detalle-recepcion');

var snowController = require('../controllers/lic/snow');
var reservaSolicitudController = require('../controllers/lic/reserva-solicitud');
var addmController = require('../controllers/lic/addm');
var aprobacionController = require('../controllers/lic/reserva-aprobacion');

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

    router.route('/lic/existeSap/:sap')
        .get(isAuthenticated, sapController.existeSap);

    router.get('/lic/cuibch', cuiController.listAll);
    router.get('/lic/cuibchres', cuiController.listAllRes);
    router.get('/lic/moneda', monedaController.listAll);
    router.get('/lic/tipo', tipoController.listAll);
    router.get('/lic/producto', productoController.listAll);

    router.route('/lic/grid_inventario')
        .get(isAuthenticated, productoController.list)
        .post(isAuthenticated, productoController.action);

    router.route('/lic/getFabricante/:idProducto')
        .get(isAuthenticated, productoController.getFabricante);

    router.route('/lic/getProducto/:idFabricante')
        .get(isAuthenticated, productoController.getProducto);

    router.route('/lic/compra/:pId')
        .get(isAuthenticated, compraController.listChilds)
        .post(isAuthenticated, compraController.action);

    router.route('/lic/compra')
        .get(isAuthenticated, compraController.list);

    router.route('/lic/comprasentramite')
        .get(isAuthenticated, recepcionController.listCompras);

    router.route('/lic/detallecomprasentramite/:pId')
        .get(isAuthenticated, detalleRecepcionController.listDetalleCompras);

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

    router.route('/lic/recepcionado/:pId')
        .get(isAuthenticated, recepcionadoController.listRecepcionados);

    router.route('/lic/recepcion')
        .get(isAuthenticated, recepcionController.list)
        .post(isAuthenticated, recepcionController.action);

    router.route('/lic/detalleRecepcion/:pId')
        .get(isAuthenticated, detalleRecepcionController.listChilds)
        .post(isAuthenticated, detalleRecepcionController.action);

    router.route('/lic/recepcion/:pId')
        .get(isAuthenticated, detalleRecepcionController.listProductChilds);

    router.route('/lic/tramite/:pId')
        .get(isAuthenticated, productoController.listcompratramite);

    /*
    router.route('/lic/snow')
        .get(isAuthenticated, snowController.get)
        .post(isAuthenticated, snowController.upload);
    */
    router.route('/lic/snow/list')
        .get(isAuthenticated, snowController.list);

    router.route('/lic/addm/list')
        .get(isAuthenticated, addmController.list);


    router.route('/lic/traduccion')
        .get(isAuthenticated, traduccionController.list)
        .post(isAuthenticated, traduccionController.action);

    router.route('/lic/snow/:pId')
        .get(isAuthenticated, traduccionController.listChilds);

    router.route('/lic/addm/:pId')
        .get(isAuthenticated, traduccionController.listChilds);

    router.route('/lic/reserva')
        .get(isAuthenticated, reservaSolicitudController.list)
        .post(isAuthenticated, reservaSolicitudController.action);

    router.route('/lic/estado/:pId')
        .get(isAuthenticated, reservaSolicitudController.estado);

        router.route('/lic/usuariocui')
        .get(isAuthenticated, reservaSolicitudController.usuariocui);

    router.route('/lic/reserva-aprobacion')
         .get(isAuthenticated, aprobacionController.list);


    return router;
};