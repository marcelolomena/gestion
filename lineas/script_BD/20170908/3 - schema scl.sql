USE [controldelimites]
GO
/****** Object:  Table [scl].[Aprobacion]    Script Date: 08-09-2017 12:06:09 ******/
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
	[FechaUltAct] [varchar](255) NULL,
	[Directo] [varchar](255) NULL,
	[Contingente] [varchar](255) NULL,
	[Derivados] [varchar](255) NULL,
	[EntregaDiferida] [varchar](255) NULL,
	[TotalCliente] [varchar](255) NULL,
	[VariacionAprobacion] [varchar](255) NULL,
	[DeudaBancoDirecta] [varchar](255) NULL,
	[GarantiaRealTopada] [varchar](255) NULL,
	[SbifAchel] [varchar](255) NULL,
 CONSTRAINT [Aprobacion_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[AprobacionLinea]    Script Date: 08-09-2017 12:06:09 ******/
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
/****** Object:  Table [scl].[Bloqueo]    Script Date: 08-09-2017 12:06:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[Bloqueo](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Monto] [varchar](255) NULL,
	[Activo] [int] NULL,
	[Linea_Id] [int] NULL,
	[Comentario] [varchar](255) NULL,
	[FechaBloqueo] [varchar](50) NULL,
 CONSTRAINT [Bloqueo_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[Comentario]    Script Date: 08-09-2017 12:06:09 ******/
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
/****** Object:  Table [scl].[ComentarioLinea]    Script Date: 08-09-2017 12:06:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[ComentarioLinea](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Linea_Id] [int] NULL,
	[Comentario_Id] [int] NULL,
 CONSTRAINT [ComentarioLinea_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[Condicion]    Script Date: 08-09-2017 12:06:09 ******/
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
/****** Object:  Table [scl].[Documento]    Script Date: 08-09-2017 12:06:09 ******/
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
/****** Object:  Table [scl].[Empresa]    Script Date: 08-09-2017 12:06:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[Empresa](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [varchar](255) NULL,
	[Alias] [varchar](255) NULL,
	[Rut] [varchar](255) NULL,
	[Riesgo] [varchar](255) NULL,
	[Rating] [varchar](255) NULL,
	[Ejecutivo] [varchar](255) NULL,
	[Banca] [varchar](255) NULL,
	[Pep] [varchar](255) NULL,
	[Oficina] [varchar](255) NULL,
	[Vigilancia] [varchar](255) NULL,
	[Dv] [varchar](2) NULL,
	[Comportamiento] [varchar](255) NULL,
 CONSTRAINT [Empresa_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[EmpresaSublinea]    Script Date: 08-09-2017 12:06:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[EmpresaSublinea](
	[Id] [int] NOT NULL,
	[Empresa_Id] [int] NULL,
	[Sublinea_Id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[EstadoAprobacion]    Script Date: 08-09-2017 12:06:09 ******/
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
/****** Object:  Table [scl].[EstadoOperacion]    Script Date: 08-09-2017 12:06:09 ******/
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
/****** Object:  Table [scl].[Garantias]    Script Date: 08-09-2017 12:06:09 ******/
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
/****** Object:  Table [scl].[Grupo]    Script Date: 08-09-2017 12:06:09 ******/
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
/****** Object:  Table [scl].[GrupoEmpresa]    Script Date: 08-09-2017 12:06:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[GrupoEmpresa](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Empresa_Id] [int] NULL,
	[Grupo_Id] [int] NULL,
	[Vigente] [int] NULL,
 CONSTRAINT [GrupoEmpresa_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[Linea]    Script Date: 08-09-2017 12:06:09 ******/
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
	[Aprobado] [float] NULL,
	[Utilizado] [float] NULL,
	[Reservado] [float] NULL,
	[ColorCondicion] [varchar](255) NULL,
	[Disponible] [float] NULL,
	[Bloqueado] [float] NULL,
	[Plazo] [varchar](255) NULL,
	[FechaVencimiento] [varchar](255) NULL,
	[Padre_Id] [int] NULL,
	[Estado] [float] NULL,
	[Cuotas] [int] NULL,
	[CalendarioPago] [varchar](255) NULL,
	[OpcionCompra] [int] NULL,
	[Financiamiento] [int] NULL,
	[Alzamiento] [varchar](255) NULL,
	[AportePrevio] [float] NULL,
	[AportePariPasu] [float] NULL,
	[Anticipo] [float] NULL,
	[DestinoFondo] [varchar](255) NULL,
	[Cleanup] [varchar](255) NULL,
	[CondicionesGTA] [varchar](255) NULL,
	[VctoLinea] [varchar](255) NULL,
	[VctoCurse] [varchar](255) NULL,
	[PlazoMaxOP] [int] NULL,
	[PeriodoGracia] [int] NULL,
	[Prorrogas] [varchar](255) NULL,
	[Tipo_Id] [int] NULL,
	[Riesgo_Id] [int] NULL,
 CONSTRAINT [Linea_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[Linea_Garantias]    Script Date: 08-09-2017 12:06:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[Linea_Garantias](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Garantias_Id] [int] NULL,
	[Linea_Id] [int] NULL,
 CONSTRAINT [GarantiasLinea_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[LineaEmpresa]    Script Date: 08-09-2017 12:06:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[LineaEmpresa](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Empresa_Id] [int] NULL,
	[Linea_Id] [int] NULL,
 CONSTRAINT [EmpresaLinea_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[LineaOperacion]    Script Date: 08-09-2017 12:06:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[LineaOperacion](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Linea_Id] [int] NULL,
	[Operacion_Id] [int] NULL,
 CONSTRAINT [LineaOperacion_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[MacGrupo]    Script Date: 08-09-2017 12:06:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[MacGrupo](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[FechaCreacion] [varchar](255) NULL,
	[FechaPresentacion] [varchar](255) NULL,
	[Comentario] [varchar](max) NULL,
	[PromSaldoVista] [varchar](255) NULL,
	[FechaVencimiento] [varchar](255) NULL,
	[RatingGrupo] [varchar](255) NULL,
	[NivelAtribucion] [varchar](255) NULL,
	[TotalSometidoAprobacion] [varchar](255) NULL,
	[GrupoEmpresa_Id] [int] NULL,
	[EstadoAprobacion_Id] [int] NULL,
	[Acomite] [int] NULL,
	[MacGrupo_Id] [int] NULL,
	[Aprobacion_Id] [int] NULL,
 CONSTRAINT [MacGrupo_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [scl].[Moneda]    Script Date: 08-09-2017 12:06:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[Moneda](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [varchar](255) NULL,
 CONSTRAINT [Moneda_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[Operacion]    Script Date: 08-09-2017 12:06:09 ******/
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
	[RutEmpresa] [varchar](255) NULL,
 CONSTRAINT [Operacion_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[Periodicidad]    Script Date: 08-09-2017 12:06:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[Periodicidad](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Tipo] [varchar](255) NULL,
 CONSTRAINT [Periodicidad_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[Riesgo]    Script Date: 08-09-2017 12:06:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[Riesgo](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [varchar](255) NULL,
 CONSTRAINT [Riesgo_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[Sublinea]    Script Date: 08-09-2017 12:06:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[Sublinea](
	[Id] [int] NOT NULL,
	[Numero] [nvarchar](255) NULL,
	[Riesgo] [nvarchar](255) NULL,
	[Descripcion] [nvarchar](255) NULL,
	[Moneda] [nvarchar](255) NULL,
	[Aprobado] [nvarchar](255) NULL,
	[Utilizado] [nvarchar](255) NULL,
	[Reservado] [nvarchar](255) NULL,
	[ColorCondicion] [nvarchar](255) NULL,
	[Disponible] [nvarchar](255) NULL,
	[Bloqueado] [nvarchar](255) NULL,
	[Plazo] [nvarchar](255) NULL,
	[FechaVencimiento] [nvarchar](255) NULL,
	[BORRARCOMEN] [nvarchar](255) NULL,
	[BORRARCOND] [nvarchar](255) NULL,
	[Linea_Id] [int] NULL,
	[Beneficiario_Id] [int] NULL,
	[Comentario_Id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[SublineaOperacion]    Script Date: 08-09-2017 12:06:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[SublineaOperacion](
	[Id] [int] NOT NULL,
	[Sublinea_Id] [int] NULL,
	[Operacion_Id] [int] NULL,
PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[TipoAprobacion]    Script Date: 08-09-2017 12:06:09 ******/
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
/****** Object:  Table [scl].[TipoLimiteMoneda]    Script Date: 08-09-2017 12:06:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[TipoLimiteMoneda](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Moneda_Id] [int] NULL,
	[TipoLimite] [int] NULL,
 CONSTRAINT [TipoLimiteMoneda_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[TipoLimitePeriodicidad]    Script Date: 08-09-2017 12:06:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[TipoLimitePeriodicidad](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Periodicidad_Id] [int] NULL,
	[TipoLimite_Id] [int] NULL,
 CONSTRAINT [TipoLimitePeriodicidad_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[TipoLinea]    Script Date: 08-09-2017 12:06:09 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[TipoLinea](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [varchar](255) NULL,
	[Plazomax] [int] NULL,
	[Prorroga] [int] NULL,
	[PeriodoGracia] [int] NULL,
	[Reutilizable] [int] NULL,
	[FactorCreq] [int] NULL,
	[Monto] [float] NULL,
	[Plazo] [int] NULL,
	[NCuotas] [nchar](10) NULL,
 CONSTRAINT [TipoLimite	_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[TipoOperacion]    Script Date: 08-09-2017 12:06:09 ******/
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
