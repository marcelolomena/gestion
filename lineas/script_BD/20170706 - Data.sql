USE [lineas]
GO
SET IDENTITY_INSERT [dbo].[Empresa] ON 

INSERT [dbo].[Empresa] ([Id], [Nombre], [RazonSocial], [Rut]) VALUES (1, N'EMPRESAS CMPC S.A.', N'EMPRESAS CMPC S.A.', N'90222000')
INSERT [dbo].[Empresa] ([Id], [Nombre], [RazonSocial], [Rut]) VALUES (2, N'FORESTAL, CONST. Y COMERCIAL DEL PACIFICO SUR S.A.', N'FORESTAL, CONST. Y COMERCIAL DEL PACIFICO SUR S.A.', N'91553000')
INSERT [dbo].[Empresa] ([Id], [Nombre], [RazonSocial], [Rut]) VALUES (3, N'FORESTAL Y PESQUERA COPAHUE S.A.', N'FORESTAL Y PESQUERA COPAHUE S.A.', N'79770520')
INSERT [dbo].[Empresa] ([Id], [Nombre], [RazonSocial], [Rut]) VALUES (4, N'MINERA VALPARAISO S.A.', N'MINERA VALPARAISO S.A.', N'90412000')
INSERT [dbo].[Empresa] ([Id], [Nombre], [RazonSocial], [Rut]) VALUES (5, N'COMPAÑÍA INDUSTRIAL EL VOLCAN S.A.', N'COMPAÑÍA INDUSTRIAL EL VOLCAN S.A.', N'90209000')
SET IDENTITY_INSERT [dbo].[Empresa] OFF
SET IDENTITY_INSERT [dbo].[Grupo] ON 

INSERT [dbo].[Grupo] ([Id], [Nombre]) VALUES (1, N'MATTE')
SET IDENTITY_INSERT [dbo].[Grupo] OFF
SET IDENTITY_INSERT [dbo].[GrupoEmpresa] ON 

INSERT [dbo].[GrupoEmpresa] ([Id], [Empresa_Id], [Grupo_Id]) VALUES (1, 1, 1)
INSERT [dbo].[GrupoEmpresa] ([Id], [Empresa_Id], [Grupo_Id]) VALUES (2, 2, 1)
INSERT [dbo].[GrupoEmpresa] ([Id], [Empresa_Id], [Grupo_Id]) VALUES (3, 3, 1)
INSERT [dbo].[GrupoEmpresa] ([Id], [Empresa_Id], [Grupo_Id]) VALUES (4, 4, 1)
INSERT [dbo].[GrupoEmpresa] ([Id], [Empresa_Id], [Grupo_Id]) VALUES (5, 5, 1)
SET IDENTITY_INSERT [dbo].[GrupoEmpresa] OFF
SET IDENTITY_INSERT [dbo].[Linea] ON 

INSERT [dbo].[Linea] ([Id], [Numero], [TipoRiesgo], [PlazoResudual], [MontoAprobado], [DeudaActual], [MontoAprobacion], [Moneda], [Comentario], [Tipolimite], [Garantiaestatal], [MacIndividual_Id]) VALUES (1, N'1', N'D', N'3-5', N'100.000
', N'30000', N'100000', N'USD', N'Línea de Crédito de Largo Plazo / Incluye LSG por MM$ 5,100 cursadas a filiales CMPC Inversiones, Sociedad Recuperadora de Papel, Chilena de Moldeados SA, CMPC Tissue y CMPC Pulp asociadas a cash pooling.-', N'Linea Capital de Trabajo', NULL, 1)
SET IDENTITY_INSERT [dbo].[Linea] OFF
SET IDENTITY_INSERT [dbo].[MacGrupal] ON 

INSERT [dbo].[MacGrupal] ([Id], [FechaPresentacion], [EjecutivoControl], [FechaVencimiento], [RatingGrupo], [NivelAtribucion], [SometidoAprobacion], [Plazos], [AprobadoTotal], [NombreAprobacion], [FirmaAprobacion], [ValorMonedaUf], [ValorMonedaDolares], [TotalAprobacionPesos], [TotalAprobacionUf], [ObservacionComiteRiesgo], [Grupo_Id]) VALUES (1, N'2017-07-04', N'J. BRAVO', N'2018-07-04', N'7', N'R2', NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, NULL, 1)
SET IDENTITY_INSERT [dbo].[MacGrupal] OFF
SET IDENTITY_INSERT [dbo].[MacGrupalMacIndividual] ON 

INSERT [dbo].[MacGrupalMacIndividual] ([Id], [MacIndividual_Id], [MacGrupal_Id]) VALUES (1, 1, 1)
SET IDENTITY_INSERT [dbo].[MacGrupalMacIndividual] OFF
SET IDENTITY_INSERT [dbo].[MacIndividual] ON 

INSERT [dbo].[MacIndividual] ([Id], [Nombre], [Rut], [ActividadEconomica], [RatingGrupal], [NivelAtribucion], [RatingIndividual], [Clasificacion], [Vigilancia], [FechaInformacionFinanciera], [PromedioSaldoVista], [DeudaSbif], [AprobadoVinculado], [EquipoCobertura], [Oficina], [FechaCreacion], [FechaVencimiento], [FechaVencimientoMacAnterior], [Empresa_Id]) VALUES (1, N'EMPRESAS CMPC S.A.
', N'90222000
', N'Sociedad de Inversión
', N'7', N'R2', N'7,5', N'A2', N'No', N'2016-12-31', N'0', N'20000000', NULL, N'J. BRAVO', N'CORPORATIVA', N'2017-07-04', N'2018-07-04', N'2017-05-25', 1)
SET IDENTITY_INSERT [dbo].[MacIndividual] OFF
