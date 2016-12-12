var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var bitacora = require("../../utils/bitacora");
var path = require('path');
var fs = require('fs');

exports.action = function(req, res) {
    var action = req.body.oper;
    //logger.debug("idclausulaplantilla: " + req.body.idclausulaplantilla)
    switch (action) {
        case "add":

            models.clausulas.create({
                idsolicitudcotizacion: req.body.idsolicitudcotizacion,
                idclausula: req.body.idclausulaplantilla,
                uid: req.session.passport.user,
                nombrecorto: req.body.nombrecorto,
                texto: req.body.texto,
                borrado: 1
            }).then(function(clausulas) {
                //bitacora.registrar(req.body.idsolicitudcotizacion, 'clausulas', clausulas.id, 'insert', req.session.passport.user, new Date(), models.clausulas)
                res.json({ error: 0, glosa: '' });
            }).catch(function(err) {
                logger.error(err)
                res.json({ error: 1, glosa: err.message });
            });

            break;
        case "edit":
            models.clausulas.update({
                idclausula: req.body.idclausulaplantilla,
                uid: req.session.passport.user,
                nombrecorto: req.body.nombrecorto,
                texto: req.body.texto
            }, {
                    where: {
                        id: req.body.id
                    }
                }).then(function(clausulas) {
                    res.json({ error: 0, glosa: '' });
                }).catch(function(err) {
                    logger.error(err)
                    res.json({ error: 1, glosa: err.message });
                });
            break;
        case "del":
            models.clausulas.destroy({
                where: {
                    id: req.body.id
                }
            }).then(function(rowDeleted) { // rowDeleted will return number of rows deleted
                if (rowDeleted === 1) {
                    logger.debug('Deleted successfully');
                }
                res.json({ result: true, glosa: 'Deleted successfully' });
            }).catch(function(err) {
                logger.error(err)
                res.json({ result: false, glosa: err.message });
            });

            break;
    }
}

exports.list = function(req, res) {

    var page = req.query.page;
    var rows = req.query.rows;
    var filters = req.query.filters;
    var sidx = req.query.sidx;
    var sord = req.query.sord;

    if (!sidx)
        sidx = "id";

    if (!sord)
        sord = "asc";

    var additional = [{
        "field": "idsolicitudcotizacion",
        "op": "eq",
        "data": req.params.id
    }];


    utilSeq.buildAdditionalCondition(filters, additional, function(err, data) {
        if (data) {

            models.clausulas.belongsTo(models.solicitudcotizacion, { foreignKey: 'idsolicitudcotizacion' });
            models.clausulas.belongsTo(models.plantillaclausula, { foreignKey: 'idclausula' });
            models.clausulas.belongsTo(models.user, { foreignKey: 'uid' });
            models.plantillaclausula.belongsTo(models.clase, { foreignKey: 'cid' })

            models.clausulas.count({
                where: data
            }).then(function(records) {
                var total = Math.ceil(records / rows);
                models.clausulas.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: 'codigo ASC',
                    where: data,
                    include: [{
                        model: models.solicitudcotizacion
                    }, {
                        model: models.plantillaclausula, include: [
                            models.clase
                        ]
                    }, {
                        model: models.user
                    }
                    ]
                }).then(function(clausulas) {
                    res.json({ records: records, total: total, page: page, rows: clausulas });
                }).catch(function(err) {
                    logger.error(err.message);
                    res.json({ error_code: 1 });
                });
            }).catch(function(err) {
                logger.error(err.message);
                res.json({ error_code: 1 });
            });

        }
    });

}

exports.clases = function(req, res) {
    var sql = `
                select e.id, e.nombre from art_user a
                join sip.usr_rol b on a.uid=b.uid
                join sip.rol c on b.rid = c.id 
                join sic.rol_clase d on d.rid= b.rid
                join sic.clase e on d.cid=e.id
                where a.uid = :uid
	                `
    sequelize.query(sql,
        {
            replacements: { uid: req.session.passport.user },
            type: sequelize.QueryTypes.SELECT
        }
    ).then(function(clases) {
        logger.debug(clases);
        res.json(clases);
    }).catch(function(err) {
        logger.error(err.message);
        res.json({ error_code: 1 });
    });

}

exports.plantillas = function(req, res) {

    models.plantillaclausula.findAll({
        order: 'id ASC',
        atributes: ['id', 'codigo'],
        where: { cid: req.params.id }
    }).then(function(plantillas) {
        res.json(plantillas);
    }).catch(function(err) {
        logger.error(err.message);
        res.json({ error_code: 1 });
    });

}

exports.texto = function(req, res) {

    models.plantillaclausula.findAll({
        order: 'id ASC',
        atributes: ['glosaclausula', 'nombrecorto'],
        where: { id: req.params.id }
    }).then(function(plantillas) {
        res.json(plantillas);
    }).catch(function(err) {
        logger.error(err.message);
        res.json({ error_code: 1 });
    });

}


exports.download = function(req, res) {
    models.clausulas.belongsTo(models.plantillaclausula, { foreignKey: 'idclausula' });
    models.clausulas.findAll({
        order: 'codigo ASC',
        atributes: ['texto'],
        where: { idsolicitudcotizacion: req.params.id },
        include: [{
            model: models.plantillaclausula
        }]
    }).then(function(clausulas) {

        //logger.debug(clausulas.plantillaclausula)

        var result = '<html><body>'

        for (var f in clausulas) {
            //logger.debug(clausulas[f].plantillaclausula.codigo)

            var level = clausulas[f].plantillaclausula.codigo.split(".");
            var nombrecorto = clausulas[f].plantillaclausula.nombrecorto;
            //logger.debug(level[0] + '-' + level[1] + '-' + level[2] + '-' + level[3])
            if (parseInt(level[0]) > 0 && parseInt(level[1]) == 0 && parseInt(level[2]) == 0 && parseInt(level[3]) == 0)
                result += '<h1>' + clausulas[f].plantillaclausula.codigo + ' ' + nombrecorto + '</h1>'
            else if (parseInt(level[0]) > 0 && parseInt(level[1]) > 0 && parseInt(level[2]) == 0 && parseInt(level[3]) == 0)
                result += '<h2>' + clausulas[f].plantillaclausula.codigo + ' ' + nombrecorto + '</h2>'
            else if (parseInt(level[0]) > 0 && parseInt(level[1]) > 0 && parseInt(level[2]) > 0 && parseInt(level[3]) == 0)
                result += '<h3>' + clausulas[f].plantillaclausula.codigo + ' ' + nombrecorto + '</h3>'
            else if (parseInt(level[0]) > 0 && parseInt(level[1]) > 0 && parseInt(level[2]) > 0 && parseInt(level[3]) > 0)
                result += '<h4>' + clausulas[f].plantillaclausula.codigo + ' ' + nombrecorto + '</h4>'

            result += clausulas[f].texto
        }

        result += '</html></body>'

        var hdr = 'attachment; filename=RTF_' + Math.floor(Date.now()) + '.doc'
        res.setHeader('Content-disposition', hdr);
        res.set('Content-Type', 'application/msword;charset=utf-8');
        res.status(200).send(result);

    }).catch(function(err) {
        logger.error(err.message);
        res.json({ error_code: 1 });
    });

}
