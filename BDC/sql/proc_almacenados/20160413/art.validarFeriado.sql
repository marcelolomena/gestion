USE [art_live]
GO
/****** Object:  StoredProcedure [art].[validate_incident_codir]    Script Date: 15-04-2016 18:24:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Cristian Guevara
-- Create date: 2015/10/19
-- Description:	Valida si es feriado
-- =============================================
ALTER PROCEDURE [art].[validarFeriado] 
	@fecha varchar(100)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	IF EXISTS (SELECT TOP 1 * FROM art_feriados  WHERE fecha=@fecha)
	BEGIN
		SELECT 1 ret
	END
	ELSE
	BEGIN
		SELECT 0 ret
	END

END







