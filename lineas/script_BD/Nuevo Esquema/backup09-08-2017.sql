USE [controldelimites]
GO
/****** Object:  Table [scl].[Aprobacion]    Script Date: 09-08-2017 18:37:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[Aprobacion](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [varchar](255) NULL,
	[Rut] [varchar](255) NULL,
	[Actividad] [varchar](255) NULL,
	[Oficina] [varchar](255) NULL,
	[Ejecutivo] [varchar](255) NULL,
	[FechaCreacion] [varchar](255) NULL,
	[FechaVenc] [varchar](255) NULL,
	[FechaVencAnt] [varchar](255) NULL,
	[RatingInd] [varchar](255) NULL,
	[RatingGrupo] [varchar](255) NULL,
	[Clasificacion] [varchar](255) NULL,
	[Vigilancia] [varchar](255) NULL,
	[FechaInfFin] [varchar](255) NULL,
	[PromSaldoVista] [varchar](255) NULL,
	[DeudaSbifDirecta] [varchar](255) NULL,
	[DeudaSbifIndirecta] [varchar](255) NULL,
	[Penetracion] [varchar](255) NULL,
	[Leasing] [varchar](255) NULL,
	[NivelAtribucion] [varchar](255) NULL,
	[Empresa_Id] [int] NULL,
	[TipoAprobacion_Id] [int] NULL,
	[EstadoAprobacion_Id] [int] NULL,
 CONSTRAINT [Aprobacion_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[AprobacionLinea]    Script Date: 09-08-2017 18:37:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[AprobacionLinea](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Aprobacion_Id] [int] NULL,
	[Linea_Id] [int] NULL,
 CONSTRAINT [AprobacionLinea_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[Bloqueo]    Script Date: 09-08-2017 18:37:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[Bloqueo](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Monto] [varchar](255) NULL,
	[Activo] [int] NULL,
	[Sublinea_Id] [int] NULL,
 CONSTRAINT [Bloqueo_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[Condicion]    Script Date: 09-08-2017 18:37:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[Condicion](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Descripcion] [varchar](max) NULL,
	[Sublinea_Id] [int] NULL,
 CONSTRAINT [Condicion_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [scl].[Empresa]    Script Date: 09-08-2017 18:37:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[Empresa](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [varchar](255) NULL,
	[RazonSocial] [varchar](255) NULL,
	[Rut] [varchar](255) NULL,
	[Riesgo] [varchar](255) NULL,
	[Rating] [varchar](255) NULL,
	[Ejecutivo] [varchar](255) NULL,
	[Banca] [varchar](255) NULL,
	[Pep] [varchar](255) NULL,
	[Oficina] [varchar](255) NULL,
	[Vigilancia] [varchar](255) NULL,
 CONSTRAINT [Empresa_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[EmpresaSublinea]    Script Date: 09-08-2017 18:37:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[EmpresaSublinea](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Empresa_Id] [int] NULL,
	[Sublinea_Id] [int] NULL,
 CONSTRAINT [EmpresaSublinea_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[EstadoAprobacion]    Script Date: 09-08-2017 18:37:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[EstadoAprobacion](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [varchar](255) NULL,
 CONSTRAINT [EstadoAprobacion_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[EstadoOperacion]    Script Date: 09-08-2017 18:37:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[EstadoOperacion](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [varchar](255) NULL,
	[Operacion_Id] [int] NULL,
 CONSTRAINT [EstadoOperacion_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[Grupo]    Script Date: 09-08-2017 18:37:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[Grupo](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [varchar](200) NULL,
	[Rating] [varchar](200) NULL,
 CONSTRAINT [Grupo_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[GrupoEmpresa]    Script Date: 09-08-2017 18:37:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[GrupoEmpresa](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Empresa_Id] [int] NULL,
	[Grupo_Id] [int] NULL,
	[MacGrupo_Id] [int] NULL,
 CONSTRAINT [GrupoEmpresa_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[Linea]    Script Date: 09-08-2017 18:37:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[Linea](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Numero] [varchar](255) NULL,
	[Riesgo] [varchar](255) NULL,
	[Descripcion] [varchar](255) NULL,
	[Moneda] [varchar](255) NULL,
	[Aprobado] [varchar](255) NULL,
	[Utilizado] [varchar](255) NULL,
	[Reservado] [varchar](255) NULL,
	[Condicion] [varchar](255) NULL,
	[Disponible] [varchar](255) NULL,
	[Estado] [varchar](255) NULL,
	[Plazo] [varchar](255) NULL,
	[FechaVencimiento] [varchar](255) NULL,
	[Comentarios] [varchar](255) NULL,
	[Condiciones] [varchar](255) NULL,
 CONSTRAINT [Linea_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[MacGrupo]    Script Date: 09-08-2017 18:37:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[MacGrupo](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[AComite] [int] NULL,
	[FechaCreacion] [varchar](255) NULL,
	[FechaPresentacion] [varchar](255) NULL,
	[Comentario] [varchar](max) NULL,
	[PromSaldoVista] [varchar](255) NULL,
	[FechaVencimiento] [varchar](255) NULL,
	[RatingGrupo] [varchar](255) NULL,
	[NivelAtribucion] [varchar](255) NULL,
	[TotalSometidoAprobacion] [varchar](255) NULL,
 CONSTRAINT [MacGrupo_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [scl].[Operacion]    Script Date: 09-08-2017 18:37:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[Operacion](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[TipoOperacion] [varchar](255) NULL,
	[NumeroProducto] [varchar](255) NULL,
	[FechaOtorgamiento] [varchar](255) NULL,
	[FechaProxVenc] [varchar](255) NULL,
	[Moneda] [varchar](255) NULL,
	[MontoInicial] [varchar](255) NULL,
	[MontoActual] [varchar](255) NULL,
	[MontoActualMLinea] [varchar](255) NULL,
	[MontoActualMNac] [varchar](255) NULL,
	[EstadoOperacion_Id] [int] NULL,
	[NumeroOperacion] [varchar](255) NULL,
	[DescripcionProducto] [varchar](255) NULL,
	[FechaDesembolso] [varchar](255) NULL,
 CONSTRAINT [Operacion_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[Sublinea]    Script Date: 09-08-2017 18:37:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[Sublinea](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Numero] [varchar](255) NULL,
	[Riesgo] [varchar](255) NULL,
	[Descripcion] [varchar](255) NULL,
	[Moneda] [varchar](255) NULL,
	[Aprobado] [varchar](255) NULL,
	[Utilizado] [varchar](255) NULL,
	[Reservado] [varchar](255) NULL,
	[Condicion] [varchar](255) NULL,
	[Disponible] [varchar](255) NULL,
	[Estado] [varchar](255) NULL,
	[Plazo] [varchar](255) NULL,
	[FechaVencimiento] [varchar](255) NULL,
	[Comentarios] [varchar](255) NULL,
	[Condiciones] [varchar](255) NULL,
	[Linea_Id] [int] NULL,
	[Beneficiario_Id] [int] NULL,
 CONSTRAINT [Sublinea_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[SublineaOperacion]    Script Date: 09-08-2017 18:37:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[SublineaOperacion](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Sublinea_Id] [int] NULL,
	[Operacion_Id] [int] NULL,
 CONSTRAINT [SublineaOperacion_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[TipoAprobacion]    Script Date: 09-08-2017 18:37:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[TipoAprobacion](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [varchar](255) NULL,
 CONSTRAINT [TipoAprobacion_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[TipoOperacion]    Script Date: 09-08-2017 18:37:17 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[TipoOperacion](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Codigo] [varchar](255) NULL,
	[Plazo] [varchar](255) NULL,
	[Nombre] [varchar](255) NULL,
 CONSTRAINT [TipoOperacion_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [scl].[Empresa] ON 

INSERT [scl].[Empresa] ([Id], [Nombre], [RazonSocial], [Rut], [Riesgo], [Rating], [Ejecutivo], [Banca], [Pep], [Oficina], [Vigilancia]) VALUES (1, N'DROGUETT & RABY INGENIERIA Y SERVICIOS LTDA', N'DROGUETT & RABY INGENIERIA Y SERVICIOS LTDA', N'77832610', N'A6', N'S/R', N'Rodolfo Martínez', N'Pyme', N'', N'Huerfanos 740', N'No')
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
SET IDENTITY_INSERT [scl].[EmpresaSublinea] OFF
SET IDENTITY_INSERT [scl].[Grupo] ON 

INSERT [scl].[Grupo] ([Id], [Nombre], [Rating]) VALUES (1, N'DROGUETT & RABY INGENIERIA Y SERVICIOS LTDA', N'S/R')
SET IDENTITY_INSERT [scl].[Grupo] OFF
SET IDENTITY_INSERT [scl].[GrupoEmpresa] ON 

INSERT [scl].[GrupoEmpresa] ([Id], [Empresa_Id], [Grupo_Id], [MacGrupo_Id]) VALUES (1, 1, 1, NULL)
INSERT [scl].[GrupoEmpresa] ([Id], [Empresa_Id], [Grupo_Id], [MacGrupo_Id]) VALUES (2, NULL, NULL, NULL)
SET IDENTITY_INSERT [scl].[GrupoEmpresa] OFF
SET IDENTITY_INSERT [scl].[Linea] ON 

INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [Condicion], [Disponible], [Estado], [Plazo], [FechaVencimiento], [Comentarios], [Condiciones]) VALUES (1, N'1', N'D', N'Linea Crédito Cta. Cte.', N'CLP', N'3000', N'3000', N'0', N'Amarillo', N'0', N'0', N'12', N'2018-07-03', N'', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-2 y Sra. Paulina Raby Z. Rut:13.040.985-7
')
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [Condicion], [Disponible], [Estado], [Plazo], [FechaVencimiento], [Comentarios], [Condiciones]) VALUES (2, N'2', N'D', N'Linea Tarjeta de Credito', N'CLP', N'1200', N'0', N'0', N'Amarillo', N'1200', N'0', N'12', N'2018-07-03', N'', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-2 y Sra. Paulina Raby Z. Rut:13.040.985-7
')
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [Condicion], [Disponible], [Estado], [Plazo], [FechaVencimiento], [Comentarios], [Condiciones]) VALUES (3, N'3', N'D', N'Linea Factoring
', N'CLP', N'200000', N'0', N'0', N'Amarillo', N'200000
', N'0', N'12', N'03-07-2018
', N'', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-4
')
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [Condicion], [Disponible], [Estado], [Plazo], [FechaVencimiento], [Comentarios], [Condiciones]) VALUES (4, N'4', N'D', N'Linea Boleta de Garantía
', N'CLP', N'110000
', N'103051', N'0', N'Amarillo', N'6949', N'0', N'12', N'03-07-2018
', N'', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-4
')
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [Condicion], [Disponible], [Estado], [Plazo], [FechaVencimiento], [Comentarios], [Condiciones]) VALUES (5, N'5', N'D', N'Boleta de Garantía
', N'CLP', N'0', N'0', N'0', N'Amarillo', N'0', N'0', N'12', N'03-07-2018
', N'Se Solicita Boleta de Garantía para Fiel cumplimiento en obra adjudicada Con Aguas Andinas S.A. Con la glosa : Garantizar el fiel, completo y oportuno cumplimiento por la ejecución del proyecto refuerzo de agua potable Camino La Vara', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-2 y Sra. Paulina Raby Z. Rut:13.040.985-7
')
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [Condicion], [Disponible], [Estado], [Plazo], [FechaVencimiento], [Comentarios], [Condiciones]) VALUES (6, N'6', N'D', N'Boleta de Garantía
', N'CLP', N'18257
', N'0', N'0', N'Amarillo', N'18257
', N'0', N'12', N'03-07-2018
', N'''BDG para el fiel cumplimiento del contrato por M$18.070 correspondiente al 3% de contrato obra (MM$604) "mejoramiento y ampliación de servicio APR el Trébal, Comuna de Padre Hurtado" con mandante Aguas Andinas. Plazo De Boleta por 34 meses…;
''', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-4
')
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [Condicion], [Disponible], [Estado], [Plazo], [FechaVencimiento], [Comentarios], [Condiciones]) VALUES (7, N'7', N'D', N'Boleta de Garantía
', N'CLP', N'5753
', N'0', N'0', N'Amarillo', N'5753
', N'0', N'12', N'03-07-2018
', N'', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-4
')
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [Condicion], [Disponible], [Estado], [Plazo], [FechaVencimiento], [Comentarios], [Condiciones]) VALUES (8, N'8', N'D', N'Crédito en Cuotas (MAC)
', N'CLP', N'200000
', N'134993', N'0', N'Amarillo', N'65007
', N'0', N'3', N'03-07-2018
', N'', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-4
')
SET IDENTITY_INSERT [scl].[Linea] OFF
SET IDENTITY_INSERT [scl].[Operacion] ON 

INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso]) VALUES (1, N'8610', N'1001500738', N'10-01-2008
', N'13-12-2099
', N'CLP', N'3000', N'3000', N'3000', N'3000', 0, N'', N'', N'')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso]) VALUES (2, N'9206', N'000001683
', N'01-02-2017
', N'31-01-2018
', N'UF
', N'1', N'1', N'18233', N'18233', 0, N'', N'LINEA DE CREDITO EMPRESAS LCEMP
', N'10-01-2008
')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso]) VALUES (3, N'9221', N'000000683
', N'17-01-2017
', N'17-01-2018
', N'UF
', N'0', N'0', N'1329', N'1329', 0, N'', N'CREDITO PARA BOL.DE GARANTIA - 1 AÃ‘O
', N'01-02-2017
')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso]) VALUES (4, N'9221', N'000001905
', N'14-03-2017
', N'14-09-2017', N'UF
', N'0', N'0', N'7975', N'7975', 0, N'', N'LINEA BDG MN_ME
', N'17-01-2017
')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso]) VALUES (5, N'9221', N'000016570
', N'13-10-2016
', N'10-10-2017
', N'CLP
', N'1817', N'1817', N'1817', N'1817', 0, N'', N'LINEA BDG MN_ME
', N'14-03-2017
')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso]) VALUES (6, N'9221', N'000350237
', N'14-03-2017
', N'16-08-2017
', N'UF
', N'0', N'0', N'6142', N'6142', 0, N'', N'LINEA BDG MN_ME
', N'13-10-2016
')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso]) VALUES (7, N'9221', N'000350239
', N'13-03-2017
', N'13-09-2017
', N'UF
', N'0', N'0', N'7975', N'7975', 0, N'', N'LINEA BDG MN_ME
', N'14-03-2017
')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso]) VALUES (8, N'9221', N'000354119
', N'10-07-2017
', N'10-01-2018
', N'UF
', N'0', N'0', N'5735', N'5735', 0, N'', N'LINEA BDG MN_ME
', N'14-03-2017
')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso]) VALUES (9, N'9221', N'000358403
', N'17-01-2017
', N'08-01-2018
', N'UF
', N'0', N'0', N'665', N'665', 0, N'', N'LINEA BDG MN_ME
', N'10-07-2017
')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso]) VALUES (10, N'9221', N'000358405
', N'17-01-2017
', N'08-01-2018
', N'UF
', N'0', N'0', N'1329', N'1329', 0, N'', N'LINEA BDG MN_ME
', N'17-01-2017
')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso]) VALUES (11, N'9221', N'000358409
', N'17-01-2017
', N'08-01-2018
', N'UF
', N'0', N'0', N'665', N'665', 0, N'', N'LINEA BDG MN_ME
', N'17-01-2017
')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso]) VALUES (12, N'9221', N'000359015
', N'01-02-2017
', N'02-10-2017
', N'UF
', N'2', N'0', N'40274', N'40274', 0, N'', N'LINEA BDG MN_ME
', N'17-01-2017
')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso]) VALUES (13, N'9221', N'000359203
', N'08-02-2017
', N'08-08-2017
', N'UF
', N'0', N'0', N'2658', N'2658', 0, N'', N'LINEA BDG MN_ME
', N'01-02-2017
')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso]) VALUES (14, N'9221', N'000359204
', N'08-02-2017
', N'08-08-2017
', N'UF
', N'0', N'0', N'2658', N'2658', 0, N'', N'LINEA BDG MN_ME
', N'08-02-2017
')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso]) VALUES (15, N'9221', N'000359752
', N'27-02-2017
', N'16-08-2017
', N'UF
', N'0', N'0', N'13273', N'13273', 0, N'', N'LINEA BDG MN_ME
', N'08-02-2017
')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso]) VALUES (16, N'9221', N'000359762
', N'27-02-2017
', N'28-08-2017
', N'UF
', N'0', N'0', N'10556', N'10556', 0, N'', N'LINEA BDG MN_ME
', N'27-02-2017
')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso]) VALUES (17, N'9252', N'000087096
', N'31-05-2017
', N'30-08-2017
', N'UF
', N'0', N'0', N'134993', N'134993', 0, N'', N'CREDITO EN CUOTAS COMERCIAL
', N'27-02-2017
')
SET IDENTITY_INSERT [scl].[Operacion] OFF
SET IDENTITY_INSERT [scl].[Sublinea] ON 

INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [Condicion], [Disponible], [Estado], [Plazo], [FechaVencimiento], [Comentarios], [Condiciones], [Linea_Id], [Beneficiario_Id]) VALUES (1, N'1.1', N'D', N'Linea Crédito Cta. Cte.', N'CLP', N'3000', N'3000', N'0', N'Amarillo', N'0', N'0', N'12', N'2018-07-03', N'', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-2 y Sra. Paulina Raby Z. Rut:13.040.985-7
', 1, 1)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [Condicion], [Disponible], [Estado], [Plazo], [FechaVencimiento], [Comentarios], [Condiciones], [Linea_Id], [Beneficiario_Id]) VALUES (2, N'2.1', N'D', N'Linea Tarjeta de Credito', N'CLP', N'1200', N'0', N'0', N'Amarillo', N'1200', N'0', N'12', N'2018-07-03', N'', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-2 y Sra. Paulina Raby Z. Rut:13.040.985-7
', 2, 1)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [Condicion], [Disponible], [Estado], [Plazo], [FechaVencimiento], [Comentarios], [Condiciones], [Linea_Id], [Beneficiario_Id]) VALUES (3, N'3.1', N'D', N'Linea Factoring
', N'CLP', N'200000', N'200000', N'0', N'Amarillo', N'200000', N'0', N'12', N'2018-07-03', N'', N'val Sr. Ivan Droguett Saez Rut: 10.723.799-4
L', 3, 1)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [Condicion], [Disponible], [Estado], [Plazo], [FechaVencimiento], [Comentarios], [Condiciones], [Linea_Id], [Beneficiario_Id]) VALUES (4, N'4.1', N'D', N'Linea Boleta de Garantía
', N'CLP', N'110000', N'110000
', N'0', N'Amarillo', N'6949', N'0', N'12', N'2018-07-03', N'', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-5
', 4, 1)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [Condicion], [Disponible], [Estado], [Plazo], [FechaVencimiento], [Comentarios], [Condiciones], [Linea_Id], [Beneficiario_Id]) VALUES (5, N'5.1', N'D', N'Boleta de Garantía
', N'CLP', N'0', N'0', N'0', N'Amarillo', N'0', N'0', N'12', N'2018-07-03', N'Se Solicita Boleta de Garantía para Fiel cumplimiento en obra adjudicada Con Aguas Andinas S.A. Con la glosa : Garantizar el fiel, completo y oportuno cumplimiento por la ejecución del proyecto refuerzo de agua potable Camino La Vara', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-2 y Sra. Paulina Raby Z. Rut:13.040.985-7
', 5, 1)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [Condicion], [Disponible], [Estado], [Plazo], [FechaVencimiento], [Comentarios], [Condiciones], [Linea_Id], [Beneficiario_Id]) VALUES (6, N'6.1', N'D', N'Boleta de Garantía
', N'CLP', N'18257
', N'18257
', N'0', N'Amarillo', N'18257', N'0', N'12', N'2018-07-03', N'BDG para el fiel cumplimiento del contrato por M$18.070 correspondiente al 3% de contrato obra (MM$604) "mejoramiento y ampliación de servicio APR el Trébal, Comuna de Padre Hurtado" con mandante Aguas Andinas. Plazo De Boleta por 34 meses…;
', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-7
', 6, 1)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [Condicion], [Disponible], [Estado], [Plazo], [FechaVencimiento], [Comentarios], [Condiciones], [Linea_Id], [Beneficiario_Id]) VALUES (7, N'7.1', N'D', N'Boleta de Garantía
', N'CLP', N'5753', N'5753', N'0', N'Amarillo', N'5753', N'0', N'12', N'2018-07-03', N'', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-8
', 7, 1)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [Condicion], [Disponible], [Estado], [Plazo], [FechaVencimiento], [Comentarios], [Condiciones], [Linea_Id], [Beneficiario_Id]) VALUES (8, N'8.1', N'D', N'Crédito en Cuotas (MAC)
', NULL, N'200000', N'134993
', N'0', N'Amarillo', N'65007', N'0', N'3', N'2018-07-03', N'', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-9
', 8, 1)
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
SET IDENTITY_INSERT [scl].[SublineaOperacion] OFF
SET IDENTITY_INSERT [scl].[TipoOperacion] ON 

INSERT [scl].[TipoOperacion] ([Id], [Codigo], [Plazo], [Nombre]) VALUES (1, N'8610', N'3', N'LINEA DE CREDITO EMPRESAS LCEMP')
INSERT [scl].[TipoOperacion] ([Id], [Codigo], [Plazo], [Nombre]) VALUES (2, N'9206', N'3', N'CREDITO PARA BOL.DE GARANTIA - 1 AÑO')
INSERT [scl].[TipoOperacion] ([Id], [Codigo], [Plazo], [Nombre]) VALUES (3, N'9221', N'4', N'LINEA BDG MN_ME')
INSERT [scl].[TipoOperacion] ([Id], [Codigo], [Plazo], [Nombre]) VALUES (4, N'9252', N'4', N'CREDITO EN CUOTAS COMERCIAL')
SET IDENTITY_INSERT [scl].[TipoOperacion] OFF
