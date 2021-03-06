USE art_live
GO
/****** Object:  Table [scl].[Comportamiento]    Script Date: 28-07-2017 13:39:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[Comportamiento](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Comportamiento] [varchar](255) NULL,
 CONSTRAINT [Comportamiento_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[Covenant]    Script Date: 28-07-2017 13:39:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[Covenant](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Indicador] [varchar](255) NULL,
	[RatioExigido] [varchar](255) NULL,
	[PeriodicidadControl] [varchar](255) NULL,
	[EstadoFinanciero] [varchar](255) NULL,
	[RatioActual] [varchar](255) NULL,
	[Notas] [varchar](255) NULL,
 CONSTRAINT [Covenant_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[Empresa]    Script Date: 28-07-2017 13:39:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[Empresa](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [varchar](255) NULL,
	[RazonSocial] [varchar](255) NULL,
	[Rut] [varchar](255) NULL,
 CONSTRAINT [Empresa_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[GarantiasEstatales]    Script Date: 28-07-2017 13:39:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[GarantiasEstatales](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Porcentajecobertura] [varchar](255) NULL,
	[FogapeFogain] [varchar](255) NULL,
	[DestinoFondos] [varchar](255) NULL,
 CONSTRAINT [GarantiasEstatales_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[GarantiasPersonas]    Script Date: 28-07-2017 13:39:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[GarantiasPersonas](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RutGarante] [varchar](255) NULL,
	[NombreGarante] [varchar](255) NULL,
	[PatrimonioAval] [varchar](255) NULL,
	[FechaEstadoSituacion] [varchar](255) NULL,
	[Notas] [varchar](255) NULL,
 CONSTRAINT [GarantiasPersonas_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[GarantiasPersonasConfort]    Script Date: 28-07-2017 13:39:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[GarantiasPersonasConfort](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[RutSuscriptor] [varchar](255) NULL,
	[NombreSuscriptor] [varchar](255) NULL,
	[PatrimonioSuscriptor] [varchar](255) NULL,
	[TipoConfortLetter] [varchar](255) NULL,
	[FechaEmisionConfort] [varchar](255) NULL,
	[Notas] [varchar](255) NULL,
 CONSTRAINT [GarantiasPersonasConfort_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[GarantiasReales]    Script Date: 28-07-2017 13:39:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[GarantiasReales](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Descripcion] [varchar](255) NULL,
	[Valorizacion] [varchar](255) NULL,
	[NumeroFolio] [varchar](255) NULL,
	[Estados] [varchar](255) NULL,
	[TipoGarantia] [varchar](255) NULL,
	[Secuencia] [varchar](255) NULL,
	[TipoMoneda] [varchar](255) NULL,
	[Tasacion] [varchar](255) NULL,
	[ValorLiquidacion] [varchar](255) NULL,
	[ValorComercial] [varchar](255) NULL,
	[Notas] [varchar](255) NULL,
	[ClausulaGarantias] [varchar](255) NULL,
	[RutGarante] [varchar](255) NULL,
	[NombreGarante] [varchar](255) NULL,
	[PatrimonioAval] [varchar](255) NULL,
	[EstadoSituacion] [varchar](255) NULL,
	[RutSuscriptor] [varchar](255) NULL,
	[NombreSuscriptor] [varchar](255) NULL,
	[PatrimonioSuscriptor] [varchar](255) NULL,
	[TipoConfortLetter] [varchar](255) NULL,
	[EmisionConfort] [varchar](255) NULL,
 CONSTRAINT [GarantiasReales_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[Grupo]    Script Date: 28-07-2017 13:39:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[Grupo](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [varchar](200) NULL,
 CONSTRAINT [Grupo_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[GrupoEmpresa]    Script Date: 28-07-2017 13:39:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[GrupoEmpresa](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Empresa_Id] [int] NULL,
	[Grupo_Id] [int] NULL,
 CONSTRAINT [GrupoEmpresa_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[InformacionCliente]    Script Date: 28-07-2017 13:39:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[InformacionCliente](
	[Id] [int] IDENTITY(1,1) NOT NULL,
 CONSTRAINT [InformacionCliente_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[InformacionFinancieraCliente]    Script Date: 28-07-2017 13:39:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[InformacionFinancieraCliente](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[VaciandoBalance] [varchar](255) NULL,
	[Iva] [varchar](255) NULL,
	[DeudaDirectaIndirecta] [varchar](255) NULL,
 CONSTRAINT [InformacionFinancieraCliente_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[Linea]    Script Date: 28-07-2017 13:39:54 ******/
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
	[MacIndividual_Id] [int] NULL,
 CONSTRAINT [Linea_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[LineaCovenants]    Script Date: 28-07-2017 13:39:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[LineaCovenants](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Linea_Id] [int] NULL,
	[Covenants_Id] [int] NULL,
 CONSTRAINT [LineaCovenants_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[LineaGarantiaReal]    Script Date: 28-07-2017 13:39:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[LineaGarantiaReal](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Linea_Id] [int] NULL,
	[GarantiasReales_Id] [int] NULL,
 CONSTRAINT [LineaGarantiaReal_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[LineaOtrasGarantias]    Script Date: 28-07-2017 13:39:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[LineaOtrasGarantias](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Linea_Id] [int] NULL,
	[OtrasGarantias_Id] [int] NULL,
 CONSTRAINT [LineaOtrasGarantias_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[MacGrupal]    Script Date: 28-07-2017 13:39:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[MacGrupal](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[FechaPresentacion] [varchar](255) NULL,
	[EjecutivoControl] [varchar](255) NULL,
	[FechaVencimiento] [varchar](255) NULL,
	[RatingGrupo] [varchar](255) NULL,
	[NivelAtribucion] [varchar](255) NULL,
	[SometidoAprobacion] [varchar](255) NULL,
	[Plazos] [varchar](255) NULL,
	[AprobadoTotal] [varchar](255) NULL,
	[NombreAprobacion] [varchar](255) NULL,
	[FirmaAprobacion] [varchar](255) NULL,
	[ValorMonedaUf] [varchar](255) NULL,
	[ValorMonedaDolares] [varchar](255) NULL,
	[TotalAprobacionPesos] [varchar](255) NULL,
	[TotalAprobacionUf] [varchar](255) NULL,
	[ObservacionComiteRiesgo] [varchar](255) NULL,
	[Grupo_Id] [int] NULL,
	[PromedioSaldoVistaUlt12M] [varchar](255) NULL,
 CONSTRAINT [MacGrupal_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[MacGrupalMacIndividual]    Script Date: 28-07-2017 13:39:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[MacGrupalMacIndividual](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[MacIndividual_Id] [int] NULL,
	[MacGrupal_Id] [int] NULL,
 CONSTRAINT [MacGrupalMacIndividual_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[MacIndividual]    Script Date: 28-07-2017 13:39:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[MacIndividual](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [varchar](255) NULL,
	[Rut] [varchar](255) NULL,
	[ActividadEconomica] [varchar](255) NULL,
	[RatingGrupal] [varchar](255) NULL,
	[NivelAtribucion] [varchar](255) NULL,
	[RatingIndividual] [varchar](255) NULL,
	[Clasificacion] [varchar](255) NULL,
	[Vigilancia] [varchar](255) NULL,
	[FechaInformacionFinanciera] [varchar](255) NULL,
	[PromedioSaldoVista] [varchar](255) NULL,
	[DeudaSbif] [varchar](255) NULL,
	[AprobadoVinculado] [varchar](255) NULL,
	[EquipoCobertura] [varchar](255) NULL,
	[Oficina] [varchar](255) NULL,
	[FechaCreacion] [varchar](255) NULL,
	[FechaVencimiento] [varchar](255) NULL,
	[FechaVencimientoMacAnterior] [varchar](255) NULL,
	[Empresa_Id] [int] NULL,
 CONSTRAINT [MacIndividual_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[Operacion]    Script Date: 28-07-2017 13:39:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[Operacion](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Plazo] [varchar](255) NULL,
	[TipoCredito] [varchar](255) NULL,
	[Moneda] [varchar](255) NULL,
	[Monto] [varchar](255) NULL,
	[Tasa] [varchar](255) NULL,
	[Vencimiento] [varchar](255) NULL,
	[Curse] [varchar](255) NULL,
	[Sublinea_Id] [int] NULL,
 CONSTRAINT [Operacion_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[OtrasGarantias]    Script Date: 28-07-2017 13:39:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[OtrasGarantias](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Folio] [varchar](255) NULL,
	[Titulo] [varchar](255) NULL,
	[NumeroAcciones] [varchar](255) NULL,
	[FechaValorizacion] [varchar](255) NULL,
	[PrecioUnitario] [varchar](255) NULL,
	[MontoTotalM] [varchar](255) NULL,
	[CoberturaMinima] [varchar](255) NULL,
	[CoberturaRepocision] [varchar](255) NULL,
	[CoberturaAlzamiento] [varchar](255) NULL,
	[Notas] [varchar](255) NULL,
	[ForgapeForgain] [varchar](255) NULL,
	[DestinoFondos] [varchar](255) NULL,
 CONSTRAINT [OtrasGarantias_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[Producto]    Script Date: 28-07-2017 13:39:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[Producto](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Operacion_Id] [int] NULL,
	[Operacion_IdSublimite] [int] NULL,
 CONSTRAINT [Producto_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[SetAprobacion]    Script Date: 28-07-2017 13:39:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[SetAprobacion](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[FichaFinanciera] [varchar](255) NULL,
	[MacGrupal] [varchar](255) NULL,
	[MallaSocietaria] [varchar](255) NULL,
	[ResumenEjectivo] [varchar](255) NULL,
	[MacIndividual] [varchar](255) NULL,
	[InformeAnalisis] [varchar](255) NULL,
	[FichaFinancieraConsolidada] [varchar](255) NULL,
	[ResumenCifrasFinancieras] [varchar](255) NULL,
	[DetalleCuenta] [varchar](255) NULL,
 CONSTRAINT [SetAprobacion_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[Sublinea]    Script Date: 28-07-2017 13:39:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[Sublinea](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Linea_Id] [int] NULL,
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
 CONSTRAINT [Sublinea_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[SublineaCovenants]    Script Date: 28-07-2017 13:39:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[SublineaCovenants](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Covenants_Id] [int] NULL,
	[Sublinea_Id] [int] NULL,
 CONSTRAINT [SublineaCovenants_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[SublineaGarantiasReales]    Script Date: 28-07-2017 13:39:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[SublineaGarantiasReales](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[GarantiasReales_Id] [int] NULL,
	[Sublinea_Id] [int] NULL,
 CONSTRAINT [SublineaGarantiasReales_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [scl].[SublineaOtrasGarantias]    Script Date: 28-07-2017 13:39:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [scl].[SublineaOtrasGarantias](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[OtrasGarantias_Id] [int] NULL,
	[Sublinea_Id] [int] NULL,
 CONSTRAINT [SublineaOtrasGarantias_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
