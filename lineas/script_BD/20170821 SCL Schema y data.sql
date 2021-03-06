USE [controldelimites]
GO
/****** Object:  Table [scl].[Aprobacion]    Script Date: 21-08-2017 16:35:09 ******/
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
/****** Object:  Table [scl].[AprobacionLinea]    Script Date: 21-08-2017 16:35:09 ******/
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
/****** Object:  Table [scl].[Bloqueo]    Script Date: 21-08-2017 16:35:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[Bloqueo](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Monto] [varchar](255) NULL,
	[Activo] [int] NULL,
	[Sublinea_Id] [int] NULL,
	[Comentario_Id] [int] NULL,
 CONSTRAINT [Bloqueo_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[Comentario]    Script Date: 21-08-2017 16:35:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[Comentario](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Comentario] [varchar](max) NULL,
	[NombreUsuario] [varchar](max) NULL,
	[Fecha] [varchar](max) NULL,
	[Documento_Id] [int] NULL,
	[Comentario_Id] [int] NULL,
 CONSTRAINT [Comentario_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [scl].[ComentarioSublinea]    Script Date: 21-08-2017 16:35:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[ComentarioSublinea](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Sublinea_Id] [int] NULL,
	[Comentario_Id] [int] NULL,
 CONSTRAINT [ComentarioSublinea_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[Condicion]    Script Date: 21-08-2017 16:35:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[Condicion](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Descripcion] [varchar](max) NULL,
	[Sublinea_Id] [int] NULL,
	[TipoCondicion] [varchar](50) NULL,
	[Rut] [varchar](50) NULL,
	[Nombre] [varchar](255) NULL,
	[DV] [varchar](2) NULL,
 CONSTRAINT [Condicion_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [scl].[Documento]    Script Date: 21-08-2017 16:35:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[Documento](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Direccion] [varchar](max) NULL,
 CONSTRAINT [Documento_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [scl].[Empresa]    Script Date: 21-08-2017 16:35:09 ******/
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
	[Dv] [varchar](2) NULL,
 CONSTRAINT [Empresa_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[EmpresaSublinea]    Script Date: 21-08-2017 16:35:09 ******/
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
/****** Object:  Table [scl].[EstadoAprobacion]    Script Date: 21-08-2017 16:35:09 ******/
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
/****** Object:  Table [scl].[EstadoOperacion]    Script Date: 21-08-2017 16:35:09 ******/
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
/****** Object:  Table [scl].[Garantias]    Script Date: 21-08-2017 16:35:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[Garantias](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Numero] [int] NULL,
	[Folio] [int] NULL,
	[Tipo] [varchar](255) NULL,
	[Descripcion] [varchar](255) NULL,
	[Clausula] [varchar](255) NULL,
	[Estado] [varchar](255) NULL,
	[FechaTasacion] [varchar](255) NULL,
	[ValorComercial] [varchar](255) NULL,
	[ValorLiquidacion] [varchar](255) NULL,
	[Notas] [varchar](max) NULL,
 CONSTRAINT [Garantias_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [scl].[GarantiasSublinea]    Script Date: 21-08-2017 16:35:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[GarantiasSublinea](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Garantias_Id] [int] NULL,
	[Sublinea_Id] [int] NULL,
 CONSTRAINT [GarantiasSublinea_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[Grupo]    Script Date: 21-08-2017 16:35:09 ******/
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
/****** Object:  Table [scl].[GrupoEmpresa]    Script Date: 21-08-2017 16:35:09 ******/
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
/****** Object:  Table [scl].[Linea]    Script Date: 21-08-2017 16:35:09 ******/
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
	[ColorCondicion] [varchar](255) NULL,
	[Disponible] [varchar](255) NULL,
	[Bloqueado] [varchar](255) NULL,
	[Plazo] [varchar](255) NULL,
	[FechaVencimiento] [varchar](255) NULL,
	[BORRARCOMEN] [varchar](255) NULL,
	[BORRARCOND] [varchar](255) NULL,
 CONSTRAINT [Linea_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[MacGrupo]    Script Date: 21-08-2017 16:35:09 ******/
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
/****** Object:  Table [scl].[Operacion]    Script Date: 21-08-2017 16:35:09 ******/
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
/****** Object:  Table [scl].[Sublinea]    Script Date: 21-08-2017 16:35:09 ******/
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
	[ColorCondicion] [varchar](255) NULL,
	[Disponible] [varchar](255) NULL,
	[Bloqueado] [varchar](255) NULL,
	[Plazo] [varchar](255) NULL,
	[FechaVencimiento] [varchar](255) NULL,
	[BORRARCOMEN] [varchar](255) NULL,
	[BORRARCOND] [varchar](255) NULL,
	[Linea_Id] [int] NULL,
	[Beneficiario_Id] [int] NULL,
	[Comentario_Id] [int] NULL,
 CONSTRAINT [Sublinea_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[SublineaOperacion]    Script Date: 21-08-2017 16:35:09 ******/
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
/****** Object:  Table [scl].[TipoAprobacion]    Script Date: 21-08-2017 16:35:09 ******/
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
/****** Object:  Table [scl].[TipoOperacion]    Script Date: 21-08-2017 16:35:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[TipoOperacion](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Codigo] [varchar](255) NULL,
	[Plazo] [varchar](255) NULL,
	[Nombre] [varchar](255) NULL,
	[TipoRiesgo] [varchar](2) NULL,
 CONSTRAINT [TipoOperacion_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
SET IDENTITY_INSERT [scl].[Aprobacion] ON 

INSERT [scl].[Aprobacion] ([Id], [Nombre], [Rut], [Actividad], [Oficina], [Ejecutivo], [FechaCreacion], [FechaVenc], [FechaVencAnt], [RatingInd], [RatingGrupo], [Clasificacion], [Vigilancia], [FechaInfFin], [PromSaldoVista], [DeudaSbifDirecta], [DeudaSbifIndirecta], [Penetracion], [Leasing], [NivelAtribucion], [Empresa_Id], [TipoAprobacion_Id], [EstadoAprobacion_Id]) VALUES (1, N'DROGUETT & RABY INGENIERIA Y SERVICIOS LTDA', N'77832610', N'SUBCONTRATISTAS DE EDIFICACION', N'HUERFANOS 740', N'Rodolfo Martínez', N'03-07-2017', N'03-07-2018', N'2018-06-30', N'S/R', N'S/R', N'A6', N'No', N'30-04-2017', N'90640000', N'1317925', N'0', N'0,28', N'0', N'N/A', 1, 1, 1)
INSERT [scl].[Aprobacion] ([Id], [Nombre], [Rut], [Actividad], [Oficina], [Ejecutivo], [FechaCreacion], [FechaVenc], [FechaVencAnt], [RatingInd], [RatingGrupo], [Clasificacion], [Vigilancia], [FechaInfFin], [PromSaldoVista], [DeudaSbifDirecta], [DeudaSbifIndirecta], [Penetracion], [Leasing], [NivelAtribucion], [Empresa_Id], [TipoAprobacion_Id], [EstadoAprobacion_Id]) VALUES (2, N'COMERCIAL APERITIVO CHILE LIMITADA', N'76265440', N'PRODUCTOS ALIMENTICIOS, BEBIDAS Y TABACOS', N'HUERFANOS 740', N'Roberto Alejandro Castillo', N'30-08-2016', N'30-08-2017', N'25-08-2017', N'S/R', N'S/R', N'A4', N'No', N'30-06-2016', N'21662000', N'33550', N'0', N'100%', N'7442', N'N/A', 2, 1, 1)
INSERT [scl].[Aprobacion] ([Id], [Nombre], [Rut], [Actividad], [Oficina], [Ejecutivo], [FechaCreacion], [FechaVenc], [FechaVencAnt], [RatingInd], [RatingGrupo], [Clasificacion], [Vigilancia], [FechaInfFin], [PromSaldoVista], [DeudaSbifDirecta], [DeudaSbifIndirecta], [Penetracion], [Leasing], [NivelAtribucion], [Empresa_Id], [TipoAprobacion_Id], [EstadoAprobacion_Id]) VALUES (3, N'COMPAÑÍA INDUSTRIAL EL VOLCAN S.A.', N'90209000', N'Fabricación de materiales para la construcción.', NULL, N'J BRAVO', N'04-07-2017', N'04-07-2018', N'25-05-2017', N'8,5', N'7', N'A3', N'No', N'31-12-2016', N'288000', N'0', N'10146454', N'', N'0', N'R2', 3, 1, 1)
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
SET IDENTITY_INSERT [scl].[Comentario] OFF
SET IDENTITY_INSERT [scl].[ComentarioSublinea] ON 

INSERT [scl].[ComentarioSublinea] ([Id], [Sublinea_Id], [Comentario_Id]) VALUES (1, 3, 1)
INSERT [scl].[ComentarioSublinea] ([Id], [Sublinea_Id], [Comentario_Id]) VALUES (2, 7, 2)
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

INSERT [scl].[Empresa] ([Id], [Nombre], [RazonSocial], [Rut], [Riesgo], [Rating], [Ejecutivo], [Banca], [Pep], [Oficina], [Vigilancia], [Dv]) VALUES (1, N'DROGUETT & RABY INGENIERIA Y SERVICIOS LTDA', N'DROGUETT & RABY INGENIERIA Y SERVICIOS LTDA', N'77832610', N'A6', N'S/R', N'Rodolfo Martínez', N'Pyme', N'', N'Huérfanos 740', N'No', N'8')
INSERT [scl].[Empresa] ([Id], [Nombre], [RazonSocial], [Rut], [Riesgo], [Rating], [Ejecutivo], [Banca], [Pep], [Oficina], [Vigilancia], [Dv]) VALUES (2, N'COMERCIAL APERITIVO CHILE LIMITADA', N'COMERCIAL APERITIVO CHILE LIMITADA', N'76265440', N'A4', N'S/R', N'Roberto Alejandro Castillo', N'Pyme', N'', N'Huérfanos 740', N'No', N'7')
INSERT [scl].[Empresa] ([Id], [Nombre], [RazonSocial], [Rut], [Riesgo], [Rating], [Ejecutivo], [Banca], [Pep], [Oficina], [Vigilancia], [Dv]) VALUES (3, N'COMPAÑÍA INDUSTRIAL EL VOLCAN S.A.', N'COMPAÑÍA INDUSTRIAL EL VOLCAN S.A.', N'90209000', N'A3', N'8,5', N'J.bravo', N'Corporativa', N'', NULL, N'No', N'2')
INSERT [scl].[Empresa] ([Id], [Nombre], [RazonSocial], [Rut], [Riesgo], [Rating], [Ejecutivo], [Banca], [Pep], [Oficina], [Vigilancia], [Dv]) VALUES (4, N'AISLANTES VOLCAN S.A', N'AISLANTES VOLCAN S.A', N'96848750', N'A3', N'S/R', N'J.Bravo', N'Corporativa', N' ', NULL, N'No', N'7')
INSERT [scl].[Empresa] ([Id], [Nombre], [RazonSocial], [Rut], [Riesgo], [Rating], [Ejecutivo], [Banca], [Pep], [Oficina], [Vigilancia], [Dv]) VALUES (5, N'FIBROCEMENTOS VOLCAN LTDA', N'FIBROCEMENTOS VOLCAN LTDA', N'77524300', N'A3', N'S/R', N'J.Bravo', N'Corporativa', N'', NULL, N'No', N'7')
INSERT [scl].[Empresa] ([Id], [Nombre], [RazonSocial], [Rut], [Riesgo], [Rating], [Ejecutivo], [Banca], [Pep], [Oficina], [Vigilancia], [Dv]) VALUES (6, N'MINERA LO VALDES LTDA', N'MINERA LO VALDES LTDA', N'84707300', N'A3', N'S/R', N'J.Bravo', N'Corporativa', N'', NULL, N'No', N'4')
INSERT [scl].[Empresa] ([Id], [Nombre], [RazonSocial], [Rut], [Riesgo], [Rating], [Ejecutivo], [Banca], [Pep], [Oficina], [Vigilancia], [Dv]) VALUES (7, N'TRANSPORTES EL YESO LTDA', N'TRANSPORTE EL YESO LTDA', N'78325650', N'A3', N'S/R', N'J.Bravo', N'Corporativa', N'', NULL, N'No', N'9')
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

INSERT [scl].[EstadoAprobacion] ([Id], [Nombre]) VALUES (1, N'Vigente')
INSERT [scl].[EstadoAprobacion] ([Id], [Nombre]) VALUES (2, N'Vencido')
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
SET IDENTITY_INSERT [scl].[Grupo] OFF
SET IDENTITY_INSERT [scl].[GrupoEmpresa] ON 

INSERT [scl].[GrupoEmpresa] ([Id], [Empresa_Id], [Grupo_Id], [MacGrupo_Id]) VALUES (1, 1, 1, NULL)
INSERT [scl].[GrupoEmpresa] ([Id], [Empresa_Id], [Grupo_Id], [MacGrupo_Id]) VALUES (2, 2, 2, NULL)
INSERT [scl].[GrupoEmpresa] ([Id], [Empresa_Id], [Grupo_Id], [MacGrupo_Id]) VALUES (3, 3, 3, NULL)
INSERT [scl].[GrupoEmpresa] ([Id], [Empresa_Id], [Grupo_Id], [MacGrupo_Id]) VALUES (4, 4, 3, NULL)
INSERT [scl].[GrupoEmpresa] ([Id], [Empresa_Id], [Grupo_Id], [MacGrupo_Id]) VALUES (5, 5, 3, NULL)
INSERT [scl].[GrupoEmpresa] ([Id], [Empresa_Id], [Grupo_Id], [MacGrupo_Id]) VALUES (6, 6, 3, NULL)
INSERT [scl].[GrupoEmpresa] ([Id], [Empresa_Id], [Grupo_Id], [MacGrupo_Id]) VALUES (7, 7, 3, NULL)
SET IDENTITY_INSERT [scl].[GrupoEmpresa] OFF
SET IDENTITY_INSERT [scl].[Linea] ON 

INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (1, N'1', N'D', N'Linea Crédito Cta. Cte.', N'CLP', N'3000', N'3000', N'0', N'Amarillo', N'0', N'0', N'12', N'03-07-2018
', N'undefined', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-2 y Sra. Paulina Raby Z. Rut:13.040.985-7
')
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (2, N'2', N'D', N'Linea Tarjeta de Credito', N'CLP', N'1200', N'0', N'0', N'Amarillo', N'1200', N'0', N'12', N'03-07-2018
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
', N'''BDG para el fiel cumplimiento del contrato por M$18.070 correspondiente al 3% de contrato obra (MM$604) "mejoramiento y ampliación de servicio APR el Trébol, Comuna de Padre Hurtado" con mandante Aguas Andinas. Plazo De Boleta por 34 meses…;
''', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-4
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
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (13, N'1', N'D', N'Linea Credito Cta Cte', N'CLP', N'6400', N'1070', N'0', N'Amarillo', N'10000', N'99', N'12', N'30-08-2018', N'undefined', N'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2')
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (18, N'6', N'D', N'Operación Leasing', N'CLP', N'7737', N'3625', N'0', N'Rojo', N'0', N'0', N'12', N'30-08-2018', N'undefined', N'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2.   Descripción: leasing al 50% sobre el vehículo')
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (19, N'7', N'D', N'Línea Capital de Trabajo', N'CLP', N'25000', N'21350', N'0', N'Amarillo', N'3650', N'0', N'12', N'30-08-2018', N'Se solicita linea capital de trabajo por M$50.000 para curse de bullet a 180 días, renovable una vez. Crédito comerciales a 12 meses, Carta de Crédito…;', N'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2')
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (20, N'9', N'D', N'Crédito en Cuotas (MAC)', N'CLP', N'21533', N'17196', N'0', N'Rojo', N'0', N'0', N'12', N'30-08-2018', N'.', N'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2')
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (21, N'1', N'D', N'Línea Capital de Trabajo', N'CLP', N'19455252', N'0', N'0', N'Verde', N'19455252', N'0', N'24', N'04-07-2018', N'', NULL)
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (22, N'2', N'EC', N'Linea Derivado', N'CLP', N'9000000', N'0', N'0', N'Verde', N'9000000', N'0', N'12', N'04-07-2018', N'', NULL)
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (23, N'3', N'E', N'Linea Entrega Diferida', N'CLP', N'3242542', N'0', N'0', N'Verde', N'3242542', N'0', N'12', N'04-07-2018', N'', NULL)
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
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso]) VALUES (19, N'8610', N'119002799', N'10-04-2007', N'10-04-2018', N'CLP', N'6400', N'1070', N'', N'1070', 0, N'', N'LINEA DE CREDITO EMPRESAS LCEMP', N'10-04-2007')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso]) VALUES (20, N'9252', N'000001739', N'23-03-2017', N'24-08-2017', N'CLP', N'25405', N'17196', N'', N'17196', 0, N'', N'CREDITO EN CUOTAS COMERCIAL', N'23-07-2017')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso]) VALUES (21, N'9252', N'000087148', N'02-06-2017', N'04-09-2017', N'CLP', N'25404', N'21350', N'', N'21350', 0, N'', N'CREDITO EN CUOTAS COMERCIAL', N'02-06-2017')
INSERT [scl].[Operacion] ([Id], [TipoOperacion], [NumeroProducto], [FechaOtorgamiento], [FechaProxVenc], [Moneda], [MontoInicial], [MontoActual], [MontoActualMLinea], [MontoActualMNac], [EstadoOperacion_Id], [NumeroOperacion], [DescripcionProducto], [FechaDesembolso]) VALUES (22, N'38010', N'009902256', N'06-05-2015', N'04-09-2017', N'CLP', N'201195', N'11509', N'', N'3625', 0, N'', N'LEASING MOBIL.COMERCIAL. TF SIN GARANTIA', N'06-05-2017')
SET IDENTITY_INSERT [scl].[Operacion] OFF
SET IDENTITY_INSERT [scl].[Sublinea] ON 

INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (1, N'1.1', N'D', N'Linea Crédito Cta. Cte.', N'CLP', N'3000', N'3000', N'0', N'Amarillo', N'0', N'100', N'12', N'2018-07-03', N'', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-2 y Sra. Paulina Raby Z. Rut:13.040.985-7
', 1, 1, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (2, N'2.1', N'D', N'Linea Tarjeta de Credito', N'CLP', N'1200', N'0', N'0', N'Amarillo', N'1200', N'0', N'12', N'2018-07-03', N'', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-2 y Sra. Paulina Raby Z. Rut:13.040.985-7
', 2, 1, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (3, N'3.1', N'D', N'Linea Factoring
', N'CLP', N'200000', N'0', N'0', N'Amarillo', N'200000', N'0', N'12', N'2018-07-03', N'', N'val Sr. Ivan Droguett Saez Rut: 10.723.799-4
L', 3, 1, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (4, N'4.1', N'D', N'Linea Boleta de Garantía
', N'CLP', N'110000', N'103051', N'0', N'Amarillo', N'6949', N'0', N'12', N'2018-07-03', N'', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-5
', 4, 1, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (6, N'6.1', N'D', N'Boleta de Garantía
', N'CLP', N'18257
', N'0', N'0', N'Amarillo', N'18257', N'0', N'12', N'2018-07-03', N'BDG para el fiel cumplimiento del contrato por M$18.070 correspondiente al 3% de contrato obra (MM$604) "mejoramiento y ampliación de servicio APR el Trébal, Comuna de Padre Hurtado" con mandante Aguas Andinas. Plazo De Boleta por 34 meses…;
', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-7
', 6, 1, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (7, N'7.1', N'D', N'Boleta de Garantía
', N'CLP', N'5753', N'0', N'0', N'Amarillo', N'5753', N'0', N'12', N'2018-07-03', N'', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-8
', 7, 1, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (8, N'8.1', N'D', N'Crédito en Cuotas (MAC)
', NULL, N'200000', N'134993
', N'0', N'Amarillo', N'65007', N'0', N'3', N'2018-07-03', N'', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-9
', 8, 1, NULL)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (18, N'1', N'D', N'Linea Credito Cta Cte', N'CLP', N'6400', N'1070', N'0', N'Amarillo', N'5330', N'0', N'12', N'30-08-2018', N'.', N'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2', 13, 2, 1)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (23, N'6.1', N'D', N'Operación Leasing', N'CLP', N'7737', N'3625', N'0', N'Amarillo', N'0', N'0', N'12', N'30-08-2018', N'.', N'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2.   Descripción: leasing al 50% sobre el vehículo', 18, 2, 1)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (24, N'7.1', N'D', N'Línea Capital de Trabajo', N'CLP', N'25000', N'21350', N'0', N'Amarillo', N'3650', N'0', N'12', N'30-08-2018', N'Se solicita linea capital de trabajo por M$50.000 para curse de bullet a 180 días, renovable una vez. Crédito comerciales a 12 meses, Carta de Crédito…;', N'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2', 19, 2, 1)
INSERT [scl].[Sublinea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND], [Linea_Id], [Beneficiario_Id], [Comentario_Id]) VALUES (25, N'9.1', N'D', N'Crédito en Cuotas (MAC)', N'CLP', N'21533', N'17196', N'0', N'Amarillo', N'0', N'0', N'12', N'30-08-2018', N'.', N'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2', 20, 2, 1)
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
SET IDENTITY_INSERT [scl].[SublineaOperacion] OFF
SET IDENTITY_INSERT [scl].[TipoAprobacion] ON 

INSERT [scl].[TipoAprobacion] ([Id], [Nombre]) VALUES (1, N'Mac')
SET IDENTITY_INSERT [scl].[TipoAprobacion] OFF
SET IDENTITY_INSERT [scl].[TipoOperacion] ON 

INSERT [scl].[TipoOperacion] ([Id], [Codigo], [Plazo], [Nombre], [TipoRiesgo]) VALUES (1, N'8610', N'3', N'LINEA DE CREDITO EMPRESAS LCEMP', N'D')
INSERT [scl].[TipoOperacion] ([Id], [Codigo], [Plazo], [Nombre], [TipoRiesgo]) VALUES (2, N'9206', N'3', N'CREDITO PARA BOL.DE GARANTIA - 1 AÑO', N'C')
INSERT [scl].[TipoOperacion] ([Id], [Codigo], [Plazo], [Nombre], [TipoRiesgo]) VALUES (3, N'9221', N'4', N'LINEA BDG MN_ME', N'C')
INSERT [scl].[TipoOperacion] ([Id], [Codigo], [Plazo], [Nombre], [TipoRiesgo]) VALUES (4, N'9252', N'4', N'CREDITO EN CUOTAS COMERCIAL', N'D')
SET IDENTITY_INSERT [scl].[TipoOperacion] OFF
