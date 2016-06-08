var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');

exports.getCuentas = function (req, res) {

    models.cuentascontables.findAll({ where: { 'borrado': 1 }, order: 'nombrecuenta' }).then(function (programa) {
        res.json(programa);
    }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
    });

};
