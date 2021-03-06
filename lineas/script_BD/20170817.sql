USE [controldelimites]
GO
/****** Object:  Table [dbo].[Sessions]    Script Date: 17-08-2017 18:42:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Sessions](
	[sid] [nvarchar](32) NOT NULL,
	[expires] [datetime2](7) NULL,
	[data] [nvarchar](max) NULL,
	[createdAt] [datetime2](7) NOT NULL,
	[updatedAt] [datetime2](7) NOT NULL,
PRIMARY KEY CLUSTERED 
(
	[sid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [lin].[art_user]    Script Date: 17-08-2017 18:42:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [lin].[art_user](
	[uid] [int] IDENTITY(356,1) NOT NULL,
	[uname] [nvarchar](50) NOT NULL,
	[password] [nvarchar](200) NOT NULL,
	[profile_image] [nvarchar](200) NULL,
	[first_name] [nvarchar](50) NOT NULL,
	[last_name] [nvarchar](50) NOT NULL,
	[division] [int] NULL,
	[gerencia] [int] NULL,
	[department] [int] NULL,
	[email] [nvarchar](100) NOT NULL,
	[birth_date] [date] NOT NULL,
	[office_number] [nvarchar](max) NOT NULL,
	[joining_date] [date] NOT NULL,
	[isadmin] [int] NOT NULL,
	[isverify] [int] NOT NULL,
	[verify_code] [nvarchar](100) NOT NULL,
	[verify_date] [datetime2](0) NOT NULL,
	[status] [int] NOT NULL,
	[added_date] [datetime2](0) NOT NULL,
	[rut_number] [nvarchar](max) NOT NULL,
	[rate_hour] [int] NOT NULL,
	[contact_number] [nvarchar](15) NOT NULL,
	[user_type] [int] NOT NULL,
	[work_hours] [decimal](10, 2) NOT NULL,
	[bonus_app] [int] NOT NULL,
	[designation] [int] NULL,
	[user_profile] [text] NULL,
 CONSTRAINT [PK_art_user_uid] PRIMARY KEY CLUSTERED 
(
	[uid] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [lin].[contenido]    Script Date: 17-08-2017 18:42:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [lin].[contenido](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [varchar](50) NOT NULL,
	[plantilla] [varchar](128) NULL,
	[borrado] [int] NULL,
 CONSTRAINT [pk.contenido] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [lin].[menu]    Script Date: 17-08-2017 18:42:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [lin].[menu](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[descripcion] [varchar](255) NULL,
	[url] [varchar](255) NULL,
	[pid] [int] NULL,
	[nivel] [tinyint] NULL,
	[borrado] [tinyint] NULL,
	[idsistema] [int] NULL,
	[secuencia] [int] NULL,
 CONSTRAINT [pk_menu] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [lin].[pagina]    Script Date: 17-08-2017 18:42:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [lin].[pagina](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[nombre] [varchar](50) NOT NULL,
	[idcontenido] [int] NOT NULL,
	[title] [varchar](256) NULL,
	[idsistema] [int] NOT NULL,
	[script] [text] NULL,
	[borrado] [int] NULL,
 CONSTRAINT [pk.pagina] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY] TEXTIMAGE_ON [PRIMARY]
GO
/****** Object:  Table [lin].[rol]    Script Date: 17-08-2017 18:42:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [lin].[rol](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[glosarol] [varchar](60) NULL,
	[borrado] [tinyint] NULL,
 CONSTRAINT [pk_rol] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [lin].[rol_func]    Script Date: 17-08-2017 18:42:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [lin].[rol_func](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[rid] [int] NULL,
	[fid] [int] NULL,
	[mid] [int] NULL,
	[borrado] [tinyint] NULL,
 CONSTRAINT [pk_rol_func] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [lin].[sistema]    Script Date: 17-08-2017 18:42:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [lin].[sistema](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[sistema] [varchar](3) NULL,
	[glosasistema] [varchar](255) NULL,
	[borrado] [tinyint] NULL,
	[pagina] [varchar](32) NULL,
 CONSTRAINT [pk_sistema] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [lin].[usr_rol]    Script Date: 17-08-2017 18:42:24 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [lin].[usr_rol](
	[id] [int] IDENTITY(1,1) NOT NULL,
	[uid] [int] NULL,
	[rid] [int] NULL,
	[borrado] [tinyint] NULL,
	[idsistema] [int] NULL,
 CONSTRAINT [pk_usr_rol] PRIMARY KEY CLUSTERED 
(
	[id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[Aprobacion]    Script Date: 17-08-2017 18:42:24 ******/
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
/****** Object:  Table [scl].[AprobacionLinea]    Script Date: 17-08-2017 18:42:24 ******/
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
/****** Object:  Table [scl].[Bloqueo]    Script Date: 17-08-2017 18:42:24 ******/
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
/****** Object:  Table [scl].[Comentario]    Script Date: 17-08-2017 18:42:24 ******/
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
/****** Object:  Table [scl].[ComentarioSublinea]    Script Date: 17-08-2017 18:42:24 ******/
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
/****** Object:  Table [scl].[Condicion]    Script Date: 17-08-2017 18:42:24 ******/
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
/****** Object:  Table [scl].[Documento]    Script Date: 17-08-2017 18:42:24 ******/
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
/****** Object:  Table [scl].[Empresa]    Script Date: 17-08-2017 18:42:24 ******/
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
/****** Object:  Table [scl].[EmpresaSublinea]    Script Date: 17-08-2017 18:42:24 ******/
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
/****** Object:  Table [scl].[EstadoAprobacion]    Script Date: 17-08-2017 18:42:24 ******/
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
/****** Object:  Table [scl].[EstadoOperacion]    Script Date: 17-08-2017 18:42:24 ******/
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
/****** Object:  Table [scl].[Garantias]    Script Date: 17-08-2017 18:42:24 ******/
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
/****** Object:  Table [scl].[GarantiasSublinea]    Script Date: 17-08-2017 18:42:24 ******/
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
/****** Object:  Table [scl].[Grupo]    Script Date: 17-08-2017 18:42:24 ******/
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
/****** Object:  Table [scl].[GrupoEmpresa]    Script Date: 17-08-2017 18:42:24 ******/
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
/****** Object:  Table [scl].[Linea]    Script Date: 17-08-2017 18:42:24 ******/
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
/****** Object:  Table [scl].[MacGrupo]    Script Date: 17-08-2017 18:42:24 ******/
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
/****** Object:  Table [scl].[Operacion]    Script Date: 17-08-2017 18:42:24 ******/
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
/****** Object:  Table [scl].[Sublinea]    Script Date: 17-08-2017 18:42:24 ******/
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
/****** Object:  Table [scl].[SublineaOperacion]    Script Date: 17-08-2017 18:42:24 ******/
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
/****** Object:  Table [scl].[TipoAprobacion]    Script Date: 17-08-2017 18:42:24 ******/
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
/****** Object:  Table [scl].[TipoOperacion]    Script Date: 17-08-2017 18:42:24 ******/
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
INSERT [dbo].[Sessions] ([sid], [expires], [data], [createdAt], [updatedAt]) VALUES (N'A_C4OuQfdZQcyDQOS5arhavrkxqfiF0T', CAST(N'2017-08-18T21:33:54.1620000' AS DateTime2), N'{"cookie":{"originalMaxAge":86400000,"expires":"2017-08-18T14:33:20.037Z","secure":false,"httpOnly":true,"path":"/"},"flash":{},"passport":{"user":1,"sidebar":[{"contadorPreguntas":0,"nombre":"Ejecutivo 1","uid":1,"sistema":"1","rol":[{"id":6,"glosarol":"Administrador"}],"rid":"DIOS"},{"menus":[{"menu":{"id":2,"menu":"Control de Límites"},"submenu":[{"opt":"Operaciones","url":"menu/operaciones"}]}]}]}}', CAST(N'2017-08-17T14:33:17.0000000' AS DateTime2), CAST(N'2017-08-17T21:33:54.0000000' AS DateTime2))
INSERT [dbo].[Sessions] ([sid], [expires], [data], [createdAt], [updatedAt]) VALUES (N'DFfjmhHwsHfISPe3XRczcPfXJQX51SH2', CAST(N'2017-08-18T13:44:21.7990000' AS DateTime2), N'{"cookie":{"originalMaxAge":86400000,"expires":"2017-08-18T13:44:21.799Z","secure":false,"httpOnly":true,"path":"/"},"flash":{}}', CAST(N'2017-08-17T13:44:21.0000000' AS DateTime2), CAST(N'2017-08-17T13:44:21.0000000' AS DateTime2))
INSERT [dbo].[Sessions] ([sid], [expires], [data], [createdAt], [updatedAt]) VALUES (N'dlpN0VLlr_rcUv-M6SW9XGj16eyEu-0I', CAST(N'2017-08-18T12:42:22.8050000' AS DateTime2), N'{"cookie":{"originalMaxAge":86400000,"expires":"2017-08-18T12:42:22.805Z","secure":false,"httpOnly":true,"path":"/"},"flash":{}}', CAST(N'2017-08-17T12:42:22.0000000' AS DateTime2), CAST(N'2017-08-17T12:42:22.0000000' AS DateTime2))
INSERT [dbo].[Sessions] ([sid], [expires], [data], [createdAt], [updatedAt]) VALUES (N'Gg9oQOSuP2iyE4mGiUisyoQ8Ts8m2KQE', CAST(N'2017-08-18T13:39:40.5130000' AS DateTime2), N'{"cookie":{"originalMaxAge":86399999,"expires":"2017-08-18T12:42:48.926Z","secure":false,"httpOnly":true,"path":"/"},"flash":{},"passport":{"user":1,"sidebar":[{"contadorPreguntas":0,"nombre":"Ejecutivo 1","uid":1,"sistema":"1","rol":[{"id":6,"glosarol":"Administrador"}],"rid":"DIOS"},{"menus":[{"menu":{"id":2,"menu":"Control de Límites"},"submenu":[{"opt":"Operaciones","url":"menu/operaciones"}]}]}]}}', CAST(N'2017-08-17T12:42:35.0000000' AS DateTime2), CAST(N'2017-08-17T13:39:40.0000000' AS DateTime2))
INSERT [dbo].[Sessions] ([sid], [expires], [data], [createdAt], [updatedAt]) VALUES (N'J_wQZhBUSJTnFTaadWPdksLs4jhXGCWI', CAST(N'2017-08-18T13:40:16.3300000' AS DateTime2), N'{"cookie":{"originalMaxAge":86400000,"expires":"2017-08-18T13:40:16.330Z","secure":false,"httpOnly":true,"path":"/"},"flash":{}}', CAST(N'2017-08-17T13:39:51.0000000' AS DateTime2), CAST(N'2017-08-17T13:40:16.0000000' AS DateTime2))
INSERT [dbo].[Sessions] ([sid], [expires], [data], [createdAt], [updatedAt]) VALUES (N'jVJMe7dG3-rVlw-wS8HmbygI6rUI17LC', CAST(N'2017-08-18T20:35:08.2810000' AS DateTime2), N'{"cookie":{"originalMaxAge":86400000,"expires":"2017-08-17T21:01:31.919Z","secure":false,"httpOnly":true,"path":"/"},"flash":{},"passport":{"user":1,"sidebar":[{"contadorPreguntas":0,"nombre":"Ejecutivo 1","uid":1,"sistema":"1","rol":[{"id":6,"glosarol":"Administrador"}],"rid":"DIOS"},{"menus":[{"menu":{"id":2,"menu":"Control de Límites"},"submenu":[{"opt":"Operaciones","url":"menu/operaciones"}]}]}]}}', CAST(N'2017-08-16T13:56:00.0000000' AS DateTime2), CAST(N'2017-08-17T20:35:08.0000000' AS DateTime2))
INSERT [dbo].[Sessions] ([sid], [expires], [data], [createdAt], [updatedAt]) VALUES (N'UVBuyUwAmM6Zv3ST7JhmSTJA5ssEL-XB', CAST(N'2017-08-18T21:32:05.1360000' AS DateTime2), N'{"cookie":{"originalMaxAge":86400000,"expires":"2017-08-18T15:00:35.061Z","secure":false,"httpOnly":true,"path":"/"},"flash":{},"passport":{"user":1,"sidebar":[{"contadorPreguntas":0,"nombre":"Ejecutivo 1","uid":1,"sistema":"1","rol":[{"id":6,"glosarol":"Administrador"}],"rid":"DIOS"},{"menus":[{"menu":{"id":2,"menu":"Control de Límites"},"submenu":[{"opt":"Operaciones","url":"menu/operaciones"}]}]}]}}', CAST(N'2017-08-17T15:00:33.0000000' AS DateTime2), CAST(N'2017-08-17T21:32:05.0000000' AS DateTime2))
INSERT [dbo].[Sessions] ([sid], [expires], [data], [createdAt], [updatedAt]) VALUES (N'vbSQ60G_eb2Yc--hBiscdlQGXfmvze3C', CAST(N'2017-08-18T12:48:20.4710000' AS DateTime2), N'{"cookie":{"originalMaxAge":86400000,"expires":"2017-08-18T12:40:51.425Z","secure":false,"httpOnly":true,"path":"/"},"flash":{},"passport":{"user":1,"sidebar":[{"contadorPreguntas":0,"nombre":"Ejecutivo 1","uid":1,"sistema":"1","rol":[{"id":6,"glosarol":"Administrador"}],"rid":"DIOS"},{"menus":[{"menu":{"id":2,"menu":"Control de Límites"},"submenu":[{"opt":"Operaciones","url":"menu/operaciones"}]}]}]}}', CAST(N'2017-08-17T12:40:39.0000000' AS DateTime2), CAST(N'2017-08-17T12:48:20.0000000' AS DateTime2))
SET IDENTITY_INSERT [lin].[art_user] ON 

INSERT [lin].[art_user] ([uid], [uname], [password], [profile_image], [first_name], [last_name], [division], [gerencia], [department], [email], [birth_date], [office_number], [joining_date], [isadmin], [isverify], [verify_code], [verify_date], [status], [added_date], [rut_number], [rate_hour], [contact_number], [user_type], [work_hours], [bonus_app], [designation], [user_profile]) VALUES (1, N'ejecutivo', N'$2a$10$GAAmbU/Wb/uIOtXvn53AmOLWd/st6HV/CUrUlBCBCyQd8KT4CBFyS', NULL, N'Ejecutivo', N'1', 1, 3, 100, N'dandradee@bancochile.cl', CAST(N'1956-06-12' AS Date), N'9999999999', CAST(N'2014-08-05' AS Date), 2, 1, N'4a89f4e5-d2ee-4889-9ce6-1030b8f37637', CAST(N'2014-01-05T00:00:00.0000000' AS DateTime2), 1, CAST(N'2016-05-05T00:00:00.0000000' AS DateTime2), N'Default_RUT', 10, N'26532273', 2, CAST(8.00 AS Decimal(10, 2)), 0, NULL, N'su        ')
SET IDENTITY_INSERT [lin].[art_user] OFF
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
SET IDENTITY_INSERT [lin].[contenido] OFF
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
SET IDENTITY_INSERT [lin].[pagina] ON 

INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (1, N'home1', 1, N'Vista 360', 1, N' 
script(type="text/javascript", src="/javascripts/views/mac/vista360.js") ', 1)
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
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (4, N'BORRAR', 4, N'MAC Grupal', 1, N'style.
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
script(type="text/javascript", src="/javascripts/views/macgrupal.js")
script(type="text/javascript", src="/javascripts/views/vermacgrupal.js")
script(type="text/javascript", src="/javascripts/views/macs.js")', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (5, N'operaciones', 9, N'Control de Limites', 1, N'style.
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
link(href=''/stylesheets/bootstrap-switch.css'', rel=''stylesheet'')
script(type="text/javascript", src="/javascripts/bootstrap-switch.js")   
script(type="text/javascript", src="/javascripts/views/operaciones/operaciones.js")
script(type="text/javascript", src="/javascripts/views/operaciones/operacionmac.js")
script(type="text/javascript", src="/javascripts/views/operaciones/vertablimites.js")
script(type="text/javascript", src="/javascripts/views/operaciones/vertabsublimites.js")
script(type="text/javascript", src="/javascripts/views/operaciones/sublimiteoperaciones.js")
script(type="text/javascript", src="/javascripts/views/operaciones/vertaboperaciones.js")
script(type="text/javascript", src="/javascripts/views/operaciones/operaciones2.js")
', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (6, N'crearaprobacion', 8, N'Crear Aprobación', 1, N' 
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
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (8, N'crearaprobacionmac', 8, N'Crear Aprobación', 1, N' 
script(type="text/javascript", src="/javascripts/views/mac/crearaprobacionmac.js") ', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (9, N'crearaprobacionmac2', 8, N'Crear Aprobación', 1, N' 
script(type="text/javascript", src="/javascripts/views/mac/crearaprobacionmac2.js") ', 1)
INSERT [lin].[pagina] ([id], [nombre], [idcontenido], [title], [idsistema], [script], [borrado]) VALUES (10, N'vista360', 1, N'Vista 360', 1, N' 
script(type="text/javascript", src="/javascripts/views/mac/vista360.js") ', 1)
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
SET IDENTITY_INSERT [lin].[rol] ON 

INSERT [lin].[rol] ([id], [glosarol], [borrado]) VALUES (6, N'Administrador', 1)
INSERT [lin].[rol] ([id], [glosarol], [borrado]) VALUES (7, N'AdminRespaldo', 1)
SET IDENTITY_INSERT [lin].[rol] OFF
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
SET IDENTITY_INSERT [lin].[sistema] ON 

INSERT [lin].[sistema] ([id], [sistema], [glosasistema], [borrado], [pagina]) VALUES (1, N'LIN', N'Sistema Control de Lineas', 1, N'home1')
INSERT [lin].[sistema] ([id], [sistema], [glosasistema], [borrado], [pagina]) VALUES (2, N'SIC', N'Sistema Integrado de Contrato', 1, N'home2')
INSERT [lin].[sistema] ([id], [sistema], [glosasistema], [borrado], [pagina]) VALUES (3, N'OBA', N'Sistema de Presupuestos (OBA)', 1, NULL)
SET IDENTITY_INSERT [lin].[sistema] OFF
SET IDENTITY_INSERT [lin].[usr_rol] ON 

INSERT [lin].[usr_rol] ([id], [uid], [rid], [borrado], [idsistema]) VALUES (33, 1, 6, 1, 1)
SET IDENTITY_INSERT [lin].[usr_rol] OFF
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

INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (1, N'1', N'D', N'Linea Crédito Cta. Cte.', N'CLP', N'3000', N'3000', N'0', N'Amarillo', N'0', N'1', N'12', N'03-07-2018
', N'', N'Aval Sr. Ivan Droguett Saez Rut: 10.723.799-2 y Sra. Paulina Raby Z. Rut:13.040.985-7
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
', N'''BDG para el fiel cumplimiento del contrato por M$18.070 correspondiente al 3% de contrato obra (MM$604) "mejoramiento y ampliación de servicio APR el Trébal, Comuna de Padre Hurtado" con mandante Aguas Andinas. Plazo De Boleta por 34 meses…;
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
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (13, N'1', N'D', N'Linea Credito Cta Cte', N'CLP', N'6400', N'1070', N'0', N'Amarillo', N'5330', N'1', N'12', N'30-08-2018', N'.', N'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2')
INSERT [scl].[Linea] ([Id], [Numero], [Riesgo], [Descripcion], [Moneda], [Aprobado], [Utilizado], [Reservado], [ColorCondicion], [Disponible], [Bloqueado], [Plazo], [FechaVencimiento], [BORRARCOMEN], [BORRARCOND]) VALUES (18, N'6', N'D', N'Operación Leasing', N'CLP', N'7737', N'3625', N'0', N'Rojo', N'0', N'0', N'12', N'30-08-2018', N'.', N'Aval Sr. Rodrigo Bustos Rut: 10.956.073-1 y Sr. Ignacio Muñoz Rut: 13.234.007-2.   Descripción: leasing al 50% sobre el vehículo')
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
ALTER TABLE [lin].[art_user] ADD  DEFAULT (NULL) FOR [profile_image]
GO
ALTER TABLE [lin].[art_user] ADD  DEFAULT (NULL) FOR [division]
GO
ALTER TABLE [lin].[art_user] ADD  DEFAULT (NULL) FOR [gerencia]
GO
ALTER TABLE [lin].[art_user] ADD  DEFAULT (NULL) FOR [department]
GO
ALTER TABLE [lin].[art_user] ADD  DEFAULT ((1)) FOR [status]
GO
ALTER TABLE [lin].[art_user] ADD  DEFAULT (NULL) FOR [designation]
GO
ALTER TABLE [lin].[menu]  WITH CHECK ADD  CONSTRAINT [fk_menu_reference_sistema] FOREIGN KEY([idsistema])
REFERENCES [lin].[sistema] ([id])
GO
ALTER TABLE [lin].[menu] CHECK CONSTRAINT [fk_menu_reference_sistema]
GO
ALTER TABLE [lin].[pagina]  WITH CHECK ADD  CONSTRAINT [FK_pagina_contenido] FOREIGN KEY([idcontenido])
REFERENCES [lin].[contenido] ([id])
GO
ALTER TABLE [lin].[pagina] CHECK CONSTRAINT [FK_pagina_contenido]
GO
ALTER TABLE [lin].[pagina]  WITH CHECK ADD  CONSTRAINT [FK_pagina_sistema] FOREIGN KEY([idsistema])
REFERENCES [lin].[sistema] ([id])
GO
ALTER TABLE [lin].[pagina] CHECK CONSTRAINT [FK_pagina_sistema]
GO
ALTER TABLE [lin].[rol_func]  WITH CHECK ADD  CONSTRAINT [fk_rol_func_reference_menu] FOREIGN KEY([mid])
REFERENCES [lin].[menu] ([id])
GO
ALTER TABLE [lin].[rol_func] CHECK CONSTRAINT [fk_rol_func_reference_menu]
GO
ALTER TABLE [lin].[rol_func]  WITH CHECK ADD  CONSTRAINT [fk_rol_func_reference_rol] FOREIGN KEY([rid])
REFERENCES [lin].[rol] ([id])
GO
ALTER TABLE [lin].[rol_func] CHECK CONSTRAINT [fk_rol_func_reference_rol]
GO
ALTER TABLE [lin].[usr_rol]  WITH CHECK ADD  CONSTRAINT [fk_usr_rol_reference_art_user] FOREIGN KEY([uid])
REFERENCES [lin].[art_user] ([uid])
GO
ALTER TABLE [lin].[usr_rol] CHECK CONSTRAINT [fk_usr_rol_reference_art_user]
GO
ALTER TABLE [lin].[usr_rol]  WITH CHECK ADD  CONSTRAINT [fk_usr_rol_reference_rol] FOREIGN KEY([rid])
REFERENCES [lin].[rol] ([id])
GO
ALTER TABLE [lin].[usr_rol] CHECK CONSTRAINT [fk_usr_rol_reference_rol]
GO
ALTER TABLE [lin].[usr_rol]  WITH CHECK ADD  CONSTRAINT [fk_usr_rol_reference_sistema] FOREIGN KEY([idsistema])
REFERENCES [lin].[sistema] ([id])
GO
ALTER TABLE [lin].[usr_rol] CHECK CONSTRAINT [fk_usr_rol_reference_sistema]
GO
EXEC sys.sp_addextendedproperty @name=N'MS_SSMA_SOURCE', @value=N'art_bdc_dev.art_user' , @level0type=N'SCHEMA',@level0name=N'lin', @level1type=N'TABLE',@level1name=N'art_user'
GO
