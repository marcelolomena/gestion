var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var Busboy = require('busboy');
var path = require('path');
var fs = require('fs');


exports.listall = function (req, res) {

    models.valores.findAll({
        order: 'id ASC',
        attributes: ['id', 'nombre'],
        where: { tipo: req.params.val },
    }).then(function (valores) {
        return res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
}

exports.listall2 = function (req, res) {

    models.valores.findAll({
        order: 'id ASC',
        attributes: [['id', 'value'], ['nombre', 'text']],
        where: { tipo: req.params.val },
    }).then(function (valores) {
        return res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
}

exports.getEtapa = function (req, res) {

    models.valores.findAll({
        order: 'valor ASC',
        attributes: ['id', 'nombre'],
        where: { tipo: 'clasificacionsolicitud' },
    }).then(function (valores) {
        return res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
}
