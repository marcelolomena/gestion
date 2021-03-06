USE [controldelimites]
GO
SET IDENTITY_INSERT [lin].[art_user] ON 

INSERT [lin].[art_user] ([uid], [uname], [password], [profile_image], [first_name], [last_name], [division], [gerencia], [department], [email], [birth_date], [office_number], [joining_date], [isadmin], [isverify], [verify_code], [verify_date], [status], [added_date], [rut_number], [rate_hour], [contact_number], [user_type], [work_hours], [bonus_app], [designation], [user_profile]) VALUES (1, N'ejecutivo', N'$2a$10$GAAmbU/Wb/uIOtXvn53AmOLWd/st6HV/CUrUlBCBCyQd8KT4CBFyS', NULL, N'Ejecutivo', N'1', 1, 3, 100, N'dandradee@bancochile.cl', CAST(N'1956-06-12' AS Date), N'9999999999', CAST(N'2014-08-05' AS Date), 2, 1, N'4a89f4e5-d2ee-4889-9ce6-1030b8f37637', CAST(N'2014-01-05T00:00:00.0000000' AS DateTime2), 1, CAST(N'2016-05-05T00:00:00.0000000' AS DateTime2), N'Default_RUT', 10, N'26532273', 2, CAST(8.00 AS Decimal(10, 2)), 0, NULL, N'su        ')
SET IDENTITY_INSERT [lin].[art_user] OFF
SET IDENTITY_INSERT [lin].[rol] ON 

INSERT [lin].[rol] ([id], [glosarol], [borrado]) VALUES (6, N'Administrador', 1)
INSERT [lin].[rol] ([id], [glosarol], [borrado]) VALUES (7, N'AdminRespaldo', 1)
SET IDENTITY_INSERT [lin].[rol] OFF
SET IDENTITY_INSERT [lin].[sistema] ON 

INSERT [lin].[sistema] ([id], [sistema], [glosasistema], [borrado], [pagina]) VALUES (1, N'LIN', N'Sistema Control de Lineas', 1, N'home1')
INSERT [lin].[sistema] ([id], [sistema], [glosasistema], [borrado], [pagina]) VALUES (2, N'SIC', N'Sistema Integrado de Contrato', 1, N'home2')
INSERT [lin].[sistema] ([id], [sistema], [glosasistema], [borrado], [pagina]) VALUES (3, N'OBA', N'Sistema de Presupuestos (OBA)', 1, NULL)
SET IDENTITY_INSERT [lin].[sistema] OFF
SET IDENTITY_INSERT [lin].[usr_rol] ON 

INSERT [lin].[usr_rol] ([id], [uid], [rid], [borrado], [idsistema]) VALUES (33, 1, 6, 1, 1)
SET IDENTITY_INSERT [lin].[usr_rol] OFF
SET IDENTITY_INSERT [lin].[contenido] ON 

INSERT [lin].[contenido] ([id], [nombre], [plantilla], [borrado]) VALUES (1, N'grid', N'views/page_grid.pug', 1)
INSERT [lin].[contenido] ([id], [nombre], [plantilla], [borrado]) VALUES (2, N'dashboard', N'views/page_dash_1.pug', 1)
INSERT [lin].[contenido] ([id], [nombre], [plantilla], [borrado]) VALUES (3, N'dashboard2', N'views/page_dash_2.pug', 1)
INSERT [lin].[contenido] ([id], [nombre], [plantilla], [borrado]) VALUES (4, N'tabs', N'views/page_tab.pug', 1)
INSERT [lin].[contenido] ([id], [nombre], [plantilla], [borrado]) VALUES (5, N'grafico', N'views/page_grafico.pug', 1)
INSERT [lin].[contenido] ([id], [nombre], [plantilla], [borrado]) VALUES (6, N'static', N'views/page_home1.pug', 1)
INSERT [lin].[contenido] ([id], [nombre], [plantilla], [borrado]) VALUES (7, N'home de contrato', N'views/page_home2.pug', 1)
INSERT [lin].[contenido] ([id], [nombre], [plantilla], [borrado]) VALUES (8, N'gridparam', N'views/page_grid_param.pug', 1)
INSERT [lin].[contenido] ([id], [nombre], [plantilla], [borrado]) VALUES (9, N'tabsparam', N'views/page_tab_param.pug', 1)
INSERT [lin].[contenido] ([id], [nombre], [plantilla], [borrado]) VALUES (10, N'tabsparam2', N'views/page_tab_param2.pug', 1)
SET IDENTITY_INSERT [lin].[contenido] OFF
SET IDENTITY_INSERT [lin].[pagina] ON 

INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (1, N'home1', 1, N'Vista 360', 1, N' 
link(rel=''stylesheet'', href=''../../stylesheets/cdn_style.css'', type=''text/css'', media=''screen'', charset=''utf-8'')    
<link href="../../stylesheets/css.css" rel="stylesheet">
script(type="text/javascript", src="/javascripts/views/mac/vista360.js") 
script(type="text/javascript", src="/javascripts/jquery.Rut.js") 
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (2, N'cartera', 4, N'MAC/Cartera', 1, N'
style.
 .ui-th-column>div, .ui-jqgrid-btable .jqgrow>td {
 word-wrap: break-word;
 white-space: pre-wrap;
 white-space: -moz-pre-wrap;
 white-space: -pre-wrap;
 white-space: -o-pre-wrap;
 overflow: hidden;
 vertical-align: middle;
 }
 .ui-jqgrid tr.jqgrow td {
 white-space: normal !important;
 height:auto;
 vertical-align:text-top;
 padding-top:2px;
 }   
script(type="text/javascript", src="/javascripts/views/mac/cartera.js")
script(type="text/javascript", src="/javascripts/views/limite.js")
script(type="text/javascript", src="/javascripts/views/sublimite.js")
script(type="text/javascript", src="/javascripts/views/garantia.js")
script(type="text/javascript", src="/javascripts/views/garantiasub.js")', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (3, N'grupos', 1, N'Parametros/Grupos', 1, N' 
script(type="text/javascript", src="/javascripts/views/grupo.js") ', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (4, N'generarmac', 8, N'Generar MAC', 1, N' 
script(type="text/javascript", src="/javascripts/views/mac/generarmac1.js") ', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (5, N'operaciones', 9, N'Control de Limites', 1, N'
style.
 .ui-th-column>div, .ui-jqgrid-btable .jqgrow>td {
 word-wrap: break-word;
 white-space: pre-wrap;
 white-space: -moz-pre-wrap;
 white-space: -pre-wrap;
 white-space: -o-pre-wrap;
 overflow: hidden;
 vertical-align: middle;
 }
 .ui-jqgrid tr.jqgrow td {
 white-space: normal !important;
 height:auto;
 vertical-align:text-top;
 padding-top:2px;
 }   
script(type="text/javascript", src="/javascripts/bootstrap-switch.js")   
script(type="text/javascript", src="/javascripts/jquery.Rut.js") 
link(rel=''stylesheet'', href=''../../../stylesheets/cdn_style.css'', type=''text/css'', media=''screen'', charset=''utf-8'')    
link(href="../../../stylesheets/css.css" rel="stylesheet")
script(type="text/javascript", src="/javascripts/views/operaciones/operaciones.js")
script(type="text/javascript", src="/javascripts/views/operaciones/aprobaciones.js")
script(type="text/javascript", src="/javascripts/views/operaciones/vertablimites.js")
script(type="text/javascript", src="/javascripts/views/operaciones/vertabsublimites.js")
script(type="text/javascript", src="/javascripts/views/operaciones/sublimiteoperaciones.js")
script(type="text/javascript", src="/javascripts/views/operaciones/vertaboperaciones.js")
script(type="text/javascript", src="/javascripts/views/operaciones/operaciones2.js")
script(type="text/javascript", src="/javascripts/views/operaciones/vertabasignaciones.js")
script(type="text/javascript", src="/javascripts/views/operaciones/versublimitesasignaciones.js")
script(type="text/javascript", src="/javascripts/views/operaciones/veroperacionesasignar.js")
script(type="text/javascript", src="/javascripts/views/operaciones/vertabreserva.js")
script(type="text/javascript", src="/javascripts/views/operaciones/vertabreservasublimites.js")

', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (6, N'crearaprobacion', 8, N'Crear Aprobación', 1, N' 
script(type="text/javascript", src="/javascripts/jquery.Rut.js") 
link(rel=''stylesheet'', href=''../../../stylesheets/cdn_style.css'', type=''text/css'', media=''screen'', charset=''utf-8'')    
link(href="../../../stylesheets/css.css" rel="stylesheet")
script(type="text/javascript", src="/javascripts/views/mac/crearaprobacion.js") ', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (7, N'macindividuales', 9, N'MAC Grupal', 1, N'style.
 .ui-th-column>div, .ui-jqgrid-btable .jqgrow>td {
 word-wrap: break-word;
 white-space: pre-wrap;
 white-space: -moz-pre-wrap;
 white-space: -pre-wrap;
 white-space: -o-pre-wrap;
 overflow: hidden;
 vertical-align: middle;
 }
 .ui-jqgrid tr.jqgrow td {
 white-space: normal !important;
 height:auto;
 vertical-align:text-top;
 padding-top:2px;
 }   
script(type="text/javascript", src="/javascripts/views/mac/macgrupal.js")
script(type="text/javascript", src="/javascripts/views/mac/vermacindividuales.js")', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (8, N'crearaprobacionmac', 10, N'Crear Aprobación', 1, N'style.
 .ui-th-column>div, .ui-jqgrid-btable .jqgrow>td {
 word-wrap: break-word;
 white-space: pre-wrap;
 white-space: -moz-pre-wrap;
 white-space: -pre-wrap;
 white-space: -o-pre-wrap;
 overflow: hidden;
 vertical-align: middle;
 }
 .ui-jqgrid tr.jqgrow td {
 white-space: normal !important;
 height:auto;
 vertical-align:text-top;
 padding-top:2px;
 }  
script(type="text/javascript", src="/javascripts/jquery.Rut.js") 
link(rel=''stylesheet'', href=''../../../stylesheets/cdn_style.css'', type=''text/css'', media=''screen'', charset=''utf-8'')    
link(href="../../../stylesheets/css.css" rel="stylesheet") 
script(type="text/javascript", src="/javascripts/views/mac/crearaprobacionmac.js")
script(type="text/javascript", src="/javascripts/views/mac/vermacindividuales.js")
script(type="text/javascript", src="/javascripts/views/mac/macindividual.js")', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (9, N'crearaprobacionmac2', 8, N'Crear Aprobación', 1, N'style.
 .ui-th-column>div, .ui-jqgrid-btable .jqgrow>td {
 word-wrap: break-word;
 white-space: pre-wrap;
 white-space: -moz-pre-wrap;
 white-space: -pre-wrap;
 white-space: -o-pre-wrap;
 overflow: hidden;
 vertical-align: middle;
 }
 .ui-jqgrid tr.jqgrow td {
 white-space: normal !important;
 height:auto;
 vertical-align:text-top;
 padding-top:2px;
 }  
script(type="text/javascript", src="/javascripts/jquery.Rut.js") 
link(rel=''stylesheet'', href=''../../../stylesheets/cdn_style.css'', type=''text/css'', media=''screen'', charset=''utf-8'')    
link(href="../../../stylesheets/css.css" rel="stylesheet") 
script(type="text/javascript", src="/javascripts/views/mac/crearaprobacionmac.js")
script(type="text/javascript", src="/javascripts/views/mac/vermacindividuales.js")
script(type="text/javascript", src="/javascripts/views/mac/macindividual.js")', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (10, N'vista360', 1, N'Vista 360', 1, N' 
link(rel=''stylesheet'', href=''../../stylesheets/cdn_style.css'', type=''text/css'', media=''screen'', charset=''utf-8'')    
<link href="../../stylesheets/css.css" rel="stylesheet">
script(type="text/javascript", src="/javascripts/views/mac/vista360.js") 
script(type="text/javascript", src="/javascripts/jquery.Rut.js") 
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (11, N'macgrupal', 9, N'MAC Grupal', 1, N'style.
 .ui-th-column>div, .ui-jqgrid-btable .jqgrow>td {
 word-wrap: break-word;
 white-space: pre-wrap;
 white-space: -moz-pre-wrap;
 white-space: -pre-wrap;
 white-space: -o-pre-wrap;
 overflow: hidden;
 vertical-align: middle;
 }
 .ui-jqgrid tr.jqgrow td {
 white-space: normal !important;
 height:auto;
 vertical-align:text-top;
 padding-top:2px;
 }   
script(type="text/javascript", src="/javascripts/views/mac/macgrupal.js")
script(type="text/javascript", src="/javascripts/views/mac/vermacgrupal.js")
script(type="text/javascript", src="/javascripts/views/mac/macindividual.js")
script(type="text/javascript", src="/javascripts/views/limite.js")
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (12, N'clasecriticidad', 1, N'Contenido', 2, N'
script(type="text/javascript", src="/javascripts/views/sic/clasecriticidad.js")      
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (13, N'claseevaluaciontecnica', 1, N'Contenido', 2, N'
script(type="text/javascript", src="/javascripts/views/sic/claseevaluaciontecnica.js") 
script(type="text/javascript", src="/javascripts/views/sic/criteriosevaluacion.js")  
script(type="text/javascript", src="/javascripts/views/sic/criteriosevaluacion2.js") 
script(type="text/javascript", src="/javascripts/views/sic/criteriosevaluacion3.js")   
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (14, N'solicitudcontrato', 4, N'Contenido', 2, N'
style.
 .ui-th-column>div, .ui-jqgrid-btable .jqgrow>td {
 word-wrap: break-word;
 white-space: pre-wrap;
 white-space: -moz-pre-wrap;
 white-space: -pre-wrap;
 white-space: -o-pre-wrap;
 overflow: hidden;
 vertical-align: middle;
 }
 .ui-jqgrid tr.jqgrow td {
 white-space: normal !important;
 height:auto;
 vertical-align:text-top;
 padding-top:2px;
 }
script(type="text/javascript", src="/javascripts/views/sic/solicitudcontrato.js")
script(type="text/javascript", src="/javascripts/views/sic/estadosolicitud.js")  
script(type="text/javascript", src="/javascripts/views/sic/preguntas.js")
script(type="text/javascript", src="/javascripts/views/sic/asignar.js")
script(type="text/javascript", src="/javascripts/views/sic/respuestas.js")
script(type="text/javascript", src="/javascripts/views/sic/respuestasrfp.js") 
script(type="text/javascript", src="/javascripts/views/sic/participantesproveedor.js")   
script(type="text/javascript", src="/javascripts/views/sic/evaluacioneconomica.js")
script(type="text/javascript", src="/javascripts/views/sic/flujocotizacion.js")  
script(type="text/javascript", src="/javascripts/views/sic/cotizacionservicio.js") 
script(type="text/javascript", src="/javascripts/views/sic/evaluaciontecnica.js") 
script(type="text/javascript", src="/javascripts/views/sic/evaluaciontecnica2.js") 
script(type="text/javascript", src="/javascripts/views/sic/evaluaciontecnica3.js")
script(type="text/javascript", src="/javascripts/views/sic/evaluaciontecnica4.js")
script(type="text/javascript", src="/javascripts/views/sic/matrizevaluacion.js")
script(type="text/javascript", src="/javascripts/views/sic/matrizevaluacion2.js")
script(type="text/javascript", src="/javascripts/views/sic/matrizevaluacion3.js")
script(type="text/javascript", src="/javascripts/views/sic/matrizevaluacion2e.js")
script(type="text/javascript", src="/javascripts/views/sic/matrizevaluaciontotal.js")
script(type="text/javascript", src="/javascripts/views/sic/bitacora.js")
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (15, N'graficotest', 5, N'Contenido', 1, N' 
script(type="text/javascript", src="/javascripts/views/grafico2.js")
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (16, N'dash1', 2, N'Contenido', 1, N' 
link(rel="stylesheet", href="/stylesheets/dashboard.css", type="text/css", media="screen", charset="utf-8")
script(type="text/javascript", src="/javascripts/dashboard.js")
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (17, N'cargadte', 1, N'Contenido', 1, N'        
link(rel="stylesheet", href="stylesheets/font-awesome-4.7.0/css/font-awesome.min.css", type="text/css", media="screen", charset="utf-8")
script(type="text/javascript", src="/javascripts/views/cargadte.js")
script(type="text/javascript", src="/javascripts/ajaxfileupload.js")
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (18, N'cargas', 1, N'Contenido', 1, N' 
link(rel="stylesheet", href="stylesheets/font-awesome-4.7.0/css/font-awesome.min.css", type="text/css", media="screen", charset="utf-8")           
script(type="text/javascript", src="/javascripts/views/cargas.js")
script(type="text/javascript", src="/javascripts/ajaxfileupload.js")
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (19, N'conceptos', 1, N'Contenido', 1, N'      
script(type="text/javascript", src="/javascripts/views/conceptos.js")
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (20, N'cuentascontables', 1, N'Contenido', 1, N'
script(type="text/javascript", src="/javascripts/views/cuentascontables.js")
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (21, N'factorrecuperacion', 1, N'Contenido', 1, N' 
script(type="text/javascript", src="/javascripts/views/factorrecuperacion.js")
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (22, N'iniciativas', 1, N'Contenido', 1, N'
script(type="text/javascript", src="/javascripts/views/iniciativa.js")
script(type="text/javascript", src="/javascripts/views/iniciativaprograma.js")
script(type="text/javascript", src="/javascripts/views/iniciativafecha.js")
script(type="text/javascript", src="/javascripts/views/presupuestoiniciativa.js")
script(type="text/javascript", src="/javascripts/views/tareasnuevosproyectos.js")
script(type="text/javascript", src="/javascripts/views/flujonuevatarea.js")
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (23, N'compromisosporcui', 1, N'Contenido', 1, N' 
script(type="text/javascript", src="/javascripts/views/compromisosporcui.js")
script(type="text/javascript", src="/javascripts/views/compromisosporcuiservicios.js")
script(type="text/javascript", src="/javascripts/views/compromisosporcuiflujos.js")
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (24, N'planiniciativas', 1, N'Contenido', 1, N' 
script(type="text/javascript", src="/javascripts/views/planiniciativas.js")   
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (25, N'iniciativasconsulta', 1, N'Contenido', 1, N' 
script(type="text/javascript", src="/javascripts/views/iniciativaconsulta.js")
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (26, N'nuevosproyectos', 1, N'Contenido', 1, N' 
script(type="text/javascript", src="/javascripts/views/nuevosproyectos.js")
script(type="text/javascript", src="/javascripts/views/tareasnuevosproyecto.js")
script(type="text/javascript", src="/javascripts/views/flujonuevatarea.js")
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (27, N'plantilla', 1, N'Contenido', 1, N' 
script(type="text/javascript", src="/javascripts/views/plantilla.js")  
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (28, N'solicitud', 1, N'Contenido', 1, N' 
script(type="text/javascript", src="/javascripts/views/solicitud.js")          
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (29, N'prefactura', 1, N'Contenido', 1, N' 
script(type="text/javascript", src="/javascripts/views/prefactura.js")     
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (30, N'prefacturas', 1, N'Contenido', 1, N' 
script(type="text/javascript", src="/javascripts/views/prefacturas.js")
script(type="text/javascript", src="/javascripts/views/solicitudesfactura.js")
script(type="text/javascript", src="/javascripts/views/desglosesolicitud.js")
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (31, N'pert', 1, N'Contenido', 1, N' 
script(type="text/javascript", src="/javascripts/views/pert.js")
script(type="text/javascript", src="/javascripts/go/go-debug.js")   
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (32, N'genprefacturas', 1, N'Contenido', 1, N' 
script(type="text/javascript", src="/javascripts/views/solicitudesaprobadas.js")
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (33, N'genprefacturasproy', 1, N'Contenido', 1, N' 
script(type="text/javascript", src="/javascripts/views/solicitudesaprobadasproy.js")
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (34, N'solicitudProyectos', 1, N'Contenido', 1, N' 
script(type="text/javascript", src="/javascripts/views/solicitudProyectos.js")       
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (35, N'facturas', 1, N'Contenido', 1, N' 
script(type="text/javascript", src="/javascripts/views/facturas.js")
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (36, N'presupuesto', 1, N'Contenido', 1, N' 
script(type="text/javascript", src="/javascripts/views/presupuesto.js")
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (37, N'presupuestoaprueba', 1, N'Contenido', 1, N' 
script(type="text/javascript", src="/javascripts/views/presupuestoaprueba.js")     
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (38, N'presupuestoeditcosto', 1, N'Contenido', 1, N' 
script(type="text/javascript", src="/javascripts/views/presupuestoeditcosto.js")   
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (39, N'presupuestoenvuelo', 1, N'Contenido', 1, N' 
script(type="text/javascript", src="/javascripts/views/presupuestoenvuelo.js")
script(type="text/javascript", src="/javascripts/views/tareaenvuelo.js")
script(type="text/javascript", src="/javascripts/views/fechaenvuelo.js")
script(type="text/javascript", src="/javascripts/views/conversionenvuelo.js")
script(type="text/javascript", src="/javascripts/views/flujopagoenvuelo.js")
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (40, N'inscripcionsap', 1, N'Contenido', 1, N' 
script(type="text/javascript", src="/javascripts/views/inscripcionsap.js")
script(type="text/javascript", src="/javascripts/views/tareasinscripcion.js")
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (41, N'proveedores', 1, N'Contenido', 1, N' 
script(type="text/javascript", src="/javascripts/views/proveedor.js")
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (42, N'parametros', 1, N'Contenido', 1, N' 
script(type="text/javascript", src="/javascripts/views/parametro.js")
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (43, N'roles', 1, N'Contenido', 1, N' 
script(type="text/javascript", src="/javascripts/views/roles.js")
script(type="text/javascript", src="/javascripts/views/roles2.js")
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (44, N'permisos', 1, N'Contenido', 1, N' 
script(type="text/javascript", src="/javascripts/views/permisos.js")
script(type="text/javascript", src="/javascripts/views/permisos2.js")
script(type="text/javascript", src="/javascripts/views/permisos3.js")
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (45, N'proyectos', 1, N'Contenido', 1, N' 
script(type="text/javascript", src="/javascripts/views/proyecto.js")
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (46, N'serviciosext', 1, N'Contenido', 1, N' 
script(type="text/javascript", src="/javascripts/views/servicios.js")
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (47, N'registro', 1, N'Contenido', 1, N' 
script(type="text/javascript", src="/javascripts/views/registro.js")
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (48, N'roldenegocio', 1, N'Contenido', 1, N' 
script(type="text/javascript", src="/javascripts/views/roldenegocio.js")
script(type="text/javascript").
 var uid = #{user[0].uid};
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (49, N'sysadmin', 1, N'Administrador de páginas', 1, N' 
script(type="text/javascript", src="/javascripts/views/sysadmin.js")
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (52, N'solicitudcontratofinal', 4, N'Solicitudes de Contrato', 2, N'style.
 .ui-th-column>div, .ui-jqgrid-btable .jqgrow>td {
 word-wrap: break-word;
 white-space: pre-wrap;
 white-space: -moz-pre-wrap;
 white-space: -pre-wrap;
 white-space: -o-pre-wrap;
 overflow: hidden;
 vertical-align: middle;
 }
 .ui-jqgrid tr.jqgrow td {
 white-space: normal !important;
 height:auto;
 vertical-align:text-top;
 padding-top:2px;
 }
script(type="text/javascript", src="/javascripts/views/sic/solicitudcontratofinal.js")
script(type="text/javascript", src="/javascripts/views/sic/estadosolicitud.js")  
script(type="text/javascript", src="/javascripts/views/sic/bitacora.js")
script(type="text/javascript", src="/javascripts/views/sic/adjudicacion.js")
script(type="text/javascript", src="/javascripts/views/sic/adjudicados.js")
script(type="text/javascript", src="/javascripts/views/sic/contratoadjudicado.js")
script(type="text/javascript", src="/javascripts/views/sic/tocsolcon.js")', 1)
SET IDENTITY_INSERT [lin].[pagina] OFF
SET IDENTITY_INSERT [lin].[menu] ON 

INSERT [lin].[menu] ([id], [descripcion], [url], [pid], [nivel], [borrado], [idsistema], [secuencia]) VALUES (1, N'MAC', N'mac', NULL, 0, 1, 1, 1)
INSERT [lin].[menu] ([id], [descripcion], [url], [pid], [nivel], [borrado], [idsistema], [secuencia]) VALUES (2, N'Control de Límites', N'presupuesto', NULL, 0, 1, 1, 2)
INSERT [lin].[menu] ([id], [descripcion], [url], [pid], [nivel], [borrado], [idsistema], [secuencia]) VALUES (5, N'Parametros', N'parametros', NULL, 0, 1, 1, 3)
INSERT [lin].[menu] ([id], [descripcion], [url], [pid], [nivel], [borrado], [idsistema], [secuencia]) VALUES (6, N'Dashboard', N'dashboard', NULL, 0, 1, 1, 4)
INSERT [lin].[menu] ([id], [descripcion], [url], [pid], [nivel], [borrado], [idsistema], [secuencia]) VALUES (7, N'Control de Usuario', N'controldeusuario', NULL, 0, 1, 1, 5)
INSERT [lin].[menu] ([id], [descripcion], [url], [pid], [nivel], [borrado], [idsistema], [secuencia]) VALUES (8, N'Cartera', N'menu/cartera', 1, 1, 1, 1, 1)
INSERT [lin].[menu] ([id], [descripcion], [url], [pid], [nivel], [borrado], [idsistema], [secuencia]) VALUES (9, N'Grupos', N'menu/grupos', 5, 1, 1, 1, 1)
INSERT [lin].[menu] ([id], [descripcion], [url], [pid], [nivel], [borrado], [idsistema], [secuencia]) VALUES (11, N'Roles por Usuario', N'menu/rolesporusuario', 7, 1, 1, 1, 1)
INSERT [lin].[menu] ([id], [descripcion], [url], [pid], [nivel], [borrado], [idsistema], [secuencia]) VALUES (12, N'Permisos por Rol', N'menu/permisosporrol', 7, 1, 1, 1, 2)
INSERT [lin].[menu] ([id], [descripcion], [url], [pid], [nivel], [borrado], [idsistema], [secuencia]) VALUES (110, N'Operaciones', N'menu/operaciones', 2, 1, 1, 1, 1)
INSERT [lin].[menu] ([id], [descripcion], [url], [pid], [nivel], [borrado], [idsistema], [secuencia]) VALUES (111, N'Dashboard', N'menu/dashboard', 6, 1, 1, 1, 1)
INSERT [lin].[menu] ([id], [descripcion], [url], [pid], [nivel], [borrado], [idsistema], [secuencia]) VALUES (1110, N'Grupal', N'menu/macgrupal', 1, 1, 1, 1, 2)
INSERT [lin].[menu] ([id], [descripcion], [url], [pid], [nivel], [borrado], [idsistema], [secuencia]) VALUES (1111, N'Crear Aprobación', N'menu/crearaprobacion', 1, 1, 1, 1, 2)
SET IDENTITY_INSERT [lin].[menu] OFF
SET IDENTITY_INSERT [lin].[rol_func] ON 

INSERT [lin].[rol_func] ([id], [rid], [fid], [mid], [borrado]) VALUES (20, 7, NULL, 1, 1)
INSERT [lin].[rol_func] ([id], [rid], [fid], [mid], [borrado]) VALUES (21, 6, NULL, 2, 1)
INSERT [lin].[rol_func] ([id], [rid], [fid], [mid], [borrado]) VALUES (22, 7, NULL, 5, 1)
INSERT [lin].[rol_func] ([id], [rid], [fid], [mid], [borrado]) VALUES (23, 7, NULL, 6, 1)
INSERT [lin].[rol_func] ([id], [rid], [fid], [mid], [borrado]) VALUES (24, 7, NULL, 7, 1)
INSERT [lin].[rol_func] ([id], [rid], [fid], [mid], [borrado]) VALUES (35, 7, NULL, 8, 1)
INSERT [lin].[rol_func] ([id], [rid], [fid], [mid], [borrado]) VALUES (46, 7, NULL, 9, 1)
INSERT [lin].[rol_func] ([id], [rid], [fid], [mid], [borrado]) VALUES (56, 7, NULL, 11, 1)
INSERT [lin].[rol_func] ([id], [rid], [fid], [mid], [borrado]) VALUES (59, 7, NULL, 12, 1)
INSERT [lin].[rol_func] ([id], [rid], [fid], [mid], [borrado]) VALUES (171, 6, NULL, 110, 1)
INSERT [lin].[rol_func] ([id], [rid], [fid], [mid], [borrado]) VALUES (1171, 7, NULL, 1111, 1)
SET IDENTITY_INSERT [lin].[rol_func] OFF
