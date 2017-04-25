var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var segmentoController = require('../controllers/sic/segmentoproveedor');
var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");

module.exports = function(passport) {
    router.get('/segmentoproveedor', isAuthenticated, function(req, res) {
        //res.render('sic/segmentoproveedor', { user: req.user, data: req.session.passport.sidebar });
        models.pagina.belongsTo(models.contenido, { foreignKey: 'idtipo' });
        return models.pagina.findOne({
            where: { nombre: 'segmentoproveedor' },
            include: [{
                model: models.contenido
            }
            ]
        }).then(function (pagina) {

            return res.render('home2', {
                user: req.user,
                data: req.session.passport.sidebar,
                page: 'segmentoproveedor',
                title: '',
                type: pagina.contenido.nombre
            });
        }).catch(function (err) {
            logger.error(err);
        });
        
    });

    router.route('/sic/segmentoproveedor/list')
        .get(isAuthenticated, segmentoController.list);

    router.route('/sic/segmentoproveedor/action')
        .post(isAuthenticated, segmentoController.action);

    router.route('/sic/segmentoproveedor/excel')
        .get(isAuthenticated, segmentoController.getExcel);

    return router;
}