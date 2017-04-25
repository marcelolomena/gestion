var express = require('express')
var router = express.Router()
var isAuthenticated = require('../policies/isAuthenticated')
var valoresController = require('../controllers/sic/valores');
var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");

module.exports = function(passport) {
    router.get('/valores', isAuthenticated, function(req, res) {
        //res.render('sic/valores', { user: req.user, data: req.session.passport.sidebar });
        models.pagina.belongsTo(models.contenido, { foreignKey: 'idtipo' });
        return models.pagina.findOne({
            where: { nombre: 'valores' },
            include: [{
                model: models.contenido
            }
            ]
        }).then(function (pagina) {

            return res.render('home2', {
                user: req.user,
                data: req.session.passport.sidebar,
                page: 'valores',
                title: '',
                type: pagina.contenido.nombre
            });
        }).catch(function (err) {
            logger.error(err);
        });
        
    });

    router.route('/sic/valores/list')
        .post(isAuthenticated, valoresController.list);

    router.route('/sic/valores/action')
        .post(isAuthenticated, valoresController.action);

    router.route('/sic/valores/tipos')
        .get(isAuthenticated, valoresController.getTipos);

    return router;
}