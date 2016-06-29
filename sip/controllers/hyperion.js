var models = require('../models');
var sequelize = require('../models/index').sequelize;
var nodeExcel = require('excel-export');

exports.list = function (req, res) {
    var page = req.query.page;
    var rows = req.query.rows;
    var sidx = req.query.sidx;
    var sord = req.query.sord;
    var filters = req.query.filters;
    var condition = "";
    var id = req.params.id
    
    var sql = "DECLARE @cols AS NVARCHAR(MAX), @query  AS NVARCHAR(MAX); " +
        "SELECT @cols = STUFF((SELECT ',' + QUOTENAME(d.periodo) " +
        "FROM sip.presupuesto a " +
        "JOIN sip.detallepre b ON a.id = b.idpresupuesto " +
        "JOIN sip.estructuracui c ON a.idcui = c.id " +
        "JOIN sip.detalleplan d on d.iddetallepre = b.id " +
        "WHERE " +
        "a.estado='Aprobado' " +
        "GROUP BY d.periodo " +
        "FOR XML PATH(''), TYPE " +
        ").value('.', 'NVARCHAR(MAX)') " +
        ",1,1,'') " +
        "SET @query = 'SELECT cui,' + @cols + ' FROM " +
        "(" +
        "SELECT " +
        "c.cui, " +
        "d.periodo, " +
        "d.presupuestoorigen " +
        "FROM sip.presupuesto a " +
        "JOIN sip.detallepre b on a.id = b.idpresupuesto " +
        "JOIN sip.estructuracui c on a.idcui = c.id " +
        "JOIN sip.detalleplan d on d.iddetallepre = b.id " +
        ") x " +
        "PIVOT " +
        "( " +
        "SUM(presupuestoorigen) " +
        "FOR periodo IN (' + @cols + ') " +
    ") p ' execute(@query);";
    
    console.log(sql)

    sequelize.query(sql)
        .spread(function (rows) {
            console.dir(rows)
            res.json(rows);
        });

};