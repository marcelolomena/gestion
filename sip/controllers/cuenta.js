var models = require('../models');

exports.getCuentas = function (req, res) {

    models.CuentasContables.findAll({ where: { 'borrado': 1 }, order: 'nombrecuenta' }).then(function (programa) {
        res.json(programa);
    }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
    });

};
