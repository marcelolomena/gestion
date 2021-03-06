USE [controldelimites]
GO
SET IDENTITY_INSERT [scl].[Aprobacion] ON 

INSERT [scl].[Aprobacion] ([Id], [Nombre], [Rut], [Actividad], [Oficina], [Ejecutivo], [FechaCreacion], [FechaVenc], [FechaVencAnt], [RatingInd], [RatingGrupo], [Clasificacion], [Vigilancia], [FechaInfFin], [PromSaldoVista], [DeudaSbifDirecta], [DeudaSbifIndirecta], [Penetracion], [Leasing], [NivelAtribucion], [Empresa_Id], [TipoAprobacion_Id], [EstadoAprobacion_Id], [FechaUltAct], [Aprobado], [Utilizado]) VALUES (1, N'DROGUETT & RABY INGENIERIA Y SERVICIOS LTDA', N'77832610', N'SUBCONTRATISTAS DE EDIFICACION', N'HUERFANOS 740', N'Rodolfo Martínez', N'03-07-2017', N'03-07-2018', N'2018-06-30', N'S/R', N'S/R', N'A6', N'No', N'30-04-2017', N'90640000', N'1317925', N'0', N'0,28', N'0', N'N/A', 1, 1, 1, N'22-08-2017', N'1', N'0')
INSERT [scl].[Aprobacion] ([Id], [Nombre], [Rut], [Actividad], [Oficina], [Ejecutivo], [FechaCreacion], [FechaVenc], [FechaVencAnt], [RatingInd], [RatingGrupo], [Clasificacion], [Vigilancia], [FechaInfFin], [PromSaldoVista], [DeudaSbifDirecta], [DeudaSbifIndirecta], [Penetracion], [Leasing], [NivelAtribucion], [Empresa_Id], [TipoAprobacion_Id], [EstadoAprobacion_Id], [FechaUltAct], [Aprobado], [Utilizado]) VALUES (2, N'COMERCIAL APERITIVO CHILE LIMITADA', N'76265440', N'PRODUCTOS ALIMENTICIOS, BEBIDAS Y TABACOS', N'HUERFANOS 740', N'Roberto Alejandro Castillo', N'30-08-2016', N'30-08-2017', N'25-08-2017', N'S/R', N'S/R', N'A4', N'No', N'30-06-2016', N'21662000', N'33550', N'0', N'100%', N'7442', N'N/A', 2, 1, 1, N'22-08-2017', N'1', N'0')
INSERT [scl].[Aprobacion] ([Id], [Nombre], [Rut], [Actividad], [Oficina], [Ejecutivo], [FechaCreacion], [FechaVenc], [FechaVencAnt], [RatingInd], [RatingGrupo], [Clasificacion], [Vigilancia], [FechaInfFin], [PromSaldoVista], [DeudaSbifDirecta], [DeudaSbifIndirecta], [Penetracion], [Leasing], [NivelAtribucion], [Empresa_Id], [TipoAprobacion_Id], [EstadoAprobacion_Id], [FechaUltAct], [Aprobado], [Utilizado]) VALUES (3, N'COMPAÑÍA INDUSTRIAL EL VOLCAN S.A.', N'90209000', N'Fabricación de materiales para la construcción.', NULL, N'J BRAVO', N'04-07-2017', N'04-07-2018', N'25-05-2017', N'8,5', N'7', N'A3', N'No', N'31-12-2016', N'288000', N'0', N'10146454', N'', N'0', N'R2', 3, 1, 1, N'22-08-2017', N'32388750', N'0')
INSERT [scl].[Aprobacion] ([Id], [Nombre], [Rut], [Actividad], [Oficina], [Ejecutivo], [FechaCreacion], [FechaVenc], [FechaVencAnt], [RatingInd], [RatingGrupo], [Clasificacion], [Vigilancia], [FechaInfFin], [PromSaldoVista], [DeudaSbifDirecta], [DeudaSbifIndirecta], [Penetracion], [Leasing], [NivelAtribucion], [Empresa_Id], [TipoAprobacion_Id], [EstadoAprobacion_Id], [FechaUltAct], [Aprobado], [Utilizado]) VALUES (4, N'COMERCIAL FRUTICOLA S.A', N'79663940', N'EXPORTADORA DE FRUTA CONGELADA Y FRESCA', NULL, N'Marcela Castro', N'19-06-2017
', N'19-06-2018', N'28-06-0217', N'5,5', N'5,5', N'A5', N'No', N'31-03-2017', N'70504', N'40809715', N'0', N'13,3%', N'766367', N'R3', 8, 1, 1, N'22-08-2017', N'6590937', N'5566245')
SET IDENTITY_INSERT [scl].[Aprobacion] OFF
SET IDENTITY_INSERT [scl].[AprobacionLinea] ON 

INSERT [scl].[AprobacionLinea] ([Id], [Aprobacion_Id], [Linea_Id]) VALUES (1, 1, 1)
INSERT [scl].[AprobacionLinea] ([Id], [Aprobacion_Id], [Linea_Id]) VALUES (2, 1, 2)
INSERT [scl].[AprobacionLinea] ([Id], [Aprobacion_Id], [Linea_Id]) VALUES (3, 1, 3)
INSERT [scl].[AprobacionLinea] ([Id], [Aprobacion_Id], [Linea_Id]) VALUES (4, 1, 4)
INSERT [scl].[AprobacionLinea] ([Id], [Aprobacion_Id], [Linea_Id]) VALUES (5, 1, 5)
INSERT [scl].[AprobacionLinea] ([Id], [Aprobacion_Id], [Linea_Id]) VALUES (6, 1, 6)
INSERT [scl].[AprobacionLinea] ([Id], [Aprobacion_Id], [Linea_Id]) VALUES (7, 1, 7)
INSERT [scl].[AprobacionLinea] ([Id], [Aprobacion_Id], [Linea_Id]) VALUES (8, 1, 8)
INSERT [scl].[AprobacionLinea] ([Id], [Aprobacion_Id], [Linea_Id]) VALUES (9, 2, 13)
INSERT [scl].[AprobacionLinea] ([Id], [Aprobacion_Id], [Linea_Id]) VALUES (10, 2, 14)
INSERT [scl].[AprobacionLinea] ([Id], [Aprobacion_Id], [Linea_Id]) VALUES (11, 2, 15)
INSERT [scl].[AprobacionLinea] ([Id], [Aprobacion_Id], [Linea_Id]) VALUES (12, 2, 16)
INSERT [scl].[AprobacionLinea] ([Id], [Aprobacion_Id], [Linea_Id]) VALUES (13, 2, 17)
INSERT [scl].[AprobacionLinea] ([Id], [Aprobacion_Id], [Linea_Id]) VALUES (14, 2, 18)
INSERT [scl].[AprobacionLinea] ([Id], [Aprobacion_Id], [Linea_Id]) VALUES (15, 2, 19)
INSERT [scl].[AprobacionLinea] ([Id], [Aprobacion_Id], [Linea_Id]) VALUES (16, 2, 20)
INSERT [scl].[AprobacionLinea] ([Id], [Aprobacion_Id], [Linea_Id]) VALUES (17, 3, 21)
INSERT [scl].[AprobacionLinea] ([Id], [Aprobacion_Id], [Linea_Id]) VALUES (18, 3, 22)
INSERT [scl].[AprobacionLinea] ([Id], [Aprobacion_Id], [Linea_Id]) VALUES (19, 3, 23)
SET IDENTITY_INSERT [scl].[AprobacionLinea] OFF
SET IDENTITY_INSERT [scl].[Comentario] ON 

INSERT [scl].[Comentario] ([Id], [Comentario], [NombreUsuario], [Fecha], [Documento_Id], [Comentario_Id]) VALUES (1, N'Bullet por MM$7 a 8 meses plazo, renovable en su vencimiento por otros 2 meses. garantia fogape del 80% corresponde a credito N° 2033.', N'Roberto Castillo', N'30-08-2016', NULL, NULL)
INSERT [scl].[Comentario] ([Id], [Comentario], [NombreUsuario], [Fecha], [Documento_Id], [Comentario_Id]) VALUES (2, N'Se solicita linea capital de trabajo por M$50.000, para curse de bullet a 180 dias, renovable una vez. credito comerciales a 12 meses, carta de credito', N'Roberto Castillo', N'30-08-2016', NULL, NULL)
INSERT [scl].[Comentario] ([Id], [Comentario], [NombreUsuario], [Fecha], [Documento_Id], [Comentario_Id]) VALUES (3, N'CUPO MN: MM$2,5 ; Cupo ME MUS$ 5', N'Marcela Castro', N'24-08-2017', NULL, NULL)
INSERT [scl].[Comentario] ([Id], [Comentario], [NombreUsuario], [Fecha], [Documento_Id], [Comentario_Id]) VALUES (4, N'Cliente deberá hacer un clean up de un 30% en
los meses de noviembre o diciembre. ', N'Marcela Castro', N'24-08-2017', NULL, NULL)
INSERT [scl].[Comentario] ([Id], [Comentario], [NombreUsuario], [Fecha], [Documento_Id], [Comentario_Id]) VALUES (5, N'Operación de PAE puntual por MUS$ 3.000, plazo
vencimiento Octubre 2017', N'Marcela Castro', N'24-08-2017', NULL, NULL)
INSERT [scl].[Comentario] ([Id], [Comentario], [NombreUsuario], [Fecha], [Documento_Id], [Comentario_Id]) VALUES (6, N'Se solicita aprobar aumento de MUS$ 1.000 a MUS$
1.200. Pudiendo ser utilizada en operaciones de
Leasing o Leaseback hasta 48 meses. Se solicita
autorización para no prendar el bien al término del
contrato.', N'Marcela Castro', N'24-08-2017', NULL, NULL)
INSERT [scl].[Comentario] ([Id], [Comentario], [NombreUsuario], [Fecha], [Documento_Id], [Comentario_Id]) VALUES (7, N'Con fecha 19/11/2015 se autorizó a cursar Boleta de
garantia a Favor de Instituto de Desarrollo Agropecuario.
Cauciona: Fiel cumplimiento convenio Indao Comfrut
para el programa de alianzas productivas. Vcmto
16/03/2017', N'Marcela Castro', N'24-08-2017', NULL, NULL)
INSERT [scl].[Comentario] ([Id], [Comentario], [NombreUsuario], [Fecha], [Documento_Id], [Comentario_Id]) VALUES (8, N'Línea compra cheques propios sobre cuenta BCI o
Santander Sucursal Miami', N'Marcela Castro', N'24-08-2017', NULL, NULL)
SET IDENTITY_INSERT [scl].[Comentario] OFF
SET IDENTITY_INSERT [scl].[ComentarioSublinea] ON 

INSERT [scl].[ComentarioSublinea] ([Id], [Sublinea_Id], [Comentario_Id]) VALUES (1, 3, 1)
INSERT [scl].[ComentarioSublinea] ([Id], [Sublinea_Id], [Comentario_Id]) VALUES (2, 7, 2)
INSERT [scl].[ComentarioSublinea] ([Id], [Sublinea_Id], [Comentario_Id]) VALUES (3, 38, 3)
INSERT [scl].[ComentarioSublinea] ([Id], [Sublinea_Id], [Comentario_Id]) VALUES (4, 39, 4)
INSERT [scl].[ComentarioSublinea] ([Id], [Sublinea_Id], [Comentario_Id]) VALUES (5, 40, 5)
INSERT [scl].[ComentarioSublinea] ([Id], [Sublinea_Id], [Comentario_Id]) VALUES (6, 42, 6)
INSERT [scl].[ComentarioSublinea] ([Id], [Sublinea_Id], [Comentario_Id]) VALUES (7, 43, 7)
INSERT [scl].[ComentarioSublinea] ([Id], [Sublinea_Id], [Comentario_Id]) VALUES (8, 44, 8)
SET IDENTITY_INSERT [scl].[ComentarioSublinea] OFF
SET IDENTITY_INSERT [scl].[Condicion] ON 

INSERT [scl].[Condicion] ([Id], [Descripcion], [Sublinea_Id], [TipoCondicion], [Rut], [Nombre], [DV]) VALUES (2, N'Garantias Personales/Aval', 18, N'Aval', N'10956073', N'Rodrigo Bustos', N'1')
INSERT [scl].[Condicion] ([Id], [Descripcion], [Sublinea_Id], [TipoCondicion], [Rut], [Nombre], [DV]) VALUES (3, N'Garantias Personales/Aval', 23, N'Aval', N'10956073', N'Rodrigo Bustos', N'1')
INSERT [scl].[Condicion] ([Id], [Descripcion], [Sublinea_Id], [TipoCondicion], [Rut], [Nombre], [DV]) VALUES (4, N'Garantias Personales/Aval', 24, N'Aval', N'10956073', N'Rodrigo Bustos', N'1')
INSERT [scl].[Condicion] ([Id], [Descripcion], [Sublinea_Id], [TipoCondicion], [Rut], [Nombre], [DV]) VALUES (5, N'Garantias Personales/Aval', 25, N'Aval', N'10956073', N'Rodrigo Bustos', N'1')
INSERT [scl].[Condicion] ([Id], [Descripcion], [Sublinea_Id], [TipoCondicion], [Rut], [Nombre], [DV]) VALUES (6, N'Garantias Personales/Aval', 18, N'Aval', N'13234007', N'Ignacio Muñoz', N'2')
INSERT [scl].[Condicion] ([Id], [Descripcion], [Sublinea_Id], [TipoCondicion], [Rut], [Nombre], [DV]) VALUES (7, N'Garantias Personales/Aval', 23, N'Aval', N'13234007', N'Ignacio Muñoz', N'2')
INSERT [scl].[Condicion] ([Id], [Descripcion], [Sublinea_Id], [TipoCondicion], [Rut], [Nombre], [DV]) VALUES (8, N'Garantias Personales/Aval', 24, N'Aval', N'13234007', N'Ignacio Muñoz', N'2')
INSERT [scl].[Condicion] ([Id], [Descripcion], [Sublinea_Id], [TipoCondicion], [Rut], [Nombre], [DV]) VALUES (9, N'Garantias Personales/Aval', 25, N'Aval', N'13234007', N'Ignacio Muñoz', N'2')
INSERT [scl].[Condicion] ([Id], [Descripcion], [Sublinea_Id], [TipoCondicion], [Rut], [Nombre], [DV]) VALUES (10, N'Garantias Personales/Aval', 1, N'Aval', N'13040985', N'Paulina Raby Z.', N'7')
INSERT [scl].[Condicion] ([Id], [Descripcion], [Sublinea_Id], [TipoCondicion], [Rut], [Nombre], [DV]) VALUES (11, N'Garantias Personales/Aval', 2, N'Aval', N'13040985', N'Paulina Raby Z.', N'7')
INSERT [scl].[Condicion] ([Id], [Descripcion], [Sublinea_Id], [TipoCondicion], [Rut], [Nombre], [DV]) VALUES (12, N'Garantias Personales/Aval', 1, N'Aval', N'10723799', N'Ivan Droguett S.', N'2')
INSERT [scl].[Condicion] ([Id], [Descripcion], [Sublinea_Id], [TipoCondicion], [Rut], [Nombre], [DV]) VALUES (13, N'Garantias Personales/Aval', 2, N'Aval', N'10723799', N'Ivan Droguett S.', N'2')
INSERT [scl].[Condicion] ([Id], [Descripcion], [Sublinea_Id], [TipoCondicion], [Rut], [Nombre], [DV]) VALUES (14, N'Garantias Personales/Aval', 3, N'Aval', N'10723799', N'Ivan Droguett S.', N'2')
INSERT [scl].[Condicion] ([Id], [Descripcion], [Sublinea_Id], [TipoCondicion], [Rut], [Nombre], [DV]) VALUES (15, N'Garantias Personales/Aval', 4, N'Aval', N'10723799', N'Ivan Droguett S.', N'2')
INSERT [scl].[Condicion] ([Id], [Descripcion], [Sublinea_Id], [TipoCondicion], [Rut], [Nombre], [DV]) VALUES (16, N'Garantias Personales/Aval', 6, N'Aval', N'10723799', N'Ivan Droguett S.', N'2')
INSERT [scl].[Condicion] ([Id], [Descripcion], [Sublinea_Id], [TipoCondicion], [Rut], [Nombre], [DV]) VALUES (17, N'Garantias Personales/Aval', 7, N'Aval', N'10723799', N'Ivan Droguett S.', N'2')
INSERT [scl].[Condicion] ([Id], [Descripcion], [Sublinea_Id], [TipoCondicion], [Rut], [Nombre], [DV]) VALUES (18, N'Garantias Personales/Aval', 8, N'Aval', N'10723799', N'Ivan Droguett S.', N'2')
SET IDENTITY_INSERT [scl].[Condicion] OFF
SET IDENTITY_INSERT [scl].[Empresa] ON 

INSERT [scl].[Empresa] ([Id], [Nombre], [Alias], [Rut], [Riesgo], [Rating], [Ejecutivo], [Banca], [Pep], [Oficina], [Vigilancia], [Dv], [Comportamiento]) VALUES (1, N'DROGUETT & RABY INGENIERIA Y SERVICIOS LTDA', N'DROGUETT & RABY', N'77832610', N'A6', N'S/R', N'Rodolfo Martínez', N'Pyme', N'', N'Huérfanos 740', N'No', N'8', N'Verde')
INSERT [scl].[Empresa] ([Id], [Nombre], [Alias], [Rut], [Riesgo], [Rating], [Ejecutivo], [Banca], [Pep], [Oficina], [Vigilancia], [Dv], [Comportamiento]) VALUES (2, N'COMERCIAL APERITIVO CHILE LIMITADA', N'COMERCIAL APERITIVO', N'76265440', N'A4', N'S/R', N'Roberto Alejandro Castillo', N'Pyme', N'', N'Huérfanos 740', N'No', N'7', N'Rojo')
INSERT [scl].[Empresa] ([Id], [Nombre], [Alias], [Rut], [Riesgo], [Rating], [Ejecutivo], [Banca], [Pep], [Oficina], [Vigilancia], [Dv], [Comportamiento]) VALUES (3, N'COMPAÑÍA INDUSTRIAL EL VOLCAN S.A.', N'CIA EL VOLCAN', N'90209000', N'A3', N'8,5', N'J.bravo', N'Corporativa', N'', NULL, N'No', N'2', N'Verde')
INSERT [scl].[Empresa] ([Id], [Nombre], [Alias], [Rut], [Riesgo], [Rating], [Ejecutivo], [Banca], [Pep], [Oficina], [Vigilancia], [Dv], [Comportamiento]) VALUES (4, N'AISLANTES VOLCAN S.A', N'AISLANTES VOLCAN', N'96848750', N'A3', N'S/R', N'J.Bravo', N'Corporativa', N' ', NULL, N'No', N'7', N'Verde')
INSERT [scl].[Empresa] ([Id], [Nombre], [Alias], [Rut], [Riesgo], [Rating], [Ejecutivo], [Banca], [Pep], [Oficina], [Vigilancia], [Dv], [Comportamiento]) VALUES (5, N'FIBROCEMENTOS VOLCAN LTDA', N'FIBROCEMENTOS VOLCAN', N'77524300', N'A3', N'S/R', N'J.Bravo', N'Corporativa', N'', NULL, N'No', N'7', N'Verde')
INSERT [scl].[Empresa] ([Id], [Nombre], [Alias], [Rut], [Riesgo], [Rating], [Ejecutivo], [Banca], [Pep], [Oficina], [Vigilancia], [Dv], [Comportamiento]) VALUES (6, N'MINERA LO VALDES LTDA', N'MIN LO VALDES', N'84707300', N'A3', N'S/R', N'J.Bravo', N'Corporativa', N'', NULL, N'No', N'4', N'Verde')
INSERT [scl].[Empresa] ([Id], [Nombre], [Alias], [Rut], [Riesgo], [Rating], [Ejecutivo], [Banca], [Pep], [Oficina], [Vigilancia], [Dv], [Comportamiento]) VALUES (7, N'TRANSPORTES EL YESO LTDA', N'TRANS EL YESO', N'78325650', N'A3', N'S/R', N'J.Bravo', N'Corporativa', N'', NULL, N'No', N'9', N'Verde')
INSERT [scl].[Empresa] ([Id], [Nombre], [Alias], [Rut], [Riesgo], [Rating], [Ejecutivo], [Banca], [Pep], [Oficina], [Vigilancia], [Dv], [Comportamiento]) VALUES (8, N'COMERCIAL FRUTICOLA S.A', N'FRUTICOLA S.A', N'79663940', N'A5 ', N'5,5 ', N'Marcela Castro', N'Mayorista', N' ', NULL, N'No', N'7', N'Verde')
INSERT [scl].[Empresa] ([Id], [Nombre], [Alias], [Rut], [Riesgo], [Rating], [Ejecutivo], [Banca], [Pep], [Oficina], [Vigilancia], [Dv], [Comportamiento]) VALUES (9, N'PABLO HEVIA FABRES', N'PABLO HEVIA', N'7055374', N'A2', N'S/R', N'Marcela Castro', N'Mayorista', N'', NULL, N'No', N'0', N'Verde')
INSERT [scl].[Empresa] ([Id], [Nombre], [Alias], [Rut], [Riesgo], [Rating], [Ejecutivo], [Banca], [Pep], [Oficina], [Vigilancia], [Dv], [Comportamiento]) VALUES (10, N'INVERSIONES TAGLE LIMITADA ', N'INVERSIONES TAGLE', N'76014622', N'A3', N'S/R', N'Marcela Castro', N'Mayorista', N'', NULL, N'No', N'6', N'Verde')
INSERT [scl].[Empresa] ([Id], [Nombre], [Alias], [Rut], [Riesgo], [Rating], [Ejecutivo], [Banca], [Pep], [Oficina], [Vigilancia], [Dv], [Comportamiento]) VALUES (11, N'M. MAGDALENA TAGLE SUBERCASEUX', N'MAGDALENA TAGLE', N'11347809', N'A2', N'S/R', N'Marcela Castro', N'Mayorista', N'', NULL, N'No', N'8', N'Verde')
SET IDENTITY_INSERT [scl].[Empresa] OFF
SET IDENTITY_INSERT [scl].[EmpresaSublinea] ON 

INSERT [scl].[EmpresaSublinea] ([Id], [Empresa_Id], [Sublinea_Id]) VALUES (1, 1, 1)
INSERT [scl].[EmpresaSublinea] ([Id], [Empresa_Id], [Sublinea_Id]) VALUES (2, 1, 2)
INSERT [scl].[EmpresaSublinea] ([Id], [Empresa_Id], [Sublinea_Id]) VALUES (3, 1, 3)
INSERT [scl].[EmpresaSublinea] ([Id], [Empresa_Id], [Sublinea_Id]) VALUES (4, 1, 4)
INSERT [scl].[EmpresaSublinea] ([Id], [Empresa_Id], [Sublinea_Id]) VALUES (5, 1, 5)
INSERT [scl].[EmpresaSublinea] ([Id], [Empresa_Id], [Sublinea_Id]) VALUES (6, 1, 6)
INSERT [scl].[EmpresaSublinea] ([Id], [Empresa_Id], [Sublinea_Id]) VALUES (7, 1, 7)
INSERT [scl].[EmpresaSublinea] ([Id], [Empresa_Id], [Sublinea_Id]) VALUES (8, 1, 8)
INSERT [scl].[EmpresaSublinea] ([Id], [Empresa_Id], [Sublinea_Id]) VALUES (11, 2, 18)
INSERT [scl].[EmpresaSublinea] ([Id], [Empresa_Id], [Sublinea_Id]) VALUES (12, 2, 19)
INSERT [scl].[EmpresaSublinea] ([Id], [Empresa_Id], [Sublinea_Id]) VALUES (13, 2, 20)
INSERT [scl].[EmpresaSublinea] ([Id], [Empresa_Id], [Sublinea_Id]) VALUES (14, 2, 21)
INSERT [scl].[EmpresaSublinea] ([Id], [Empresa_Id], [Sublinea_Id]) VALUES (15, 2, 22)
INSERT [scl].[EmpresaSublinea] ([Id], [Empresa_Id], [Sublinea_Id]) VALUES (16, 2, 23)
INSERT [scl].[EmpresaSublinea] ([Id], [Empresa_Id], [Sublinea_Id]) VALUES (17, 2, 24)
INSERT [scl].[EmpresaSublinea] ([Id], [Empresa_Id], [Sublinea_Id]) VALUES (18, 2, 25)
SET IDENTITY_INSERT [scl].[EmpresaSublinea] OFF
SET IDENTITY_INSERT [scl].[EstadoAprobacion] ON 

INSERT [scl].[EstadoAprobacion] ([Id], [Nombre]) VALUES (1, N'Aprobado')
INSERT [scl].[EstadoAprobacion] ([Id], [Nombre]) VALUES (2, N'En Configuración')
INSERT [scl].[EstadoAprobacion] ([Id], [Nombre]) VALUES (3, N'En Evaluación')
INSERT [scl].[EstadoAprobacion] ([Id], [Nombre]) VALUES (4, N'En Comité')
INSERT [scl].[EstadoAprobacion] ([Id], [Nombre]) VALUES (5, N'Rechazado')
INSERT [scl].[EstadoAprobacion] ([Id], [Nombre]) VALUES (6, N'Devuelta')
SET IDENTITY_INSERT [scl].[EstadoAprobacion] OFF
SET IDENTITY_INSERT [scl].[Garantias] ON 

INSERT [scl].[Garantias] ([Id], [Numero], [Folio], [Tipo], [Descripcion], [Clausula], [Estado], [FechaTasacion], [ValorComercial], [ValorLiquidacion], [Notas]) VALUES (1, 6, 1, N'Otras Garantias', N'Leasing', N'', N'Constituida', N'', N'8599', N'4299', N'')
SET IDENTITY_INSERT [scl].[Garantias] OFF
SET IDENTITY_INSERT [scl].[GarantiasSublinea] ON 

INSERT [scl].[GarantiasSublinea] ([Id], [Garantias_Id], [Sublinea_Id]) VALUES (1, 1, 23)
SET IDENTITY_INSERT [scl].[GarantiasSublinea] OFF
SET IDENTITY_INSERT [scl].[Grupo] ON 

INSERT [scl].[Grupo] ([Id], [Nombre], [Rating]) VALUES (1, N'DROGUETT & RABY INGENIERIA Y SERVICIOS LTDA', N'S/R')
INSERT [scl].[Grupo] ([Id], [Nombre], [Rating]) VALUES (2, N'COMERCIAL APERITIVO CHILE LIMITADA', N'S/R')
INSERT [scl].[Grupo] ([Id], [Nombre], [Rating]) VALUES (3, N'MATTE', N'7')
INSERT [scl].[Grupo] ([Id], [Nombre], [Rating]) VALUES (4, N'COMFRUT
', N'5,5')
SET IDENTITY_INSERT [scl].[Grupo] OFF
SET IDENTITY_INSERT [scl].[GrupoEmpresa] ON 

INSERT [scl].[GrupoEmpresa] ([Id], [Empresa_Id], [Grupo_Id], [Vigente]) VALUES (1, 1, 1, 1)
INSERT [scl].[GrupoEmpresa] ([Id], [Empresa_Id], [Grupo_Id], [Vigente]) VALUES (2, 2, 2, 1)
INSERT [scl].[GrupoEmpresa] ([Id], [Empresa_Id], [Grupo_Id], [Vigente]) VALUES (3, 3, 3, 1)
INSERT [scl].[GrupoEmpresa] ([Id], [Empresa_Id], [Grupo_Id], [Vigente]) VALUES (4, 4, 3, 1)
INSERT [scl].[GrupoEmpresa] ([Id], [Empresa_Id], [Grupo_Id], [Vigente]) VALUES (5, 5, 3, 1)
INSERT [scl].[GrupoEmpresa] ([Id], [Empresa_Id], [Grupo_Id], [Vigente]) VALUES (12, 8, 4, 1)
INSERT [scl].[GrupoEmpresa] ([Id], [Empresa_Id], [Grupo_Id], [Vigente]) VALUES (13, 7, 3, 1)
INSERT [scl].[GrupoEmpresa] ([Id], [Empresa_Id], [Grupo_Id], [Vigente]) VALUES (14, 9, 4, 1)
INSERT [scl].[GrupoEmpresa] ([Id], [Empresa_Id], [Grupo_Id], [Vigente]) VALUES (15, 10, 4, 1)
INSERT [scl].[GrupoEmpresa] ([Id], [Empresa_Id], [Grupo_Id], [Vigente]) VALUES (16, 11, 4, 1)
SET IDENTITY_INSERT [scl].[GrupoEmpresa] OFF
SET IDENTITY_INSERT [scl].[Linea] ON 

INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (1, N'1', N'D', N'Linea Crédito Cta. Cte.', N'USD', N'3000', N'3000', N'0', N'Amarillo', N'0', N'0', N'12', N'03-07-2018
', N'', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-2 y Sra. Paulina Raby Z. Rut:13.040.985-7
')
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (2, N'2', N'D', N'Linea Tarjeta de Credito', N'CLP', N'1200', N'0', N'0', N'Amarillo', N'1200', N'1200', N'12', N'03-07-2018
', N'', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-2 y Sra. Paulina Raby Z. Rut:13.040.985-7
')
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (3, N'3', N'D', N'Linea Factoring
', N'CLP', N'200000', N'0', N'0', N'Amarillo', N'200000
', N'0', N'12', N'03-07-2018
', N'', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-4
')
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (4, N'4', N'D', N'Linea Boleta de Garantía
', N'CLP', N'110000
', N'103051', N'0', N'Amarillo', N'6949', N'0', N'12', N'03-07-2018
', N'', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-4
')
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (6, N'6', N'D', N'Boleta de Garantía
', N'CLP', N'18257
', N'0', N'0', N'Amarillo', N'18257
', N'0', N'12', N'03-07-2018
', N'', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-4
')
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (7, N'7', N'D', N'Boleta de Garantía
', N'CLP', N'5753
', N'0', N'0', N'Amarillo', N'5753
', N'0', N'12', N'03-07-2018
', N'', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-4
')
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (8, N'8', N'D', N'Crédito en Cuotas (MAC)
', N'CLP', N'200000
', N'134993', N'0', N'Amarillo', N'65007
', N'0', N'3', N'03-07-2018
', N'', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-4
')
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (13, N'1', N'D', N'Linea Credito Cta Cte', N'CLP', N'6400', N'1070', N'0', N'Amarillo', N'5330', N'0', N'12', N'30-08-2018', N'undefined', N'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2')
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (18, N'6', N'D', N'Operación Leasing', N'CLP', N'7737', N'3625', N'0', N'Rojo', N'0', N'0', N'12', N'30-08-2018', N'', N'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2.   Descripción: leasing al 50% sobre el vehículo')
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (19, N'7', N'D', N'Línea Capital de Trabajo', N'CLP', N'25000', N'21350', N'0', N'Amarillo', N'3650', N'0', N'12', N'30-08-2018', N'', N'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2')
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (20, N'9', N'D', N'Crédito en Cuotas (MAC)', N'CLP', N'21533', N'17196', N'0', N'Rojo', N'0', N'0', N'12', N'30-08-2018', N'', N'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2')
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (21, N'1', N'D', N'Línea Capital de Trabajo', N'CLP', N'19455252', N'0', N'0', N'Verde', N'19455252', N'0', N'24', N'04-07-2018', N'', NULL)
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (22, N'2', N'EC', N'Linea Derivado', N'CLP', N'9000000', N'0', N'0', N'Verde', N'9000000', N'0', N'12', N'04-07-2018', N'', NULL)
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (23, N'3', N'E', N'Linea Entrega Diferida', N'CLP', N'3242542', N'0', N'0', N'Verde', N'3242542', N'0', N'12', N'04-07-2018', N'', NULL)
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (24, N'1', N'D', N'Línea Crédito Cta. Cte', N'CLP', N'50000', N'0', N'0', N'Verde', N'50000', N'0', N'12', N'19-06-2018', N'', NULL)
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (25, N'2', N'D', N'Línea Tarjeta de Crédito', N'CLP', N'5797', N'0', N'0', N'Verde', N'5797', N'0', N'12', N'19-06-2018', N'', NULL)
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (26, N'3', N'D', N'Línea Capital de Trabajo
', N'USD', N'8000', N'5000', N'0', N'Verde', N'3000', N'0', N'12', N'19-06-2018', N'', NULL)
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (27, N'4', N'D', N'Otras Operaciones a Aprobación', N'USD', N'0', N'3000', N'0', N'Verde', N'0', N'0', N'12', N'19-06-2018', N'', NULL)
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (28, N'5', N'EC', N'Línea Derivados', N'CLP', N'600000', N'19798', N'0', N'Verde', N'580502', N'0', N'12', N'19-06-2018', N'', NULL)
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (29, N'6', N'D', N'Linea Leasing', N'USD', N'1200', N'403', N'0', N'Verde', N'797', N'0', N'48', N'19-06-2018', N'', NULL)
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (30, N'7', N'C', N'Operación Boleta de Garantía ', N'CLP', N'4653', N'0', N'0', N'Verde', N'0', N'0', N'12', N'19-06-2018', N'', NULL)
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (31, N'8', N'E ', N'Línea Compra Venta Divisas', N'USD', N'1000', N'0', N'0', N'Verde', N'1000', N'0', N'12', N'19-06-2018', N'', NULL)
SET IDENTITY_INSERT [scl].[Linea] OFF
SET IDENTITY_INSERT [scl].[MacGrupo] ON 

INSERT [scl].[MacGrupo] ([Id], [FechaCreacion], [FechaPresentacion], [Comentario], [PromSaldoVista], [FechaVencimiento], [RatingGrupo], [NivelAtribucion], [TotalSometidoAprobacion], [GrupoEmpresa_Id], [EstadoAprobacion_Id], [Acomite], [MacGrupo_Id]) VALUES (13, N'24-08-2017', NULL, NULL, NULL, NULL, NULL, NULL, NULL, 26, 2, NULL, NULL)
INSERT [scl].[MacGrupo] ([Id], [FechaCreacion], [FechaPresentacion], [Comentario], [PromSaldoVista], [FechaVencimiento], [RatingGrupo], [NivelAtribucion], [TotalSometidoAprobacion], [GrupoEmpresa_Id], [EstadoAprobacion_Id], [Acomite], [MacGrupo_Id]) VALUES (14, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 26, NULL, 2, 13)
INSERT [scl].[MacGrupo] ([Id], [FechaCreacion], [FechaPresentacion], [Comentario], [PromSaldoVista], [FechaVencimiento], [RatingGrupo], [NivelAtribucion], [TotalSometidoAprobacion], [GrupoEmpresa_Id], [EstadoAprobacion_Id], [Acomite], [MacGrupo_Id]) VALUES (17, N'19-06-2017', N'19-06-2017', NULL, N'233795 ', N'19-06-2018', N'5.5', N'R3', N'7755', 12, 2, NULL, NULL)
INSERT [scl].[MacGrupo] ([Id], [FechaCreacion], [FechaPresentacion], [Comentario], [PromSaldoVista], [FechaVencimiento], [RatingGrupo], [NivelAtribucion], [TotalSometidoAprobacion], [GrupoEmpresa_Id], [EstadoAprobacion_Id], [Acomite], [MacGrupo_Id]) VALUES (18, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 12, NULL, 2, 17)
INSERT [scl].[MacGrupo] ([Id], [FechaCreacion], [FechaPresentacion], [Comentario], [PromSaldoVista], [FechaVencimiento], [RatingGrupo], [NivelAtribucion], [TotalSometidoAprobacion], [GrupoEmpresa_Id], [EstadoAprobacion_Id], [Acomite], [MacGrupo_Id]) VALUES (19, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 14, NULL, 1, 17)
INSERT [scl].[MacGrupo] ([Id], [FechaCreacion], [FechaPresentacion], [Comentario], [PromSaldoVista], [FechaVencimiento], [RatingGrupo], [NivelAtribucion], [TotalSometidoAprobacion], [GrupoEmpresa_Id], [EstadoAprobacion_Id], [Acomite], [MacGrupo_Id]) VALUES (20, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 15, NULL, 1, 17)
INSERT [scl].[MacGrupo] ([Id], [FechaCreacion], [FechaPresentacion], [Comentario], [PromSaldoVista], [FechaVencimiento], [RatingGrupo], [NivelAtribucion], [TotalSometidoAprobacion], [GrupoEmpresa_Id], [EstadoAprobacion_Id], [Acomite], [MacGrupo_Id]) VALUES (21, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 16, NULL, 1, 17)
INSERT [scl].[MacGrupo] ([Id], [FechaCreacion], [FechaPresentacion], [Comentario], [PromSaldoVista], [FechaVencimiento], [RatingGrupo], [NivelAtribucion], [TotalSometidoAprobacion], [GrupoEmpresa_Id], [EstadoAprobacion_Id], [Acomite], [MacGrupo_Id]) VALUES (25, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 39, NULL, 2, 13)
SET IDENTITY_INSERT [scl].[MacGrupo] OFF
SET IDENTITY_INSERT [scl].[Operacion] ON 

INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (1, N'8610', N'1001500738', N'10-01-2008
', N'13-12-2099
', N'CLP', N'3000', N'3000', N'3000', N'3000', 0, N'', N'LINEA DE CREDITO EMPRESAS LCEMP', N'10-01-2008
', N'77832610')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (2, N'9206', N'000001683
', N'01-02-2017
', N'31-01-2018
', N'UF
', N'1', N'1', N'18233', N'18233', 0, N'', N'LINEA DE CREDITO EMPRESAS LCEMP
', N'01-02-2017
', N'77832610')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (3, N'9221', N'000000683
', N'17-01-2017
', N'17-01-2018
', N'UF
', N'0', N'0', N'1329', N'1329', 0, N'', N'CREDITO PARA BOL.DE GARANTIA - 1 AÃ‘O
', N'17-01-2017
', N'77832610')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (4, N'9221', N'000001905
', N'14-03-2017
', N'14-09-2017', N'UF
', N'0', N'0', N'7975', N'7975', 0, N'', N'LINEA BDG MN_ME
', N'14-03-2017
', N'77832610')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (5, N'9221', N'000016570
', N'13-10-2016
', N'10-10-2017
', N'CLP
', N'1817', N'1817', N'1817', N'1817', 0, N'', N'LINEA BDG MN_ME
', N'13-10-2016
', N'77832610')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (6, N'9221', N'000350237
', N'14-03-2017
', N'16-08-2017
', N'UF
', N'0', N'0', N'6142', N'6142', 0, N'', N'LINEA BDG MN_ME
', N'14-03-2017
', N'77832610')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (7, N'9221', N'000350239
', N'13-03-2017
', N'13-09-2017
', N'UF
', N'0', N'0', N'7975', N'7975', 0, N'', N'LINEA BDG MN_ME
', N'14-03-2017
', N'77832610')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (8, N'9221', N'000354119
', N'10-07-2017
', N'10-01-2018
', N'UF
', N'0', N'0', N'5735', N'5735', 0, N'', N'LINEA BDG MN_ME
', N'10-07-2017
', N'77832610')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (9, N'9221', N'000358403
', N'17-01-2017
', N'08-01-2018
', N'UF
', N'0', N'0', N'665', N'665', 0, N'', N'LINEA BDG MN_ME
', N'17-01-2017
', N'77832610')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (10, N'9221', N'000358405
', N'17-01-2017
', N'08-01-2018
', N'UF
', N'0', N'0', N'1329', N'1329', 0, N'', N'LINEA BDG MN_ME
', N'17-01-2017
', N'77832610')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (11, N'9221', N'000358409
', N'17-01-2017
', N'08-01-2018
', N'UF
', N'0', N'0', N'665', N'665', 0, N'', N'LINEA BDG MN_ME
', N'17-01-2017
', N'77832610')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (12, N'9221', N'000359015
', N'01-02-2017
', N'02-10-2017
', N'UF
', N'2', N'0', N'40274', N'40274', 0, N'', N'LINEA BDG MN_ME
', N'01-02-2017
', N'77832610')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (13, N'9221', N'000359203
', N'08-02-2017
', N'08-08-2017
', N'UF
', N'0', N'0', N'2658', N'2658', 0, N'', N'LINEA BDG MN_ME
', N'08-02-2017
', N'77832610')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (14, N'9221', N'000359204
', N'08-02-2017
', N'08-08-2017
', N'UF
', N'0', N'0', N'2658', N'2658', 0, N'', N'LINEA BDG MN_ME
', N'08-02-2017
', N'77832610')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (15, N'9221', N'000359752
', N'27-02-2017
', N'16-08-2017
', N'UF
', N'0', N'0', N'13273', N'13273', 0, N'', N'LINEA BDG MN_ME
', N'27-02-2017
', N'77832610')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (16, N'9221', N'000359762
', N'27-02-2017
', N'28-08-2017
', N'UF
', N'0', N'0', N'10556', N'10556', 0, N'', N'LINEA BDG MN_ME
', N'27-02-2017
', N'77832610')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (17, N'9252', N'000087096
', N'31-05-2017
', N'30-08-2017
', N'UF
', N'0', N'0', N'134993', N'134993', 0, N'', N'CREDITO EN CUOTAS COMERCIAL
', N'31-05-2017
', N'77832610')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (19, N'8610', N'119002799', N'10-04-2007', N'10-04-2018', N'CLP', N'6400', N'1070', N'', N'1070', 0, N'', N'LINEA DE CREDITO EMPRESAS LCEMP', N'10-04-2007', N'76265440')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (20, N'9252', N'000001739', N'23-03-2017', N'24-08-2017', N'CLP', N'25405', N'17196', N'', N'17196', 0, N'', N'CREDITO EN CUOTAS COMERCIAL', N'23-07-2017', N'76265440')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (21, N'9252', N'000087148', N'02-06-2017', N'04-09-2017', N'CLP', N'25404', N'21350', N'', N'21350', 0, N'', N'CREDITO EN CUOTAS COMERCIAL', N'02-06-2017', N'76265440')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (22, N'38010', N'009902256', N'06-05-2015', N'04-09-2017', N'CLP', N'201195', N'11509', N'', N'3625', 0, N'', N'LEASING MOBIL.COMERCIAL. TF SIN GARANTIA', N'06-05-2017', N'76265440')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (24, N'4002', N'058104454', N'18-11-2017', N'13-11-2017', N'USD', N'1000', N'1000', N'100', N'645380', 0, N'', N'PTMOS EXP PRE EMB', N'13-11-2017', N'79663940')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (25, N'4002', N'058104476', N'03-02-2017', N'11-12-2017', N'USD', N'1600', N'1500', N'150', N'968070', 0, N'', N'PTMOS EXP PRE EMB', N'03-02-2017', N'79663940')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (26, N'4002', N'058104480', N'07-02-2017', N'07-08-2017', N'USD', N'1000', N'0', N'0', N'0', 0, N'', N'PTMOS EXP PRE EMB', N'07-02-2017', N'79663940')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (27, N'4002', N'059304156', N'05-01-2017', N'30-10-2017', N'USD', N'1500', N'1500', N'150', N'968070', 0, N'', N'PTMOS EXP PRE EMB', N'05-01-2017', N'79663940')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (28, N'4002', N'059304202', N'25-01-2017', N'22-09-2017', N'USD', N'1000', N'1000', N'100', N'645380', 0, N'', N'PTMOS EXP PRE EMB', N'25-01-2017', N'79663940')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (29, N'4002', N'0599304252', N'14-03-2017', N'11-12-2017', N'USD', N'1000', N'1000', N'100', N'645380', 0, N'', N'PTMOS EXP PRE EMB', N'14-03-2017', N'79663940')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (30, N'9221', N'000015035', N'21-12-2017', N'18-12-2017', N'CLP', N'1419', N'1419', N'149', N'1419', 0, N'', N'LINEA BDG MN_ME', N'21-12-2017', N'79663940')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (31, N'9221', N'000334626', N'21-12-2016', N'14-12-2017', N'CLP', N'1938', N'1938', N'193', N'1938', 0, N'', N'LINEA BDG MN_ME', N'21-12-2016', N'79663940')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (32, N'9431', N'200620570', N'19-12-2016', N'29-08-2017', N'UF', N'0', N'0', N'0', N'9681', 0, N'', N'9431 NDF COMPRACLP/FCY', N'19-12-2016', N'79663940')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (33, N'9431', N'200624160', N'15-03-2017', N'15-03-2017', N'UF', N'0', N'0', N'0', N'9681', 0, N'', N'9431 NDF COMPRACLP/FCY', N'15-03-2017', N'79663940')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (34, N'38010', N'009926352', N'19-12-2016', N'29-08-2017', N'USD', N'264', N'210', N'0', N'135286', 0, N'', N'LEASING MOBIL.COMERCIAL. TF SIN GARANTIA', N'19-12-2016', N'79663940')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso], [RutEmpresa]) VALUES (35, N'38010', N'009928341', N'28-02-2017', N'16-08-2017', N'USD', N'194', N'169', N'0', N'109056', 0, N'', N'LEASING MOBIL.COMERCIAL. TF SIN GARANTIA', N'28-02-2017', N'79663940')
SET IDENTITY_INSERT [scl].[Operacion] OFF
SET IDENTITY_INSERT [scl].[Sublinea] ON 

INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (1, N'1.1', N'D', N'Linea Crédito Cta. Cte.', N'CLP', N'3000', N'3000', N'0', N'Rojo', N'0', N'100', N'12', N'03-07-2018', N'', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-2 y Sra. Paulina Raby Z. Rut:13.040.985-7
', 1, 1, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (2, N'2.1', N'D', N'Linea Tarjeta de Credito', N'CLP', N'1200', N'0', N'0', N'Amarillo', N'1200', N'0', N'12', N'03-07-2018', N'', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-2 y Sra. Paulina Raby Z. Rut:13.040.985-7
', 2, 1, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (3, N'3.1', N'D', N'Linea Factoring
', N'CLP', N'200000', N'0', N'0', N'Amarillo', N'200000', N'0', N'12', N'03-07-2018', N'', N'val Sr. Ivan Droguett Saez Rut: 10.723.799-4
L', 3, 1, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (4, N'4.1', N'D', N'Linea Boleta de Garantía
', N'CLP', N'110000', N'103051', N'0', N'Amarillo', N'6949', N'0', N'12', N'03-07-2018', N'', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-5
', 4, 1, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (6, N'6.1', N'D', N'Boleta de Garantía
', N'CLP', N'18257
', N'0', N'0', N'Amarillo', N'18257', N'0', N'12', N'03-07-2018', N'BDG para el fiel cumplimiento del contrato por M$18.070 correspondiente al 3% de contrato obra (MM$604) "mejoramiento y ampliación de servicio APR el Trébal, Comuna de Padre Hurtado" con mandante Aguas Andinas. Plazo De Boleta por 34 meses…;
', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-7
', 6, 1, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (7, N'7.1', N'D', N'Boleta de Garantía
', N'CLP', N'5753', N'0', N'0', N'Amarillo', N'5753', N'0', N'12', N'03-07-2018', N'', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-8
', 7, 1, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (8, N'8.1', N'D', N'Crédito en Cuotas (MAC)
', NULL, N'200000', N'134993
', N'0', N'Amarillo', N'65007', N'0', N'3', N'03-07-2018', N'', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-9
', 8, 1, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (18, N'1', N'D', N'Linea Credito Cta Cte', N'CLP', N'6400', N'1070', N'0', N'Amarillo', N'5330', N'0', N'12', N'30-08-2018', N'.', N'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2', 13, 2, 1)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (23, N'6.1', N'D', N'Operación Leasing', N'CLP', N'7737', N'3625', N'0', N'Rojo', N'0', N'0', N'12', N'30-08-2018', N'.', N'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2.   Descripción: leasing al 50% sobre el vehículo', 18, 2, 1)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (24, N'7.1', N'D', N'Línea Capital de Trabajo', N'CLP', N'25000', N'21350', N'0', N'Amarillo', N'3650', N'0', N'12', N'30-08-2018', N'Se solicita linea capital de trabajo por M$50.000 para curse de bullet a 180 días, renovable una vez. Crédito comerciales a 12 meses, Carta de Crédito…;', N'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2', 19, 2, 1)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (25, N'9.1', N'D', N'Crédito en Cuotas (MAC)', N'CLP', N'21533', N'17196', N'0', N'Rojo', N'0', N'0', N'12', N'30-08-2018', N'.', N'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2', 20, 2, 1)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (26, N'1.3', N'D
', N'Línea Capital de Trabajo
', N'CLP', N'19455252', N'0
', N'0
', N'Verde', N'19455252', N'0
', N'12
', N'04-07-2018
', N'', N'', 21, 3, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (27, N'2
.1', N'EC
', N'Linea Derivado
', N'CLP
', N'9000000
', N'0', N'0', N'Verde', N'9000000', N'0', N'12', N'04-07-2018
', N'', N'', 22, 3, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (28, N'3.1', N'E
', N'Linea Entrega Diferida
', N'CLP', N'3242542', N'0', N'0', N'Verde', N'3242542', N'0', N'12', N'04-07-2018
', N'', N'Cliente preimum', 23, 3, 1)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (29, N'1.4', N'D', N'Línea Capital de Trabajo
', N'CLP', N'500000', N'0', N'0', N'Verde', N'500000', N'0', N'12', N'04-07-2018', N'', N'', 21, 5, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (30, N'1.5', N'D', N'Línea Capital de Trabajo
', N'CLP', N'500000', N'0', N'0', N'Verde', N'500000', N'0', N'12', N'04-07-2018', N'', N'', 21, 4, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (31, N'1.6', N'D', N'Línea Capital de Trabajo
', N'CLP', N'100000', N'0', N'0', N'Verde', N'100000', N'0', N'24', N'04-07-2018', N'', N'', 21, 6, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (32, N'1.7', N'D', N'Línea Capital de Trabajo
', N'CLP', N'20000', N'0', N'0', N'Verde', N'20000', N'0', N'24', N'04-07-2018', N'', N'', 21, 7, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (33, N'1.1', N'D', N'Compraventa M/E', N'CLP', N'19455252', N'0', N'0', N'Verde', N'19455252', N'0', N'48', N'04-07-2018', N'', N'', 21, 7, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (34, N'1.2', N'D', N'Línea de Sobregiro', N'CLP', N'2000000', N'0', N'0', N'Verde', N'2000000', N'0', N'24', N'04-07-2018', N'', N'', 21, 7, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (35, N'2.2', N'EC', N'Linea Derivado', N'CLP', N'9000000', N'0', N'0', N'Verde', N'9000000', N'0', N'12', N'04-07-2018', N'', N'', 22, 7, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (36, N'2.3', N'EC', N'Línea Derivado', N'CLP', N'7000000', N'0', N'0', N'Verde', N'7000000', N'0', N'60', N'05-07-2018', N'', N'', 22, 7, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (37, N'1.1', N'D', N'Línea Crédito Cta. Cte
', N'CLP', N'50000', N'0', N'0', N'Verde', N'50000', N'0', N'12', N'19-06-2018', N'', N'', 24, 8, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (38, N'2.1', N'D', N'Tarjeta de Crédito', N'CLP', N'5797', N'0', N'0', N'Verde', N'5797', N'0', N'12', N'19-06-2018', N'', N'', 25, 8, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (39, N'3.1', N'D', N'Línea Capital de Trabajo
', N'USD', N'8000', N'5000', N'0', N'Verde', N'3000', N'0', N'12', N'19-06-2018', N'', N'', 26, 8, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (40, N'4.1', N'D', N'Otras Operaciones a Aprobación', N'USD', N'0', N'3000', N'0', N'Verde', N'0', N'0', N'12', N'19-06-2018', N'', N'', 27, 8, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (41, N'5.1', N'EC', N'Línea Derivados', N'CLP', N'600000', N'19798', N'0', N'Verde', N'580202', N'0', N'12', N'19-06-2018', N'', N'', 28, 8, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (42, N'6.1', N'D', N'Línea Leasing  ', N'USD', N'1200', N'403', N'0', N'Verde', N'797', N'0', N'48', N'19-06-2018', N'', N'', 29, 8, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (43, N'7.1', N'C', N'Operación Boleta de Garantía ', N'CLP', N'4653', N'0', N'0', N'Verde', N'0', N'0', N'12', N'19-06-2018', N'', N'', 30, 8, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (44, N'8.1', N'E', N'Línea Compra Venta Divisas', N'USD', N'1000', N'0', N'0', N'Verde', N'1000', N'0', N'12', N'19-06-2018', N'', N'', 31, 8, NULL)
SET IDENTITY_INSERT [scl].[Sublinea] OFF
SET IDENTITY_INSERT [scl].[SublineaOperacion] ON 

INSERT [scl].[SublineaOperacion] ([Id], [Sublinea_Id], [Operacion_Id]) VALUES (1, 1, 1)
INSERT [scl].[SublineaOperacion] ([Id], [Sublinea_Id], [Operacion_Id]) VALUES (2, 2, 2)
INSERT [scl].[SublineaOperacion] ([Id], [Sublinea_Id], [Operacion_Id]) VALUES (3, 4, 3)
INSERT [scl].[SublineaOperacion] ([Id], [Sublinea_Id], [Operacion_Id]) VALUES (4, 4, 4)
INSERT [scl].[SublineaOperacion] ([Id], [Sublinea_Id], [Operacion_Id]) VALUES (5, 4, 5)
INSERT [scl].[SublineaOperacion] ([Id], [Sublinea_Id], [Operacion_Id]) VALUES (6, 4, 6)
INSERT [scl].[SublineaOperacion] ([Id], [Sublinea_Id], [Operacion_Id]) VALUES (7, 4, 7)
INSERT [scl].[SublineaOperacion] ([Id], [Sublinea_Id], [Operacion_Id]) VALUES (8, 4, 8)
INSERT [scl].[SublineaOperacion] ([Id], [Sublinea_Id], [Operacion_Id]) VALUES (9, 4, 9)
INSERT [scl].[SublineaOperacion] ([Id], [Sublinea_Id], [Operacion_Id]) VALUES (10, 4, 10)
INSERT [scl].[SublineaOperacion] ([Id], [Sublinea_Id], [Operacion_Id]) VALUES (11, 4, 11)
INSERT [scl].[SublineaOperacion] ([Id], [Sublinea_Id], [Operacion_Id]) VALUES (12, 4, 12)
INSERT [scl].[SublineaOperacion] ([Id], [Sublinea_Id], [Operacion_Id]) VALUES (13, 4, 13)
INSERT [scl].[SublineaOperacion] ([Id], [Sublinea_Id], [Operacion_Id]) VALUES (14, 4, 14)
INSERT [scl].[SublineaOperacion] ([Id], [Sublinea_Id], [Operacion_Id]) VALUES (15, 4, 15)
INSERT [scl].[SublineaOperacion] ([Id], [Sublinea_Id], [Operacion_Id]) VALUES (16, 4, 16)
INSERT [scl].[SublineaOperacion] ([Id], [Sublinea_Id], [Operacion_Id]) VALUES (17, 8, 17)
INSERT [scl].[SublineaOperacion] ([Id], [Sublinea_Id], [Operacion_Id]) VALUES (18, 18, 19)
INSERT [scl].[SublineaOperacion] ([Id], [Sublinea_Id], [Operacion_Id]) VALUES (19, 25, 20)
INSERT [scl].[SublineaOperacion] ([Id], [Sublinea_Id], [Operacion_Id]) VALUES (20, 24, 21)
INSERT [scl].[SublineaOperacion] ([Id], [Sublinea_Id], [Operacion_Id]) VALUES (21, 23, 22)
INSERT [scl].[SublineaOperacion] ([Id], [Sublinea_Id], [Operacion_Id]) VALUES (28, 39, 24)
INSERT [scl].[SublineaOperacion] ([Id], [Sublinea_Id], [Operacion_Id]) VALUES (29, 39, 25)
INSERT [scl].[SublineaOperacion] ([Id], [Sublinea_Id], [Operacion_Id]) VALUES (30, 39, 26)
INSERT [scl].[SublineaOperacion] ([Id], [Sublinea_Id], [Operacion_Id]) VALUES (31, 39, 27)
INSERT [scl].[SublineaOperacion] ([Id], [Sublinea_Id], [Operacion_Id]) VALUES (32, 39, 28)
INSERT [scl].[SublineaOperacion] ([Id], [Sublinea_Id], [Operacion_Id]) VALUES (33, 39, 29)
SET IDENTITY_INSERT [scl].[SublineaOperacion] OFF
SET IDENTITY_INSERT [scl].[TipoAprobacion] ON 

INSERT [scl].[TipoAprobacion] ([Id], [Nombre]) VALUES (1, N'MAC')
INSERT [scl].[TipoAprobacion] ([Id], [Nombre]) VALUES (2, N'Complementaria')
INSERT [scl].[TipoAprobacion] ([Id], [Nombre]) VALUES (3, N'Especial')
INSERT [scl].[TipoAprobacion] ([Id], [Nombre]) VALUES (4, N'Productos')
SET IDENTITY_INSERT [scl].[TipoAprobacion] OFF
SET IDENTITY_INSERT [scl].[TipoOperacion] ON 

INSERT [scl].[TipoOperacion] ([Id], [Codigo], [Plazo], [Nombre], [TipoRiesgo]) VALUES (1, N'8610', N'3', N'LINEA DE CREDITO EMPRESAS LCEMP', N'D')
INSERT [scl].[TipoOperacion] ([Id], [Codigo], [Plazo], [Nombre], [TipoRiesgo]) VALUES (2, N'9206', N'3', N'CREDITO PARA BOL.DE GARANTIA - 1 AÑO', N'C')
INSERT [scl].[TipoOperacion] ([Id], [Codigo], [Plazo], [Nombre], [TipoRiesgo]) VALUES (3, N'9221', N'4', N'LINEA BDG MN_ME', N'C')
INSERT [scl].[TipoOperacion] ([Id], [Codigo], [Plazo], [Nombre], [TipoRiesgo]) VALUES (4, N'9252', N'4', N'CREDITO EN CUOTAS COMERCIAL', N'D')
INSERT [scl].[TipoOperacion] ([Id], [Codigo], [Plazo], [Nombre], [TipoRiesgo]) VALUES (5, N'4002', N'4', N'PTMOS EXP PRE EMB', N'D')
INSERT [scl].[TipoOperacion] ([Id], [Codigo], [Plazo], [Nombre], [TipoRiesgo]) VALUES (7, N'9431', N'50', N'9431 NDF COMPRACLP/FCY', N'D')
INSERT [scl].[TipoOperacion] ([Id], [Codigo], [Plazo], [Nombre], [TipoRiesgo]) VALUES (8, N'38010', N'0', N'LEASING MOBIL.COMERCIAL. TF SIN GARANTIA', N'D')
SET IDENTITY_INSERT [scl].[TipoOperacion] OFF
