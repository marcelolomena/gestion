USE [lineas]
GO
/****** Object:  Table [dbo].[Comportamiento]    Script Date: 06-07-2017 16:16:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Comportamiento](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Comportamiento] [varchar](255) NULL,
 CONSTRAINT [Comportamiento_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[Covenant]    Script Date: 06-07-2017 16:16:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Covenant](
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
/****** Object:  Table [dbo].[Empresa]    Script Date: 06-07-2017 16:16:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Empresa](
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
/****** Object:  Table [dbo].[GarantiasEstatales]    Script Date: 06-07-2017 16:16:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GarantiasEstatales](
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
/****** Object:  Table [dbo].[GarantiasPersonas]    Script Date: 06-07-2017 16:16:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GarantiasPersonas](
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
/****** Object:  Table [dbo].[GarantiasPersonasConfort]    Script Date: 06-07-2017 16:16:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GarantiasPersonasConfort](
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
/****** Object:  Table [dbo].[GarantiasReales]    Script Date: 06-07-2017 16:16:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GarantiasReales](
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
/****** Object:  Table [dbo].[Grupo]    Script Date: 06-07-2017 16:16:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Grupo](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Nombre] [varchar](200) NULL,
 CONSTRAINT [Grupo_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[GrupoEmpresa]    Script Date: 06-07-2017 16:16:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[GrupoEmpresa](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Empresa_Id] [int] NULL,
	[Grupo_Id] [int] NULL,
 CONSTRAINT [GrupoEmpresa_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[InformacionCliente]    Script Date: 06-07-2017 16:16:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[InformacionCliente](
	[Id] [int] IDENTITY(1,1) NOT NULL,
 CONSTRAINT [InformacionCliente_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[InformacionFinancieraCliente]    Script Date: 06-07-2017 16:16:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[InformacionFinancieraCliente](
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
/****** Object:  Table [dbo].[Linea]    Script Date: 06-07-2017 16:16:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Linea](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Numero] [varchar](255) NULL,
	[TipoRiesgo] [varchar](255) NULL,
	[PlazoResudual] [varchar](255) NULL,
	[MontoAprobado] [varchar](255) NULL,
	[DeudaActual] [varchar](255) NULL,
	[MontoAprobacion] [varchar](255) NULL,
	[Moneda] [varchar](255) NULL,
	[Comentario] [varchar](255) NULL,
	[Tipolimite] [varchar](255) NULL,
	[Garantiaestatal] [varchar](255) NULL,
	[MacIndividual_Id] [int] NULL,
 CONSTRAINT [Linea_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LineaCovenants]    Script Date: 06-07-2017 16:16:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LineaCovenants](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Linea_Id] [int] NULL,
	[Covenants_Id] [int] NULL,
 CONSTRAINT [LineaCovenants_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LineaGarantiaReal]    Script Date: 06-07-2017 16:16:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LineaGarantiaReal](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Linea_Id] [int] NULL,
	[GarantiasReales_Id] [int] NULL,
 CONSTRAINT [LineaGarantiaReal_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[LineaOtrasGarantias]    Script Date: 06-07-2017 16:16:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[LineaOtrasGarantias](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Linea_Id] [int] NULL,
	[OtrasGarantias_Id] [int] NULL,
 CONSTRAINT [LineaOtrasGarantias_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MacGrupal]    Script Date: 06-07-2017 16:16:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MacGrupal](
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
 CONSTRAINT [MacGrupal_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MacGrupalMacIndividual]    Script Date: 06-07-2017 16:16:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MacGrupalMacIndividual](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[MacIndividual_Id] [int] NULL,
	[MacGrupal_Id] [int] NULL,
 CONSTRAINT [MacGrupalMacIndividual_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[MacIndividual]    Script Date: 06-07-2017 16:16:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[MacIndividual](
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
/****** Object:  Table [dbo].[Operacion]    Script Date: 06-07-2017 16:16:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Operacion](
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
/****** Object:  Table [dbo].[OtrasGarantias]    Script Date: 06-07-2017 16:16:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[OtrasGarantias](
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
/****** Object:  Table [dbo].[Producto]    Script Date: 06-07-2017 16:16:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Producto](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Operacion_Id] [int] NULL,
	[Operacion_IdSublimite] [int] NULL,
 CONSTRAINT [Producto_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SetAprobacion]    Script Date: 06-07-2017 16:16:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SetAprobacion](
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
/****** Object:  Table [dbo].[Sublinea]    Script Date: 06-07-2017 16:16:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[Sublinea](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Linea_Id] [int] NULL,
	[Numero] [varchar](255) NULL,
	[TipoRiesgo] [varchar](255) NULL,
	[PlazoResudual] [varchar](255) NULL,
	[MontoAprobado] [varchar](255) NULL,
	[DeudaActual] [varchar](255) NULL,
	[MontoAprobacion] [varchar](255) NULL,
	[Moneda] [varchar](255) NULL,
	[Comentario] [varchar](255) NULL,
	[Tipolimite] [varchar](255) NULL,
	[Garantiaestatal] [varchar](255) NULL,
 CONSTRAINT [Sublinea_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SublineaCovenants]    Script Date: 06-07-2017 16:16:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SublineaCovenants](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[Covenants_Id] [int] NULL,
	[Sublinea_Id] [int] NULL,
 CONSTRAINT [SublineaCovenants_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SublineaGarantiasReales]    Script Date: 06-07-2017 16:16:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SublineaGarantiasReales](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[GarantiasReales_Id] [int] NULL,
	[Sublinea_Id] [int] NULL,
 CONSTRAINT [SublineaGarantiasReales_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
/****** Object:  Table [dbo].[SublineaOtrasGarantias]    Script Date: 06-07-2017 16:16:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
CREATE TABLE [dbo].[SublineaOtrasGarantias](
	[Id] [int] IDENTITY(1,1) NOT NULL,
	[OtrasGarantias_Id] [int] NULL,
	[Sublinea_Id] [int] NULL,
 CONSTRAINT [SublineaOtrasGarantias_PK] PRIMARY KEY CLUSTERED 
(
	[Id] ASC
)WITH (PAD_INDEX = OFF, STATISTICS_NORECOMPUTE = OFF, IGNORE_DUP_KEY = OFF, ALLOW_ROW_LOCKS = ON, ALLOW_PAGE_LOCKS = ON) ON [PRIMARY]
) ON [PRIMARY]
GO
