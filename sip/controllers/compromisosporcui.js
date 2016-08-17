var models = require('../models');
var sequelize = require('../models/index').sequelize;
var userService = require('../service/user');
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');

var log = function (inst) {
    console.dir(inst.get())
}

exports.list = function (req, res) {
    var page = req.body.page;
    var rows = req.body.rows;
    var sidx = req.body.sidx;
    var sord = req.body.sord;
    var filters = req.body.filters;
    var condition = "";
    //var idiniciativaprograma = req.params.id;

    if (!sidx)
        sidx = "id";

    if (!sord)
        sord = "asc";

    var order = sidx + " " + sord;

    var sql0 = "declare @rowsPerPage as bigint; " +
        "declare @pageNum as bigint;" +
        "set @rowsPerPage=" + rows + "; " +
        "set @pageNum=" + page + ";   " +
        "With SQLPaging As   ( " +
        "Select distinct  A.idcui, B.nombre   " +
        "FROM sip.detalleserviciocto As A, sip.estructuracui AS B, sip.contrato AS C, sip.proveedor AS D " +
        "WHERE (B.Id = A.idcui And C.Id = A.idcontrato And D.Id = C.idproveedor And D.numrut <> 1 ) " +
        ") " +
        "select * from SQLPaging with (nolock) "

    models.detalleserviciocto.count({
    }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql0)
            .spread(function (rows) {
                res.json({ records: records, total: total, page: page, rows: rows });
            });
    })


};
exports.list2 = function (req, res) {
    var page = req.body.page;
    var rows = req.body.rows;
    var sidx = req.body.sidx;
    var sord = req.body.sord;
    var filters = req.body.filters;
    var condition = "";
    var idcui = req.params.id;

    if (!sidx)
        sidx = "id";

    if (!sord)
        sord = "asc";

    var order = sidx + " " + sord;

    var sql0 = "declare @order as varchar; " +
        "set @order = 'D.razonsocial, E.nombre, A.glosaservicio, C.numero, C.solicitudcontrato asc'; " +
        "declare @rowsPerPage as bigint;  " +
        "declare @pageNum as bigint; " +
        "set @rowsPerPage= " + rows + " ;  " +
        "set @pageNum= " + page + " ; " +
        "With SQLPaging As   ( " +
        "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY @order )  " +
        "as resultNum, A.Id, D.razonsocial, D.numrut, D.dvrut, D.id As IdProveedor, C.numero, C.nombre As nombreContrato, C.id As IdContrato,  " +
        "C.solicitudcontrato, C.idestadosol, C.idtiposolicitud, C.pmoresponsable,  E.nombre, E.id As IdServicio, A.glosaservicio,  " +
        "A.idcondicion, A.idplazocontrato, A.estadocontrato, F.glosamoneda, A.valorcuota, A.impuesto, A.factorimpuesto   " +
        "FROM sip.detalleserviciocto As A, sip.estructuracui AS B, sip.contrato AS C, sip.proveedor AS D, sip.servicio AS E, sip.moneda As F " +
        "WHERE (B.Id = A.idcui And C.Id = A.idcontrato And D.Id = C.idproveedor And D.numrut <> 1 And A.idcui = " + idcui + " And E.Id = A.idServicio And F.Id = A.IdMoneda )  " +
        ")  " +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

    models.detalleserviciocto.count({
    }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql0)
            .spread(function (rows) {
                res.json({ records: records, total: total, page: page, rows: rows });
            });
    })


};
exports.list3 = function (req, res) {
    var page = req.body.page;
    var rows = req.body.rows;
    var sidx = req.body.sidx;
    var sord = req.body.sord;
    var filters = req.body.filters;
    var condition = "";
    var iddetalleservicio = req.params.id;

    if (!sidx)
        sidx = "id";

    if (!sord)
        sord = "asc";

    var order = sidx + " " + sord;

    var sql0 = "declare @order as varchar; " +
        "set @order = 'periodo asc'; " +
        "declare @rowsPerPage as bigint;  " +
        "declare @pageNum as bigint; " +
        "set @rowsPerPage= " + rows + " ;  " +
        "set @pageNum= " + page + " ; " +
        "With SQLPaging As   ( " +
        "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY @order )  " +
        "as resultNum, periodo,montoorigen    " +
        "FROM sip.detallecompromiso " +
        "WHERE (iddetalleserviciocto = " + iddetalleservicio + "  )  " +
        ")  " +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

    models.detallecompromiso.count({
        where: { 'iddetalleserviciocto': iddetalleservicio },
    }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql0)
            .spread(function (rows) {
                res.json({ records: records, total: total, page: page, rows: rows });
            });
    })


};