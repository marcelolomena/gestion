var models = require('../models');
// Create endpoint /iniciativaprograma/:id for GET
exports.getIniciativaPrograma = function (req, res) {
    // Use the IniciativaPrograma model to find a specific id programa
    models.IniciativaPrograma.find({ where: { 'idiniciativa': req.params.id } }).then(function (iniciativaprograma) {
        res.json(iniciativaprograma);
    }).error(function (err) {
        res.send(err);
    });
};
