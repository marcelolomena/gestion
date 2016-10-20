var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");
exports.getMonedas = function (req, res) {

    models.moneda.findAll({ where: { 'borrado': 1 }, order: 'glosamoneda' }).then(function (moneda) {
        res.json(moneda);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error_code: 1 });
    });

};
