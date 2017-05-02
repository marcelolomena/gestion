var cuentasController = require('../controllers/cuentascontables');
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");

module.exports = function (passport) {

    router.get('/cuentascontables', isAuthenticated, function (req, res) {
        return models.pagina.findOne({
            where: { nombre: 'cuentascontables' },
            include: [{
                model: models.contenido
            }
            ]
        }).then(function (pagina) {

            return res.render('home', {
                user: req.user,
                data: req.session.passport.sidebar,
                page: 'cuentascontables',
                title: 'Cuentas Contables',
                type: pagina.contenido.nombre,
                idtype: pagina.contenido.id
            });
        }).catch(function (err) {
            logger.error(err);
        });
    });

    router.route('/cuentascontables/list')
        .get(isAuthenticated, cuentasController.list);

    router.route('/cuentascontables/action')
        .post(isAuthenticated, cuentasController.action);

    router.route('/cuentascontables/excel')
        .get(isAuthenticated, cuentasController.getExcel);

    router.route('/cuentascontables/conceptospresupuestarios')
        .get(isAuthenticated, cuentasController.getConceptos);

    return router;

}