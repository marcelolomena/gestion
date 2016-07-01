var models = require('../models');
var sequelize = require('../models/index').sequelize;
var nodeExcel = require('excel-export');


exports.colnames = function (req, res) {
    models.presupuesto.hasMany(models.detallepre, { foreignKey: 'idpresupuesto' })
    models.detallepre.belongsTo(models.presupuesto, { foreignKey: 'idpresupuesto' })
    models.detallepre.hasMany(models.detalleplan, { foreignKey: 'iddetallepre' })
    models.detalleplan.belongsTo(models.detallepre, { foreignKey: 'iddetallepre' })
    models.presupuesto.findAll({
        attributes: ['id'],
        where: { 'estado': 'Creado' },//Aprobado
        include: [
            {
                model: models.detallepre,
                attributes: ['id'],
                include: [
                    {
                        model: models.detalleplan,
                        attributes: ['periodo'],
                        where: { 'periodo': { $between: [201509, 201612] } },
                    }]
            }
        ],
    }).then(function (presupuesto) {
        res.json(presupuesto);
    }).catch(function (err) {
        console.log(err)
    });


}

exports.list = function (req, res) {
    var _page = req.body.page;
    var _rows = req.body.rows;
    var _sidx = req.body.sidx;
    var _sord = req.body.sord;
    var _filters = req.body.filters;
    var _search = req.body._search;
    var ano = 2015
    var ssql

    if (_search == true) {
        var searchField = req.body.searchField;
        var searchString = req.body.searchString;
        var searchOper = req.body.searchOper;
        console.log("searchString : " + searchString)

        if (searchField === 'ano') {
            ano = parseInt(searchString)
            console.log("----------->> " + ano)
            ssql = "BETWEEN " + searchString + "09 AND " + (parseInt(searchString) + 1) + "12 "
        }

    } else {
        ssql = "BETWEEN " + ano.toString() + "09 AND " + (ano + 1) + "12 "
    }

    console.log(ssql)

    var sql = "DECLARE @cols AS NVARCHAR(MAX), @query  AS NVARCHAR(MAX), @ano AS NVARCHAR(4)= ':ano'; " +
        "SELECT @cols = STUFF((SELECT ',' + QUOTENAME(d.periodo) " +
        "FROM sip.presupuesto a " +
        "JOIN sip.detallepre b ON a.id = b.idpresupuesto " +
        "JOIN sip.estructuracui c ON a.idcui = c.id " +
        "JOIN sip.detalleplan d on d.iddetallepre = b.id " +
        "WHERE " +
        "a.estado='Creado' AND d.periodo " + ssql + 
        "GROUP BY d.periodo " +
        "FOR XML PATH(''), TYPE " +
        ").value('.', 'NVARCHAR(MAX)') " +
        ",1,1,'') " +
        "SET @query = 'SELECT cui,ano,' + @cols + ' FROM " +
        "(" +
        "SELECT " +
        "c.cui, " +
        "' + @ano + ' ano, " +
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

    sequelize.query(sql, { replacements: { ano: ano, periodo: ssql }, type: sequelize.QueryTypes.SELECT }
    ).then(function (rows) {
        res.json(rows);
    }).catch(function (err) {
        res.json({ error_code: 1 });
    });
};