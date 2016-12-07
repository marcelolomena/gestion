var models = require('../models');
var sequelize = require('../models/index').sequelize;
var userService = require('../service/user');
var nodeExcel = require('excel-export');
var utilSeq = require('../utils/seq');

exports.getExcel = function (req, res) {
  var page = req.query.page;
  var rows = req.query.rows;
  var filters = req.query.filters;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var condition = "";
  console.log("En getExcel");
  var conf = {}
  conf.cols = [{
    caption: 'id',
    type: 'number',
    width: 3
  },
    {
      caption: 'Iniciativa',
      type: 'string',
      width: 10
    },
    {
      caption: 'Programa',
      type: 'string',
      width: 40
    },
    {
      caption: 'Estado',
      type: 'string',
      width: 40
    },
    {
      caption: 'Proyecto',
      type: 'number',
      width: 20
    },
    {
      caption: 'Inscrita',
      type: 'number',
      width: 10
    },
    {
      caption: 'Fecha Entrega',
      type: 'string',
      width: 15
    },
    {
      caption: 'PMO',
      type: 'number',
      width: 15
    }
  ];

  var sql = "DECLARE @idfechafinal int;"+
    "SELECT TOP 1 @idfechafinal=id FROM sip.parametro WHERE tipo='tipofecha' ORDER BY valor DESC; "+
    "select a.nombre Iniciativa, b.nombre, b.estado, c.glosa, "+
    "c.parainscripcion Inscrita, CONVERT(VARCHAR(10),d.fecha,110) FechaEntrega, b.pmoresponsable FROM  sip.iniciativa a "+
    "LEFT JOIN sip.iniciativaprograma b ON a.id=b.idiniciativa LEFT JOIN sip.presupuestoiniciativa c "+ 
    "ON b.id=c.idiniciativaprograma LEFT JOIN sip.iniciativafecha d ON b.id=d.idiniciativaprograma "+
    "AND d.idtipofecha=@idfechafinal ";

  sequelize.query(sql)
    .spread(function (proyecto) {
      var arr = []
      for (var i = 0; i < proyecto.length; i++) {

        a = [i + 1, proyecto[i].Iniciativa,
          proyecto[i].nombre,
          proyecto[i].estado,
          proyecto[i].glosa,
          proyecto[i].Inscrita,
          proyecto[i].FechaEntrega,
          proyecto[i].pmoresponsable
        ];
        arr.push(a);
      }
      conf.rows = arr;

      var result = nodeExcel.execute(conf);
      res.setHeader('Content-Type', 'application/vnd.openxmlformates');
      res.setHeader("Content-Disposition", "attachment;filename=" + "EstadoInciativas.xlsx");
      res.end(result, 'binary');

    }).catch(function (err) {
      console.log(err);
      res.json({ error_code: 100 });
    });

};


exports.getInciativaConsulta = function (req, res) {
  var page = req.query.page;
  var rowspp = req.query.rows;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var filters = req.query.filters;
  var condition = "";

  if (!sidx)
    sidx = "a.[id]";

  if (!sord)
    sord = "asc";

  var order = sidx + " " + sord;
  
  if (filters) {
    var jsonObj = JSON.parse(filters);
    if (JSON.stringify(jsonObj.rules) != '[]') {
      jsonObj.rules.forEach(function (item) {
        if (item.op === 'cn') {
          if (item.field=='Iniciativa') {
            condition += "a.nombre like '%" + item.data + "%' AND ";
          } else if (item.field=='nombre' || item.field=='estado' || item.field=='pmoresponsable') {
            condition += 'b.' + item.field + " like '%" + item.data + "%' AND ";
          }  else if (item.field=='glosa' ) {
            condition += 'c.' + item.field + " like '%" + item.data + "%' AND ";
          }
          
        }
      });
      condition = condition.substring(0, condition.length - 5);
      console.log("***CONDICION:" + condition);
    }
  }
  var sqlcount = "DECLARE @idfechafinal int;"+
  "SELECT TOP 1 @idfechafinal=id FROM sip.parametro WHERE tipo='tipofecha' ORDER BY valor DESC;"+ 
  "SELECT count(*) AS count FROM  sip.iniciativa a "+
  "LEFT JOIN sip.iniciativaprograma b ON a.id=b.idiniciativa LEFT JOIN sip.presupuestoiniciativa c "+ 
  "ON b.id=c.idiniciativaprograma LEFT JOIN sip.iniciativafecha d ON b.id=d.idiniciativaprograma "+
  "AND d.idtipofecha=@idfechafinal "; 
  if (filters && condition != "") {
    sqlcount += "WHERE " + condition + " ";
  }

  var sqlok = "DECLARE @idfechafinal int;"+
    "SELECT TOP 1 @idfechafinal=id FROM sip.parametro WHERE tipo='tipofecha' ORDER BY valor DESC; "+
    "declare @rowsPerPage as bigint; " +
    "declare @pageNum as bigint;" +
    "set @rowsPerPage=" + rowspp + "; " +
    "set @pageNum=" + page + ";   " +
    "With SQLPaging As   ( " +
    "Select Top(@rowsPerPage * @pageNum) ROW_NUMBER() OVER (ORDER BY " + order + ") " +
    "as resultNum, a.nombre Iniciativa, b.nombre, b.estado, c.glosa, "+
    "c.parainscripcion Inscrita, d.fecha FechaEntrega, b.pmoresponsable FROM  sip.iniciativa a "+
    "LEFT JOIN sip.iniciativaprograma b ON a.id=b.idiniciativa LEFT JOIN sip.presupuestoiniciativa c "+ 
    "ON b.id=c.idiniciativaprograma LEFT JOIN sip.iniciativafecha d ON b.id=d.idiniciativaprograma "+
    "AND d.idtipofecha=@idfechafinal ";
    if (filters && condition != "") {
      console.log("**" + condition + "**");
      sqlok += "WHERE " + condition + " ";
    }    
    sqlok += ") " +
    "select * from SQLPaging with (nolock) where resultNum > ((@pageNum - 1) * @rowsPerPage);";
    console.log("SQL:"+sqlcount);
    sequelize.query(sqlcount).spread(function (recs) {
      var records = recs[0].count;
      var total = Math.ceil(parseInt(recs[0].count) / rowspp);
      console.log("Total:"+total+ "recs[0].count:"+recs[0].count);
      console.log("SQL:"+sqlok);
      sequelize.query(sqlok).spread(function (rows) {
        res.json({ records: records, total: total, page: page, rows: rows });
      });
    });
};


exports.getWord = function (req, res) {
  var page = req.query.page;
  var rows = req.query.rows;
  var filters = req.query.filters;
  var sidx = req.query.sidx;
  var sord = req.query.sord;
  var condition = "";
  console.log("En getWord");
 
  var texto = "";
  texto += "<html>";
  texto += "<head>";
  texto += '<META HTTP-EQUIV="Content-Type" CONTENT="text/html; charset=UTF-8">';
  texto += "<meta name=ProgId content=Word.Document>";
  texto += '<meta name=Generator content="Microsoft Word 9">';
  texto += '<meta name=Originator content="Microsoft Word 9">';
  texto += "<style>";
  texto += "@page Section1 {size:595.45pt 1007.7pt; margin:1.50in 1,25in 2.00in 1.00in;mso-header-margin:.5in;mso-footer-margin:.5in;mso-paper-source:0;font-family:Verdana;font-size:11pt;}";
  texto += "div.Section1 {page:Section1;}";
  texto += "</style>";
  texto += "</head>";
  texto += "<body>";
  texto += '<div class="Section1">';
  texto += '<table width="600" border="0" cellpadding="0" cellspacing="0" style="font-family:Verdana;font-size:11pt;" >';
  texto += '<tr><td width="50">PROCEDIMIENTO:</td><td colspan="2" width="550"><b>EJECUTIVO</b></td></tr>';
  texto += '<tr><td width="50" valign="top">MATERIA:</td><td colspan="2" width="550"><b> JUCIO LABORAL </b></td></tr>';
  texto += '<tr><td width="50">DEMANDANTE:</td><td width="400"><b>BANCO SCOTIABANK CHILE</b></td><td width="150"><b>RUT 97.018.000-1</b></td></tr>';
  texto += '<tr><td width="50">PATROCINANTE:</td><td width="400"><b>JORGE MONTES BEZANILLA</b></td><td width="150"><b>RUT 5.892.163-7</b></td></tr>';
  texto += '<tr><td width="50">APODERADO:</td><td width="400"><b>MARÍA PAZ MONTES BEZANILLA</b></td><td width="150"><b>RUT 6.971.644-K</b></td></tr>';
  texto += '<tr><td width="50" valign="top">DEMANDADO:</td><td colspan="2" width="550"> OTRO CAMPO DESDE LA BD</td></tr>';
  texto += '<tr><td colspan="3"><hr /></td><tr>';
  texto += '<tr><td colspan="3">';  
  texto += "<p>En lo principal, demanda ejecutiva y mandamiento de ejecución y embargo; en el primer otrosí, señala bienes para la traba de embargo y depositarios provisionales; en el segundo, acompaña documentos, con citación; en el tercero, patrocinio y poder";
  texto += ".</p>";
  texto += "</body>";
  texto += "</html>";


      res.setHeader('Content-Type', 'application/msword');
      res.setHeader('Charset', 'UTF-8');
      res.setHeader("Content-Disposition", "attachment;filename=" + "EstadoInciativas.doc");
      res.end(texto, 'utf8');

};
