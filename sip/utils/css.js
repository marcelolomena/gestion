module.exports = (function () {
    var css = ` <style>
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
		</style> `
    return {
        css: css
    };
})();