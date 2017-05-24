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

    if (!sidx)
        sidx = "id";

    if (!sord)
        sord = "asc";

    var orden = sidx + " " + sord;

    utilSeq.buildCondition(filters, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
            models.pagina.belongsTo(models.sistema, { foreignKey: 'idsistema' });
            models.pagina.belongsTo(models.contenido, { foreignKey: 'idcontenido' });
            models.pagina.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.pagina.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    //order: orden,
                    where: data,
                    /*attributes: [['id'], ['nombre'], ['title'], ['script']],*/
                    include: [
                        {
                            /*attributes: [['glosasistema']], */model: models.sistema
                        },
                        {
                            /*attributes: [['nombre'],['plantilla']],*/
                            model: models.contenido
                        }]
                }).then(function (pages) {
                    res.json({ records: records, total: total, page: page, rows: pages });
                }).catch(function (err) {
                    logger.error(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });
}