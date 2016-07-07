var models = require('../models');
var sequelize = require('../models/index').sequelize;
var nodeExcel = require('excel-export');

exports.excel = function (req, res) {
    var conf = {}
    conf.cols = [{
        caption: 'Id Contrato',
        type: 'number',
        width: 3
    },
        {
            caption: 'Contrato',
            type: 'string',
            width: 50
        },
        {
            caption: 'Solicitud',
            type: 'string',
            width: 30
        }
    ];

}

exports.listcui = function (req, res) {
    models.presupuesto.belongsTo(models.estructuracui, { foreignKey: 'idcui' })
    models.presupuesto.findAll({
        attributes: ['idcui'],
        where: { 'estado': 'Aprobado' },
        include: [
            {
                model: models.estructuracui, attributes: ['cui']
            }, {
                model: models.ejercicios, attributes: ['ejercicio']
            }]
    }).then(function (presupuesto) {
        //console.dir(presupuesto[0])
        res.json(presupuesto);
    }).catch(function (err) {
        console.log(err)
    });
}

exports.presupuesto = function (req, res) {
    models.presupuesto.belongsTo(models.estructuracui, { foreignKey: 'idcui' })
    models.presupuesto.belongsTo(models.ejercicios, { foreignKey: 'idejercicio' })
    models.presupuesto.findAll({
        attributes: ['id', 'idcui', 'descripcion', 'estado', 'version', 'montoforecast', 'montoanual'],
        where: { 'estado': 'Aprobado' },
        include: [
            {
                model: models.estructuracui, attributes: ['cui', 'nombre', 'nombreresponsable']
            }, {
                model: models.ejercicios, attributes: ['ejercicio']
            }]
    }).then(function (presupuesto) {
        //console.dir(presupuesto[0])
        res.json(presupuesto);
    }).catch(function (err) {
        console.log(err)
    });
}

exports.colnames = function (req, res) {
    var ano = req.params.ano;
    var peini = ano + '09'
    var pefin = (parseInt(ano) + 1) + '12'

    models.presupuesto.hasMany(models.detallepre, { foreignKey: 'idpresupuesto' })
    models.detallepre.belongsTo(models.presupuesto, { foreignKey: 'idpresupuesto' })
    models.detallepre.hasMany(models.detalleplan, { foreignKey: 'iddetallepre' })
    models.detalleplan.belongsTo(models.detallepre, { foreignKey: 'iddetallepre' })

    models.presupuesto.findAll({
        attributes: ['id'],
        //limit: 1,
        where: [{ 'estado': 'Aprobado' }, { 'idcui': 59 }],
        include: [
            {
                model: models.detallepre,
                attributes: ['id'],
                include: [
                    {
                        model: models.detalleplan,
                        attributes: ['periodo'],
                        where: { 'periodo': { $between: [peini, pefin] } },
                        group: ['periodo']
                    }]
            }
        ],
    }).then(function (presupuesto) {
        //console.dir(presupuesto[0])
        res.json(presupuesto);
    }).catch(function (err) {
        console.log(err)
    });

}

exports.estructura = function (req, res) {
    var sql = `
SELECT S.gerencia,S.departamento,S.seccion,R.cui FROM 
(
SELECT B.cui,B.cuipadre FROM sip.presupuesto A JOIN sip.estructuracui B ON A.idcui = B.id WHERE A.estado='Aprobado'
) R
RIGHT OUTER JOIN 
(
SELECT X.cuipadre gerencia, X.cui departamento,Y.cui seccion FROM 
(
  SELECT A.cui,A.cuipadre FROM sip.estructuracui A JOIN sip.estructuracui B ON A.cuipadre = B.cui WHERE B.cuipadre=1900
) X LEFT OUTER JOIN 
(
 SELECT C.cui,C.cuipadre FROM sip.estructuracui C JOIN 
 (SELECT A.cui,A.cuipadre FROM sip.estructuracui A JOIN sip.estructuracui B ON A.cuipadre = B.cui WHERE B.cuipadre=1900 ) D
 ON C.cuipadre = D.cui
) Y
ON X.cui=Y.cuipadre
) S
ON R.cuipadre=S.gerencia AND R.cui = departamento
ORDER BY gerencia,departamento,seccion
    `
}

exports.list = function (req, res) {
    var _page = req.body.page;
    var _rows = req.body.rows;
    var _sidx = req.body.sidx;
    var _sord = req.body.sord;
    var _filters = req.body.filters;
    var _search = req.body._search;
    var ano = req.body.ano;
    var cui = req.body.cui;
    var idcui = req.body.idcui;
    var estado = 'Aprobado'
    var ssql
    
    if (_search == 'true') {
        var searchField = req.body.searchField;
        var searchString = req.body.searchString;
        var searchOper = req.body.searchOper;
        if (searchField === 'ano') {
            ano = parseInt(searchString)
            ssql = "BETWEEN " + searchString + "09 AND " + (parseInt(searchString) + 1) + "12 "
        } else if (searchField === 'cui') {
            cui = parseInt(searchString)
            console.log("la super cui ----------->> " + cui)
        }
    } else if (_search == 'false') {
        console.log("ano ----------->> " + ano)
        ssql = "BETWEEN " + ano.toString() + "09 AND " + (ano + 1) + "12 "
        console.log("ssql ----------->> " + ssql)
    }

    //console.log(ssql)

    var sql = "DECLARE @cols AS NVARCHAR(MAX), @query  AS NVARCHAR(MAX), @ano AS NVARCHAR(4)= :ano; " +
        "SELECT @cols = STUFF((SELECT ',' + QUOTENAME(d.periodo) " +
        "FROM sip.presupuesto a " +
        "JOIN sip.detallepre b ON a.id = b.idpresupuesto " +
        "JOIN sip.estructuracui c ON a.idcui = c.id " +
        "JOIN sip.detalleplan d on d.iddetallepre = b.id " +
        "WHERE " +
        "a.estado= :estado AND a.idcui = :idcui AND d.periodo " + ssql +
        "GROUP BY d.periodo " +
        "FOR XML PATH(''), TYPE " +
        ").value('.', 'NVARCHAR(MAX)') " +
        ",1,1,'') " +
        "SET @query = 'SELECT cuentacontable,cui,cuipadre,ano,' + @cols + ' FROM " +
        "(" +
        "SELECT " +
        "f.cuentacontable, c.cui, c.cuipadre, " +
        "' + @ano + ' ano, " +
        "d.periodo, " +
        "d.presupuestopesos " +
        "FROM sip.presupuesto a " +
        "JOIN sip.detallepre b ON a.id = b.idpresupuesto " +
        "JOIN sip.estructuracui c ON a.idcui = c.id " +
        "JOIN sip.detalleplan d ON d.iddetallepre = b.id " +
        "JOIN sip.servicio e ON b.idservicio=e.id " +
        "JOIN sip.cuentascontables f ON e.idcuenta=f.id " +
        " WHERE a.estado=''" + estado + "'' AND a.idcui = :idcui AND d.periodo " + ssql +
        ") x " +
        "PIVOT " +
        "( " +
        "SUM(presupuestopesos) " +
        "FOR periodo IN (' + @cols + ') " +
        ") p ' execute(@query);";

    sequelize.query(sql, { replacements: { ano: ano, periodo: ssql, idcui: parseInt(idcui), estado: estado }, type: sequelize.QueryTypes.SELECT }
    ).then(function (rows) {
        res.json(rows);
    }).catch(function (err) {
        res.json({ error_code: 1 });
    });
};