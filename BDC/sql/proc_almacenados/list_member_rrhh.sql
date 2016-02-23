USE [art_live]
GO
/****** Object:  StoredProcedure [art].[list_member_rrhh]    Script Date: 23-02-2016 16:13:34 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Marcelo Lomeña
-- Create date: 09/01/2016
-- Description:	Busqueda recursiva de programas
-- =============================================
CREATE PROCEDURE [art].[list_member_rrhh]
	-- Add the parameters for the stored procedure here
	@term varchar(max)
AS
BEGIN
	SET NOCOUNT ON;

	declare @pos int
	DECLARE @name varchar(MAX)
	declare @ape varchar(max)

	set @Pos = charindex(' ' ,@term)

	IF @pos>0
	BEGIN
	set @name = substring(@term,1,@Pos - 1)
	set @ape= substring(@term,@Pos + 1, LEN(@term))
	SELECT RTRIM(LTRIM(nombre)) + ' ' + RTRIM(LTRIM(apellido)) value,
	 RTRIM(LTRIM(nombre)) + ' ' + RTRIM(LTRIM(apellido)) label 
	 FROM RecursosHumanos WHERE LEN(emailTrab) != 1 AND
	  periodo=(select max(periodo) from RecursosHumanos) AND
	 -- nombre like '%hernan pena%' OR apellido like '%pena%'
	   nombre like '%' +@name+ '%' AND apellido like '%' +@ape+ '%' order by nombre
	print @ape
	END
	ELSE 
	BEGIN
	SELECT RTRIM(LTRIM(nombre)) + ' ' + RTRIM(LTRIM(apellido)) value,
	 RTRIM(LTRIM(nombre)) + ' ' + RTRIM(LTRIM(apellido)) label 
	 FROM RecursosHumanos WHERE LEN(emailTrab) != 1 AND
	  periodo=(select max(periodo) from RecursosHumanos) AND
	 -- nombre like '%hernan pena%' OR apellido like '%pena%'
	   nombre+apellido like '%'+@term+'%' order by nombre
	END 
END