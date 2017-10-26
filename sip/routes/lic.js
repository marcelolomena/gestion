<<<<<<< HEAD
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
var matrizevaluacionController = require('../controllers/sic/matrizevaluacion')
var adjudicacionController = require('../controllers/sic/adjudicacion')
var solicitudcontratoController = require('../controllers/sic/solicitudcontrato')
var triadaController = require('../controllers/sic/triada');
//var triada2Controller = require('../controllers/sic/triada2');

//var plantillaController = require('../controllers/plantilla');
var detalleplantillaController = require('../controllers/sic/detalleplantilla2');
var plantillacuiController = require('../controllers/sic/plantillacui2');


var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");

module.exports = function (passport) {
    /*    
        router.get('/solicitudcotizacion', isAuthenticated, function (req, res) {
            models.pagina.belongsTo(models.contenido, { foreignKey: 'idtipo' });
            return models.pagina.findOne({
                where: { nombre: 'solicitudcotizacion' },
                include: [{
                    model: models.contenido
                }
                ]
            }).then(function (pagina) {
    
                return res.render('home2', {
                    user: req.user,
                    data: req.session.passport.sidebar,
                    page: 'solicitudcotizacion',
                    title: '',
                    type: pagina.contenido.nombre
                });
            }).catch(function (err) {
                logger.error(err);
            });
            
        });
    
        router.get('/solicitudcontrato', isAuthenticated, function (req, res) {
              models.pagina.belongsTo(models.contenido, { foreignKey: 'idtipo' });
            return models.pagina.findOne({
                where: { nombre: 'solicitudcontrato' },
                include: [{
                    model: models.contenido
                }
                ]
            }).then(function (pagina) {
    
                return res.render('home2', {
                    user: req.user,
                    data: req.session.passport.sidebar,
                    page: 'solicitudcontrato',
                    title: '',
                    type: pagina.contenido.nombre
                });
            }).catch(function (err) {
                logger.error(err);
            });
            
        });
    */
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

    //router.route('/sic/asignarpreguntas/:id')
    //    .get(isAuthenticated, preguntasController.listasignar);

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
    /*
        router.get('/catalogoclausulas', isAuthenticated, function (req, res) {
            models.pagina.belongsTo(models.contenido, { foreignKey: 'idtipo' });
            return models.pagina.findOne({
                where: { nombre: 'catalogoclausulas' },
                include: [{
                    model: models.contenido
                }
                ]
            }).then(function (pagina) {
    
                return res.render('home2', {
                    user: req.user,
                    data: req.session.passport.sidebar,
                    page: 'catalogoclausulas',
                    title: '',
                    type: pagina.contenido.nombre
                });
            }).catch(function (err) {
                logger.error(err);
            });        
        });
    
        router.get('/claseevaluaciontecnica', isAuthenticated, function (req, res) {
            models.pagina.belongsTo(models.contenido, { foreignKey: 'idtipo' });
            return models.pagina.findOne({
                where: { nombre: 'claseevaluaciontecnica' },
                include: [{
                    model: models.contenido
                }
                ]
            }).then(function (pagina) {
    
                return res.render('home2', {
                    user: req.user,
                    data: req.session.passport.sidebar,
                    page: 'claseevaluaciontecnica',
                    title: '',
                    type: pagina.contenido.nombre
                });
            }).catch(function (err) {
                logger.error(err);
            });        
            
        });
    */
    router.route('/sic/usuarios_por_rolid/:id')
        .get(isAuthenticated, responsablesController.getUsersByRolId);

    router.route('/sic/getroles')
        .get(isAuthenticated, responsablesController.getRoles);

    router.route('/sic/tecnicosresponsables/:idsolicitud')
        .get(isAuthenticated, responsablesController.tecnicosresponsables);

    //router.route('/sic/getresponsablessolicitud/:id')
    //    .get(isAuthenticated, preguntasController.getresponsablessolicitud);

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
    /*
        router.get('/toc', isAuthenticated, function (req, res) {
            models.pagina.belongsTo(models.contenido, { foreignKey: 'idtipo' });
            return models.pagina.findOne({
                where: { nombre: 'toc' },
                include: [{
                    model: models.contenido
                }
                ]
            }).then(function (pagina) {
    
                return res.render('home2', {
                    user: req.user,
                    data: req.session.passport.sidebar,
                    page: 'toc',
                    title: '',
                    type: pagina.contenido.nombre
                });
            }).catch(function (err) {
                logger.error(err);
            });
            
        });
    */
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

    //router.route('/sic/asignar')
    //    .post(isAuthenticated, preguntasController.asignar);

    //router.route('/sic/preguntasresponsable/:id')
    //    .get(isAuthenticated, preguntasController.listresponsables);

    //router.route('/sic/preguntasresponsablenew/:id')
    //    .get(isAuthenticated, preguntasController.listresponsablesnew);

    //router.route('/sic/responder')
    //    .post(isAuthenticated, preguntasController.responder);

    router.route('/sic/descargarespuestas/:id')
        .get(isAuthenticated, preguntasController.descargarespuestas);
    /*
        router.get('/sic/inboxpreguntas', isAuthenticated, function (req, res) {
            return res.render('sic/inboxpreguntas', { user: req.user, data: req.session.passport.sidebar });
        });
    */
    //router.route('/sic/inboxpreguntaslist')
    //    .post(isAuthenticated, preguntasController.listinbox);

    //router.route('/sic/inboxpreguntasaction')
    //    .post(isAuthenticated, preguntasController.actioninbox);

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

    /*
        router.get('/tipodocumento', isAuthenticated, function (req, res) {
            models.pagina.belongsTo(models.contenido, { foreignKey: 'idtipo' });
            return models.pagina.findOne({
                where: { nombre: 'tipodocumento' },
                include: [{
                    model: models.contenido
                }
                ]
            }).then(function (pagina) {
    
                return res.render('home2', {
                    user: req.user,
                    data: req.session.passport.sidebar,
                    page: 'tipodocumento',
                    title: '',
                    type: pagina.contenido.nombre
                });
            }).catch(function (err) {
                logger.error(err);
            });
            
        });
    */
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
    /*
        router.get('/rolessic', isAuthenticated, function (req, res) {
            models.pagina.belongsTo(models.contenido, { foreignKey: 'idtipo' });
            return models.pagina.findOne({
                where: { nombre: 'rolessic' },
                include: [{
                    model: models.contenido
                }
                ]
            }).then(function (pagina) {
    
                return res.render('home2', {
                    user: req.user,
                    data: req.session.passport.sidebar,
                    page: 'rolessic',
                    title: '',
                    type: pagina.contenido.nombre
                });
            }).catch(function (err) {
                logger.error(err);
            });
          });
    */
    router.route('/sic/roles/list')
        .post(isAuthenticated, rolessicController.list);

    router.route('/sic/roles/list2/:id')
        .post(isAuthenticated, rolessicController.list2);

    router.route('/sic/roles/action')
        .post(isAuthenticated, rolessicController.action);

    router.route('/sic/getrolessic')
        .get(isAuthenticated, rolessicController.getRoles);
    /*
        router.get('/permisossic', isAuthenticated, function (req, res) {
            models.pagina.belongsTo(models.contenido, { foreignKey: 'idtipo' });
            return models.pagina.findOne({
                where: { nombre: 'permisossic' },
                include: [{
                    model: models.contenido
                }
                ]
            }).then(function (pagina) {
    
                return res.render('home2', {
                    user: req.user,
                    data: req.session.passport.sidebar,
                    page: 'permisossic',
                    title: '',
                    type: pagina.contenido.nombre
                });
            }).catch(function (err) {
                logger.error(err);
            });
            
        });
    */
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

    router.route('/sic/flujocotizacion/action')
        .post(isAuthenticated, cotizacionservicioController.actionflujo);

    router.route('/sic/notaevaluaciontecnica/:id/list')
        .get(isAuthenticated, cotizacionservicioController.listnota)

    router.route('/sic/notaevaluaciontecnica/action')
        .post(isAuthenticated, cotizacionservicioController.actionnota);

    router.route('/sic/nivelclase/:id')
        .get(isAuthenticated, cotizacionservicioController.nivelclase);

    router.route('/sic/matriznivel1/:id/list')
        .get(isAuthenticated, matrizevaluacionController.matriznivel1)

    router.route('/sic/matriznivel1/:id/cols')
        .get(isAuthenticated, matrizevaluacionController.columnas)

    router.route('/sic/matriznivel2/:id/list')
        .get(isAuthenticated, matrizevaluacionController.matriznivel2)

    router.route('/sic/matrizeco/:id/cols')
        .get(isAuthenticated, matrizevaluacionController.columnaseco)

    router.route('/sic/matrizeco/:id/list')
        .get(isAuthenticated, matrizevaluacionController.matrizeco)

    router.route('/sic/matriztotal/:id/list')
        .get(isAuthenticated, matrizevaluacionController.matriztotal)

    router.route('/sic/matriztotaleco/:id/list')
        .get(isAuthenticated, matrizevaluacionController.matriztotaleco)

    router.route('/sic/matriztotalajustada/:id/list')
        .get(isAuthenticated, matrizevaluacionController.matriztotalajustada)

    router.route('/sic/criterios1/:id')
        .get(isAuthenticated, cotizacionservicioController.criterios1)

    router.route('/sic/notaevaluaciontecnica2/:id/list')
        .get(isAuthenticated, cotizacionservicioController.listnota2)

    router.route('/sic/notaevaluaciontecnica2/action')
        .post(isAuthenticated, cotizacionservicioController.actionnota2)

    router.route('/sic/criterios2/:id')
        .get(isAuthenticated, cotizacionservicioController.criterios2)

    router.route('/sic/listaaprobaciondocumento/:id/list')
        .get(isAuthenticated, documentosController.listaaprobaciondoc)

    router.route('/sic/actionaprobaciondoc/:id/:idpadre')
        .post(isAuthenticated, documentosController.actionaprobaciondoc);

    router.route('/sic/adjudicacion/:id')
        .get(isAuthenticated, adjudicacionController.list)

    router.route('/sic/adjudicacion/:id/cols')
        .get(isAuthenticated, adjudicacionController.columnas)

    router.route('/sic/adjudicados/:id/list')
        .get(isAuthenticated, adjudicacionController.listadjudicados)

    router.route('/sic/adjudicados/action')
        .post(isAuthenticated, adjudicacionController.action)

    router.route('/sic/solicitudcontrato/:id')
        .get(isAuthenticated, solicitudcontratoController.list)

    router.route('/sic/solicitudcontrato/action')
        .post(isAuthenticated, solicitudcontratoController.action)

    router.route('/sic/tocsolcon/:id/list')
        .get(isAuthenticated, clausulasController.listsolcon)

    router.route('/sic/defaulttoc/:id')
        .get(isAuthenticated, clausulasController.defaulttoc);

    router.route('/sic/documentowordsolcon/:id')
        .get(isAuthenticated, clausulasController.downloadsolcon);

    router.route('/sic/clausulassolcon/action')
        .post(isAuthenticated, clausulasController.actionsolcon);

    router.route('/sic/textosolcon/:id')
        .get(isAuthenticated, clausulasController.textosolcon);

    router.route('/sic/notaevaluaciontecnica3/:id/list')
        .get(isAuthenticated, cotizacionservicioController.listnota3)

    router.route('/sic/notaevaluaciontecnica3/action')
        .post(isAuthenticated, cotizacionservicioController.actionnota3)

    router.route('/sic/criterios3/:id')
        .get(isAuthenticated, cotizacionservicioController.criterios3)

    router.route('/sic/proveedoressugeridosserviciodesdenota2/:id')
        .get(isAuthenticated, cotizacionservicioController.proveedoressugeridosserviciodesdenota2);

    router.route('/sic/guardarcontrato/:id')
        .get(isAuthenticated, solicitudcontratoController.guardarcontrato)

    router.route('/sic/BorrarClausulas/:id/:numero')
        .get(isAuthenticated, clausulasController.BorrarClausulas)

    router.route('/sic/getjustificacion/:nombrefactor/:nota')
        .get(isAuthenticated, serviciosController.getjustificacion);

    //-----------------------------------------------------------------

    router.route('/sic/triada/:id')
        .get(isAuthenticated, triadaController.list);
    
    router.route('/sic/triada/action')
        .post(isAuthenticated, triadaController.action);

    router.route('/sic/detalleplantilla/:id')
        .get(isAuthenticated, detalleplantillaController.list);

    router.route('/sic/cuiservicios/:id')
        .get(isAuthenticated, plantillacuiController.getCuiServicios);

    router.route('/sic/cuiproveedores/:id/:idservicio')
        .get(isAuthenticated, plantillacuiController.getCuiProveedores);


    return router;
}
=======
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

    router.route('/lic/snow')
        .get(isAuthenticated, snowController.get)
        .post(isAuthenticated, snowController.upload);


    return router;
};
>>>>>>> licencias
