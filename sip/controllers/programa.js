var models = require('../models');
// Create endpoint /programa/:id for GET
exports.getPrograma = function (req, res) {
    // Use the Proveedor model to find a specific programa
    models.Programa.find({ where: { 'program_id': req.params.id } }).then(function (programa) {
        res.json(programa);
    }).error(function (err) {
        res.send(err);
    });
};
