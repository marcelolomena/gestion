var models = require('../models');
var sequelize = require('../models/index').sequelize;
var userService = require('../service/user');
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');
var constants = require("../utils/constants");

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
    //var idcui = req.params.id;

    if (!sidx)
        sidx = "id";

    if (!sord)
        sord = "asc";

    var order = sidx + " " + sord;

    var sql0 = "declare @rowsPerPage as bigint;  " +
        "declare @pageNum as bigint; " +
        "set @rowsPerPage= " + rows + " ;  " +
        "set @pageNum= " + page + " ; " +
        "With SQLPaging As   ( " +
        "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY anoinicioprevisto, mesinicioprevisto, a.nombre asc )  " +
        "as resultNum, a.id,codigoart,a.nombre,c.nombre as estado, case 	when a.pptoestimadoprevisto is not null 		then a.pptoestimadoprevisto 	when a.pptoestimadogasto is not null  and a.pptoestimadoinversion is not null		then a.pptoestimadogasto+a.pptoestimadoinversion 		else 0 end as costototalestimadoUS,pptoaprobadodolares,case 	when a.q1 is not null 		then a.q1 	when a.q2 is not null  		then a.q2 	when a.q3 is not null  		then a.q3 	when a.q4 is not null  		then a.q4 		else '' end as QPROPUESTODIVOT,d.first_name+' '+d.last_name as nombregerente,e.first_name+' '+e.last_name as nombrepmo,a.anoinicioprevisto,a.mesinicioprevisto,case 	when a.anoinicioprevisto =2016 and a.mesinicioprevisto=7		then b.fecha		else null end as JULIO,case 	when a.anoinicioprevisto =2016 and a.mesinicioprevisto=8		then b.fecha		else null end as AGOSTO,case 	when a.anoinicioprevisto =2016 and a.mesinicioprevisto=9		then b.fecha		else null end as SEPTIEMBRE,case 	when a.anoinicioprevisto =2016 and a.mesinicioprevisto=10		then b.fecha		else null end as OCTUBRE,case 	when a.anoinicioprevisto =2016 and a.mesinicioprevisto=11		then b.fecha		else null end as NOVIEMBRE,case 	when a.anoinicioprevisto =2016 and a.mesinicioprevisto=12		then b.fecha		else null end as DICIEMBRE,case 	when a.anoinicioprevisto =2017		then b.fecha		else null end as '2017' FROM sip.iniciativaprograma a left outer JOIN sip.iniciativafecha b on a.id=b.idiniciativaprograma join sip.parametro c on a.idestado= c.id join dbo.art_user d on d.uid = a.uidgerente join dbo.art_user e on e.uid = a.uidpmo WHERE anoinicioprevisto > 0 and (b.tipofecha='Fecha Comité SAP' or b.tipofecha is null)  " +
        ")  " +
        "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";

    models.iniciativaprograma.count({
    }).then(function (records) {
        var total = Math.ceil(records / rows);
        sequelize.query(sql0)
            .spread(function (rows) {
                res.json({ records: records, total: total, page: page, rows: rows });
            });
    })
}