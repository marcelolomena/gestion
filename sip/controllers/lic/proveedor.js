'use strict';
var models = require('../../models');
var logger = require('../../utils/logger');
var base = require('./lic-controller');


var entity = models.proveedor;

function listAll(req, res) {
    entity.findAll()
        .then(function (rows) {
            return res.json(_.map(rows, function (item) {
                return {
                    id: item.id,
                    nombre: item.razonsocial
                };
            }));
        })
        .catch(function (err) {
            logger.error(err.message);
            res.json({
                error_code: 1
            });
        });
}
module.exports = {
    listAll: listAll
};