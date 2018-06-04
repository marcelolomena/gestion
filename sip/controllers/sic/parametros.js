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

exports.getEtapaRol = function (req, res) {
    var rol = req.session.passport.sidebar[0].rol[0].id
    models.etaparol.belongsTo(models.valores, {
        foreignKey: 'idetapa'
    });
    models.etaparol.belongsTo(models.rol, {
        foreignKey: 'idrol'
    })
    models.etaparol.findAll({
        where: {
            idrol: rol
        },
        include: [{
            model: models.valores,
            order: 'valor ASC'
        },
        {
            model: models.rol
        }]
    }).then(function (valores) {
        return res.json(valores);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
}
