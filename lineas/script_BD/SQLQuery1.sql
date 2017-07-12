USE [lineas]
GO

/****** Object:  Table [dbo].[art_user]    Script Date: 04-07-2017 21:32:43 ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO

CREATE TABLE Comportamiento
  (
    Id [int] IDENTITY(1,1)NOT NULL ,
    Comportamiento VARCHAR (255)
  ) ;
ALTER TABLE Comportamiento ADD CONSTRAINT Comportamiento_PK PRIMARY KEY ( Id ) ;

CREATE TABLE Covenant
  (
    Id [int] IDENTITY(1,1) NOT NULL ,
    Indicador           VARCHAR (255) ,
    RatioExigido        VARCHAR (255) ,
    PeriodicidadControl VARCHAR (255) ,
    EstadoFinanciero    VARCHAR (255) ,
    RatioActual         VARCHAR (255) ,
    Notas               VARCHAR (255)
  ) ;
ALTER TABLE Covenant ADD CONSTRAINT Covenant_PK PRIMARY KEY ( Id ) ;

CREATE TABLE Empresa
  (
    --cliente
	Id [int] IDENTITY(1,1) NOT NULL ,
    Nombre      VARCHAR (255) ,
    RazonSocial VARCHAR (255) ,
    Rut         VARCHAR (255)
  ) ;
ALTER TABLE Empresa ADD CONSTRAINT Empresa_PK PRIMARY KEY ( Id ) ;

CREATE TABLE GarantiasEstatales
  (
    Id [int] IDENTITY(1,1) NOT NULL ,
    Porcentajecobertura VARCHAR (255) ,
    FogapeFogain        VARCHAR (255) ,
    DestinoFondos       VARCHAR (255)
  ) ;
ALTER TABLE GarantiasEstatales ADD CONSTRAINT GarantiasEstatales_PK PRIMARY KEY ( Id ) ;

CREATE TABLE GarantiasPersonas
  (
    Id [int] IDENTITY(1,1) NOT NULL ,
    RutGarante           VARCHAR (255) ,
    NombreGarante        VARCHAR (255) ,
    PatrimonioAval       VARCHAR (255) ,
    FechaEstadoSituacion VARCHAR (255) ,
    Notas                VARCHAR (255)
  ) ;
ALTER TABLE GarantiasPersonas ADD CONSTRAINT GarantiasPersonas_PK PRIMARY KEY ( Id ) ;

CREATE TABLE GarantiasPersonasConfort
  (
    Id [int] IDENTITY(1,1) NOT NULL ,
    RutSuscriptor        VARCHAR (255) ,
    NombreSuscriptor     VARCHAR (255) ,
    PatrimonioSuscriptor VARCHAR (255) ,
    TipoConfortLetter    VARCHAR (255) ,
    FechaEmisionConfort  VARCHAR (255) ,
    Notas                VARCHAR (255)
  ) ;
ALTER TABLE GarantiasPersonasConfort ADD CONSTRAINT GarantiasPersonasConfort_PK PRIMARY KEY ( Id ) ;

CREATE TABLE GarantiasReales
  (
    Id [int] IDENTITY(1,1) NOT NULL ,
    Descripcion          VARCHAR (255) ,
    Valorizacion         VARCHAR (255) ,
    NumeroFolio          VARCHAR (255) ,
    Estados              VARCHAR (255) ,
    TipoGarantia         VARCHAR (255) ,
    Secuencia            VARCHAR (255) ,
    TipoMoneda           VARCHAR (255) ,
    Tasacion             VARCHAR (255) ,
    ValorLiquidacion     VARCHAR (255) ,
    ValorComercial       VARCHAR (255) ,
    Notas                VARCHAR (255) ,
    ClausulaGarantias    VARCHAR (255) ,
    RutGarante           VARCHAR (255) ,
    NombreGarante        VARCHAR (255) ,
    PatrimonioAval       VARCHAR (255) ,
    EstadoSituacion      VARCHAR (255) ,
    RutSuscriptor        VARCHAR (255) ,
    NombreSuscriptor     VARCHAR (255)  ,
    PatrimonioSuscriptor VARCHAR (255) ,
    TipoConfortLetter    VARCHAR (255) ,
    EmisionConfort       VARCHAR (255)
  ) ;
ALTER TABLE GarantiasReales ADD CONSTRAINT GarantiasReales_PK PRIMARY KEY ( Id ) ;

CREATE TABLE GrupoEmpresa
  (
    Id [int] IDENTITY(1,1) NOT NULL ,
    Empresa_Id [int] NULL ,
    Grupo_Id   [int] NULL
  ) ;
ALTER TABLE GrupoEmpresa ADD CONSTRAINT GrupoEmpresa_PK PRIMARY KEY ( id ) ;

CREATE TABLE Grupo
  ( 
	Id [int] IDENTITY(1,1) NOT NULL 
  ) ;
ALTER TABLE Grupo ADD CONSTRAINT Grupo_PK PRIMARY KEY ( Id ) ;

CREATE TABLE InformacionCliente
  ( 
	Id [int] IDENTITY(1,1) NOT NULL 
  ) ;
ALTER TABLE InformacionCliente ADD CONSTRAINT InformacionCliente_PK PRIMARY KEY ( Id ) ;

CREATE TABLE InformacionFinancieraCliente
  (
    Id [int] IDENTITY(1,1) NOT NULL ,
    VaciandoBalance       VARCHAR (255) ,
    Iva                   VARCHAR (255) ,
    DeudaDirectaIndirecta VARCHAR (255)
  ) ;
ALTER TABLE InformacionFinancieraCliente ADD CONSTRAINT InformacionFinancieraCliente_PK PRIMARY KEY ( Id ) ;

CREATE TABLE Linea
  (
    Id [int] IDENTITY(1,1) NOT NULL ,
    Numero           VARCHAR (255) ,
    TipoRiesgo       VARCHAR (255) ,
    PlazoResudual    VARCHAR (255) ,
    MontoAprobado    VARCHAR (255) ,
    DeudaActual      VARCHAR (255) ,
    MontoAprobacion  VARCHAR (255) ,
    Moneda           VARCHAR (255) ,
    Comentario       VARCHAR (255) ,
    Tipolimite       VARCHAR (255) ,
    Garantiaestatal  VARCHAR (255) ,
    MacIndividual_Id INT  NULL
  ) ;
ALTER TABLE Linea ADD CONSTRAINT Linea_PK PRIMARY KEY ( Id ) ;

CREATE TABLE LineaCovenants
  (
    Id [int] IDENTITY(1,1) NOT NULL ,
    Linea_Id     INT NULL ,
    Covenants_Id INT  NULL
  ) ;
ALTER TABLE LineaCovenants ADD CONSTRAINT LineaCovenants_PK PRIMARY KEY ( Id ) ;

CREATE TABLE LineaGarantiaReal
  (
    Id [int] IDENTITY(1,1) NOT NULL  ,
    Linea_Id           INT  NULL ,
    GarantiasReales_Id INT  NULL
  ) ;
ALTER TABLE LineaGarantiaReal ADD CONSTRAINT LineaGarantiaReal_PK PRIMARY KEY ( Id ) ;

CREATE TABLE LineaOtrasGarantias
  (
    Id [int] IDENTITY(1,1) NOT NULL ,
    Linea_Id          INT   NULL ,
    OtrasGarantias_Id INT  NULL
  ) ;
ALTER TABLE LineaOtrasGarantias ADD CONSTRAINT LineaOtrasGarantias_PK PRIMARY KEY ( Id ) ;

CREATE TABLE MacGrupalMacIndividual
  (
    Id [int] IDENTITY(1,1) NOT NULL ,
    MacIndividual_Id INT  NULL ,
    MacGrupal_Id     INT NULL
  ) ;
ALTER TABLE MacGrupalMacIndividual ADD CONSTRAINT MacGrupalMacIndividual_PK PRIMARY KEY ( Id ) ;

CREATE TABLE MacGrupal
  (
    Id [int] IDENTITY(1,1) NOT NULL ,
    FechaPresentacion       VARCHAR (255) ,
    EjecutivoControl        VARCHAR (255) ,
    FechaVencimiento        VARCHAR (255) ,
    RatingGrupo             VARCHAR (255) ,
    NivelAtribucion         VARCHAR (255) ,
    SometidoAprobacion      VARCHAR (255) ,
    Plazos                  VARCHAR (255) ,
    AprobadoTotal           VARCHAR (255) ,
    NombreAprobacion        VARCHAR (255) ,
    FirmaAprobacion         VARCHAR (255) ,
    ValorMonedaUf           VARCHAR (255) ,
    ValorMonedaDolares      VARCHAR (255) ,
    TotalAprobacionPesos    VARCHAR (255) ,
    TotalAprobacionUf       VARCHAR (255),
    ObservacionComiteRiesgo VARCHAR (255) ,
    Grupo_Id                INT  NULL
  ) ;
 ALTER TABLE MacGrupal ADD CONSTRAINT MacGrupal_PK PRIMARY KEY ( Id ) ;

CREATE TABLE MacIndividual
  (
    Id [int] IDENTITY(1,1) NOT NULL ,
    Nombre                      VARCHAR (255) ,
    Rut                         VARCHAR (255) ,
    ActividadEconomica          VARCHAR (255) ,
    RatingGrupal                VARCHAR (255) ,
    NivelAtribucion             VARCHAR (255) ,
    RatingIndividual            VARCHAR (255) ,
    Clasificacion               VARCHAR (255) ,
    Vigilancia                  VARCHAR (255) ,
    FechaInformacionFinanciera  VARCHAR (255) ,
    PromedioSaldoVista          VARCHAR (255) ,
    DeudaSbif                   VARCHAR (255) ,
    AprobadoVinculado           VARCHAR (255) ,
    EquipoCobertura             VARCHAR (255) ,
    Oficina                     VARCHAR (255) ,
    FechaCreacion               VARCHAR (255) ,
    FechaVencimiento            VARCHAR (255) ,
    FechaVencimientoMacAnterior VARCHAR (255) ,
    Empresa_Id                  INT NULL
  ) ;
ALTER TABLE MacIndividual ADD CONSTRAINT MacIndividual_PK PRIMARY KEY ( Id ) ;

CREATE TABLE Operacion
  (
    Id [int] IDENTITY(1,1) NOT NULL ,
    Plazo       VARCHAR (255) ,
    TipoCredito VARCHAR (255) ,
    Moneda      VARCHAR (255) ,
    Monto       VARCHAR (255) ,
    Tasa        VARCHAR (255) ,
    Vencimiento VARCHAR (255) ,
    Curse       VARCHAR (255) ,
    Sublinea_Id INT  NULL
  ) ;
ALTER TABLE Operacion ADD CONSTRAINT Operacion_PK PRIMARY KEY ( Id ) ;

CREATE TABLE OtrasGarantias
  (
    Id [int] IDENTITY(1,1) NOT NULL ,
    Folio               VARCHAR (255) ,
    Titulo              VARCHAR (255) ,
    NumeroAcciones      VARCHAR (255) ,
    FechaValorizacion   VARCHAR (255) ,
    PrecioUnitario      VARCHAR (255) ,
    MontoTotalM         VARCHAR (255) ,
    CoberturaMinima     VARCHAR (255) ,
    CoberturaRepocision VARCHAR (255) ,
    CoberturaAlzamiento VARCHAR (255) ,
    Notas               VARCHAR (255) ,
    ForgapeForgain      VARCHAR (255) ,
    DestinoFondos       VARCHAR (255)
  ) ;
ALTER TABLE OtrasGarantias ADD CONSTRAINT OtrasGarantias_PK PRIMARY KEY ( Id ) ;

CREATE TABLE Producto
  (
Id [int] IDENTITY(1,1) NOT NULL ,
    Operacion_Id          INT  NULL ,
    Operacion_IdSublimite INT  NULL
  ) ;
ALTER TABLE Producto ADD CONSTRAINT Producto_PK PRIMARY KEY ( Id ) ;

CREATE TABLE SetAprobacion
  (
    Id [int] IDENTITY(1,1) NOT NULL ,
    FichaFinanciera            VARCHAR (255) ,
    MacGrupal                  VARCHAR (255) ,
    MallaSocietaria            VARCHAR (255) ,
    ResumenEjectivo            VARCHAR (255) ,
    MacIndividual              VARCHAR (255) ,
    InformeAnalisis            VARCHAR (255) ,
    FichaFinancieraConsolidada VARCHAR (255) ,
    ResumenCifrasFinancieras   VARCHAR (255) ,
    DetalleCuenta              VARCHAR (255)
  ) ;
ALTER TABLE SetAprobacion ADD CONSTRAINT SetAprobacion_PK PRIMARY KEY ( Id ) ;

CREATE TABLE Sublinea
  ( 
   Id [int] IDENTITY(1,1) NOT NULL ,
   Linea_Id INT NULL
  ) ;
ALTER TABLE Sublinea ADD CONSTRAINT Sublinea_PK PRIMARY KEY ( Id ) ;

CREATE TABLE SublineaCovenants
  (
    Id [int] IDENTITY(1,1) NOT NULL ,
    Covenants_Id INT  NULL ,
    Sublinea_Id  INT  NULL
  ) ;
ALTER TABLE SublineaCovenants ADD CONSTRAINT SublineaCovenants_PK PRIMARY KEY (  Id ) ;

CREATE TABLE SublineaGarantiasReales
  (
    Id [int] IDENTITY(1,1) NOT NULL  ,
    GarantiasReales_Id INT  NULL ,
    Sublinea_Id        INT  NULL
  ) ;
ALTER TABLE SublineaGarantiasReales ADD CONSTRAINT SublineaGarantiasReales_PK PRIMARY KEY ( Id ) ;

CREATE TABLE SublineaOtrasGarantias
  (
    Id [int] IDENTITY(1,1) NOT NULL ,
    OtrasGarantias_Id INT  NULL ,
    Sublinea_Id       INT  NULL
  ) ;
  ALTER TABLE SublineaOtrasGarantias ADD CONSTRAINT SublineaOtrasGarantias_PK PRIMARY KEY ( Id ) ;
  
  GO