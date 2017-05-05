var recuperacionController = require('../controllers/factorrecuperacion');
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");

module.exports = function (passport) {
/*
    router.get('/factorrecuperacion', isAuthenticated, function (req, res) {
        return models.pagina.findOne({
            where: { nombre: 'factorrecuperacion' },
            include: [{
                model: models.contenido
            }
            ]
        }).then(function (pagina) {

            return res.render('home', {
                user: req.user,
                data: req.session.passport.sidebar,
                page: 'factorrecuperacion',
                title: 'Factor de Recuperación',
                type: pagina.contenido.nombre,
                idtype: pagina.contenido.id
            });
        }).catch(function (err) {
            logger.error(err);
        });        
    });
*/
    router.route('/factorrecuperacion/list')
        .get(isAuthenticated, recuperacionController.list);

    router.route('/factorrecuperacion/action')
        .post(isAuthenticated, recuperacionController.action);

    router.route('/factorrecuperacion/excel')
        .get(isAuthenticated, recuperacionController.getExcel);

    return router;

}