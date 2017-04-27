var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");
var path = require('path');
var fs = require('fs');

exports.presupuesto = function (req, res) {

    var idtipo = req.params.id;

    logger.debug("idtipo : " + idtipo)

    return models.dashboard.findAll({
        where: { idtipo: idtipo }
    }).then(function (dashboard) {
        return res.json(dashboard);
    }).catch(function (err) {
        logger.error(err);
    });

};

exports.zone = function (req, res) {

    var idtipo = req.params.idtipo;
    var idzona = req.params.idzona;

    var data = []

    if (idzona === 'zon1') {

        models.dashboard.findAll({
            attributes: [
                'valorx', 'valory'
            ],
            where: { idtipo: idtipo, div: idzona, serie: 'Plan' },
            order: 'secuencia'
        }).then(function (da) {

            var plan = {}
            plan['name'] = 'Plan'
            plan['data'] = da
            data.push(plan)

            models.dashboard.findAll({
                attributes: [
                    'valorx', 'valory'
                ],
                where: { idtipo: idtipo, div: idzona, serie: 'Real' },
                order: 'secuencia'
            }).then(function (db) {
                var real = {}
                real['name'] = 'Real'
                real['data'] = db
                data.push(real)

                return res.json(data);

            }).catch(function (err) {
                logger.error(err);
            });

        }).catch(function (err) {
            logger.error(err);
        });


    } else if (idzona === 'zon2' || idzona === 'zon3' || idzona === 'zon4') {

        models.dashboard.findAll({
            attributes: [
                'valorx', 'valory'
            ],
            where: { idtipo: idtipo, div: idzona },
            order: 'secuencia'
        }).then(function (da) {
            return res.json(da);
        })

    } else if (idzona === 'zon5') {

        models.dashboard.findAll({
            attributes: [
                'valorx', 'valory'
            ],
            where: { idtipo: idtipo, div: idzona },
            order: 'secuencia'
        }).then(function (da) {
            return res.json(da);
        })

    }

};