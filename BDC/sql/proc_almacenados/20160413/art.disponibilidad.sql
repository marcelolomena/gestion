USE [art_live]
GO
/****** Object:  StoredProcedure [art].[disponibilidad]    Script Date: 14-04-2016 17:43:10 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Cristian Guevara
-- Create date: 13-04-2016
-- Description:	Devuelve la cantidad de horas por dia desde la fecha actual hasta 1 mes atras
-- =============================================
ALTER PROCEDURE [art].[disponibilidad] 
	@uid int
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @fecini DATE
	DECLARE @fecfin  DATE
	DECLARE @fecha  DATE
	DECLARE @horas FLOAT

	DECLARE @resultado TABLE(
	    fecha DATE,
		horas FLOAT
	)

	SET @fecfin = GETDATE()
	SET @fecini = '2016-01-01'

	SET @fecha=@fecini

	WHILE(@fecha<=@fecfin)
	BEGIN
		select @horas=ISNULL(sum(hours),0) from art_timesheet where task_for_date=@fecha and user_id=@uid
		INSERT INTO @resultado (fecha, horas) values (@fecha,@horas)
		SET @fecha = DATEADD(dd,1,@fecha)
	END
	SELECT * from @resultado

END










