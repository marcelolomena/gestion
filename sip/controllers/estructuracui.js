var models = require('../models');

exports.getEstructuraCui = function (req, res) {

    models.EstructuraCui.findAll({ where: { 'borrado': 1 }, order: 'nombre' }).then(function (programa) {
        res.json(programa);
    }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
    });

};
