USE [art_live]
GO
/****** Object:  StoredProcedure [art].[list_member_art]    Script Date: 24-03-2016 15:31:15 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Marcelo Lomeña
-- Create date: 09/01/2016
-- Description:	Busqueda recursiva de programas
-- =============================================
ALTER PROCEDURE [art].[list_member_art]
	@term varchar(max)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @pos INT
	DECLARE @name VARCHAR(MAX)
	DECLARE @ape VARCHAR(MAX)
	DECLARE @periodo INT

	SET @Pos = charindex(' ' ,@term)
	SELECT @periodo=max(periodo) FROM RecursosHumanos

	IF @pos>0
	BEGIN
	SET @name = SUBSTRING(@term,1,@Pos - 1)
	SET @ape= SUBSTRING(@term,@Pos + 1, LEN(@term))

	SELECT LEFT(r.emailTrab, CHARINDEX('@', r.emailTrab) - 1 ) value,
		 RTRIM(LTRIM(r.nombre)) + ' ' + RTRIM(LTRIM(r.apellido)) label 
		 FROM RecursosHumanos r,art_user u
		  WHERE 
		  LEN(r.emailTrab) > 1 AND
		  r.periodo=@periodo AND
		  LEFT(r.emailTrab, CHARINDEX('@', r.emailTrab) - 1 ) = u.uname AND
		   r.nombre like '%' + @name + '%' AND
		    r.apellido like '%' +@ape+ '%' ORDER BY nombre
	END
	ELSE 
	BEGIN
		SELECT LEFT(r.emailTrab, CHARINDEX('@', r.emailTrab) - 1 ) value,
		 RTRIM(LTRIM(r.nombre)) + ' ' + RTRIM(LTRIM(r.apellido)) label 
		 FROM RecursosHumanos r,art_user u 
		  WHERE LEN(r.emailTrab) > 1 AND
		  r.periodo=@periodo AND 
		  LEFT(r.emailTrab, CHARINDEX('@', r.emailTrab) - 1 ) = u.uname AND
		  r.nombre+r.apellido like '%'+@term+'%' ORDER BY nombre
	END 
END
