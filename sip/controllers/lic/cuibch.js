'use strict';
var models = require('../../models');
var base = require('./lic-controller');


var entity = models.estructuracuibch;

function listAll(req, res) {
    base.listAll(req, res, entity, function (item) {
        return {
            id: item.id,
            cui: item.cui,
            unidad: item.unidad
        };
    });
}


function getNombreCui(req, res) {
    var cui = parseInt(req.params.cui);
    entity
        .findOne({ where: { cui: cui }, attributes: ['unidad'] })
        .then(function (result) {
            return res.json({ error: 0, glosa: '', nombre: result.unidad });
        })
        .catch(function (err) {
            return res.json({ error_code: 1 });
        });
}


// exports.getNombreCui = function (req, res) {
//     var sql = "SELECT unidad FROM lic.estructuracuibch WHERE estado = 'Activado' AND cui = " + req.params.id;
//     sequelize.query(sql)
//       .spread(function (rows) {
//         return res.json(rows);
//       });

//   };

module.exports = {
    listAll: listAll,
    getNombreCui: getNombreCui
};