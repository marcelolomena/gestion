var models = require('../models');
var sequelize = require('../models/index').sequelize;
var logger = require("../utils/logger");
var path = require('path');
var fs = require('fs');

exports.presupuesto = function (req, res) {

    var idtipo = req.params.id;

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


    } else if (idzona === 'zon2' || idzona === 'zon3' || idzona === 'zon4' || idzona === 'zon7' || idzona === 'zon9' || idzona === 'zon10' || idzona === 'zon11') {

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
                'serie'
            ],
            where: { idtipo: idtipo, div: idzona },
            group: 'serie'
        }).then(function (rows) {
            const nodeData = rows.map((node) => node.get({ plain: true }));

            var promesas = []
            for (var s in rows) {
                promesas.push(models.dashboard.findAll({
                    attributes: [
                        'valorx', 'valory'
                    ],
                    where: { idtipo: idtipo, div: idzona, serie: rows[s].serie }
                })
                )
            }

            Promise.all(promesas)
                .then(function (result) {
                    return res.json({ records: result, series: nodeData });
                })

        })

    } else if (idzona === 'zon6') {

        models.dashboard.findAll({
            attributes: [
                'valorx', 'valory'
            ],
            where: { idtipo: idtipo, div: idzona },
            order: 'secuencia'
        }).then(function (rows) {
            //logger.debug(rows)
            //const nodeData = rows.map((node) => node.get({ plain: true }));
            return res.json(rows)
        })
    } if (idzona === 'zon8') {

        models.dashboard.findAll({
            attributes: [
                'valorx', 'valory'
            ],
            where: { idtipo: idtipo, div: idzona, serie: 'Mantener' },
            order: 'secuencia'
        }).then(function (da) {

            var _mantener = {}
            _mantener['name'] = 'Mantener'
            _mantener['data'] = da
            data.push(_mantener)

            models.dashboard.findAll({
                attributes: [
                    'valorx', 'valory'
                ],
                where: { idtipo: idtipo, div: idzona, serie: 'Crecer' },
                order: 'secuencia'
            }).then(function (db) {
                console.dir(db)
                var _crecer = {}
                _crecer['name'] = 'Crecer'
                _crecer['data'] = db
                data.push(_crecer)

                models.dashboard.findAll({
                    attributes: [
                        'valorx', 'valory'
                    ],
                    where: { idtipo: idtipo, div: idzona, serie: 'Transformar' },
                    order: 'secuencia'
                }).then(function (tr) {

                    var _transformar = {}
                    _transformar['name'] = 'Transformar'
                    _transformar['data'] = tr
                    data.push(_transformar)

                    return res.json(data);

                }).catch(function (err) {
                    logger.error(err);
                });

            }).catch(function (err) {
                logger.error(err);
            });

        }).catch(function (err) {
            logger.error(err);
        });


    }

};