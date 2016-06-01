var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');

exports.getMonedas = function (req, res) {

    models.Moneda.findAll({ where: { 'borrado': 1 }, order: 'glosamoneda' }).then(function (moneda) {
        res.json(moneda);
    }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
    });

};