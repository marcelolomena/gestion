// routes/users.js
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var prefacturaController = require('../controllers/prefactura');
var prefacturasController = require('../controllers/prefacturas');
var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");

module.exports = function (passport) {

    router.route('/factura/prefactura/:id')
        .get(isAuthenticated, prefacturaController.test);

    router.get('/solicitud', isAuthenticated, function (req, res) {

        return models.pagina.findOne({
            where: { nombre: 'solicitud' },
            include: [{
                model: models.contenido
            }
            ]
        }).then(function (pagina) {

            return res.render('home', {
                user: req.user,
                data: req.session.passport.sidebar,
                page: 'solicitud',
                title: 'GENERAR SOLICITUDES',
                type: pagina.contenido.nombre,
                idtype: pagina.contenido.id
            });
        }).catch(function (err) {
            logger.error(err);
        });          
    });

    router.route('/solicitud/lista')
        .post(isAuthenticated, prefacturaController.lista);

    router.route('/solicitud/generar')
        .get(isAuthenticated, prefacturaController.generar);

    router.route('/solicitud/anular/:id')
        .get(isAuthenticated, prefacturaController.anular);

    router.get('/prefactura', isAuthenticated, function (req, res) {
        return models.pagina.findOne({
            where: { nombre: 'prefactura' },
            include: [{
                model: models.contenido
            }
            ]
        }).then(function (pagina) {

            return res.render('home', {
                user: req.user,
                data: req.session.passport.sidebar,
                page: 'prefactura',
                title: 'SOLICITUDES DE APROBACIÓN',
                type: pagina.contenido.nombre,
                idtype: pagina.contenido.id
            });
        }).catch(function (err) {
            logger.error(err);
        });          
        
    });

    router.get('/prefacturas', isAuthenticated, function (req, res) {
        return models.pagina.findOne({
            where: { nombre: 'prefacturas' },
            include: [{
                model: models.contenido
            }
            ]
        }).then(function (pagina) {

            return res.render('home', {
                user: req.user,
                data: req.session.passport.sidebar,
                page: 'prefacturas',
                title: 'PREFACTURAS',
                type: pagina.contenido.nombre,
                idtype: pagina.contenido.id
            });
        }).catch(function (err) {
            logger.error(err);
        });          
        
    });

    router.route('/prefacturas/anular/:id')
        .get(isAuthenticated, prefacturasController.anular);

    router.route('/prefacturas/list')
        .post(isAuthenticated, prefacturasController.list);

    router.get('/pert', isAuthenticated, function (req, res) {
        return models.pagina.findOne({
            where: { nombre: 'pert' },
            include: [{
                model: models.contenido
            }
            ]
        }).then(function (pagina) {

            return res.render('home', {
                user: req.user,
                data: req.session.passport.sidebar,
                page: 'pert',
                title: 'Ingreso de Facturas',
                type: pagina.contenido.nombre,
                idtype: pagina.contenido.id
            });
        }).catch(function (err) {
            logger.error(err);
        });          
    });

    router.route('/solicitudesporfactura/:id')
        .post(isAuthenticated, prefacturasController.solicitudesporfactura);

    router.route('/generarprefacturas')
        .get(isAuthenticated, prefacturasController.generar);

    router.route('/generarprefacturasproy')
        .get(isAuthenticated, prefacturasController.generarproy);

    router.route('/solicitudesaprobadas')
        .post(isAuthenticated, prefacturasController.solicitudesaprobadas);

    router.route('/solicitudesaprobadasproy')
        .post(isAuthenticated, prefacturasController.solicitudesaprobadasproy);

    router.get('/genprefacturas', isAuthenticated, function (req, res) {
        return models.pagina.findOne({
            where: { nombre: 'genprefacturas' },
            include: [{
                model: models.contenido
            }
            ]
        }).then(function (pagina) {

            return res.render('home', {
                user: req.user,
                data: req.session.passport.sidebar,
                page: 'genprefacturas',
                title: 'GENERAR PREFACTURAS',
                type: pagina.contenido.nombre,
                idtype: pagina.contenido.id
            });
        }).catch(function (err) {
            logger.error(err);
        });          
        
    });

    router.get('/genprefacturasproy', isAuthenticated, function (req, res) {
        return models.pagina.findOne({
            where: { nombre: 'genprefacturasproy' },
            include: [{
                model: models.contenido
            }
            ]
        }).then(function (pagina) {

            return res.render('home', {
                user: req.user,
                data: req.session.passport.sidebar,
                page: 'genprefacturasproy',
                title: 'GENERAR PREFACTURAS PROYECTOS',
                type: pagina.contenido.nombre,
                idtype: pagina.contenido.id
            });
        }).catch(function (err) {
            logger.error(err);
        });         
    });

    router.route('/desgloseporsolicitud/:id')
        .post(isAuthenticated, prefacturasController.desgloseporsolicitud);

    router.route('/desglosecontable/action')
        .post(isAuthenticated, prefacturasController.actiondesglose);

    router.route('/porcentajedesglose/:parentRowKey')
        .get(isAuthenticated, prefacturasController.porcentajedesglose);

    router.route('/allcuis')
        .get(isAuthenticated, prefacturasController.getallcuis);

    router.get('/solicitudProyectos', isAuthenticated, function (req, res) {
        return models.pagina.findOne({
            where: { nombre: 'solicitudProyectos' },
            include: [{
                model: models.contenido
            }
            ]
        }).then(function (pagina) {

            return res.render('home', {
                user: req.user,
                data: req.session.passport.sidebar,
                page: 'solicitudProyectos',
                title: 'GENERAR SOLICITUDES DE PROYECTOS',
                type: pagina.contenido.nombre,
                idtype: pagina.contenido.id
            });
        }).catch(function (err) {
            logger.error(err);
        });         
        
    });

    router.route('/solicitudProyectos/lista')
        .post(isAuthenticated, prefacturaController.listaProyectos);

    router.route('/solicitud/generarProyectos')
        .get(isAuthenticated, prefacturaController.generarProyectos);

    return router;

}