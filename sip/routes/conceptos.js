var conceptoController = require('../controllers/concepto');
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");

module.exports = function (passport) {

    router.get('/conceptos', isAuthenticated, function (req, res) {
        return models.pagina.findOne({
            where: { nombre: 'conceptos' },
            include: [{
                model: models.contenido
            }
            ]
        }).then(function (pagina) {

            return res.render('home', {
                user: req.user,
                data: req.session.passport.sidebar,
                page: 'conceptos',
                title: 'Conceptos Presupuestarios',
                type: pagina.contenido.nombre,
                idtype: pagina.contenido.id
            });
        }).catch(function (err) {
            logger.error(err);
        });         
        
    });

    router.route('/conceptos/list')
        .get(isAuthenticated, conceptoController.list);

    router.route('/conceptos/action')
        .post(isAuthenticated, conceptoController.action);

    router.route('/conceptos/excel')
        .get(isAuthenticated, conceptoController.getExcel);

    return router;

}