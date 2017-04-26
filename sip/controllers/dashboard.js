var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");
var path = require('path');
var fs = require('fs');

exports.presupuesto = function (req, res) {

    var idtipo = req.params.id;

    logger.debug("idtipo : " + idtipo)

    return models.dashboard.findAll({
        where: { idtipo: idtipo }
    }).then(function (dashboard) {
        return res.json(dashboard);
    }).catch(function (err) {
        logger.error(err);
    });

};