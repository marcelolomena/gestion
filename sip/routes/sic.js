var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var solicitudcotizacionController = require('../controllers/sic/solicitudcotizacion');
var documentosController = require('../controllers/sic/documentos');
var serviciosController = require('../controllers/sic/servicios');
var parametrosController = require('../controllers/sic/parametros');
var clausulasController = require('../controllers/sic/clausulas');
var anexosController = require('../controllers/sic/anexos');
var catalogoclausulasController = require('../controllers/sic/catalogoclausulas');
var tocController = require('../controllers/sic/toc');
//var proveedoresController = require('../controllers/sic/proveedores');
var preguntasController = require('../controllers/sic/preguntas');
var responsablesController = require('../controllers/sic/responsables');
var calendarioController = require('../controllers/sic/calendario');
var tipodocumentoController = require('../controllers/sic/tipodocumento');
var preguntasrfpController = require('../controllers/sic/preguntasrfp');
var foroController = require('../controllers/sic/foro');
var criteriosController = require('../controllers/sic/criterios');
var claseevaluaciontecnicaController = require('../controllers/sic/claseevaluaciontecnica');
var bitacoraController = require('../controllers/sic/bitacora');
var estadosolicitudController = require('../controllers/sic/estadosolicitud');
var rolessicController = require('../controllers/sic/rolessic');
var permisosController = require('../controllers/sic/permisos')
var participantesproveedorController = require('../controllers/sic/participantesproveedor')
var cotizacionservicioController = require('../controllers/sic/cotizacionservicio')

module.exports = function (passport) {
    router.get('/sic/solicitudcotizacion', isAuthenticated, function (req, res) {
        return res.render('sic/solicitudcotizacion', { user: req.user, data: req.session.passport.sidebar });
    });

    router.get('/sic/solicitudcontrato', isAuthenticated, function (req, res) {
        return res.render('sic/solicitudcontrato', { user: req.user, data: req.session.passport.sidebar });
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

    router.route('/sic/criterios/:id')
        .get(isAuthenticated, criteriosController.list); //TODO cambiar a controller de criterios

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
            return res.json(req.session.passport.sidebar[0].rol);//JSON
        else
            return res.send("no session value stored in DB ");
    });

    router.route('/sic/parametros/:val')
        .get(isAuthenticated, parametrosController.listall);

    router.route('/sic/parametros2/:val')
        .get(isAuthenticated, parametrosController.listall2);

    router.route('/sic/servicios/:id/list')
        .get(isAuthenticated, serviciosController.listaservicios);

    router.route('/sic/clasesevaluacion')
        .get(isAuthenticated, claseevaluaciontecnicaController.clasesevaluacion);

    router.route('/sic/servicios/:id/doctoasociado')
        .get(isAuthenticated, serviciosController.doctoasociado);

    router.route('/sic/clasecriticidadserv')
        .get(isAuthenticated, serviciosController.clasecriticidad);

    router.route('/sic/clausulas/:id')
        .get(isAuthenticated, clausulasController.list)
    router.route('/sic/clausulas/action')
        .post(isAuthenticated, clausulasController.action);

    router.route('/sic/anexos/:id')
        .get(isAuthenticated, anexosController.list)
    router.route('/sic/anexos/action')
        .post(isAuthenticated, anexosController.action);

    router.route('/sic/servicios/action')
        .post(isAuthenticated, serviciosController.action);

    router.route('/sic/criterios/action')
        .post(isAuthenticated, criteriosController.action);

    router.route('/sic/responsables/action')
        .post(isAuthenticated, responsablesController.action);

    router.get('/sic/catalogoclausulas', isAuthenticated, function (req, res) {
        return res.render('sic/catalogoclausulas', { user: req.user, data: req.session.passport.sidebar });
    });

    router.get('/sic/claseevaluaciontecnica', isAuthenticated, function (req, res) {
        return res.render('sic/claseevaluaciontecnica', { user: req.user, data: req.session.passport.sidebar });
    });

    router.route('/sic/usuarios_por_rolid/:id')
        .get(isAuthenticated, responsablesController.getUsersByRolId);

    router.route('/sic/getroles')
        .get(isAuthenticated, responsablesController.getRoles);

    router.route('/sic/tecnicosresponsables/:idsolicitud')
        .get(isAuthenticated, responsablesController.tecnicosresponsables);

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

    router.route('/sic/grid_claseevaluaciontecnica')
        .post(isAuthenticated, claseevaluaciontecnicaController.action)
        .get(isAuthenticated, claseevaluaciontecnicaController.list);

    //router.route('/sic/proveedoressugeridos/action')
    //    .post(isAuthenticated, serviciosController.proveedoressugeridosaction);

    router.route('/sic/clases')
        .get(isAuthenticated, clausulasController.clases);

    router.route('/sic/plantillas/:id')
        .get(isAuthenticated, clausulasController.plantillas);

    router.route('/sic/plantillasanexos/:id')
        .get(isAuthenticated, anexosController.plantillas);

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

    //router.route('/sic/desglosefactoresserv/action')
    //    .post(isAuthenticated, serviciosController.desgloseaction);

    router.route('/sic/actualizanotafactor/:id')
        .get(isAuthenticated, serviciosController.actualizanotafactor);

    router.route('/sic/getcalculadoconclase/:id')
        .get(isAuthenticated, serviciosController.getcalculadoconclase);

    router.route('/sic/documentoword/:id/:gid')
        .get(isAuthenticated, clausulasController.download);

    router.route('/sic/documentowordanexo/:id/:gid')
        .get(isAuthenticated, anexosController.download);

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
        return res.render('sic/toc', { user: req.user, data: req.session.passport.sidebar });
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
        return res.render('sic/inboxpreguntas', { user: req.user, data: req.session.passport.sidebar });
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

    router.route('/sic/buscarsecuenciatoc/:idtipo')
        .get(isAuthenticated, tocController.buscarsecuenciatoc);

    router.route('/sic/buscarsecuenciatocplantilla/:idtipo/:idclase')
        .get(isAuthenticated, tocController.buscarsecuenciatocplantilla);

    router.route('/sic/getcolorservicios/:idsolicitud')
        .get(isAuthenticated, solicitudcotizacionController.getcolorservicios);

    router.get('/sic/tipodocumento', isAuthenticated, function (req, res) {
        res.render('sic/tipodocumento', { user: req.user, data: req.session.passport.sidebar });
    });

    router.route('/sic/grid_tipodocumento')
        .post(isAuthenticated, tipodocumentoController.action)
        .get(isAuthenticated, tipodocumentoController.list);

    router.route('/sic/tipodocumento/upload')
        .post(isAuthenticated, tipodocumentoController.upload);

    router.route('/sic/gettipodocumentos')
        .get(isAuthenticated, documentosController.gettipodocumentos);

    router.route('/sic/getplantillatipo/:idtipo')
        .get(isAuthenticated, documentosController.getplantillatipo);

    //router.route('/sic/getpreguntasrfp/:idsolicitud')
    //    .get(isAuthenticated, preguntasrfpController.getpreguntasrfp);

    router.route('/sic/preguntasrfp/:id')
        .post(isAuthenticated, preguntasrfpController.action)
        .get(isAuthenticated, preguntasrfpController.list);

    router.route('/sic/preguntasrfps/upload')
        .post(isAuthenticated, preguntasrfpController.upload);

    router.route('/sic/descargapreguntas/:id')
        .get(isAuthenticated, preguntasrfpController.descargapreguntas);

    router.route('/sic/catalogoclausulas/upload')
        .post(isAuthenticated, catalogoclausulasController.upload);

    router.route('/sic/foro/:id')
        .post(isAuthenticated, foroController.action)
        .get(isAuthenticated, foroController.list);

    router.route('/sic/actionrespuesta/:id/:idpadre')
        .post(isAuthenticated, foroController.actionrespuesta)

    router.route('/sic/listarespuestaforo/:id/list')
        .get(isAuthenticated, foroController.listarespuestaforo);

    router.route('/sic/docrespuesta/:id')
        .get(isAuthenticated, foroController.docrespuesta);

    router.route('/sic/forousuario/:idforo')
        .get(isAuthenticated, foroController.forousuario);

    router.route('/sic/respuestausuario/:idforo')
        .get(isAuthenticated, foroController.respuestausuario);

    router.route('/sic/clasesanexos')
        .get(isAuthenticated, anexosController.clases);

    router.route('/sic/tecnicosresponsablescui/:idcui')
        .get(isAuthenticated, solicitudcotizacionController.tecnicosresponsablescui);

    router.route('/sic/traerdatos/:id')
        .get(isAuthenticated, solicitudcotizacionController.traerdatos);

    router.route('/sic/bitacora/:id')
        .get(isAuthenticated, bitacoraController.list);

    router.route('/sic/proveedoressugeridosaction/:id/:idpadre')
        .post(isAuthenticated, serviciosController.proveedoressugeridosaction)

    router.route('/sic/desglosefactoraction/:id/:idpadre')
        .post(isAuthenticated, serviciosController.desglosefactoraction)

    router.route('/bitacora/combobox')
        .get(isAuthenticated, bitacoraController.combobox);

    router.route('/bitacora/comboboxaction')
        .get(isAuthenticated, bitacoraController.comboboxaction);

    router.route('/sic/estadosolicitud/action')
        .post(isAuthenticated, estadosolicitudController.action);

    router.route('/sic/estadosolicitud/:id')
        .get(isAuthenticated, estadosolicitudController.list);

    router.route('/sic/genrfc/:id')
        .get(isAuthenticated, calendarioController.list);

    router.route('/sic/documentowordfinal/:id/:gid')
        .get(isAuthenticated, estadosolicitudController.download);

    router.route('/sic/criteriosevaluacion/:id/list')
        .get(isAuthenticated, claseevaluaciontecnicaController.list2)

    router.route('/sic/criteriosevaluacion/action')
        .post(isAuthenticated, claseevaluaciontecnicaController.action2);

    router.route('/sic/porcentajecriterios/:parentRowKey')
        .get(isAuthenticated, claseevaluaciontecnicaController.porcentajecriterios);

    router.get('/sic/roles', isAuthenticated, function (req, res) {
        res.render('sic/rolessic', { user: req.user, data: req.session.passport.sidebar });
    });

    router.route('/sic/roles/list')
        .post(isAuthenticated, rolessicController.list);

    router.route('/sic/roles/list2/:id')
        .post(isAuthenticated, rolessicController.list2);

    router.route('/sic/roles/action')
        .post(isAuthenticated, rolessicController.action);

    router.route('/sic/getrolessic')
        .get(isAuthenticated, rolessicController.getRoles);

    router.get('/sic/permisos', isAuthenticated, function (req, res) {
        res.render('sic/permisossic', { user: req.user, data: req.session.passport.sidebar });
    });

    router.route('/sic/permisos/list')
        .post(isAuthenticated, permisosController.list);

    router.route('/sic/permisos/list2/:id')
        .post(isAuthenticated, permisosController.list2);

    router.route('/sic/permisos/list3/:rid/:mid')
        .post(isAuthenticated, permisosController.list3);

    router.route('/sic/permisos/action')
        .post(isAuthenticated, permisosController.action);

    router.route('/sic/permisos/action2')
        .post(isAuthenticated, permisosController.action2);

    router.route('/sic/getmenus')
        .get(isAuthenticated, permisosController.getMenus);

    router.route('/sic/getsubmenus')
        .get(isAuthenticated, permisosController.getSubMenus);

    router.route('/sic/documentousuario/:iddoc')
        .get(isAuthenticated, documentosController.documentousuario);

    router.route('/sic/criteriosevaluacion/:id/list2')
        .get(isAuthenticated, claseevaluaciontecnicaController.list3)

    router.route('/sic/criteriosevaluacion/action2')
        .post(isAuthenticated, claseevaluaciontecnicaController.action3);

    router.route('/sic/porcentajecriterios2/:parentRowKey')
        .get(isAuthenticated, claseevaluaciontecnicaController.porcentajecriterios2);

    router.route('/sic/criteriosevaluacion/:id/list3')
        .get(isAuthenticated, claseevaluaciontecnicaController.list4)

    router.route('/sic/criteriosevaluacion/action3')
        .post(isAuthenticated, claseevaluaciontecnicaController.action4);

    router.route('/sic/porcentajecriterios3/:parentRowKey')
        .get(isAuthenticated, claseevaluaciontecnicaController.porcentajecriterios3);

    router.route('/sic/criterio3/upload/:idcriterioevaluacion2')
        .post(isAuthenticated, claseevaluaciontecnicaController.upload);

    router.route('/sic/proveedoressugeridostotal/:id')
        .get(isAuthenticated, preguntasrfpController.proveedoressugeridostotal);

    router.route('/sic/respuestasrfp/:id')
        .post(isAuthenticated, preguntasrfpController.action2)
        .get(isAuthenticated, preguntasrfpController.list2);

    router.route('/sic/participantesproveedor/:id')
        .post(isAuthenticated, participantesproveedorController.action)
        .get(isAuthenticated, participantesproveedorController.list);

    router.route('/sic/cotizacionservicio/:id/list')
        .get(isAuthenticated, cotizacionservicioController.list)

    router.route('/sic/cotizacionservicio/action')
        .post(isAuthenticated, cotizacionservicioController.action);

    router.route('/sic/proveedoressugeridosservicio/:id')
        .get(isAuthenticated, cotizacionservicioController.proveedoressugeridosservicio);

    router.route('/sic/flujocotizacion/:id/list')
        .get(isAuthenticated, cotizacionservicioController.listflujo)

    router.route('/sic/cotizacionservicio/action')
        .post(isAuthenticated, cotizacionservicioController.actionflujo);

    return router;
}