var plantillaController = require('../controllers/plantilla');
var detalleplantillaController = require('../controllers/detalleplantilla');
var plantillacuiController = require('../controllers/plantillacui');
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");

module.exports = function (passport) {
/*
    router.get('/plantilla', isAuthenticated, function (req, res) {
        return models.pagina.findOne({
            where: { nombre: 'plantilla' },
            include: [{
                model: models.contenido
            }
            ]
        }).then(function (pagina) {

            return res.render('home', {
                user: req.user,
                data: req.session.passport.sidebar,
                page: 'plantilla',
                title: 'Plantilla Presupuestaria',
                type: pagina.contenido.nombre,
                idtype: pagina.contenido.id
            });
        }).catch(function (err) {
            logger.error(err);
        });         
    });
*/
    router.route('/plantilla/list')
        .get(isAuthenticated, plantillaController.list);

    router.route('/plantilla/action')
        .post(isAuthenticated, plantillaController.action);

    router.route('/plantilla/excel')
        .get(isAuthenticated, plantillaController.getExcel);

    router.route('/detalleplantilla/:id')
        .get(isAuthenticated, detalleplantillaController.list);

    router.route('/cuiservicios/:id')
        .get(isAuthenticated, plantillacuiController.getCuiServicios);

    router.route('/cuiproveedores/:id/:idservicio')
        .get(isAuthenticated, plantillacuiController.getCuiProveedores);

    return router;

}