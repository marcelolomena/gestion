'use strict';
var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require('../../utils/logger');
var _ = require('lodash');


var entity = models.tipolicenciamiento;

function listAll(req, res) {
    entity.findAll()
        .then(function (rows) {
            return res.json(_.map(rows, function (item) {
                return {
                    id: item.id,
                    nombre: item.nombre
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