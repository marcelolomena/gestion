var models = require('../models');
var sequelize = require('../models/index').sequelize;
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");

exports.grid = function (req, res) {

    var page = req.body.page;
    var rows = req.body.rows;
    var filters = req.body.filters;
    var sidx = req.body.sidx;
    var sord = req.body.sord;

    //console.dir(filters)

    if (!sidx)
        sidx = "id";

    if (!sord)
        sord = "asc";

    var orden = sidx + " " + sord;

    utilSeq.buildGenericFilter(filters, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
            models.pagina.belongsTo(models.sistema, { foreignKey: 'idsistema' });
            models.pagina.belongsTo(models.contenido, { foreignKey: 'idcontenido' });
            //logger.debug(data)
            var incl = []
            for (t in data) {
                var item = data[t], key
                for (key in item) {
                    if (item.hasOwnProperty(key)) {
                        //console.log(key + " = " + item[key]);
                        var jsonInclude = {}
                        var jsonWhere = {}
                        if (key.split(".")[0] === 'contenido')
                            jsonInclude["model"] = models.contenido
                        else if (key.split(".")[0] === 'sistema')
                            jsonInclude["model"] = models.sistema

                        jsonWhere[key.split(".")[1]] = item[key];
                        jsonInclude["where"] = jsonWhere
                        incl.push(jsonInclude)
                    }
                }
            }
            //console.dir(incl)
            models.pagina.count({

                include: incl
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.pagina.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    include: incl
                }).then(function (pages) {
                    res.json({ records: records, total: total, page: page, rows: pages });
                }).catch(function (err) {
                    logger.error(err);
                    res.json({ error_code: 1 });
                });
            }).catch(function (err) {
                logger.debug("cago")
                logger.error(err);
                res.json({ error_code: 1 });
            });
        }
    });
}

exports.sistema = function (req, res) {
    models.sistema.findAll({
        where: { borrado: 1 },
    }).then(function (sistema) {
        res.json(sistema);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
}

exports.contenido = function (req, res) {
    models.contenido.findAll({
        where: { borrado: 1 },
    }).then(function (contenido) {
        res.json(contenido);
    }).catch(function (err) {
        logger.error(err);
        res.json({ error: 1 });
    });
}