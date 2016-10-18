var models = require('../models');
var sequelize = require('../models/index').sequelize;
var userService = require('../service/user');
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');
var constants = require("../utils/constants");
var logger = require("../utils/logger");
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

    var superCui = function (uid, callback) {
    var rol = req.user[0].rid;
    if (rol != constants.ROLADMDIVOT) {
      var sql1 = "SELECT cui FROM sip.estructuracui WHERE uid=" + uid;
      console.log("query:" + sql1);
      sequelize.query(sql1)
        .spread(function (rows) {
          if (rows.length > 0) {
            console.log("query:" + rows + ", valor:" + rows[0].cui);
            idcui = rows[0].cui;
          } else {
            idcui = 0; //cui no existente para que no encuentre nada
          }
        }).then(function (servicio) {
          var sql = "select a.id " +
            "from   sip.estructuracui a " +
            "where  a.cui = " + idcui + " " +
            "union " +
            "select b.id " +
            "from   sip.estructuracui a,sip.estructuracui b " +
            "where  a.cui = " + idcui + " " +
            "  and  a.cui = b.cuipadre " +
            "union " +
            "select c.id " +
            "from   sip.estructuracui a,sip.estructuracui b,sip.estructuracui c " +
            "where  a.cui = " + idcui + " " +
            "  and  a.cui = b.cuipadre " +
            "  and  b.cui = c.cuipadre " +
            "union " +
            "select d.id " +
            "from   sip.estructuracui a,sip.estructuracui b,sip.estructuracui c,sip.estructuracui d " +
            "where  a.cui = " + idcui + " " +
            "  and  a.cui = b.cuipadre " +
            "  and  b.cui = c.cuipadre " +
            "  and  c.cui = d.cuipadre ";
          sequelize.query(sql)
            .spread(function (rows) {
              var cuis = "";
              console.log("En cuis:" + rows);
              for (i = 0; i < rows.length; i++) {
                //console.log("cui:" + rows[i].id);
                cuis = cuis + rows[i].id + ",";
              }
              //return cuis.substring(0, cuis.length - 1);
              console.log("antes call:" + cuis.substring(0, cuis.length - 1));
              callback(cuis.substring(0, cuis.length - 1));
            });
        });
    } else {
      callback("*");
    }
  };

    superCui(req.user[0].uid, function (elcui) {
      console.log('elcui:' + elcui)
      var rol = req.user[0].rid;
      var sqlok;
      if (rol == constants.ROLADMDIVOT) {
        sqlok = "declare @rowsPerPage as bigint; " +
        "declare @pageNum as bigint;" +
        "set @rowsPerPage=" + rows + "; " +
        "set @pageNum=" + page + ";   " +
        "With SQLPaging As   ( " +
        "Select distinct  A.idcui, B.nombre   " +
        "FROM sip.detalleserviciocto As A, sip.estructuracui AS B, sip.contrato AS C, sip.proveedor AS D " +
        "WHERE (B.Id = A.idcui And C.Id = A.idcontrato And D.Id = C.idproveedor And D.numrut <> 1 ) " +
        ") " +
        "select * from SQLPaging with (nolock) order by nombre"
      } else {
        sqlok = "declare @rowsPerPage as bigint; " +
        "declare @pageNum as bigint;" +
        "set @rowsPerPage=" + rows + "; " +
        "set @pageNum=" + page + ";   " +
        "With SQLPaging As   ( " +
        "Select distinct  A.idcui, B.nombre   " +
        "FROM sip.detalleserviciocto As A, sip.estructuracui AS B, sip.contrato AS C, sip.proveedor AS D " +
        "WHERE (B.Id = A.idcui And C.Id = A.idcontrato And D.Id = C.idproveedor And D.numrut <> 1 and a.idcui IN (" + elcui + ") ) " +
        ") " +
        "select * from SQLPaging with (nolock) order by nombre"        
      }
      sequelize.query(sqlok).spread(function (rows) {
        res.json({ records: null, total: 0, page: page, rows: rows }); 
      });             
    });

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

    var sql0 = "declare @rowsPerPage as bigint;  " +
        "declare @pageNum as bigint; " +
        "set @rowsPerPage= " + rows + " ;  " +
        "set @pageNum= " + page + " ; " +
        "With SQLPaging As   ( " +
        "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY D.razonsocial, E.nombre, A.glosaservicio, C.numero, C.solicitudcontrato asc )  " +
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

    var sql0 = "declare @rowsPerPage as bigint;  " +
        "declare @pageNum as bigint; " +
        "set @rowsPerPage= " + rows + " ;  " +
        "set @pageNum= " + page + " ; " +
        "With SQLPaging As   ( " +
        "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY periodo asc )  " +
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