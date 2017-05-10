var cargadteController = require('../controllers/cargadte');
var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");

module.exports = function (passport) {
/*
    router.get('/cargadte', isAuthenticated, function (req, res) {
        models.pagina.belongsTo(models.contenido, { foreignKey: 'idtipo' });
        return models.pagina.findOne({
            where: { nombre: 'cargadte' },
            include: [{
                model: models.contenido
            }
            ]
        }).then(function (pagina) {

            return res.render('home', {
                user: req.user,
                data: req.session.passport.sidebar,
                page: 'cargadte',
                title: 'Carga DTE',
                type: pagina.contenido.nombre,
                idtype: pagina.contenido.id
            });
        }).catch(function (err) {
            logger.error(err);
        });        
    });
*/
    router.route('/cargadte/list')
        .get(isAuthenticated, cargadteController.list);

    router.route('/cargadte/guardar')
        .post(isAuthenticated, cargadteController.guardar);

    router.route('/cargadte/archivo')
        .post(isAuthenticated, cargadteController.archivo);

    router.route('/cargadte/detalle/:id')
        .get(isAuthenticated, cargadteController.detalle);

    router.route('/cargadte/items/:id')
        .get(isAuthenticated, cargadteController.items);

    router.route('/cargadte/download/:id')
        .get(isAuthenticated, cargadteController.excel);


    return router;

}