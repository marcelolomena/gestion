var models = require('../models');
var sequelize = require('../models/index').sequelize;
var userService = require('../service/user');
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');

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
        "as resultNum, a.*, proveedor.[razonsocial] as proveedor, estructuracui.[cui] as cui " +
        "FROM [sip].[prefactura] a " +
        " LEFT OUTER JOIN [sip].[proveedor] proveedor  ON a.[idproveedor] = proveedor.[id] " +
        " LEFT OUTER JOIN  [sip].[estructuracui] estructuracui  ON a.[idcui] = estructuracui.[id] " +
        "WHERE (a.[borrado] = 1) " +
        ") " +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

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
                "as resultNum, a.*, proveedor.[razonsocial] as proveedor, estructuracui.[cui] as cui " +
                "FROM [sip].[prefactura] a " +
                " LEFT OUTER JOIN [sip].[proveedor] proveedor  ON a.[idproveedor] = proveedor.[id] " +
                " LEFT OUTER JOIN  [sip].[estructuracui] estructuracui  ON a.[idcui] = estructuracui.[id] " +
                "WHERE ( a.[borrado] = 1) AND " + condition.substring(0, condition.length - 4) + ") " +
                "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

            console.log(sql);

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
            console.log("->>> " + err)
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
                    //console.log(err);
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

    console.log("****El peridodo:" + periodo);
    sequelize.query('EXECUTE sip.generaprefacturas '
        + periodo + ';').then(function (response) {
            res.json({ error_code: 0 });
        }).error(function (err) {
            res.json(err);
        });

};