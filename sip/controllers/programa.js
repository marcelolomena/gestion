var models = require('../models');
var sequelize = require('../models/index').sequelize;
// Create endpoint /programa/:id for GET
exports.getPrograma = function (req, res) {
    // Use the Proveedor model to find a specific programa
    models.Programa.find({ where: { 'program_id': req.params.id } }).then(function (programa) {
        res.json(programa);
    }).error(function (err) {
        res.send(err);
    });
};

exports.getProgramas = function (req, res) {

    models.Programa.findAll({ attributes: ['program_id', 'program_name'], where: { $or: [{work_flow_status: 1},{work_flow_status: 3},{work_flow_status: 4}, {work_flow_status: 5}], 'is_active': 1 }, order: 'program_name' }).then(function (programa) {
        res.json(programa);
    }).catch(function (err) {
        console.log(err);
        res.json({ error_code: 1 });
    });

};

exports.getProgramasId = function (req, res) {

  var sql = "select * from art_program a join art_division_master b on a.devison=b.dId" +
    " where a.is_active=1 and b.idRRHH="+req.params.id+" order by a.program_name";

  sequelize.query(sql)
    .spread(function (rows) {
      res.json(rows);
    });

};

