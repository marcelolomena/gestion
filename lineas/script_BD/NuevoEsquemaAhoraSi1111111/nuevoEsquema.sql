USE controldelimites
GO
/****** Object:  Table [scl].[Aprobacion]    Script Date: 04-08-2017 18:22:31 ******/
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
/****** Object:  Table [scl].[AprobacionLinea]    Script Date: 04-08-2017 18:22:31 ******/
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
/****** Object:  Table [scl].[Bloqueo]    Script Date: 04-08-2017 18:22:31 ******/
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
/****** Object:  Table [scl].[Condicion]    Script Date: 04-08-2017 18:22:31 ******/
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
/****** Object:  Table [scl].[Empresa]    Script Date: 04-08-2017 18:22:31 ******/
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
/****** Object:  Table [scl].[EstadoAprobacion]    Script Date: 04-08-2017 18:22:31 ******/
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
/****** Object:  Table [scl].[EstadoOperacion]    Script Date: 04-08-2017 18:22:31 ******/
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
/****** Object:  Table [scl].[Grupo]    Script Date: 04-08-2017 18:22:31 ******/
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
/****** Object:  Table [scl].[GrupoEmpresa]    Script Date: 04-08-2017 18:22:31 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[GrupoEmpresa](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Empresa_Id] [int] NULL,
	[Grupo_Id] [int] NULL,
	[MacGrupo_Id] [int] NULL
 CONSTRAINT [GrupoEmpresa_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] 
GO

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


/****** Object:  Table [scl].[Linea]    Script Date: 04-08-2017 18:22:31 ******/
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
/****** Object:  Table [scl].[Operacion]    Script Date: 04-08-2017 18:22:31 ******/
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
/****** Object:  Table [scl].[Sublinea]    Script Date: 04-08-2017 18:22:31 ******/
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
	Beneficiario_Id [int] NULL
 CONSTRAINT [Sublinea_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[SublineaOperacion]    Script Date: 04-08-2017 18:22:31 ******/
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
/****** Object:  Table [scl].[TipoAprobacion]    Script Date: 04-08-2017 18:22:31 ******/
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
