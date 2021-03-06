USE [art_live]
GO
/****** Object:  StoredProcedure [art].[list_member_junior]    Script Date: 15-02-2016 12:26:32 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Marcelo Lomeña
-- Create date: 09/11/2015
-- Description:	Busqueda recursiva de programas
-- =============================================
ALTER PROCEDURE [art].[list_member_junior] 
	-- Add the parameters for the stored procedure here
	@uid int, 
	@page int
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @email NVARCHAR(100)
	DECLARE @rol VARCHAR(3)
	DECLARE @PageSize INT = 10

	SELECT @email=email,@rol=RTRIM(CAST(user_profile AS VARCHAR)) FROM art_user WHERE uid=@uid

	IF @rol = 'su' OR @rol = 'cl'
	BEGIN 
		SELECT * FROM art_program WHERE is_active = 1 ORDER BY program_id OFFSET @PageSize * (@page - 1) ROWS FETCH NEXT @PageSize ROWS ONLY
	END
	ELSE
	BEGIN
		IF EXISTS (SELECT * FROM RecursosHumanos WHERE emailTrab=@email)
		BEGIN
			  WITH tblSubalternos AS
			  (
				  SELECT IIF(LEN(emailTrab)>1,LEFT(emailTrab, CHARINDEX('@', emailTrab) -1 ),null) uname,numRut FROM RecursosHumanos WHERE emailTrab = @email
				  UNION ALL
				SELECT IIF(LEN(emailTrab)>1,LEFT(emailTrab, CHARINDEX('@', emailTrab) -1 ),null) uname,RecursosHumanos.numRut 
				FROM RecursosHumanos JOIN tblSubalternos ON RecursosHumanos.rutJefe = tblSubalternos.numRut
			  )
			  SELECT DISTINCT art_program.*
				  FROM tblSubalternos,art_user,art_program_members,art_program 
				WHERE tblSubalternos.uname=art_user.uname AND
				 art_user.uid=art_program_members.member_id AND
				 art_program.program_id=art_program_members.program_id AND
		 			 --art_program.is_active=1 AND art_program_members.is_active = 0 ORDER BY art_program.program_id OFFSET @PageSize * (@page - 1) ROWS FETCH NEXT @PageSize ROWS ONLY
					 art_program.is_active=1 AND art_program.work_flow_status!=6 AND art_program.work_flow_status!=7 AND art_program.work_flow_status!=8 AND art_program.work_flow_status!=9 AND art_program_members.is_active = 0 ORDER BY art_program.program_id OFFSET @PageSize * (@page - 1) ROWS FETCH NEXT @PageSize ROWS ONLY
			  OPTION(MAXRECURSION 32767)  
		END
		ELSE
		BEGIN
			SELECT * FROM art_program WHERE is_active = 1 AND 
			program_id IN (SELECT program FROM art_project_master WHERE is_active = 1 AND
			 pId IN (SELECT pId FROM art_user_project_mapping WHERE uId=@uid and show_project=1))
			 ORDER BY art_program.program_id OFFSET @PageSize * (@page - 1) ROWS FETCH NEXT @PageSize ROWS ONLY
		END
	END
END




