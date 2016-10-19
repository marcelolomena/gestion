var models = require('../models');
var sequelize = require('../models/index').sequelize;
var userService = require('../service/user');
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');
var logger = require("../utils/logger");
exports.list = function (req, res) {

    var page = req.body.page;
    var rows = req.body.rows;
    var filters = req.body.filters;
    var sidx = req.body.sidx;
    var sord = req.body.sord;

    if (!sidx)
        sidx = "a.id";

    if (!sord)
        sord = "asc";

    var order = sidx + " " + sord;

    var sql0 = "declare @rowsPerPage as bigint; " +
        "declare @pageNum as bigint;" +
        "set @rowsPerPage=" + rows + "; " +
        "set @pageNum=" + page + ";   " +
        "With SQLPaging As   ( " +
        "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
        "as resultNum, a.*, proveedor.[razonsocial] as proveedor, estructuracui.[cui] as cui, moneda.glosamoneda as moneda " +
        "FROM [sip].[prefactura] a " +
        " LEFT OUTER JOIN [sip].[proveedor] proveedor  ON a.[idproveedor] = proveedor.[id] " +
        " LEFT OUTER JOIN  [sip].[estructuracui] estructuracui  ON a.[idcui] = estructuracui.[id] " +
        " LEFT OUTER JOIN  [sip].[moneda] moneda  ON a.[idmoneda] = moneda.[id] " +
        "WHERE (a.[borrado] = 1) " +
        ") " +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

         logger.debug(sql0);

    if (filters) {
        var jsonObj = JSON.parse(filters);

        if (JSON.stringify(jsonObj.rules) != '[]') {

            jsonObj.rules.forEach(function (item) {

                if (item.op === 'cn')
                    condition += item.field + " like '%" + item.data + "%' AND"
            });

            var sql = "declare @rowsPerPage as bigint; " +
                "declare @pageNum as bigint;" +
                "set @rowsPerPage=" + rows + "; " +
                "set @pageNum=" + page + ";   " +
                "With SQLPaging As   ( " +
                "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
                "as resultNum, a.*, proveedor.[razonsocial] as proveedor, estructuracui.[cui] as cui, moneda.glosamoneda as moneda " +
                "FROM [sip].[prefactura] a " +
                " LEFT OUTER JOIN [sip].[proveedor] proveedor  ON a.[idproveedor] = proveedor.[id] " +
                " LEFT OUTER JOIN  [sip].[estructuracui] estructuracui  ON a.[idcui] = estructuracui.[id] " +
                " LEFT OUTER JOIN  [sip].[moneda] moneda  ON a.[idmoneda] = moneda.[id] " +
                "WHERE ( a.[borrado] = 1) AND " + condition.substring(0, condition.length - 4) + ") " +
                "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

            logger.debug(sql);

            models.prefactura.count({ where: [condition.substring(0, condition.length - 4)] }).then(function (records) {
                var total = Math.ceil(records / rows);
                sequelize.query(sql)
                    .spread(function (rows) {
                        res.json({ records: records, total: total, page: page, rows: rows });
                    });
            })

        } else {

            models.prefactura.count({

            }).then(function (records) {
                var total = Math.ceil(records / rows);
                sequelize.query(sql0)
                    .spread(function (rows) {
                        res.json({ records: records, total: total, page: page, rows: rows });
                    });
            })
        }

    } else {

        models.prefactura.count({

        }).then(function (records) {
            var total = Math.ceil(records / rows);
            sequelize.query(sql0)
                .spread(function (rows) {
                    res.json({ records: records, total: total, page: page, rows: rows });
                });
        })

    }

}
exports.solicitudesporfactura = function (req, res) {

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

    var additional = [{
        "field": "idprefactura",
        "op": "eq",
        "data": req.params.id
    }];

    utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
        if (err) {
            logger.debug("->>> " + err)
        } else {
            models.solicitudaprobacion.count({
                where: data
            }).then(function (records) {
                var total = Math.ceil(records / rows);
                models.solicitudaprobacion.findAll({
                    offset: parseInt(rows * (page - 1)),
                    limit: parseInt(rows),
                    order: orden,
                    where: data
                }).then(function (iniciativas) {
                    res.json({ records: records, total: total, page: page, rows: iniciativas });
                }).catch(function (err) {
                    logger.error(err);
                    res.json({ error_code: 1 });
                });
            })
        }
    });


}


exports.generar = function (req, res) {
    var iniDate = new Date();
    var mes = parseInt(iniDate.getMonth()) + 1
    var mm = mes < 10 ? '0' + mes : mes;
    var periodo = iniDate.getFullYear() + '' + mm;

    logger.debug("****El peridodo:" + periodo);
    sequelize.query('EXECUTE sip.generaprefacturas '
        + periodo + ';').then(function (response) {
            res.json({ error_code: 0 });
        }).error(function (err) {
            logger.error(err)
            res.json(err);
        });

};

exports.solicitudesaprobadas = function (req, res) {
    var page = req.body.page;
    var rows = req.body.rows;
    var sidx = req.body.sidx;
    var sord = req.body.sord;
    var filters = req.body.filters;
    var condition = "";
    var iniDate = new Date();
    var mes = parseInt(iniDate.getMonth()) + 1
    var mm = mes < 10 ? '0' + mes : mes;
    var periodo = iniDate.getFullYear() + '' + mm;

    if (!sidx)
        sidx = "id";

    if (!sord)
        sord = "asc";

    var order = " ORDER BY " + sidx + " " + sord + " ";

    if (filters) {
        var jsonObj = JSON.parse(filters);
        jsonObj.rules.forEach(function (item) {
            if (item.op === 'cn')
                condition += " AND " + item.field + " like '%" + item.data + "%'"
        });
    }

    var count = `
            SELECT 
            count(*) cantidad
            FROM sip.solicitudaprobacion a 
            where a.periodo= :periodo and a.idprefactura is null 
            and a.aprobado=1 ` + condition

    var sql = `
            SELECT 
                    *
                    FROM sip.solicitudaprobacion a 
            where a.periodo= :periodo and a.idprefactura is null 
            and a.aprobado=1 ` + condition + order +
        `OFFSET :rows * (:page - 1) ROWS FETCH NEXT :rows ROWS ONLY`

        logger.debug("lala : " + sql)
        logger.debug("lilo : " + periodo)


    sequelize.query(count,
        {
            replacements: { periodo: periodo, condition: condition },
            type: sequelize.QueryTypes.SELECT
        }).then(function (records) {
            var total = Math.ceil(parseInt(records[0].cantidad) / rows);
            sequelize.query(sql,
                {
                    replacements: { page: parseInt(page), rows: parseInt(rows), periodo: periodo, condition: condition },
                    type: sequelize.QueryTypes.SELECT
                }).then(function (data) {
                    res.json({ records: parseInt(records[0].cantidad), total: total, page: page, rows: data });
                }).catch(function (e) {
                    logger.error(e)
                })

        }).catch(function (e) {
            logger.error(e)
        })
}