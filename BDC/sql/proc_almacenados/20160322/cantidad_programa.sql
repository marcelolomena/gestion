USE [art_live]
GO
/****** Object:  StoredProcedure [art].[cantidad_programa]    Script Date: 22-03-2016 14:55:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Marcelo Lomeña
-- Create date: 06/08/2015
-- Description:	Lista de programas para JQGrid
-- =============================================
ALTER PROCEDURE [art].[cantidad_programa] 
@Json NVARCHAR(MAX)
AS
BEGIN

	SET NOCOUNT ON;

	DECLARE @res TABLE(
		id int,
		nivel VARCHAR(MAX),
		estado VARCHAR(MAX),
		codigo int,
		programa VARCHAR(MAX),
		responsable VARCHAR(MAX),
		pfecini DATE,
		pfecter DATE,
		rfecini DATE,
		rfecter DATE,
		hplan FLOAT,
		hreal FLOAT
	)


	INSERT INTO @res
	 (id,nivel,estado,codigo,programa,responsable,pfecini,pfecter,rfecini,rfecter,hplan,hreal) 
	EXEC art.reporte_programa 0,0,@Json

	SELECT count(*) FROM @res

END









