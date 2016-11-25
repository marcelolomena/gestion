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
        atributes: ['id', 'nombre'],//Es Nombre
        where: { tipo: req.params.val },
    }).then(function (valores) {
        console.dir(valores)
        res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
}