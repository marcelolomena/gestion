var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var solicitudcotizacionController = require('../controllers/sic/solicitudcotizacion');
var documentosController = require('../controllers/sic/documentos');
var serviciosController = require('../controllers/sic/servicios');
var parametrosController = require('../controllers/sic/parametros');
var clausulasController = require('../controllers/sic/clausulas');
var catalogoclausulasController = require('../controllers/sic/catalogoclausulas');
var tocController = require('../controllers/sic/toc');
//var proveedoresController = require('../controllers/sic/proveedores');
var preguntasController = require('../controllers/sic/preguntas');
var responsablesController = require('../controllers/sic/responsables');
var calendarioController = require('../controllers/sic/calendario');


module.exports = function (passport) {
    router.get('/sic/solicitudcotizacion', isAuthenticated, function (req, res) {
        res.render('sic/solicitudcotizacion', { user: req.user, data: req.session.passport.sidebar });
    });

    router.get('/sic/preguntaproveedor', isAuthenticated, function (req, res) {
        res.render('sic/preguntaproveedor', { user: req.user, data: req.session.passport.sidebar });
    });

    router.route('/sic/grid_solicitudcotizacion')
        .post(isAuthenticated, solicitudcotizacionController.action)
        .get(isAuthenticated, solicitudcotizacionController.list);

    router.route('/sic/documentos/:id')
        .get(isAuthenticated, documentosController.list);

    //router.route('/sic/proveedores/:id')
    //    .get(isAuthenticated, proveedoresController.list);

    router.route('/sic/proveedorespre/:id')
        .get(isAuthenticated, preguntasController.proveedorespre);

    router.route('/sic/preguntas/:id')
        .get(isAuthenticated, preguntasController.list);

    router.route('/sic/servicios/:id')
        .get(isAuthenticated, serviciosController.list);

    router.route('/sic/responsables/:id')
        .get(isAuthenticated, responsablesController.list);

    router.route('/sic/pre/falsa')
        .post(isAuthenticated, preguntasController.action);

    router.route('/sic/documentos/action')
        .post(isAuthenticated, documentosController.action);

    router.route('/sic/documentos/upload')
        .post(isAuthenticated, documentosController.upload);

    router.route('/sic/preguntas/upload')
        .post(isAuthenticated, preguntasController.archivo);

    router.get('/sic/getsession', function (req, res) {
        //console.dir(req.session.passport.sidebar[0])
        if (req.session.passport.sidebar[0].rol)
            res.json(req.session.passport.sidebar[0].rol);//JSON
        else
            res.send("no session value stored in DB ");
    });

    router.route('/sic/parametros/:val')
        .get(isAuthenticated, parametrosController.listall);

    router.route('/sic/parametros2/:val')
        .get(isAuthenticated, parametrosController.listall2);

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

    router.route('/sic/responsables/action')
        .post(isAuthenticated, responsablesController.action);

    router.get('/sic/catalogoclausulas', isAuthenticated, function (req, res) {
        res.render('sic/catalogoclausulas', { user: req.user, data: req.session.passport.sidebar });
    });

    router.route('/sic/usuarios_por_rolid/:id')
        .get(isAuthenticated, responsablesController.getUsersByRolId);

    router.route('/sic/getroles')
        .get(isAuthenticated, responsablesController.getRoles);

    router.route('/sic/getresponsablessolicitud/:id')
        .get(isAuthenticated, preguntasController.getresponsablessolicitud);

    router.route('/sic/grid_catalogoclausulas')
        .post(isAuthenticated, catalogoclausulasController.action)
        .get(isAuthenticated, catalogoclausulasController.list);

    router.route('/sic/catalogoclausulas2/:id/list')
        .get(isAuthenticated, catalogoclausulasController.list2);

    router.route('/sic/catalogoclausulas2/action')
        .post(isAuthenticated, catalogoclausulasController.action2);

    router.route('/sic/catalogoclausulas3/:id/list')
        .get(isAuthenticated, catalogoclausulasController.list3);

    router.route('/sic/catalogoclausulas3/action')
        .post(isAuthenticated, catalogoclausulasController.action3);

    router.route('/sic/proveedoressugeridos/action')
        .post(isAuthenticated, serviciosController.proveedoressugeridosaction);

    router.route('/sic/clases')
        .get(isAuthenticated, clausulasController.clases);

    router.route('/sic/plantillas/:id')
        .get(isAuthenticated, clausulasController.plantillas);

    router.route('/sic/texto/:id/:gid')
        .get(isAuthenticated, clausulasController.texto);

    router.route('/sic/proveedoressugeridostriada/:id')
        .get(isAuthenticated, serviciosController.proveedoressugeridostriada);

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

    router.route('/sic/documentoword/:id/:gid')
        .get(isAuthenticated, clausulasController.download);

    router.route('/sic/downloadclausulas/:id')
        .get(isAuthenticated, catalogoclausulasController.download);

    router.route('/sic/notas/:id')
        .get(isAuthenticated, serviciosController.getnotasdefactor);

    router.route('/sic/actualizacolorfactor/:id')
        .get(isAuthenticated, serviciosController.actualizacolorfactor);

    router.route('/sic/grupoclausula')
        .get(isAuthenticated, catalogoclausulasController.getgrupoclausula);

    router.route('/sic/tipoclausula')
        .get(isAuthenticated, catalogoclausulasController.gettipoclausula);

    router.route('/sic/default/:id/:gid/:tid')
        .get(isAuthenticated, clausulasController.default);

    router.get('/sic/toc', isAuthenticated, function (req, res) {
        res.render('sic/toc', { user: req.user, data: req.session.passport.sidebar });
    });

    router.route('/sic/grid_toctipo')
        .post(isAuthenticated, tocController.action)
        .get(isAuthenticated, tocController.list);

    router.route('/sic/tocclases/:id/list')
        .get(isAuthenticated, tocController.list2);

    router.route('/sic/tocclases/action')
        .post(isAuthenticated, tocController.action2);

    //router.route('/sic/preguntaproveedor/action')
    //    .post(isAuthenticated, proveedoresController.action);

    router.route('/sic/clasestoc/:id')
        .get(isAuthenticated, tocController.getclasestoc);

    router.route('/sic/tocclausulas/:idtipoclausula/list/:idclase')
        .get(isAuthenticated, tocController.list3);

    router.route('/sic/tocclausulas/action')
        .post(isAuthenticated, tocController.action3);

    router.route('/sic/clausulastoc/:id')
        .get(isAuthenticated, tocController.getclausulastoc);

    router.route('/sic/tipos')
        .get(isAuthenticated, solicitudcotizacionController.tipoclausula);

    router.route('/sic/asignar')
        .post(isAuthenticated, preguntasController.asignar);

    router.route('/sic/preguntasresponsable/:id')
        .get(isAuthenticated, preguntasController.listresponsables);

    router.route('/sic/responder')
        .post(isAuthenticated, preguntasController.responder);

    router.route('/sic/descargarespuestas/:id')
        .get(isAuthenticated, preguntasController.descargarespuestas);

    router.get('/sic/inboxpreguntas', isAuthenticated, function (req, res) {
        res.render('sic/inboxpreguntas', { user: req.user, data: req.session.passport.sidebar });
    });

    router.route('/sic/inboxpreguntaslist')
        .post(isAuthenticated, preguntasController.listinbox);

    router.route('/sic/inboxpreguntasaction')
        .post(isAuthenticated, preguntasController.actioninbox);

    router.route('/sic/calendario/:id')
        .get(isAuthenticated, calendarioController.list);

    router.route('/sic/calendario/action')
        .post(isAuthenticated, calendarioController.action);

    router.route('/sic/gettiporesponsable')
        .get(isAuthenticated, calendarioController.gettiporesponsable);


    return router;
}