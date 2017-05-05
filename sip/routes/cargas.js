var cargasController = require('../controllers/cargas');
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");

module.exports = function (passport) {
/*
    router.get('/cargas', isAuthenticated, function (req, res) {
        return models.pagina.findOne({
            where: { nombre: 'cargas' },
            include: [{
                model: models.contenido
            }
            ]
        }).then(function (pagina) {

            return res.render('home', {
                user: req.user,
                data: req.session.passport.sidebar,
                page: 'cargas',
                title: 'Cargas',
                type: pagina.contenido.nombre,
                idtype: pagina.contenido.id
            });
        }).catch(function (err) {
            logger.error(err);
        });         
    });
*/
    router.route('/cargas/list')
        .get(isAuthenticated, cargasController.list);

    router.route('/cargas/guardar')
        .post(isAuthenticated, cargasController.guardar);

    router.route('/cargas/archivo')
        .post(isAuthenticated, cargasController.archivo);

    router.route('/detallecarga/:id')
        .get(isAuthenticated, cargasController.detallecarga);

    return router;

}