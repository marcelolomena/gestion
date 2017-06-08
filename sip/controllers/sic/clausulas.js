var models = require('../../models');
var sequelize = require('../../models/index').sequelize;
var utilSeq = require('../../utils/seq');
var logger = require("../../utils/logger");
var bitacora = require("../../utils/bitacora");
var path = require('path');
var fs = require('fs');

exports.action = function (req, res) {
	var action = req.body.oper;
	switch (action) {
		case "add":
			models.clausulas.create({
				idsolicitudcotizacion: req.body.idsolicitudcotizacion,
				idplantillaclausula: req.body.idclausulaplantilla,
				idcuerpoclausula: req.body.idcuerpoclausula,
				titulo: req.body.titulo,
				glosa: req.body.glosa,
				tipoadjunto: req.body.tipoadjunto,
				nombreadjunto: req.body.nombreadjunto,
				borrado: 1
			}).then(function (clausulas) {
				bitacora.registrar(
					req.body.idsolicitudcotizacion,
					'clausulas',
					clausulas.id,
					'insert',
					req.session.passport.user,
					new Date(),
					models.clausulas,
					function (err, data) {
						if (!err) {
							return res.json({ id: clausulas.id, parent: req.body.idsolicitudcotizacion, message: 'Inicio carga', success: true });
						} else {
							logger.error(err)
							return res.json({ id: clausulas.id, parent: req.body.idsolicitudcotizacion, message: 'Falla', success: false });
						}
					});
			}).catch(function (err) {
				logger.error(err)
				res.json({ error: 1, glosa: err.message });
			});
			break;
		case "edit":
			bitacora.registrar(
				req.body.idsolicitudcotizacion,
				'clausulas',
				req.body.id,
				'update',
				req.session.passport.user,
				new Date(),
				models.clausulas,
				function (err, data) {
					if (!err) {
						models.clausulas.update({
							titulo: req.body.titulo,
							glosa: req.body.glosa,
						}, {
								where: {
									id: req.body.id
								}
							}).then(function (clausulas) {
								res.json({ id: req.body.id, parent: req.body.idsolicitudcotizacion, message: 'Inicio carga', success: true });
							}).catch(function (err) {
								logger.error(err)
								res.json({ message: err.message, success: false });
							});
					} else {
						logger.error(err)
						return res.json({ message: err.message, success: false });
					}
				});
			break;
		case "del":
			models.clausulas.findAll({
				where: {
					id: req.body.id
				}
			}).then(function (clausulas) {
				bitacora.registrar(
					req.body.idsolicitudcotizacion,
					'clausulas',
					req.body.id,
					'delete',
					req.session.passport.user,
					new Date(),
					models.clausulas,
					function (err, data) {
						if (!err) {
							models.clausulas.destroy({
								where: {
									id: req.body.id
								}
							}).then(function (rowDeleted) {
								return res.json({ message: '', success: true });
							}).catch(function (err) {
								logger.error(err)
								res.json({ message: err.message, success: false });
							});
						} else {
							logger.error(err)
							return res.json({ message: err.message, success: false });
						}
					});
			});
			break;
	}
}

exports.list = function (req, res) {

	var page = req.query.page;
	var rows = req.query.rows;
	var filters = req.query.filters;
	var sidx = req.query.sidx;
	var sord = req.query.sord;

	if (!sidx)
		sidx = "id";

	if (!sord)
		sord = "asc";

	var additional = [{
		"field": "idsolicitudcotizacion",
		"op": "eq",
		"data": req.params.id
	}];


	utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
		if (data) {
			models.clausulas.belongsTo(models.solicitudcotizacion, { foreignKey: 'idsolicitudcotizacion' });
			models.clausulas.belongsTo(models.cuerpoclausula, { foreignKey: 'idcuerpoclausula' });
			models.clausulas.belongsTo(models.plantillaclausula, { foreignKey: 'idplantillaclausula' });
			models.clausulas.belongsTo(models.valores, { foreignKey: 'tipoadjunto' });
			models.plantillaclausula.belongsTo(models.clase, { foreignKey: 'idclase' })

			models.clausulas.count({
				where: data,
				include: [{
					model: models.solicitudcotizacion
				}, {
					model: models.valores
				},
				{ model: models.cuerpoclausula, where: { anexo: 0 } },
				{

					model: models.plantillaclausula,
					include: [
						{ model: models.clase },

					]
				}
				]
			}).then(function (records) {
				var total = Math.ceil(records / rows);
				models.clausulas.findAll({
					offset: parseInt(rows * (page - 1)),
					limit: parseInt(rows),
					//order: 'secuencia, codigo',
					where: data,
					include: [{
						model: models.solicitudcotizacion
					}, {
						model: models.valores
					},
					{ model: models.cuerpoclausula, where: { anexo: 0 } },
					{

						model: models.plantillaclausula,
						include: [
							{ model: models.clase },

						]
					}
					]
				}).then(function (clausulas) {
					return res.json({ records: records, total: total, page: page, rows: clausulas });
				}).catch(function (err) {
					logger.error(err.message);
					res.json({ error_code: 1 });
				});
			}).catch(function (err) {
				logger.error(err.message);
				res.json({ error_code: 1 });
			});

		}
	});

}
/*
exports.clases = function (req, res) {

	models.clase.findAll({
		attributes: [['id', 'id'], ['titulo', 'nombre']],
	}).then(function (clases) {
		return res.json(clases);
	}).catch(function (err) {
		logger.error(err.message);
		res.json({ error_code: 1 });
	});

}

exports.plantillas = function (req, res) {

	models.plantillaclausula.findAll({
		order: 'id ASC',
		attributes: ['id', 'codigo'],
		where: { idclase: req.params.id }
	}).then(function (plantillas) {
		return res.json(plantillas);
	}).catch(function (err) {
		logger.error(err.message);
		res.json({ error_code: 1 });
	});

}
*/

exports.clases = function (req, res) {
	sequelize.query(
		'select distinct a.id, a.titulo from sic.clase a  ' +
		'join sic.plantillaclausula b on a.id=b.idclase ' +
		'join sic.cuerpoclausula c on c.idplantillaclausula=b.id ' +
		'where c.anexo = 0 ',
		{ type: sequelize.QueryTypes.SELECT }
	).then(function (valores) {
		//logger.debug(valores)
		res.json(valores);
	}).catch(function (err) {
		logger.error(err);
		res.json({ error: 1 });
	});

}

exports.plantillas = function (req, res) {
	var id = req.params.id;

	sequelize.query(
		'select distinct a.id, a.codigo  from sic.plantillaclausula a   ' +
		'join sic.cuerpoclausula b on b.idplantillaclausula=a.id ' +
		'join sic.clase c on c.id=a.idclase ' +
		'where b.anexo = 0 and c.id=:id ',
		{ replacements: { id: id }, type: sequelize.QueryTypes.SELECT }
	).then(function (valores) {
		//logger.debug(valores)
		res.json(valores);
	}).catch(function (err) {
		logger.error(err);
		res.json({ error: 1 });
	});

}

exports.texto = function (req, res) {
	models.cuerpoclausula.belongsTo(models.valores, { foreignKey: 'tipoadjunto' });
	models.cuerpoclausula.findAll({
		where: { idplantillaclausula: req.params.id, idgrupo: req.params.gid },
		include: [
			{
				model: models.valores
			}]
	}).then(function (plantillas) {
		if (plantillas != "") {
			return res.json(plantillas);
		} else {
			models.cuerpoclausula.findAll({
				where: { idplantillaclausula: req.params.id, idgrupo: 15 },
				include: [
					{
						model: models.valores
					}]
			}).then(function (plantillapordefecto) {
				return res.json(plantillapordefecto);
			}).catch(function (err) {
				logger.error(err.message);
				res.json({ error_code: 1 });
			});
		}
	}).catch(function (err) {
		logger.error(err.message);
		res.json({ error_code: 1 });
	});
}

exports.download = function (req, res) {
	models.clausulas.belongsTo(models.solicitudcotizacion, { foreignKey: 'idsolicitudcotizacion' });
	models.clausulas.belongsTo(models.plantillaclausula, { foreignKey: 'idplantillaclausula' });
	models.plantillaclausula.belongsTo(models.clase, { foreignKey: 'idclase' })
	models.plantillaclausula.hasMany(models.cuerpoclausula, { constraints: false, foreignKey: 'idplantillaclausula' });

	models.clausulas.findAll({
		//order: 'secuencia, codigo',
		attributes: [['titulo', 'titulo'], ['glosa', 'glosa']],
		where: { idsolicitudcotizacion: req.params.id },
		include: [
			{
				attributes: [['descripcion', 'descripcion']],
				model: models.solicitudcotizacion
			}, {
				model: models.plantillaclausula,
				include: [
					{ model: models.clase },
					{ model: models.cuerpoclausula, where: { anexo: 0 } }
				]
			}
		]
	}).then(function (clausulas) {
		//console.dir(clausulas)
		//logger.debug(clausulas.titulo)

		var result = `
				<apex:page sidebar="false" contentType="application/msword" cache="true">
					<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='<a target="_blank" href="http://www.w3.org/TR/REC-html40'" rel="nofollow">http://www.w3.org/TR/REC-html40'</a>>
		<head>
		<meta http-equiv=Content-Type content="text/html;">
		<meta charset='utf-8'>
		<meta name=Generator content="Microsoft Word 15 (filtered)">
		<title>Automatización Swift MT300 y Pagos Masivos vía Swift MT101</title>
		<link type="text/css" href="http://localhost:3000/stylesheets/word.css">
		<style>
		<!--
		
		 @font-face
			{font-family:Wingdings;
			panose-1:5 0 0 0 0 0 0 0 0 0;}
		@font-face
			{font-family:"Cambria Math";
			panose-1:2 4 5 3 5 4 6 3 2 4;}
		@font-face
			{font-family:Calibri;
			panose-1:2 15 5 2 2 2 4 3 2 4;}
		@font-face
			{font-family:Verdana;
			panose-1:2 11 6 4 3 5 4 4 2 4;}
		@font-face
			{font-family:Cambria;
			panose-1:2 4 5 3 5 4 6 3 2 4;}
		@font-face
			{font-family:Consolas;
			panose-1:2 11 6 9 2 2 4 3 2 4;}
		@font-face
			{font-family:Tahoma;
			panose-1:2 11 6 4 3 5 4 4 2 4;}
		
		 p.MsoNormal, li.MsoNormal, div.MsoNormal
			{margin-top:0cm;
			margin-right:0cm;
			margin-bottom:10.0pt;
			margin-left:19.85pt;
			text-align:justify;
			line-height:115%;
			font-size:11.0pt;
			font-family:"Calibri",sans-serif;}
		h1
			{mso-style-link:"Título 1 Car";
			margin-top:24.0pt;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:21.6pt;
			margin-bottom:.0001pt;
			text-align:justify;
			text-indent:-21.6pt;
			line-height:115%;
			page-break-after:avoid;
			font-size:14.0pt;
			font-family:"Cambria",serif;
			color:#365F91;}
		h2
			{mso-style-link:"Título 2 Car";
			margin-top:10.0pt;
			margin-right:0cm;
			margin-bottom:6.0pt;
			margin-left:28.8pt;
			text-align:justify;
			text-indent:-28.8pt;
			line-height:115%;
			page-break-after:avoid;
			font-size:13.0pt;
			font-family:"Cambria",serif;
			color:#4F81BD;}
		h3
			{mso-style-link:"Título 3 Car";
			margin-top:10.0pt;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:36.0pt;
			margin-bottom:.0001pt;
			text-align:justify;
			text-indent:-36.0pt;
			line-height:115%;
			page-break-after:avoid;
			font-size:11.0pt;
			font-family:"Cambria",serif;
			color:#4F81BD;}
		h4
			{mso-style-link:"Título 4 Car";
			margin-top:12.0pt;
			margin-right:0cm;
			margin-bottom:3.0pt;
			margin-left:43.2pt;
			text-align:justify;
			text-indent:-43.2pt;
			page-break-after:avoid;
			font-size:11.0pt;
			font-family:"Calibri",sans-serif;
			color:#4F81BD;}
		h5
			{mso-style-link:"Título 5 Car";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:50.4pt;
			margin-bottom:.0001pt;
			text-align:justify;
			text-indent:-50.4pt;
			line-height:115%;
			page-break-after:avoid;
			font-size:11.0pt;
			font-family:"Cambria",serif;
			color:#243F60;
			font-weight:normal;}
		h6
			{mso-style-link:"Título 6 Car";
			margin-top:10.0pt;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:57.6pt;
			margin-bottom:.0001pt;
			text-align:justify;
			text-indent:-57.6pt;
			line-height:115%;
			page-break-after:avoid;
			font-size:11.0pt;
			font-family:"Cambria",serif;
			color:#243F60;
			font-weight:normal;
			font-style:italic;}
		p.MsoHeading7, li.MsoHeading7, div.MsoHeading7
			{mso-style-link:"Título 7 Car";
			margin-top:10.0pt;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:64.8pt;
			margin-bottom:.0001pt;
			text-align:justify;
			text-indent:-64.8pt;
			line-height:115%;
			page-break-after:avoid;
			font-size:11.0pt;
			font-family:"Cambria",serif;
			color:#404040;
			font-style:italic;}
		p.MsoHeading8, li.MsoHeading8, div.MsoHeading8
			{mso-style-link:"Título 8 Car";
			margin-top:10.0pt;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:72.0pt;
			margin-bottom:.0001pt;
			text-align:justify;
			text-indent:-72.0pt;
			page-break-after:avoid;
			font-size:10.0pt;
			font-family:"Cambria",serif;
			color:#404040;}
		p.MsoHeading9, li.MsoHeading9, div.MsoHeading9
			{mso-style-link:"Título 9 Car";
			margin-top:10.0pt;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:79.2pt;
			margin-bottom:.0001pt;
			text-align:justify;
			text-indent:-79.2pt;
			line-height:115%;
			page-break-after:avoid;
			font-size:10.0pt;
			font-family:"Cambria",serif;
			color:#404040;
			font-style:italic;}
		p.MsoToc1, li.MsoToc1, div.MsoToc1
			{margin-top:12.0pt;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:11.9pt;
			margin-bottom:.0001pt;
			font-size:12.0pt;
			font-family:"Times New Roman",serif;}
		p.MsoToc2, li.MsoToc2, div.MsoToc2
			{margin-top:3.0pt;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:11.9pt;
			margin-bottom:.0001pt;
			text-align:justify;
			font-size:12.0pt;
			font-family:"Times New Roman",serif;}
		p.MsoToc3, li.MsoToc3, div.MsoToc3
			{margin-top:0cm;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:24.0pt;
			margin-bottom:.0001pt;
			text-align:justify;
			font-size:12.0pt;
			font-family:"Times New Roman",serif;}
		p.MsoCommentText, li.MsoCommentText, div.MsoCommentText
			{mso-style-link:"Texto comentario Car";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:10.0pt;
			margin-left:19.85pt;
			text-align:justify;
			font-size:10.0pt;
			font-family:"Calibri",sans-serif;}
		p.MsoHeader, li.MsoHeader, div.MsoHeader
			{mso-style-link:"Encabezado Car";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:19.85pt;
			margin-bottom:.0001pt;
			text-align:justify;
			font-size:12.0pt;
			font-family:"Times New Roman",serif;}
		p.MsoFooter, li.MsoFooter, div.MsoFooter
			{mso-style-link:"Pie de página Car";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:19.85pt;
			margin-bottom:.0001pt;
			text-align:justify;
			font-size:12.0pt;
			font-family:"Times New Roman",serif;}
		p.MsoTitle, li.MsoTitle, div.MsoTitle
			{mso-style-link:"Puesto Car";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:15.0pt;
			margin-left:19.85pt;
			text-align:justify;
			border:none;
			padding:0cm;
			font-size:26.0pt;
			font-family:"Cambria",serif;
			color:#17365D;
			letter-spacing:.25pt;}
		p.MsoTitleCxSpFirst, li.MsoTitleCxSpFirst, div.MsoTitleCxSpFirst
			{mso-style-link:"Puesto Car";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:19.85pt;
			margin-bottom:.0001pt;
			text-align:justify;
			border:none;
			padding:0cm;
			font-size:26.0pt;
			font-family:"Cambria",serif;
			color:#17365D;
			letter-spacing:.25pt;}
		p.MsoTitleCxSpMiddle, li.MsoTitleCxSpMiddle, div.MsoTitleCxSpMiddle
			{mso-style-link:"Puesto Car";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:19.85pt;
			margin-bottom:.0001pt;
			text-align:justify;
			border:none;
			padding:0cm;
			font-size:26.0pt;
			font-family:"Cambria",serif;
			color:#17365D;
			letter-spacing:.25pt;}
		p.MsoTitleCxSpLast, li.MsoTitleCxSpLast, div.MsoTitleCxSpLast
			{mso-style-link:"Puesto Car";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:15.0pt;
			margin-left:19.85pt;
			text-align:justify;
			border:none;
			padding:0cm;
			font-size:26.0pt;
			font-family:"Cambria",serif;
			color:#17365D;
			letter-spacing:.25pt;}
		p.MsoBodyText, li.MsoBodyText, div.MsoBodyText
			{mso-style-link:"Texto independiente Car";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:6.0pt;
			margin-left:19.85pt;
			text-align:justify;
			line-height:115%;
			font-size:11.0pt;
			font-family:"Calibri",sans-serif;}
		p.MsoSubtitle, li.MsoSubtitle, div.MsoSubtitle
			{mso-style-link:"Subtítulo Car";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:10.0pt;
			margin-left:19.85pt;
			text-align:justify;
			line-height:115%;
			font-size:12.0pt;
			font-family:"Cambria",serif;
			color:#4F81BD;
			letter-spacing:.75pt;
			font-style:italic;}
		p.MsoBodyText2, li.MsoBodyText2, div.MsoBodyText2
			{mso-style-link:"Texto independiente 2 Car";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:6.0pt;
			margin-left:19.85pt;
			text-align:justify;
			line-height:200%;
			font-size:12.0pt;
			font-family:"Times New Roman",serif;}
		a:link, span.MsoHyperlink
			{color:blue;
			text-decoration:underline;}
		a:visited, span.MsoHyperlinkFollowed
			{color:purple;
			text-decoration:underline;}
		p.MsoPlainText, li.MsoPlainText, div.MsoPlainText
			{mso-style-link:"Texto sin formato Car";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:19.85pt;
			margin-bottom:.0001pt;
			text-align:justify;
			font-size:10.5pt;
			font-family:Consolas;}
		p.MsoCommentSubject, li.MsoCommentSubject, div.MsoCommentSubject
			{mso-style-link:"Asunto del comentario Car";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:10.0pt;
			margin-left:19.85pt;
			text-align:justify;
			font-size:10.0pt;
			font-family:"Calibri",sans-serif;
			font-weight:bold;}
		p.MsoAcetate, li.MsoAcetate, div.MsoAcetate
			{mso-style-link:"Texto de globo Car";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:19.85pt;
			margin-bottom:.0001pt;
			text-align:justify;
			font-size:8.0pt;
			font-family:"Tahoma",sans-serif;}
		p.MsoNoSpacing, li.MsoNoSpacing, div.MsoNoSpacing
			{mso-style-link:"Sin espaciado Car";
			margin:0cm;
			margin-bottom:.0001pt;
			font-size:11.0pt;
			font-family:"Calibri",sans-serif;}
		p.MsoRMPane, li.MsoRMPane, div.MsoRMPane
			{margin:0cm;
			margin-bottom:.0001pt;
			font-size:11.0pt;
			font-family:"Calibri",sans-serif;}
		p.MsoListParagraph, li.MsoListParagraph, div.MsoListParagraph
			{margin-top:0cm;
			margin-right:0cm;
			margin-bottom:12.0pt;
			margin-left:72.0pt;
			text-align:justify;
			text-indent:-18.0pt;
			font-size:11.0pt;
			font-family:"Calibri",sans-serif;}
		p.MsoListParagraphCxSpFirst, li.MsoListParagraphCxSpFirst, div.MsoListParagraphCxSpFirst
			{margin-top:0cm;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:72.0pt;
			margin-bottom:.0001pt;
			text-align:justify;
			text-indent:-18.0pt;
			font-size:11.0pt;
			font-family:"Calibri",sans-serif;}
		p.MsoListParagraphCxSpMiddle, li.MsoListParagraphCxSpMiddle, div.MsoListParagraphCxSpMiddle
			{margin-top:0cm;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:72.0pt;
			margin-bottom:.0001pt;
			text-align:justify;
			text-indent:-18.0pt;
			font-size:11.0pt;
			font-family:"Calibri",sans-serif;}
		p.MsoListParagraphCxSpLast, li.MsoListParagraphCxSpLast, div.MsoListParagraphCxSpLast
			{margin-top:0cm;
			margin-right:0cm;
			margin-bottom:12.0pt;
			margin-left:72.0pt;
			text-align:justify;
			text-indent:-18.0pt;
			font-size:11.0pt;
			font-family:"Calibri",sans-serif;}
		span.MsoIntenseEmphasis
			{color:#4F81BD;
			font-weight:bold;
			font-style:italic;}
		span.MsoBookTitle
			{font-family:"Calibri",sans-serif;
			font-variant:small-caps;
			color:#365F91;
			letter-spacing:.25pt;
			font-weight:normal;}
		p.MsoTocHeading, li.MsoTocHeading, div.MsoTocHeading
			{margin-top:24.0pt;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:21.6pt;
			margin-bottom:.0001pt;
			text-align:justify;
			text-indent:-21.6pt;
			line-height:115%;
			page-break-after:avoid;
			font-size:14.0pt;
			font-family:"Cambria",serif;
			color:#365F91;
			font-weight:bold;}
		span.Ttulo1Car
			{mso-style-name:"Título 1 Car";
			mso-style-link:"Título 1";
			font-family:"Cambria",serif;
			color:#365F91;
			font-weight:bold;}
		span.Ttulo2Car
			{mso-style-name:"Título 2 Car";
			mso-style-link:"Título 2";
			font-family:"Cambria",serif;
			color:#4F81BD;
			font-weight:bold;}
		span.Ttulo3Car
			{mso-style-name:"Título 3 Car";
			mso-style-link:"Título 3";
			font-family:"Cambria",serif;
			color:#4F81BD;
			font-weight:bold;}
		span.TextosinformatoCar
			{mso-style-name:"Texto sin formato Car";
			mso-style-link:"Texto sin formato";
			font-family:Consolas;}
		span.TextodegloboCar
			{mso-style-name:"Texto de globo Car";
			mso-style-link:"Texto de globo";
			font-family:"Tahoma",sans-serif;}
		span.TableTextChar
			{mso-style-name:"Table Text Char";
			mso-style-link:"Table Text";
			font-family:"Calibri",sans-serif;}
		p.TableText, li.TableText, div.TableText
			{mso-style-name:"Table Text";
			mso-style-link:"Table Text Char";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:19.85pt;
			margin-bottom:.0001pt;
			text-align:justify;
			font-size:12.0pt;
			font-family:"Calibri",sans-serif;}
		span.Textoindependiente2Car
			{mso-style-name:"Texto independiente 2 Car";
			mso-style-link:"Texto independiente 2";
			font-family:"Times New Roman",serif;}
		span.PiedepginaCar
			{mso-style-name:"Pie de página Car";
			mso-style-link:"Pie de página";
			font-family:"Times New Roman",serif;}
		span.EncabezadoCar
			{mso-style-name:"Encabezado Car";
			mso-style-link:Encabezado;
			font-family:"Times New Roman",serif;}
		p.Default, li.Default, div.Default
			{mso-style-name:Default;
			margin:0cm;
			margin-bottom:.0001pt;
			text-autospace:none;
			font-size:12.0pt;
			font-family:"Arial",sans-serif;
			color:black;}
		span.SubttuloCar
			{mso-style-name:"Subtítulo Car";
			mso-style-link:Subtítulo;
			font-family:"Cambria",serif;
			color:#4F81BD;
			letter-spacing:.75pt;
			font-style:italic;}
		span.Ttulo4Car
			{mso-style-name:"Título 4 Car";
			mso-style-link:"Título 4";
			font-family:"Calibri",sans-serif;
			color:#4F81BD;
			font-weight:bold;}
		p.clausula, li.clausula, div.clausula
			{mso-style-name:clausula;
			margin-top:6.0pt;
			margin-right:0cm;
			margin-bottom:6.0pt;
			margin-left:9.0pt;
			text-align:justify;
			font-size:10.0pt;
			font-family:"Verdana",sans-serif;}
		span.TextoindependienteCar
			{mso-style-name:"Texto independiente Car";
			mso-style-link:"Texto independiente";}
		p.Bullet3, li.Bullet3, div.Bullet3
			{mso-style-name:"Bullet 3";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:19.85pt;
			margin-bottom:.0001pt;
			text-align:justify;
			punctuation-wrap:simple;
			text-autospace:none;
			font-size:10.0pt;
			font-family:"Arial",sans-serif;}
		span.Ttulo8Car
			{mso-style-name:"Título 8 Car";
			mso-style-link:"Título 8";
			font-family:"Cambria",serif;
			color:#404040;}
		span.SinespaciadoCar
			{mso-style-name:"Sin espaciado Car";
			mso-style-link:"Sin espaciado";
			font-family:"Times New Roman",serif;}
		span.PuestoCar
			{mso-style-name:"Puesto Car";
			mso-style-link:Puesto;
			font-family:"Cambria",serif;
			color:#17365D;
			letter-spacing:.25pt;}
		p.8EAA14224D814626B5601D20B9208574, li.8EAA14224D814626B5601D20B9208574, div.8EAA14224D814626B5601D20B9208574
			{mso-style-name:8EAA14224D814626B5601D20B9208574;
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:10.0pt;
			margin-left:0cm;
			line-height:115%;
			font-size:11.0pt;
			font-family:"Calibri",sans-serif;}
		span.Ttulo5Car
			{mso-style-name:"Título 5 Car";
			mso-style-link:"Título 5";
			font-family:"Cambria",serif;
			color:#243F60;}
		span.Ttulo6Car
			{mso-style-name:"Título 6 Car";
			mso-style-link:"Título 6";
			font-family:"Cambria",serif;
			color:#243F60;
			font-style:italic;}
		span.Ttulo7Car
			{mso-style-name:"Título 7 Car";
			mso-style-link:"Título 7";
			font-family:"Cambria",serif;
			color:#404040;
			font-style:italic;}
		span.Ttulo9Car
			{mso-style-name:"Título 9 Car";
			mso-style-link:"Título 9";
			font-family:"Cambria",serif;
			color:#404040;
			font-style:italic;}
		span.TextocomentarioCar
			{mso-style-name:"Texto comentario Car";
			mso-style-link:"Texto comentario";}
		span.AsuntodelcomentarioCar
			{mso-style-name:"Asunto del comentario Car";
			mso-style-link:"Asunto del comentario";
			font-weight:bold;}
		.MsoChpDefault
			{font-family:"Calibri",sans-serif;}
		.MsoPapDefault
			{margin-bottom:10.0pt;
			line-height:115%;}
		
		 @page WordSection1
			{size:612.0pt 792.0pt;
			margin:70.9pt 59.25pt 70.9pt 78.0pt;}
		div.WordSection1
			{page:WordSection1;}
		
		 ol
			{margin-bottom:0cm;}
		ul
			{margin-bottom:0cm;}
		-->
		</style>
		
		</head>
		
		<body lang=ES link=blue vlink=purple>
		
		<div class=WordSection1>
		
		<p class=MsoNormal align=center style='text-align:center'><b><span lang=ES-MX>&nbsp;</span></b></p>
		
		<div align=center>
		
		<table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0 width="100%"
		 style='width:100.0%;border-collapse:collapse'>
		 <tr style='height:144.0pt'>
		  <td width="100%" valign=top style='width:100.0%;padding:0cm 5.4pt 0cm 5.4pt;
		  height:144.0pt'>
		  <p class=MsoNoSpacing align=center style='text-align:center'><span
		  style='font-size:18.0pt'><img width=315 height=86 id="Imagen 9"
		  src="http://localhost:3000/images/bancodechile.jpg"></span></p>
		  </td>
		 </tr>
		 <tr style='height:72.0pt'>
		  <td width="100%" style='width:100.0%;border:none;border-bottom:solid #4F81BD 1.0pt;
		  padding:0cm 5.4pt 0cm 5.4pt;height:72.0pt'>
		  <div style='border:none;border-bottom:solid #4F81BD 1.0pt;padding:0cm 0cm 4.0pt 0cm;
		  margin-left:19.85pt;margin-right:0cm'>
		  <p class=MsoTitle align=center style='margin-left:0cm;text-align:center'><span
		  lang=ES-CL>
		  `
		result += clausulas[0].solicitudcotizacion.descripcion

		result += `
		  </span></p>
		  </div>
		  </td>
		 </tr>
		 <tr style='height:36.0pt'>
		  <td width="100%" style='width:100.0%;border:none;padding:0cm 5.4pt 0cm 5.4pt;
		  height:36.0pt'>
		  <div style='border:none;border-bottom:solid #4F81BD 1.0pt;padding:0cm 0cm 4.0pt 0cm;
		  margin-left:19.85pt;margin-right:0cm'>
		  <p class=MsoTitle align=center style='margin-left:0cm;text-align:center'><b><span
		  lang=ES-CL>BASES DE LICITACION N°</span></b></p>
		  </div>
		  </td>
		 </tr>
		 <tr style='height:18.0pt'>
		  <td width="100%" style='width:100.0%;padding:0cm 5.4pt 0cm 5.4pt;height:18.0pt'>
		  <p class=MsoNormal><span lang=ES-CL>&nbsp;</span></p>
		  </td>
		 </tr>
		 <tr style='height:102.45pt'>
		  <td width="100%" style='width:100.0%;padding:0cm 5.4pt 0cm 5.4pt;height:102.45pt'>
		  <p class=MsoNormal><span lang=ES-CL style='color:#17365D'>&nbsp;</span></p>
		  <h2 style='margin-left:36.0pt;text-indent:0cm'><span lang=ES-MX
		  style='color:#17365D'>&nbsp;</span></h2>
		  </td>
		 </tr>
		 <tr style='height:18.0pt'>
		  <td width="100%" style='width:100.0%;padding:0cm 5.4pt 0cm 5.4pt;height:18.0pt'>
		  <p class=MsoNormal align=center style='margin-left:0cm;text-align:center'><span
		  class=MsoBookTitle><b><span style='font-size:16.0pt;line-height:115%;
		  font-family:"Cambria",serif;font-variant:normal !important;color:#17365D;
		  text-transform:uppercase'><span style='mso-field-code: DATE '></span></span></b></span></p>
		  </td>
		 </tr>
		</table>
		
		</div>
		<span lang=ES-CL style='font-size:11.0pt;line-height:115%;font-family:"Calibri",sans-serif'><br
		clear=all style='page-break-before:always'>
		</span>
		
		<p class=MsoNormal align=left style='margin-left:0cm;text-align:left'><b><span
		lang=ES-CL style='font-size:14.0pt;line-height:115%;font-family:"Cambria",serif;
		color:#365F91'>&nbsp;</span></b></p>
						`
		/*		
						for (var f in clausulas) {
							var clase = clausulas[f].plantillaclausula.clase.nombre
							var code = clausulas[f].plantillaclausula.codigo
							if (!code) {
								throw new Error("No es posible generar el documento.")
							}
				
							var level = code.split(".");
							var nombrecorto = clausulas[f].plantillaclausula.nombrecorto;
				
							result += '<h1>' + clase + '</h1>'
				
							if (parseInt(level[0]) > 0 && parseInt(level[1]) == 0)
								result += '<h2>' + nombrecorto + '</h2>'
							else if (parseInt(level[0]) > 0 && parseInt(level[1]) > 0)
								result += '<h3>' + nombrecorto + '</h3>'
				
				
							result += clausulas[f].texto
							result += "<br/>"
				
						}
		*/
		var tituloclase = ''
		for (var f in clausulas) {
			if (clausulas[f].plantillaclausula.clase.titulo != tituloclase) {
				tituloclase = clausulas[f].plantillaclausula.clase.titulo
				logger.debug("EL TITULO: " + tituloclase);
				result += '<h1>' + tituloclase + '</h1>'
			}
			var titulo = clausulas[f].titulo
			var glosa = clausulas[f].glosa

			result += '<h2>' + titulo + '</h2>'

			result += '<p>' + glosa + '</p>'

			result += "<br/>"

		}
		result +=
			`
		</div>
		
		</body>
		
		</html>
		</apex:page>
		`

		var hdr = 'attachment; filename=RTF_' + Math.floor(Date.now()) + '.doc'
		res.setHeader('Content-disposition', hdr);
		res.set('Content-Type', 'application/msword;charset=utf-8');
		res.status(200).send(result);

	}).catch(function (err) {
		logger.error(err.message);
		res.status(500).send(err.message);
	});

}

exports.default = function (req, res) {
	//logger.debug(req.params.id)
	//logger.debug(req.params.gid)
	//logger.debug(req.params.tid)


	models.serviciosrequeridos.max('notacriticidad', {
		where: { idsolicitudcotizacion: req.params.id }
	}).then(function (notacriticidad) {
		models.toc.belongsTo(models.plantillaclausula, { foreignKey: 'idplantillaclausula' });
		models.toc.belongsTo(models.clase, { foreignKey: 'idclase' });
		models.plantillaclausula.hasMany(models.cuerpoclausula, { constraints: false, foreignKey: 'idplantillaclausula' });

		//logger.debug("notacriticidad :" + notacriticidad)
		var criticidad = notacriticidad === 3 ? 1 : 0;

		models.toc.findAll({
			attributes: [['id', 'id']],
			//order: 'id ASC',
			where: {
				idplantillaclausula: {
					$ne: null
				}, idtipoclausula: req.params.tid
			},
			include: [
				{
					attributes: [['id', 'id']],
					model: models.plantillaclausula,
					required: true,
					include: [{
						attributes: [
							['id', 'id'],
							['idplantillaclausula', 'idplantillaclausula'],
							['titulo', 'titulo'],
							['glosa', 'glosa'],
							['idgrupo', 'idgrupo'],
							['nombreadjunto', 'nombreadjunto'],
							['tipoadjunto', 'tipoadjunto']
						],
						model: models.cuerpoclausula,
						required: true,
					}
					]
				},
				{ attributes: [['titulo', 'titulo']], model: models.clase },
			],
			order: [[models.plantillaclausula, 'id', 'ASC'], [models.plantillaclausula, { model: models.cuerpoclausula }, 'idgrupo', 'asc']],
		}).then(function (clausulas) {
			//logger.debug("-------->AQUI VIENEN LAS CLAUSULAS")
			//console.dir(clausulas)
			var inClau = []

			for (var c in clausulas) {
				var cuerpoclausulas = clausulas[c].plantillaclausula.cuerpoclausulas

				for (var p in cuerpoclausulas) {
					logger.debug("LOS CUERPOS = " + cuerpoclausulas[p].titulo)
					logger.debug("grupo = " + cuerpoclausulas[p].idgrupo)
					var item = {}
					if (cuerpoclausulas[p].idgrupo == 15) {
						logger.debug("ES DEFAULT")
						item["idsolicitudcotizacion"] = req.params.id
						item["idplantillaclausula"] = cuerpoclausulas[p].idplantillaclausula
						item["idcuerpoclausula"] = cuerpoclausulas[p].id
						logger.debug("-------->ESTO ES LO QUE QUIERO: " + cuerpoclausulas[p].id)
						item["titulo"] = cuerpoclausulas[p].titulo
						item["glosa"] = cuerpoclausulas[p].glosa
						item["nombreadjunto"] = cuerpoclausulas[p].nombreadjunto
						item["tipoadjunto"] = cuerpoclausulas[p].tipoadjunto
						item["borrado"] = 1
						inClau.push(item)
					} else {
						logger.debug("NO ES DEFAULT")
						logger.debug("Y YO TENGO: " + req.params.gid)
						if (cuerpoclausulas[p].idgrupo == req.params.gid) {
							for (var i = 0; i < inClau.length; i++) {
								//logger.debug(inClau[i]["idplantillaclausula"])
								logger.debug("ENTRO AL FOR A BUSCAR LA CLAUSULA: " + cuerpoclausulas[p].titulo)
								if (inClau[i]["idplantillaclausula"] === cuerpoclausulas[p].idplantillaclausula) {
									//borrando el default 15 
									logger.debug("ENCONTRE LA CLAUSULA " + inClau[i]["titulo"] + " Y LA BORRO")
									inClau.splice(i)
									logger.debug("Y LA REEMPLAZO POR LA CLAUSULA " + cuerpoclausulas[p].titulo)
									item["idsolicitudcotizacion"] = req.params.id
									item["idplantillaclausula"] = cuerpoclausulas[p].idplantillaclausula
									item["titulo"] = cuerpoclausulas[p].titulo
									item["glosa"] = cuerpoclausulas[p].glosa
									item["idcuerpoclausula"] = cuerpoclausulas[p].id
									logger.debug("-------->ESTO ES LO QUE QUIERO 2: " + cuerpoclausulas[p].id)
									item["nombreadjunto"] = cuerpoclausulas[p].nombreadjunto
									item["tipoadjunto"] = cuerpoclausulas[p].tipoadjunto
									item["borrado"] = 1
									inClau.push(item)
								}
							}
						}
					}
				}
			}
			//console.dir(inClau)
			models.clausulas.bulkCreate(inClau).then(function (events) {
				return res.json({ message: 'Las cláusulas predefinidas fueron generadas', success: true });
			}).catch(function (err) {
				logger.error(err)
				res.json({ message: err.message, success: false });
			});

		}).catch(function (err) {
			logger.error(err.message);
			return res.json({ message: '', success: false });
		});

		/*


        models.plantillaclausula.findAll({
            attributes: [['id', 'idclausula'], ['glosaclausula', 'texto'], 'nombrecorto'],
            where: {
                idgrupo: req.params.gid,
                critica: criticidad
            },
        }).then(function (plantillas) {
            var clausulas = plantillas.map(function (plantilla) {
                var clausula = plantilla.toJSON();
                clausula['idsolicitudcotizacion'] = req.params.id;
                clausula['uid'] = req.session.passport.user;
                clausula['borrado'] = 1;
                return clausula;
            });

            models.clausulas.bulkCreate(clausulas).then(function (events) {
                res.json({ message: 'Las cláusulas predefinidas fueron generadas', success: true });
            }).catch(function (err) {
                logger.error(err)
                res.json({ message: err.message, success: false });
            });

        }).catch(function (err) {
            logger.error(err.message);
            res.json({ message: err.message, success: false });
        });
		*/

	}).catch(function (err) {
		logger.error(err.message);
	});


}
exports.defaulttoc = function (req, res) {
	//logger.debug(req.params.id)
	//logger.debug(req.params.gid)
	//logger.debug(req.params.tid)



	models.toc.belongsTo(models.plantillaclausula, { foreignKey: 'idplantillaclausula' });
	models.toc.belongsTo(models.clase, { foreignKey: 'idclase' });
	models.plantillaclausula.hasMany(models.cuerpoclausula, { constraints: false, foreignKey: 'idplantillaclausula' });

	models.toc.findAll({
		attributes: [['id', 'id']],
		//order: 'id ASC',
		where: {
			idplantillaclausula: {
				$ne: null
			}, idtipoclausula: 2
		},
		include: [
			{
				attributes: [['id', 'id']],
				model: models.plantillaclausula,
				required: true,
				include: [{
					attributes: [
						['id', 'id'],
						['idplantillaclausula', 'idplantillaclausula'],
						['titulo', 'titulo'],
						['glosa', 'glosa'],
						['idgrupo', 'idgrupo'],
						['nombreadjunto', 'nombreadjunto'],
						['tipoadjunto', 'tipoadjunto']
					],
					model: models.cuerpoclausula,
					required: true,
				}
				]
			},
			{ attributes: [['titulo', 'titulo']], model: models.clase },
		],
		order: [[models.plantillaclausula, 'id', 'ASC'], [models.plantillaclausula, { model: models.cuerpoclausula }, 'idgrupo', 'asc']],
	}).then(function (clausulas) {
		//logger.debug("-------->AQUI VIENEN LAS CLAUSULAS")
		//console.dir(clausulas)
		var inClau = []

		for (var c in clausulas) {
			var cuerpoclausulas = clausulas[c].plantillaclausula.cuerpoclausulas

			for (var p in cuerpoclausulas) {
				logger.debug("LOS CUERPOS = " + cuerpoclausulas[p].titulo)
				logger.debug("grupo = " + cuerpoclausulas[p].idgrupo)
				var item = {}

				logger.debug("ES DEFAULT")
				item["idsolicitudcontrato"] = req.params.id
				item["idplantillaclausula"] = cuerpoclausulas[p].idplantillaclausula
				item["idcuerpoclausula"] = cuerpoclausulas[p].id
				logger.debug("-------->ESTO ES LO QUE QUIERO: " + cuerpoclausulas[p].id)
				item["titulo"] = cuerpoclausulas[p].titulo
				item["glosa"] = cuerpoclausulas[p].glosa
				item["nombreadjunto"] = cuerpoclausulas[p].nombreadjunto
				item["tipoadjunto"] = cuerpoclausulas[p].tipoadjunto
				item["borrado"] = 1
				inClau.push(item)

			}
		}
		//console.dir(inClau)
		models.clausulassol.bulkCreate(inClau).then(function (events) {
			return res.json({ message: 'Las cláusulas predefinidas fueron generadas', success: true });
		}).catch(function (err) {
			logger.error(err)
			res.json({ message: err.message, success: false });
		});

	}).catch(function (err) {
		logger.error(err.message);
		return res.json({ message: '', success: false });
	});




}

exports.listsolcon = function (req, res) {

	var page = req.query.page;
	var rows = req.query.rows;
	var filters = req.query.filters;
	var sidx = req.query.sidx;
	var sord = req.query.sord;

	if (!sidx)
		sidx = "id";

	if (!sord)
		sord = "asc";

	var additional = [{
		"field": "idsolicitudcontrato",
		"op": "eq",
		"data": req.params.id
	}];


	utilSeq.buildAdditionalCondition(filters, additional, function (err, data) {
		if (data) {
			models.clausulassol.belongsTo(models.solicitudcontrato, { foreignKey: 'idsolicitudcontrato' });
			models.clausulassol.belongsTo(models.cuerpoclausula, { foreignKey: 'idcuerpoclausula' });
			models.clausulassol.belongsTo(models.plantillaclausula, { foreignKey: 'idplantillaclausula' });
			models.clausulassol.belongsTo(models.valores, { foreignKey: 'tipoadjunto' });
			models.plantillaclausula.belongsTo(models.clase, { foreignKey: 'idclase' })

			models.clausulassol.count({
				where: data,
				include: [{
					model: models.solicitudcontrato
				}, {
					model: models.valores
				},
				{ model: models.cuerpoclausula, where: { anexo: 0 } },
				{

					model: models.plantillaclausula,
					include: [
						{ model: models.clase },

					]
				}
				]
			}).then(function (records) {
				var total = Math.ceil(records / rows);
				models.clausulassol.findAll({
					offset: parseInt(rows * (page - 1)),
					limit: parseInt(rows),
					//order: 'secuencia, codigo',
					where: data,
					include: [{
						model: models.solicitudcontrato
					}, {
						model: models.valores
					},
					{ model: models.cuerpoclausula, where: { anexo: 0 } },
					{

						model: models.plantillaclausula,
						include: [
							{ model: models.clase },

						]
					}
					]
				}).then(function (clausulas) {
					return res.json({ records: records, total: total, page: page, rows: clausulas });
				}).catch(function (err) {
					logger.error(err.message);
					res.json({ error_code: 1 });
				});
			}).catch(function (err) {
				logger.error(err.message);
				res.json({ error_code: 1 });
			});

		}
	});

}

exports.downloadsolcon = function (req, res) {
	models.clausulassol.belongsTo(models.solicitudcontrato, { foreignKey: 'idsolicitudcontrato' });
	models.clausulassol.belongsTo(models.plantillaclausula, { foreignKey: 'idplantillaclausula' });
	models.plantillaclausula.belongsTo(models.clase, { foreignKey: 'idclase' })
	models.plantillaclausula.hasMany(models.cuerpoclausula, { constraints: false, foreignKey: 'idplantillaclausula' });

	models.clausulassol.findAll({
		//order: 'secuencia, codigo',
		attributes: [['titulo', 'titulo'], ['glosa', 'glosa']],
		where: { idsolicitudcontrato: req.params.id },
		include: [
			{
				attributes: [['descripcion', 'descripcion']],
				model: models.solicitudcontrato
			}, {
				model: models.plantillaclausula,
				include: [
					{ model: models.clase },
					{ model: models.cuerpoclausula, where: { anexo: 0 } }
				]
			}
		]
	}).then(function (clausulas) {
		//console.dir(clausulas)
		//logger.debug(clausulas.titulo)

		var result = `
				<apex:page sidebar="false" contentType="application/msword" cache="true">
					<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='<a target="_blank" href="http://www.w3.org/TR/REC-html40'" rel="nofollow">http://www.w3.org/TR/REC-html40'</a>>
		<head>
		<meta http-equiv=Content-Type content="text/html;">
		<meta charset='utf-8'>
		<meta name=Generator content="Microsoft Word 15 (filtered)">
		<title>Automatización Swift MT300 y Pagos Masivos vía Swift MT101</title>
		<link type="text/css" href="http://localhost:3000/stylesheets/word.css">
		<style>
		<!--
		
		 @font-face
			{font-family:Wingdings;
			panose-1:5 0 0 0 0 0 0 0 0 0;}
		@font-face
			{font-family:"Cambria Math";
			panose-1:2 4 5 3 5 4 6 3 2 4;}
		@font-face
			{font-family:Calibri;
			panose-1:2 15 5 2 2 2 4 3 2 4;}
		@font-face
			{font-family:Verdana;
			panose-1:2 11 6 4 3 5 4 4 2 4;}
		@font-face
			{font-family:Cambria;
			panose-1:2 4 5 3 5 4 6 3 2 4;}
		@font-face
			{font-family:Consolas;
			panose-1:2 11 6 9 2 2 4 3 2 4;}
		@font-face
			{font-family:Tahoma;
			panose-1:2 11 6 4 3 5 4 4 2 4;}
		
		 p.MsoNormal, li.MsoNormal, div.MsoNormal
			{margin-top:0cm;
			margin-right:0cm;
			margin-bottom:10.0pt;
			margin-left:19.85pt;
			text-align:justify;
			line-height:115%;
			font-size:11.0pt;
			font-family:"Calibri",sans-serif;}
		h1
			{mso-style-link:"Título 1 Car";
			margin-top:24.0pt;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:21.6pt;
			margin-bottom:.0001pt;
			text-align:justify;
			text-indent:-21.6pt;
			line-height:115%;
			page-break-after:avoid;
			font-size:14.0pt;
			font-family:"Cambria",serif;
			color:#365F91;}
		h2
			{mso-style-link:"Título 2 Car";
			margin-top:10.0pt;
			margin-right:0cm;
			margin-bottom:6.0pt;
			margin-left:28.8pt;
			text-align:justify;
			text-indent:-28.8pt;
			line-height:115%;
			page-break-after:avoid;
			font-size:13.0pt;
			font-family:"Cambria",serif;
			color:#4F81BD;}
		h3
			{mso-style-link:"Título 3 Car";
			margin-top:10.0pt;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:36.0pt;
			margin-bottom:.0001pt;
			text-align:justify;
			text-indent:-36.0pt;
			line-height:115%;
			page-break-after:avoid;
			font-size:11.0pt;
			font-family:"Cambria",serif;
			color:#4F81BD;}
		h4
			{mso-style-link:"Título 4 Car";
			margin-top:12.0pt;
			margin-right:0cm;
			margin-bottom:3.0pt;
			margin-left:43.2pt;
			text-align:justify;
			text-indent:-43.2pt;
			page-break-after:avoid;
			font-size:11.0pt;
			font-family:"Calibri",sans-serif;
			color:#4F81BD;}
		h5
			{mso-style-link:"Título 5 Car";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:50.4pt;
			margin-bottom:.0001pt;
			text-align:justify;
			text-indent:-50.4pt;
			line-height:115%;
			page-break-after:avoid;
			font-size:11.0pt;
			font-family:"Cambria",serif;
			color:#243F60;
			font-weight:normal;}
		h6
			{mso-style-link:"Título 6 Car";
			margin-top:10.0pt;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:57.6pt;
			margin-bottom:.0001pt;
			text-align:justify;
			text-indent:-57.6pt;
			line-height:115%;
			page-break-after:avoid;
			font-size:11.0pt;
			font-family:"Cambria",serif;
			color:#243F60;
			font-weight:normal;
			font-style:italic;}
		p.MsoHeading7, li.MsoHeading7, div.MsoHeading7
			{mso-style-link:"Título 7 Car";
			margin-top:10.0pt;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:64.8pt;
			margin-bottom:.0001pt;
			text-align:justify;
			text-indent:-64.8pt;
			line-height:115%;
			page-break-after:avoid;
			font-size:11.0pt;
			font-family:"Cambria",serif;
			color:#404040;
			font-style:italic;}
		p.MsoHeading8, li.MsoHeading8, div.MsoHeading8
			{mso-style-link:"Título 8 Car";
			margin-top:10.0pt;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:72.0pt;
			margin-bottom:.0001pt;
			text-align:justify;
			text-indent:-72.0pt;
			page-break-after:avoid;
			font-size:10.0pt;
			font-family:"Cambria",serif;
			color:#404040;}
		p.MsoHeading9, li.MsoHeading9, div.MsoHeading9
			{mso-style-link:"Título 9 Car";
			margin-top:10.0pt;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:79.2pt;
			margin-bottom:.0001pt;
			text-align:justify;
			text-indent:-79.2pt;
			line-height:115%;
			page-break-after:avoid;
			font-size:10.0pt;
			font-family:"Cambria",serif;
			color:#404040;
			font-style:italic;}
		p.MsoToc1, li.MsoToc1, div.MsoToc1
			{margin-top:12.0pt;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:11.9pt;
			margin-bottom:.0001pt;
			font-size:12.0pt;
			font-family:"Times New Roman",serif;}
		p.MsoToc2, li.MsoToc2, div.MsoToc2
			{margin-top:3.0pt;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:11.9pt;
			margin-bottom:.0001pt;
			text-align:justify;
			font-size:12.0pt;
			font-family:"Times New Roman",serif;}
		p.MsoToc3, li.MsoToc3, div.MsoToc3
			{margin-top:0cm;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:24.0pt;
			margin-bottom:.0001pt;
			text-align:justify;
			font-size:12.0pt;
			font-family:"Times New Roman",serif;}
		p.MsoCommentText, li.MsoCommentText, div.MsoCommentText
			{mso-style-link:"Texto comentario Car";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:10.0pt;
			margin-left:19.85pt;
			text-align:justify;
			font-size:10.0pt;
			font-family:"Calibri",sans-serif;}
		p.MsoHeader, li.MsoHeader, div.MsoHeader
			{mso-style-link:"Encabezado Car";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:19.85pt;
			margin-bottom:.0001pt;
			text-align:justify;
			font-size:12.0pt;
			font-family:"Times New Roman",serif;}
		p.MsoFooter, li.MsoFooter, div.MsoFooter
			{mso-style-link:"Pie de página Car";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:19.85pt;
			margin-bottom:.0001pt;
			text-align:justify;
			font-size:12.0pt;
			font-family:"Times New Roman",serif;}
		p.MsoTitle, li.MsoTitle, div.MsoTitle
			{mso-style-link:"Puesto Car";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:15.0pt;
			margin-left:19.85pt;
			text-align:justify;
			border:none;
			padding:0cm;
			font-size:26.0pt;
			font-family:"Cambria",serif;
			color:#17365D;
			letter-spacing:.25pt;}
		p.MsoTitleCxSpFirst, li.MsoTitleCxSpFirst, div.MsoTitleCxSpFirst
			{mso-style-link:"Puesto Car";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:19.85pt;
			margin-bottom:.0001pt;
			text-align:justify;
			border:none;
			padding:0cm;
			font-size:26.0pt;
			font-family:"Cambria",serif;
			color:#17365D;
			letter-spacing:.25pt;}
		p.MsoTitleCxSpMiddle, li.MsoTitleCxSpMiddle, div.MsoTitleCxSpMiddle
			{mso-style-link:"Puesto Car";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:19.85pt;
			margin-bottom:.0001pt;
			text-align:justify;
			border:none;
			padding:0cm;
			font-size:26.0pt;
			font-family:"Cambria",serif;
			color:#17365D;
			letter-spacing:.25pt;}
		p.MsoTitleCxSpLast, li.MsoTitleCxSpLast, div.MsoTitleCxSpLast
			{mso-style-link:"Puesto Car";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:15.0pt;
			margin-left:19.85pt;
			text-align:justify;
			border:none;
			padding:0cm;
			font-size:26.0pt;
			font-family:"Cambria",serif;
			color:#17365D;
			letter-spacing:.25pt;}
		p.MsoBodyText, li.MsoBodyText, div.MsoBodyText
			{mso-style-link:"Texto independiente Car";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:6.0pt;
			margin-left:19.85pt;
			text-align:justify;
			line-height:115%;
			font-size:11.0pt;
			font-family:"Calibri",sans-serif;}
		p.MsoSubtitle, li.MsoSubtitle, div.MsoSubtitle
			{mso-style-link:"Subtítulo Car";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:10.0pt;
			margin-left:19.85pt;
			text-align:justify;
			line-height:115%;
			font-size:12.0pt;
			font-family:"Cambria",serif;
			color:#4F81BD;
			letter-spacing:.75pt;
			font-style:italic;}
		p.MsoBodyText2, li.MsoBodyText2, div.MsoBodyText2
			{mso-style-link:"Texto independiente 2 Car";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:6.0pt;
			margin-left:19.85pt;
			text-align:justify;
			line-height:200%;
			font-size:12.0pt;
			font-family:"Times New Roman",serif;}
		a:link, span.MsoHyperlink
			{color:blue;
			text-decoration:underline;}
		a:visited, span.MsoHyperlinkFollowed
			{color:purple;
			text-decoration:underline;}
		p.MsoPlainText, li.MsoPlainText, div.MsoPlainText
			{mso-style-link:"Texto sin formato Car";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:19.85pt;
			margin-bottom:.0001pt;
			text-align:justify;
			font-size:10.5pt;
			font-family:Consolas;}
		p.MsoCommentSubject, li.MsoCommentSubject, div.MsoCommentSubject
			{mso-style-link:"Asunto del comentario Car";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:10.0pt;
			margin-left:19.85pt;
			text-align:justify;
			font-size:10.0pt;
			font-family:"Calibri",sans-serif;
			font-weight:bold;}
		p.MsoAcetate, li.MsoAcetate, div.MsoAcetate
			{mso-style-link:"Texto de globo Car";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:19.85pt;
			margin-bottom:.0001pt;
			text-align:justify;
			font-size:8.0pt;
			font-family:"Tahoma",sans-serif;}
		p.MsoNoSpacing, li.MsoNoSpacing, div.MsoNoSpacing
			{mso-style-link:"Sin espaciado Car";
			margin:0cm;
			margin-bottom:.0001pt;
			font-size:11.0pt;
			font-family:"Calibri",sans-serif;}
		p.MsoRMPane, li.MsoRMPane, div.MsoRMPane
			{margin:0cm;
			margin-bottom:.0001pt;
			font-size:11.0pt;
			font-family:"Calibri",sans-serif;}
		p.MsoListParagraph, li.MsoListParagraph, div.MsoListParagraph
			{margin-top:0cm;
			margin-right:0cm;
			margin-bottom:12.0pt;
			margin-left:72.0pt;
			text-align:justify;
			text-indent:-18.0pt;
			font-size:11.0pt;
			font-family:"Calibri",sans-serif;}
		p.MsoListParagraphCxSpFirst, li.MsoListParagraphCxSpFirst, div.MsoListParagraphCxSpFirst
			{margin-top:0cm;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:72.0pt;
			margin-bottom:.0001pt;
			text-align:justify;
			text-indent:-18.0pt;
			font-size:11.0pt;
			font-family:"Calibri",sans-serif;}
		p.MsoListParagraphCxSpMiddle, li.MsoListParagraphCxSpMiddle, div.MsoListParagraphCxSpMiddle
			{margin-top:0cm;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:72.0pt;
			margin-bottom:.0001pt;
			text-align:justify;
			text-indent:-18.0pt;
			font-size:11.0pt;
			font-family:"Calibri",sans-serif;}
		p.MsoListParagraphCxSpLast, li.MsoListParagraphCxSpLast, div.MsoListParagraphCxSpLast
			{margin-top:0cm;
			margin-right:0cm;
			margin-bottom:12.0pt;
			margin-left:72.0pt;
			text-align:justify;
			text-indent:-18.0pt;
			font-size:11.0pt;
			font-family:"Calibri",sans-serif;}
		span.MsoIntenseEmphasis
			{color:#4F81BD;
			font-weight:bold;
			font-style:italic;}
		span.MsoBookTitle
			{font-family:"Calibri",sans-serif;
			font-variant:small-caps;
			color:#365F91;
			letter-spacing:.25pt;
			font-weight:normal;}
		p.MsoTocHeading, li.MsoTocHeading, div.MsoTocHeading
			{margin-top:24.0pt;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:21.6pt;
			margin-bottom:.0001pt;
			text-align:justify;
			text-indent:-21.6pt;
			line-height:115%;
			page-break-after:avoid;
			font-size:14.0pt;
			font-family:"Cambria",serif;
			color:#365F91;
			font-weight:bold;}
		span.Ttulo1Car
			{mso-style-name:"Título 1 Car";
			mso-style-link:"Título 1";
			font-family:"Cambria",serif;
			color:#365F91;
			font-weight:bold;}
		span.Ttulo2Car
			{mso-style-name:"Título 2 Car";
			mso-style-link:"Título 2";
			font-family:"Cambria",serif;
			color:#4F81BD;
			font-weight:bold;}
		span.Ttulo3Car
			{mso-style-name:"Título 3 Car";
			mso-style-link:"Título 3";
			font-family:"Cambria",serif;
			color:#4F81BD;
			font-weight:bold;}
		span.TextosinformatoCar
			{mso-style-name:"Texto sin formato Car";
			mso-style-link:"Texto sin formato";
			font-family:Consolas;}
		span.TextodegloboCar
			{mso-style-name:"Texto de globo Car";
			mso-style-link:"Texto de globo";
			font-family:"Tahoma",sans-serif;}
		span.TableTextChar
			{mso-style-name:"Table Text Char";
			mso-style-link:"Table Text";
			font-family:"Calibri",sans-serif;}
		p.TableText, li.TableText, div.TableText
			{mso-style-name:"Table Text";
			mso-style-link:"Table Text Char";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:19.85pt;
			margin-bottom:.0001pt;
			text-align:justify;
			font-size:12.0pt;
			font-family:"Calibri",sans-serif;}
		span.Textoindependiente2Car
			{mso-style-name:"Texto independiente 2 Car";
			mso-style-link:"Texto independiente 2";
			font-family:"Times New Roman",serif;}
		span.PiedepginaCar
			{mso-style-name:"Pie de página Car";
			mso-style-link:"Pie de página";
			font-family:"Times New Roman",serif;}
		span.EncabezadoCar
			{mso-style-name:"Encabezado Car";
			mso-style-link:Encabezado;
			font-family:"Times New Roman",serif;}
		p.Default, li.Default, div.Default
			{mso-style-name:Default;
			margin:0cm;
			margin-bottom:.0001pt;
			text-autospace:none;
			font-size:12.0pt;
			font-family:"Arial",sans-serif;
			color:black;}
		span.SubttuloCar
			{mso-style-name:"Subtítulo Car";
			mso-style-link:Subtítulo;
			font-family:"Cambria",serif;
			color:#4F81BD;
			letter-spacing:.75pt;
			font-style:italic;}
		span.Ttulo4Car
			{mso-style-name:"Título 4 Car";
			mso-style-link:"Título 4";
			font-family:"Calibri",sans-serif;
			color:#4F81BD;
			font-weight:bold;}
		p.clausula, li.clausula, div.clausula
			{mso-style-name:clausula;
			margin-top:6.0pt;
			margin-right:0cm;
			margin-bottom:6.0pt;
			margin-left:9.0pt;
			text-align:justify;
			font-size:10.0pt;
			font-family:"Verdana",sans-serif;}
		span.TextoindependienteCar
			{mso-style-name:"Texto independiente Car";
			mso-style-link:"Texto independiente";}
		p.Bullet3, li.Bullet3, div.Bullet3
			{mso-style-name:"Bullet 3";
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:0cm;
			margin-left:19.85pt;
			margin-bottom:.0001pt;
			text-align:justify;
			punctuation-wrap:simple;
			text-autospace:none;
			font-size:10.0pt;
			font-family:"Arial",sans-serif;}
		span.Ttulo8Car
			{mso-style-name:"Título 8 Car";
			mso-style-link:"Título 8";
			font-family:"Cambria",serif;
			color:#404040;}
		span.SinespaciadoCar
			{mso-style-name:"Sin espaciado Car";
			mso-style-link:"Sin espaciado";
			font-family:"Times New Roman",serif;}
		span.PuestoCar
			{mso-style-name:"Puesto Car";
			mso-style-link:Puesto;
			font-family:"Cambria",serif;
			color:#17365D;
			letter-spacing:.25pt;}
		p.8EAA14224D814626B5601D20B9208574, li.8EAA14224D814626B5601D20B9208574, div.8EAA14224D814626B5601D20B9208574
			{mso-style-name:8EAA14224D814626B5601D20B9208574;
			margin-top:0cm;
			margin-right:0cm;
			margin-bottom:10.0pt;
			margin-left:0cm;
			line-height:115%;
			font-size:11.0pt;
			font-family:"Calibri",sans-serif;}
		span.Ttulo5Car
			{mso-style-name:"Título 5 Car";
			mso-style-link:"Título 5";
			font-family:"Cambria",serif;
			color:#243F60;}
		span.Ttulo6Car
			{mso-style-name:"Título 6 Car";
			mso-style-link:"Título 6";
			font-family:"Cambria",serif;
			color:#243F60;
			font-style:italic;}
		span.Ttulo7Car
			{mso-style-name:"Título 7 Car";
			mso-style-link:"Título 7";
			font-family:"Cambria",serif;
			color:#404040;
			font-style:italic;}
		span.Ttulo9Car
			{mso-style-name:"Título 9 Car";
			mso-style-link:"Título 9";
			font-family:"Cambria",serif;
			color:#404040;
			font-style:italic;}
		span.TextocomentarioCar
			{mso-style-name:"Texto comentario Car";
			mso-style-link:"Texto comentario";}
		span.AsuntodelcomentarioCar
			{mso-style-name:"Asunto del comentario Car";
			mso-style-link:"Asunto del comentario";
			font-weight:bold;}
		.MsoChpDefault
			{font-family:"Calibri",sans-serif;}
		.MsoPapDefault
			{margin-bottom:10.0pt;
			line-height:115%;}
		
		 @page WordSection1
			{size:612.0pt 792.0pt;
			margin:70.9pt 59.25pt 70.9pt 78.0pt;}
		div.WordSection1
			{page:WordSection1;}
		
		 ol
			{margin-bottom:0cm;}
		ul
			{margin-bottom:0cm;}
		-->
		</style>
		
		</head>
		
		<body lang=ES link=blue vlink=purple>
		
		<div class=WordSection1>
		
		<p class=MsoNormal align=center style='text-align:center'><b><span lang=ES-MX>&nbsp;</span></b></p>
		
		<div align=center>
		
		<table class=MsoNormalTable border=0 cellspacing=0 cellpadding=0 width="100%"
		 style='width:100.0%;border-collapse:collapse'>
		 <tr style='height:144.0pt'>
		  <td width="100%" valign=top style='width:100.0%;padding:0cm 5.4pt 0cm 5.4pt;
		  height:144.0pt'>
		  <p class=MsoNoSpacing align=center style='text-align:center'><span
		  style='font-size:18.0pt'><img width=315 height=86 id="Imagen 9"
		  src="http://localhost:3000/images/bancodechile.jpg"></span></p>
		  </td>
		 </tr>
		 <tr style='height:72.0pt'>
		  <td width="100%" style='width:100.0%;border:none;border-bottom:solid #4F81BD 1.0pt;
		  padding:0cm 5.4pt 0cm 5.4pt;height:72.0pt'>
		  <div style='border:none;border-bottom:solid #4F81BD 1.0pt;padding:0cm 0cm 4.0pt 0cm;
		  margin-left:19.85pt;margin-right:0cm'>
		  <p class=MsoTitle align=center style='margin-left:0cm;text-align:center'><span
		  lang=ES-CL>
		  `
		result += clausulas[0].solicitudcontrato.descripcion

		result += `
		  </span></p>
		  </div>
		  </td>
		 </tr>
		 <tr style='height:36.0pt'>
		  <td width="100%" style='width:100.0%;border:none;padding:0cm 5.4pt 0cm 5.4pt;
		  height:36.0pt'>
		  <div style='border:none;border-bottom:solid #4F81BD 1.0pt;padding:0cm 0cm 4.0pt 0cm;
		  margin-left:19.85pt;margin-right:0cm'>
		  <p class=MsoTitle align=center style='margin-left:0cm;text-align:center'><b><span
		  lang=ES-CL>BASES DE LICITACION N°</span></b></p>
		  </div>
		  </td>
		 </tr>
		 <tr style='height:18.0pt'>
		  <td width="100%" style='width:100.0%;padding:0cm 5.4pt 0cm 5.4pt;height:18.0pt'>
		  <p class=MsoNormal><span lang=ES-CL>&nbsp;</span></p>
		  </td>
		 </tr>
		 <tr style='height:102.45pt'>
		  <td width="100%" style='width:100.0%;padding:0cm 5.4pt 0cm 5.4pt;height:102.45pt'>
		  <p class=MsoNormal><span lang=ES-CL style='color:#17365D'>&nbsp;</span></p>
		  <h2 style='margin-left:36.0pt;text-indent:0cm'><span lang=ES-MX
		  style='color:#17365D'>&nbsp;</span></h2>
		  </td>
		 </tr>
		 <tr style='height:18.0pt'>
		  <td width="100%" style='width:100.0%;padding:0cm 5.4pt 0cm 5.4pt;height:18.0pt'>
		  <p class=MsoNormal align=center style='margin-left:0cm;text-align:center'><span
		  class=MsoBookTitle><b><span style='font-size:16.0pt;line-height:115%;
		  font-family:"Cambria",serif;font-variant:normal !important;color:#17365D;
		  text-transform:uppercase'><span style='mso-field-code: DATE '></span></span></b></span></p>
		  </td>
		 </tr>
		</table>
		
		</div>
		<span lang=ES-CL style='font-size:11.0pt;line-height:115%;font-family:"Calibri",sans-serif'><br
		clear=all style='page-break-before:always'>
		</span>
		
		<p class=MsoNormal align=left style='margin-left:0cm;text-align:left'><b><span
		lang=ES-CL style='font-size:14.0pt;line-height:115%;font-family:"Cambria",serif;
		color:#365F91'>&nbsp;</span></b></p>
						`
		/*		
						for (var f in clausulas) {
							var clase = clausulas[f].plantillaclausula.clase.nombre
							var code = clausulas[f].plantillaclausula.codigo
							if (!code) {
								throw new Error("No es posible generar el documento.")
							}
				
							var level = code.split(".");
							var nombrecorto = clausulas[f].plantillaclausula.nombrecorto;
				
							result += '<h1>' + clase + '</h1>'
				
							if (parseInt(level[0]) > 0 && parseInt(level[1]) == 0)
								result += '<h2>' + nombrecorto + '</h2>'
							else if (parseInt(level[0]) > 0 && parseInt(level[1]) > 0)
								result += '<h3>' + nombrecorto + '</h3>'
				
				
							result += clausulas[f].texto
							result += "<br/>"
				
						}
		*/
		var tituloclase = ''
		for (var f in clausulas) {
			if (clausulas[f].plantillaclausula.clase.titulo != tituloclase) {
				tituloclase = clausulas[f].plantillaclausula.clase.titulo
				logger.debug("EL TITULO: " + tituloclase);
				result += '<h1>' + tituloclase + '</h1>'
			}
			var titulo = clausulas[f].titulo
			var glosa = clausulas[f].glosa

			result += '<h2>' + titulo + '</h2>'

			result += '<p>' + glosa + '</p>'

			result += "<br/>"

		}
		result +=
			`
		</div>
		
		</body>
		
		</html>
		</apex:page>
		`

		var hdr = 'attachment; filename=RTF_' + Math.floor(Date.now()) + '.doc'
		res.setHeader('Content-disposition', hdr);
		res.set('Content-Type', 'application/msword;charset=utf-8');
		res.status(200).send(result);

	}).catch(function (err) {
		logger.error(err.message);
		res.status(500).send(err.message);
	});

}

exports.actionsolcon = function (req, res) {
	var action = req.body.oper;
	switch (action) {
		case "add":
			models.clausulassol.create({
				idsolicitudcontrato: req.body.idsolicitudcontrato,
				idplantillaclausula: req.body.idclausulaplantilla,
				idcuerpoclausula: req.body.idcuerpoclausula,
				titulo: req.body.titulo,
				glosa: req.body.glosa,
				tipoadjunto: req.body.tipoadjunto,
				nombreadjunto: req.body.nombreadjunto,
				borrado: 1
			}).then(function (clausulas) {
				bitacora.registrar(
					req.body.idsolicitudcotizacion,
					'clausulassol',
					clausulas.id,
					'insert',
					req.session.passport.user,
					new Date(),
					models.clausulassol,
					function (err, data) {
						if (!err) {
							return res.json({ id: clausulas.id, parent: req.body.idsolicitudcotizacion, message: 'Inicio carga', success: true });
						} else {
							logger.error(err)
							return res.json({ id: clausulas.id, parent: req.body.idsolicitudcotizacion, message: 'Falla', success: false });
						}
					});
			}).catch(function (err) {
				logger.error(err)
				res.json({ error: 1, glosa: err.message });
			});
			break;
		case "edit":
			bitacora.registrar(
				req.body.idsolicitudcotizacion,
				'clausulassol',
				req.body.id,
				'update',
				req.session.passport.user,
				new Date(),
				models.clausulassol,
				function (err, data) {
					if (!err) {
						models.clausulassol.update({
							titulo: req.body.titulo,
							glosa: req.body.glosa,
						}, {
								where: {
									id: req.body.id
								}
							}).then(function (clausulas) {
								res.json({ id: req.body.id, parent: req.body.idsolicitudcotizacion, message: 'Inicio carga', success: true });
							}).catch(function (err) {
								logger.error(err)
								res.json({ message: err.message, success: false });
							});
					} else {
						logger.error(err)
						return res.json({ message: err.message, success: false });
					}
				});
			break;
		case "del":
			models.clausulassol.findAll({
				where: {
					id: req.body.id
				}
			}).then(function (clausulas) {
				bitacora.registrar(
					req.body.idsolicitudcotizacion,
					'clausulassol',
					req.body.id,
					'delete',
					req.session.passport.user,
					new Date(),
					models.clausulassol,
					function (err, data) {
						if (!err) {
							models.clausulassol.destroy({
								where: {
									id: req.body.id
								}
							}).then(function (rowDeleted) {
								return res.json({ message: '', success: true });
							}).catch(function (err) {
								logger.error(err)
								res.json({ message: err.message, success: false });
							});
						} else {
							logger.error(err)
							return res.json({ message: err.message, success: false });
						}
					});
			});
			break;
	}
}

exports.textosolcon = function (req, res) {
	models.cuerpoclausula.belongsTo(models.valores, { foreignKey: 'tipoadjunto' });
	models.cuerpoclausula.findAll({
		where: { idplantillaclausula: req.params.id },
		include: [
			{
				model: models.valores
			}]
	}).then(function (plantillas) {
		if (plantillas != "") {
			return res.json(plantillas);
		} else {
			models.cuerpoclausula.findAll({
				where: { idplantillaclausula: req.params.id },
				include: [
					{
						model: models.valores
					}]
			}).then(function (plantillapordefecto) {
				return res.json(plantillapordefecto);
			}).catch(function (err) {
				logger.error(err.message);
				res.json({ error_code: 1 });
			});
		}
	}).catch(function (err) {
		logger.error(err.message);
		res.json({ error_code: 1 });
	});
}