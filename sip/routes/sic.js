var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var solicitudcotizacionController = require('../controllers/sic/solicitudcotizacion');
var documentosController = require('../controllers/sic/documentos');
var serviciosController = require('../controllers/sic/servicios');
var parametrosController = require('../controllers/sic/parametros');
var clausulasController = require('../controllers/sic/clausulas');
var catalogoclausulasController = require('../controllers/sic/catalogoclausulas');

module.exports = function(passport) {
    router.get('/sic/solicitudcotizacion', isAuthenticated, function(req, res) {
        res.render('sic/solicitudcotizacion', { user: req.user, data: req.session.passport.sidebar });
    });

    router.route('/sic/grid_solicitudcotizacion')
        .post(isAuthenticated, solicitudcotizacionController.action)
        .get(isAuthenticated, solicitudcotizacionController.list);

    router.route('/sic/documentos/:id')
        .get(isAuthenticated, documentosController.list);

    router.route('/sic/servicios/:id')
        .get(isAuthenticated, serviciosController.list);

    router.route('/sic/documentos/action')
        .post(isAuthenticated, documentosController.action);

    router.route('/sic/documentos/upload')
        .post(isAuthenticated, documentosController.upload);

    router.get('/sic/getsession', function(req, res) {
        //console.dir(req.session.passport.sidebar[0])
        if (req.session.passport.sidebar[0].rol)
            res.json(req.session.passport.sidebar[0].rol);//JSON
        else
            res.send("no session value stored in DB ");
    });

    router.route('/sic/parametros/:val')
        .get(isAuthenticated, parametrosController.listall);

    router.route('/sic/servicios/:id/list')
        .get(isAuthenticated, serviciosController.listaservicios);

    router.route('/sic/servicios/:id/doctoasociado')
        .get(isAuthenticated, serviciosController.doctoasociado);

    router.route('/sic/clasecriticidadserv')
        .get(isAuthenticated, serviciosController.clasecriticidad);

    router.route('/sic/clausulas/:id')
        .get(isAuthenticated, clausulasController.list)
    router.route('/sic/clausulas/action')
        .post(isAuthenticated, clausulasController.action);

    router.route('/sic/segmentoproveedorserv')
        .get(isAuthenticated, serviciosController.segmentoproveedor);

    router.route('/sic/servicios/action')
        .post(isAuthenticated, serviciosController.action);

    router.get('/sic/catalogoclausulas', isAuthenticated, function(req, res) {
        res.render('sic/catalogoclausulas', { user: req.user, data: req.session.passport.sidebar });
    });

    router.route('/sic/grid_catalogoclausulas')
        .post(isAuthenticated, catalogoclausulasController.action)
        .get(isAuthenticated, catalogoclausulasController.list);

    router.route('/sic/catalogoclausulas2/:id/list')
        .get(isAuthenticated, catalogoclausulasController.list2);

    router.route('/sic/catalogoclausulas2/action')
        .post(isAuthenticated, catalogoclausulasController.action2);

    router.route('/sic/clases')
        .get(isAuthenticated, clausulasController.clases);

    router.route('/sic/plantillas/:id')
        .get(isAuthenticated, clausulasController.plantillas);

    router.route('/sic/texto/:id')
        .get(isAuthenticated, clausulasController.texto);

    router.route('/sic/desglosefactoresserv/:id/list')
        .get(isAuthenticated, serviciosController.desglosefactoreslist);

    router.route('/sic/proveedoressugeridoslist/:id/list')
        .get(isAuthenticated, serviciosController.proveedoressugeridoslist);

    router.route('/sic/getcalculado/:id')
        .get(isAuthenticated, serviciosController.getcalculado);

    router.route('/sic/desglosefactoresserv/action')
        .post(isAuthenticated, serviciosController.desgloseaction);

    router.route('/sic/actualizanotafactor/:id')
        .get(isAuthenticated, serviciosController.actualizanotafactor);

    router.route('/sic/getcalculadoconclase/:id')
        .get(isAuthenticated, serviciosController.getcalculadoconclase);

    router.get('/sic/pruebahtmlword', isAuthenticated, function(req, res) {
        res.render('sic/pruebahtmlword', { user: req.user, data: req.session.passport.sidebar });
    });
    return router;
}