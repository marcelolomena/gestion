USE [art_live]
GO
/****** Object:  StoredProcedure [art].[list_incident]    Script Date: 18-03-2016 18:33:02 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- ============================================================
-- Author:		Marcelo Lomeña 
-- Create date: 13/10/2015
-- Update date: 13/10/2015
-- Description:	Lista de incidentes
-- ============================================================
ALTER PROCEDURE [art].[list_incident] 
@PageSize int,
@PageNumber int,
@Json NVARCHAR(MAX),
@User_Id int
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @hoy DATE=GETDATE()
	DECLARE @sql NVARCHAR(MAX) 
	DECLARE @ParmDefinition NVARCHAR(MAX)
	--SET @ParmDefinition = N'@PageSize int, @PageNumber int, @User_Id int'
	SET @ParmDefinition = N'@PageSize int, @PageNumber int'

	SET @sql =N'SELECT X.*,Y.status_id,Y.status_name FROM
	(
	SELECT  
		   a.incident_id
		  ,a.configuration_id
		  ,a.program_id
		  ,a.date_creation
		  ,a.ir_number
		  ,a.alm_number
		  ,(select uname from art_user where uid=a.user_sponsor_id) uname
		  ,a.user_sponsor_id
		  ,a.brief_description
		  ,a.extended_description
		  ,a.severity_id
		  ,a.date_end
		  ,a.task_owner_id
		  ,j.project_manager project_manager_id
		  ,d.demand_manager program_manager_id
		  ,a.user_creation_id
		  ,a.task_id
		  ,b.task_title
		  ,c.configuration_name
		  ,d.program_name
		  ,e.first_name + '' '' + e.last_name sponsor_name
		  ,f.first_name + '' '' + f.last_name owner_name
		  ,'''' note
		  ,severity_description
		  ,r.codDepartamento dId
		  ,r.glosaDepartamento department
		 FROM art_incident a,
		  art_project_master j,
		  art_task b,
		   art_incident_configuration c,
		   art_program d,
		   art_user e,
		   art_user f,
		   art_incident_severity g,
		   RecursosHumanos r
			WHERE a.task_id=b.tId AND
			a.configuration_id=c.configuration_id AND
			a.program_id=d.program_id AND
			a.user_sponsor_id=e.uid AND 
			a.task_owner_id=f.uid AND
			g.severity_id=a.severity_id AND
			a.is_deleted = 1 AND
			b.pId = j.pId AND
			j.program = d.program_id AND
			LEFT(r.emailTrab, CHARINDEX(''@'', r.emailTrab) - 1 ) = f.uname 
			AND LEN(r.emailTrab) > 1
			AND periodo=(SELECT MAX(periodo) FROM RecursosHumanos)
	) X
	JOIN 
	(
	SELECT T1.log_id,T1.incident_id,T1.status_id,T1.[log_date],T2.status_name
	FROM
	(
	SELECT *,
			MAX(log_date) OVER (PARTITION BY incident_id) AS maxdate
	FROM art_incident_log
	) T1
	JOIN
	(SELECT status_id,status_name FROM art_incident_status) T2
	ON T1.status_id=T2.status_id
	WHERE [log_date] = maxdate
	) Y
	ON X.incident_id=Y.incident_id '

	IF LEN(@Json)>0
	BEGIN
		SET @sql = @sql + 'WHERE ' + @Json

		SET @sql = LEFT(@sql, LEN(@sql) - 4)

	END

	IF @PageSize > 0 AND @PageNumber > 0
		SET @sql = @sql + ' ORDER BY X.incident_id OFFSET @PageSize * (@PageNumber - 1) ROWS FETCH NEXT @PageSize ROWS ONLY'
	ELSE IF @PageSize = 0 AND @PageNumber = 0
		SET @sql = @sql + ' ORDER BY X.incident_id'

 EXEC sp_executesql  @sql,@ParmDefinition,@PageSize,@PageNumber
 
END







