USE [controldelimites]
GO
/****** Object:  Table [scl].[Aprobacion]    Script Date: 13-09-2017 18:46:43 ******/
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
/****** Object:  Table [scl].[AprobacionLinea]    Script Date: 13-09-2017 18:46:43 ******/
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
/****** Object:  Table [scl].[Bloqueo]    Script Date: 13-09-2017 18:46:43 ******/
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
/****** Object:  Table [scl].[Comentario]    Script Date: 13-09-2017 18:46:43 ******/
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
/****** Object:  Table [scl].[ComentarioLinea]    Script Date: 13-09-2017 18:46:43 ******/
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
/****** Object:  Table [scl].[Condicion]    Script Date: 13-09-2017 18:46:43 ******/
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
/****** Object:  Table [scl].[Documento]    Script Date: 13-09-2017 18:46:43 ******/
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
/****** Object:  Table [scl].[Empresa]    Script Date: 13-09-2017 18:46:43 ******/
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
/****** Object:  Table [scl].[EstadoAprobacion]    Script Date: 13-09-2017 18:46:43 ******/
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
/****** Object:  Table [scl].[EstadoOperacion]    Script Date: 13-09-2017 18:46:43 ******/
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
/****** Object:  Table [scl].[Garantias]    Script Date: 13-09-2017 18:46:43 ******/
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
/****** Object:  Table [scl].[Grupo]    Script Date: 13-09-2017 18:46:43 ******/
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
/****** Object:  Table [scl].[GrupoEmpresa]    Script Date: 13-09-2017 18:46:43 ******/
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
/****** Object:  Table [scl].[Linea]    Script Date: 13-09-2017 18:46:43 ******/
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
	[MonedaSometido] [varchar](5) NULL,
	[MonedaDisponible] [varchar](5) NULL,
	[Sometido] [float] NULL,
	[PlazoResidual] [varchar](5) NULL,
 CONSTRAINT [Linea_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[Linea_Garantias]    Script Date: 13-09-2017 18:46:43 ******/
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
/****** Object:  Table [scl].[LineaEmpresa]    Script Date: 13-09-2017 18:46:43 ******/
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
/****** Object:  Table [scl].[LineaOperacion]    Script Date: 13-09-2017 18:46:43 ******/
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
/****** Object:  Table [scl].[MacGrupo]    Script Date: 13-09-2017 18:46:43 ******/
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
/****** Object:  Table [scl].[Moneda]    Script Date: 13-09-2017 18:46:43 ******/
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
/****** Object:  Table [scl].[Operacion]    Script Date: 13-09-2017 18:46:43 ******/
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
	[Producto] [varchar](255) NULL,
	[Plazo] [varchar](255) NULL,
	[FechaReserva] [varchar](255) NULL,
	[FechaVencimiento] [varchar](255) NULL,
	[Observacion] [varchar](max) NULL,
 CONSTRAINT [Operacion_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [scl].[Periodicidad]    Script Date: 13-09-2017 18:46:43 ******/
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
/****** Object:  Table [scl].[Riesgo]    Script Date: 13-09-2017 18:46:43 ******/
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
/****** Object:  Table [scl].[Sublinea]    Script Date: 13-09-2017 18:46:43 ******/
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
/****** Object:  Table [scl].[SublineaOperacion]    Script Date: 13-09-2017 18:46:43 ******/
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
/****** Object:  Table [scl].[TipoAprobacion]    Script Date: 13-09-2017 18:46:43 ******/
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
/****** Object:  Table [scl].[TipoLimiteMoneda]    Script Date: 13-09-2017 18:46:43 ******/
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
/****** Object:  Table [scl].[TipoLimitePeriodicidad]    Script Date: 13-09-2017 18:46:43 ******/
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
/****** Object:  Table [scl].[TipoLinea]    Script Date: 13-09-2017 18:46:43 ******/
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
	[Riesgo] [int] NULL,
 CONSTRAINT [TipoLimite	_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[TipoOperacion]    Script Date: 13-09-2017 18:46:43 ******/
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
/****** Object:  StoredProcedure [scl].[borrarreserva]    Script Date: 13-09-2017 18:46:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [scl].[borrarreserva](@Linea_Id INT,@OpId INT)
as
BEGIN
	-- exec scl.nuevareserva 1,'hola'
	-- procedimiento es de select el sp se llama scl.se
	-- para insert el sp se llama scl.ins

	--DECLARE @ultimoid INT

	DELETE FROM scl.Operacion WHERE  Id=@OpId

	DELETE FROM scl.LineaOperacion WHERE Id=@Linea_Id
	
	--SELECT @ultimoid = scope_identity() FROM scl.Operacion


END
GO
/****** Object:  StoredProcedure [scl].[creargruponuevo]    Script Date: 13-09-2017 18:46:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [scl].[creargruponuevo](@idempresa INT, @nombregrupo VARCHAR(100))
as
BEGIN

	DECLARE @idnuevogrupo int
	DECLARE @idgrupoempresa int
	DECLARE @idcabecera int

	INSERT INTO [scl].[Grupo]
           ([Nombre]
           ,[Rating])
     VALUES (@nombregrupo, 'S/R')

	SELECT @idnuevogrupo = scope_identity() FROM scl.Grupo

	INSERT INTO [scl].[GrupoEmpresa]
           ([Empresa_Id]
           ,[Grupo_Id]
           ,[Vigente])
     VALUES
	 (@idempresa, @idnuevogrupo, '0')

	 SELECT @idgrupoempresa = scope_identity() FROM scl.GrupoEmpresa


	 INSERT INTO [scl].[MacGrupo]
           ([GrupoEmpresa_Id],
		    [FechaCreacion]
           ,[EstadoAprobacion_Id])
     VALUES (@idgrupoempresa,'24-08-2017', 2)

	 SELECT @idcabecera = scope_identity() FROM scl.MacGrupo

	 INSERT INTO [scl].[MacGrupo]
           ([GrupoEmpresa_Id]
           ,[Acomite]
           ,[MacGrupo_Id])
     VALUES (@idgrupoempresa, 2, @idcabecera)

	select @idcabecera as idcabecera

END


GO
/****** Object:  StoredProcedure [scl].[creargruponuevo2]    Script Date: 13-09-2017 18:46:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [scl].[creargruponuevo2](@idempresa INT, @nombregrupo VARCHAR(100))
as
BEGIN

	DECLARE @idnuevogrupo int
	DECLARE @idgrupoempresa int
	DECLARE @idcabecera int

	INSERT INTO [scl].[Grupo]
           ([Nombre]
           ,[Rating])
     VALUES (@nombregrupo, 'S/R')

	SELECT @idnuevogrupo = scope_identity() FROM scl.Grupo

	INSERT INTO [scl].[GrupoEmpresa]
           ([Empresa_Id]
           ,[Grupo_Id]
           ,[Vigente])
     VALUES
	 (@idempresa, @idnuevogrupo, '0')

	 SELECT @idgrupoempresa = scope_identity() FROM scl.GrupoEmpresa


	 INSERT INTO [scl].[MacGrupo]
           ([GrupoEmpresa_Id],
		    [FechaCreacion]
           ,[EstadoAprobacion_Id])
     VALUES (@idgrupoempresa,'24-08-2017', 2)

	 SELECT @idcabecera = scope_identity() FROM scl.MacGrupo

	 INSERT INTO [scl].[MacGrupo]
           ([GrupoEmpresa_Id]
           ,[Acomite]
           ,[MacGrupo_Id])
     VALUES (@idgrupoempresa, 2, @idcabecera)

	select @idcabecera as idcabecera

END


GO
/****** Object:  StoredProcedure [scl].[crearmacgrupodegrupo]    Script Date: 13-09-2017 18:46:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [scl].[crearmacgrupodegrupo](@idgrupo INT, @idempresabase INT)
as
BEGIN

	DECLARE @idgrupoempresa int
	DECLARE @idcabecera int
	DECLARE @idempresa int
	DECLARE @idaprobacion int
	DECLARE @fechacreacion varchar(10)
	DECLARE @fechavencimiento varchar(10)
	DECLARE @fechapresentacion varchar(10)

	DECLARE @idmac int
	DECLARE @idlinea int
	DECLARE @idlineanueva int
	DECLARE @idsublinea int

	--SELECT FORMAT(GETDATE(), 'dd-MM-yyyy')
	declare @myDate date
	set @myDate = getdate()
	set @fechacreacion = cast(FORMAT(@myDate, 'dd-MM-yyyy') as varchar(10))
	set @myDate = DATEADD(year, 1, getdate())
	set @fechavencimiento = cast(FORMAT(@myDate, 'dd-MM-yyyy') as varchar(10))
	set @myDate = DATEADD(month, 1, getdate())
	set @fechapresentacion = cast(FORMAT(@myDate, 'dd-MM-yyyy') as varchar(10))

	INSERT INTO [scl].[MacGrupo]
	([FechaCreacion]
      ,[FechaPresentacion]
      ,[Comentario]
      ,[PromSaldoVista]
      ,[FechaVencimiento]
      ,[RatingGrupo]
      ,[NivelAtribucion]
      ,[TotalSometidoAprobacion]
      ,[GrupoEmpresa_Id]
      ,[EstadoAprobacion_Id]
      ,[Acomite]
      ,[MacGrupo_Id]
      ,[Aprobacion_Id])
	  VALUES 
	  (@fechacreacion
      ,@fechacreacion
      ,''
      ,250420
      ,@fechavencimiento
      ,'5,5'
      ,'R3'
      ,''
      ,NULL
      ,2
      ,NULL
      ,NULL
      ,NULL)

	 SELECT @idcabecera = scope_identity() FROM scl.MacGrupo

	DECLARE CursorEmpresas CURSOR FOR (
	select Id,Empresa_Id from scl.GrupoEmpresa a
	where a.Grupo_Id=@idgrupo and Vigente=1
	)
	OPEN CursorEmpresas
		FETCH NEXT FROM CursorEmpresas INTO @idgrupoempresa, @idempresa
		WHILE @@fetch_status = 0
		BEGIN
		IF @idempresabase = @idempresa
		BEGIN
			IF EXISTS(SELECT * from scl.Aprobacion where EstadoAprobacion_Id=1 and Empresa_Id=@idempresa)
			BEGIN
				INSERT INTO [scl].[Aprobacion] 
				([Nombre],[Rut],[Actividad],[Oficina],[Ejecutivo]
				,[FechaCreacion],[FechaVenc],[FechaVencAnt],[FechaInfFin],[FechaUltAct]
				,[RatingInd],[RatingGrupo],[Clasificacion],[Vigilancia],[NivelAtribucion]
				,[PromSaldoVista],[DeudaSbifDirecta],[DeudaSbifIndirecta],[Penetracion],[Leasing]
				,[Empresa_Id],[TipoAprobacion_Id],[EstadoAprobacion_Id]
				,[Directo],[Contingente],[Derivados],[EntregaDiferida],[TotalCliente],[VariacionAprobacion],[DeudaBancoDirecta],[GarantiaRealTopada],[SbifAchel])
				SELECT [Nombre],[Rut],[Actividad],[Oficina],[Ejecutivo]
				,@fechacreacion,@fechavencimiento,[FechaVenc],'30-06-2017',@fechacreacion
				,[RatingInd],[RatingGrupo],[Clasificacion],[Vigilancia],[NivelAtribucion]
				,[PromSaldoVista],[DeudaSbifDirecta],[DeudaSbifIndirecta],[Penetracion],[Leasing]
				,[Empresa_Id],1,2
				,[Directo],[Contingente],[Derivados],[EntregaDiferida],[TotalCliente],[VariacionAprobacion],[DeudaBancoDirecta],[GarantiaRealTopada],[SbifAchel]
				from scl.Aprobacion
				where EstadoAprobacion_Id=1 and Empresa_Id=@idempresa
			END
			ELSE 
			BEGIN
				INSERT INTO scl.Aprobacion
					([Nombre],[FechaCreacion],[FechaVenc],[Rut],[Empresa_Id],[TipoAprobacion_Id],[EstadoAprobacion_Id],[FechaUltAct],[Ejecutivo]
					,[RatingInd],[Clasificacion],[Vigilancia],[Penetracion]
					,[Directo],[Contingente],[Derivados],[EntregaDiferida],[TotalCliente],[VariacionAprobacion],[DeudaBancoDirecta],[GarantiaRealTopada],[SbifAchel])
					select Nombre, @fechacreacion, @fechavencimiento, Rut, Id, 1,2,@fechacreacion,[Ejecutivo]
					,[Rating] ,[Riesgo],[Vigilancia],'0%'
					,'0'
					,'0'
					,'0'
					,'0'
					,'0'
					,'0'
					,'0'
					,'0'
					,'0' from scl.Empresa where Id=@idempresa
			END
			SELECT @idaprobacion = scope_identity() FROM scl.[Aprobacion]

			DECLARE CursorMacs CURSOR FOR (
				select Id from scl.Aprobacion
				where EstadoAprobacion_Id=1 and Empresa_Id=@idempresa
				)
				OPEN CursorMacs
					FETCH NEXT FROM CursorMacs INTO @idmac
					WHILE @@fetch_status = 0
					BEGIN
						DECLARE CursorLineas CURSOR FOR (
						select a.Id from scl.Linea a
						join AprobacionLinea b on b.Linea_Id=a.Id
						where b.Aprobacion_Id=@idmac
						)
						OPEN CursorLineas
							FETCH NEXT FROM CursorLineas INTO @idlinea
							WHILE @@fetch_status = 0
							BEGIN
								insert into scl.Linea 
								select [Numero]
									,[Riesgo]
									,[Descripcion]
									,[Moneda]
									,[Aprobado]
									,[Utilizado]
									,[Reservado]
									,[ColorCondicion]
									,[Disponible]
									,[Bloqueado]
									,[Plazo]
									,[FechaVencimiento]
									,[Padre_Id]
									,[Estado]
									,[Cuotas]
									,[CalendarioPago]
									,[OpcionCompra]
									,[Financiamiento]
									,[Alzamiento]
									,[AportePrevio]
									,[AportePariPasu]
									,[Anticipo]
									,[DestinoFondo]
									,[Cleanup]
									,[CondicionesGTA]
									,[VctoLinea]
									,[VctoCurse]
									,[PlazoMaxOP]
									,[PeriodoGracia]
									,[Prorrogas]
									,[Tipo_Id]
									,[Riesgo_Id]
									,[Moneda]
									,[Moneda]
									,[Aprobado]
									,[PlazoResidual] from scl.Linea where Id=@idlinea
								SELECT @idlineanueva = scope_identity() FROM scl.Linea
								insert into scl.AprobacionLinea (Aprobacion_Id,Linea_Id) 
								select @idaprobacion,@idlineanueva

								DECLARE CursorSubLineas CURSOR FOR (
								select a.Id from scl.Linea a
								where a.Padre_Id=@idlinea
								)
								OPEN CursorSubLineas
									FETCH NEXT FROM CursorSubLineas INTO @idsublinea
									WHILE @@fetch_status = 0
									BEGIN
										insert into scl.Linea 
										select [Numero]
										  ,[Riesgo]
										  ,[Descripcion]
										  ,[Moneda]
										  ,[Aprobado]
										  ,[Utilizado]
										  ,[Reservado]
										  ,[ColorCondicion]
										  ,[Disponible]
										  ,[Bloqueado]
										  ,[Plazo]
										  ,[FechaVencimiento]
										  ,@idlineanueva
										  ,[Estado]
										  ,[Cuotas]
										  ,[CalendarioPago]
										  ,[OpcionCompra]
										  ,[Financiamiento]
										  ,[Alzamiento]
										  ,[AportePrevio]
										  ,[AportePariPasu]
										  ,[Anticipo]
										  ,[DestinoFondo]
										  ,[Cleanup]
										  ,[CondicionesGTA]
										  ,[VctoLinea]
										  ,[VctoCurse]
										  ,[PlazoMaxOP]
										  ,[PeriodoGracia]
										  ,[Prorrogas]
										  ,[Tipo_Id]
										  ,[Riesgo_Id]
										  ,[Moneda]
										  ,[Moneda]
										  ,[Aprobado]
										  ,[PlazoResidual] from scl.Linea where Id=@idsublinea

									FETCH NEXT FROM CursorSubLineas INTO @idsublinea
									END
									CLOSE CursorSubLineas
									DEALLOCATE CursorSubLineas
								
							
							FETCH NEXT FROM CursorLineas INTO @idlinea
							END
							CLOSE CursorLineas
							DEALLOCATE CursorLineas
						
					FETCH NEXT FROM CursorMacs INTO @idmac
				END
			CLOSE CursorMacs
			DEALLOCATE CursorMacs

		   INSERT INTO [scl].[MacGrupo]
           ([GrupoEmpresa_Id]
           ,[Acomite]
           ,[MacGrupo_Id], Aprobacion_Id, RatingGrupo)
			VALUES (@idgrupoempresa, 2, @idcabecera, @idaprobacion,'5,5')

			update scl.MacGrupo set GrupoEmpresa_Id = @idgrupoempresa where Id=@idcabecera

		   
		END
		ELSE
		BEGIN 
			INSERT INTO [scl].[MacGrupo]
           ([GrupoEmpresa_Id]
           ,[Acomite]
           ,[MacGrupo_Id],RatingGrupo)
			VALUES (@idgrupoempresa, 1, @idcabecera,'5,5')
		END
			FETCH NEXT FROM CursorEmpresas INTO @idgrupoempresa, @idempresa
		END
	CLOSE CursorEmpresas
	DEALLOCATE CursorEmpresas

	
	

	select @idcabecera as idcabecera
	
END


GO
/****** Object:  StoredProcedure [scl].[crearmacsengrupo]    Script Date: 13-09-2017 18:46:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [scl].[crearmacsengrupo](@idgrupo INT, @JSONempresas VARCHAR(max))
as
BEGIN
--exec scl.crearmacsengrupo 4,'[{"id":"6","nombre":"ZRISMART"},{"id":"7","nombre":"DANIEL"}]'
	DECLARE @idempresa int
	DECLARE @nombreempresa varchar(100)
	DECLARE @rutempresa varchar (50)
	--DECLARE @JSONempresas varchar(max) = '[{"id":"1","nombre":"EMPRESAS CMPC S.A.","rut":"90222000"},{"id":"2","nombre":"FORESTAL, CONST. Y COMERCIAL DEL PACIFICO SUR S.A.\n","rut":"91553000"},{"id":"3","nombre":"FORESTAL Y PESQUERA COPAHUE S.A.\n","rut":"79770520"},{"id":"4","nombre":"MINERA VALPARAISO S.A.\n","rut":"90412000"},{"id":"5","nombre":"COMPAÑÍA INDUSTRIAL EL VOLCAN S.A.\n","rut":"90209000"},{"id":"6","nombre":"PUERTOS Y LOGISTICA S.A.\n","rut":"82777100"},{"id":"7","nombre":"PUERTO CENTRAL S.A.\n","rut":"76158513"},{"id":"8","nombre":"PORTUARIA LIRQUEN S.A.\n","rut":"96560720"},{"id":"9","nombre":"PUERTO LIRQUEN S.A.\n","rut":"96959030"},{"id":"10","nombre":"FORESTAL COMINCO S.A.\n","rut":"79621850"},{"id":"11","nombre":"INVERSIONES CMPC S.A.\n","rut":"96596540"}]'


	DECLARE CursorEmpresas CURSOR FOR (Select
       max(case when NAME='id' then convert(Int,StringValue) else '' end) as id,
       max(case when NAME='nombre' then convert(Varchar(100),StringValue) else '' end) as nombre,
	   max(case when NAME='rut' then convert(Varchar(50),StringValue) else '' end) as rut
		From parseJSON (@JSONempresas)
		where ValueType = 'string'
		group by parent_ID)
	OPEN CursorEmpresas
		FETCH NEXT FROM CursorEmpresas INTO @idempresa,@nombreempresa, @rutempresa
		WHILE @@fetch_status = 0
		BEGIN
			INSERT INTO scl.MacIndividual values (@nombreempresa,@rutempresa,'','','','','','','','','','','','','2017-07-25','','',@idempresa)
			FETCH NEXT FROM CursorEmpresas INTO @idempresa,@nombreempresa, @rutempresa
		END
	CLOSE CursorEmpresas
	DEALLOCATE CursorEmpresas
		

	

END


GO
/****** Object:  StoredProcedure [scl].[MAC76265440-7]    Script Date: 13-09-2017 18:46:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [scl].[MAC76265440-7](@idempresa INT, @nombregrupo VARCHAR(100))
as
BEGIN



  /****** Script para insertar datos de MAC 76.265.440-7  ******/
  INSERT INTO [controldelimites].[scl].[Linea] ([Numero],[Riesgo],		[Descripcion],				[Moneda],[Aprobado],[Utilizado],[Reservado],[ColorCondicion],[Disponible],[Bloqueado],		[Plazo],[FechaVencimiento],BORRARCOMEN,					BORRARCOND) 
										   VALUES('1',		'D',	'Linea Credito Cta Cte',		 'CLP',   '6400',	 '1070',	  '0',		 'Amarillo',	  '5330',		'0',			'12',	'30-08-2018',		'.',			'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2'),
												 ('2',		'D',	'Linea para Tarjeta de Credito', 'CLP',   '0',		 '0',		  '0',		 'Amarillo',		 '0',		'0',			'12',	'30-08-2018',		'.',			'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2'),
												 ('3',		'D',	'Crédito Corto Plazo (MAC)',	 'CLP',   '0',		 '0',		  '0',		 'Amarillo',		 '0',		'0',			'12',	'30-08-2018',		'Bullet por MM$7 a 8 meses plazo, renovable en su vencimiento por otros 2 meses. Garantía Fogape del 80%. Corresponde a Crédito N°2033…;',			'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2'),
												 ('4',		'D',	'Otras Transacciones Especiales','CLP',   '0',		 '0',		  '0',		 'Amarillo',		 '0',		'0',			'12',	'30-08-2018',		'.',			'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2'),
												 ('5',		'D',	'Crédito Corto Plazo (MAC)',	 'CLP',   '0',		 '0',		  '0',		 'Amarillo',		 '0',		'0',			'12',	'30-08-2018',		'.',			'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2'),
												 ('6',		'D',	'Operación Leasing',			 'CLP',   '7737',	 '1070',	  '0',		 'Amarillo',		 '4112',	'0',			'12',	'30-08-2018',		'.',			'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2.   Descripción: leasing al 50% sobre el vehículo'),
												 ('7',		'D',	'Línea Capital de Trabajo',		 'CLP',   '25000',	 '1070',	  '0',		 'Amarillo',		 '25000',	'0',			'12',	'30-08-2018',		'Se solicita linea capital de trabajo por M$50.000 para curse de bullet a 180 días, renovable una vez. Crédito comerciales a 12 meses, Carta de Crédito…;',			'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2'),
												 ('9',		'D',	'Crédito en Cuotas (MAC)',		 'CLP',   '21533',	 '1070',	  '0',		 'Amarillo',		 '-17013',	'0',			'12',	'30-08-2018',		'.',			'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2')
										
/****** Script para insertar datos de SUBLINEA MAC 76.265.440-7  ******/

  INSERT INTO [controldelimites].[scl].[Sublinea]([Numero],   [Riesgo],		[Descripcion],				[Moneda],[Aprobado],[Utilizado],[Reservado],[ColorCondicion],[Disponible],[Bloqueado],		[Plazo],[FechaVencimiento],BORRARCOMEN,					BORRARCOND,																																																						[Linea_Id], [Beneficiario_Id],[Comentario_Id]) 
											   VALUES('1',		'D',	'Linea Credito Cta Cte',		 'CLP',   '6400',	 '1070',	  '0',		 'Amarillo',	  '5330',		'0',			'12',	'30-08-2018',		'.',			'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2',1,1,1),
													 ('2',		'D',	'Linea para Tarjeta de Credito', 'CLP',   '0',		 '0',		  '0',		 'Amarillo',		 '0',		'0',			'12',	'30-08-2018',		'.',			'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2',2,1,1),
													 ('3',		'D',	'Crédito Corto Plazo (MAC)',	 'CLP',   '0',		 '0',		  '0',		 'Amarillo',		 '0',		'0',			'12',	'30-08-2018',		'Bullet por MM$7 a 8 meses plazo, renovable en su vencimiento por otros 2 meses. Garantía Fogape del 80%. Corresponde a Crédito N°2033…;',			'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2',3,1,1),						
													 ('4',		'D',	'Otras Transacciones Especiales','CLP',   '0',		 '0',		  '0',		 'Amarillo',		 '0',		'0',			'12',	'30-08-2018',		'.',			'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2',4,1,1),
													 ('5',		'D',	'Crédito Corto Plazo (MAC)',	 'CLP',   '0',		 '0',		  '0',		 'Amarillo',		 '0',		'0',			'12',	'30-08-2018',		'.',			'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2',5,1,1),
													 ('6',		'D',	'Operación Leasing',			 'CLP',   '7737',	 '1070',	  '0',		 'Amarillo',		 '4112',	'0',			'12',	'30-08-2018',		'.',			'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2.   Descripción: leasing al 50% sobre el vehículo',6,1,1),
													 ('7',		'D',	'Línea Capital de Trabajo',		 'CLP',   '25000',	 '1070',	  '0',		 'Amarillo',		 '25000',	'0',			'12',	'30-08-2018',		'Se solicita linea capital de trabajo por M$50.000 para curse de bullet a 180 días, renovable una vez. Crédito comerciales a 12 meses, Carta de Crédito…;',			'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2',7,1,1),
													 ('9',		'D',	'Crédito en Cuotas (MAC)',		 'CLP',   '21533',	 '1070',	  '0',		 'Amarillo',		 '-17013',	'0',			'12',	'30-08-2018',		'.',			'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2',9,1,1)


  /****** Script para insertar datos de OPERACION MAC 76.265.440-7  ******/

  INSERT INTO [controldelimites].[scl].[Operacion] ([TipoOperacion],[NumeroProducto],[FechaOtorgamiento],[FechaProxVenc],[Moneda],[MontoInicial],[MontoActual],[MontoActualMLinea],[MontoActualMNac],[EstadoOperacion_Id],[NumeroOperacion],			[DescripcionProducto],					[FechaDesembolso])
											   VALUES  ('8610',		  '119002799',   	'10-04-2007',	  '10-04-2018',   'CLP',	 '6400',	  '1070',			 '',			 '1070',				'0',				'',				'LINEA DE CREDITO EMPRESAS LCEMP',				'10-04-2007'),
													   ('9252',		  '000001739',   	'23-03-2017',	  '24-08-2017',   'CLP',	 '25405',	  '17196',			 '',			 '17196',				'0',				'',				'CREDITO EN CUOTAS COMERCIAL',					'23-07-2017'),
													   ('9252',		  '000087148',   	'02-06-2017',	  '04-09-2017',   'CLP',	 '25404',	  '21350',			 '',			 '21350',				'0',				'',				'CREDITO EN CUOTAS COMERCIAL',					'02-06-2017'),
													   ('38010',	  '009902256',   	'06-05-2015',	  '04-09-2017',   'CLP',	 '201195',	  '11509',			 '',			 '3625',				'0',				'',				'LEASING MOBIL.COMERCIAL. TF SIN GARANTIA',		'06-05-2017')
													 

END
GO
/****** Object:  StoredProcedure [scl].[nuevareserva]    Script Date: 13-09-2017 18:46:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [scl].[nuevareserva](@Id INT, @TipoOperacion1 VARCHAR(255), @NumeroProducto1 VARCHAR(255), @FechaOtorgamiento1 VARCHAR(255), @FechaProxVenc1 VARCHAR(255), @Moneda1 VARCHAR(255), @MontoInicial1 VARCHAR(255), @MontoActual1 VARCHAR(255) ,@MontoActualMNac1 VARCHAR(255), @RutEmpresa1 VARCHAR(255) )
as
BEGIN
	-- exec scl.nuevareserva 1,'hola'
	-- procedimiento es de select el sp se llama scl.se
	-- para insert el sp se llama scl.ins

	DECLARE @ultimoid INT

	INSERT INTO scl.Operacion(TipoOperacion, NumeroProducto, FechaOtorgamiento, FechaProxVenc, Moneda, MontoInicial ,MontoActual ,MontoActualMNac ,RutEmpresa) 
	VALUES (@TipoOperacion1 ,@NumeroProducto1, @FechaOtorgamiento1, @FechaProxVenc1, @Moneda1, @MontoInicial1, @MontoActual1,@MontoActualMNac1,@RutEmpresa1);
	
	SELECT @ultimoid = scope_identity() FROM scl.Operacion
	
	INSERT INTO scl.LineaOperacion (Linea_Id,Operacion_Id) values (@Id,@ultimoid)
	--INSERT INTO scl.LineaOperacion (Linea_Id,Operacion_Id) values (1,2)

END
GO
/****** Object:  StoredProcedure [scl].[procedimientocero]    Script Date: 13-09-2017 18:46:43 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE procedure [scl].[procedimientocero](@parametro1 INT, @parametro2 VARCHAR(100))
as
BEGIN
	-- exec scl.procedimientocero 1,'hola'
	-- procedimiento es de select el sp se llama scl.sel____
	-- para insert el sp se llama scl.ins

	DECLARE @variable1 int
	DECLARE @variable2 VARCHAR(100)

	SELECT @variable1 = Id from Aprobacion where Id=@parametro1

	SELECT @variable2 = Nombre from Aprobacion where Id=@parametro1

	--SELECT @variable1 as resultado
	select * from scl.Aprobacion where Id=@parametro1

END
GO
