-- =============================================
-- Author:		Ricardo Reyes
-- Create date: 27/08/2018
-- Description:	Reporte de documentos
-- =============================================
CREATE PROCEDURE [art].[reporte_documentos] 
	-- Add the parameters for the stored procedure here
@PageSize int,
@PageNumber int,
@Json NVARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @calculitos AS TPrograma 


	DECLARE @hoy DATE=GETDATE()
	DECLARE @ParmDefinition NVARCHAR(MAX)
	DECLARE @sql NVARCHAR(MAX) 
	SET @ParmDefinition = N'@calculitos TPrograma readonly, @PageSize int, @PageNumber int'


		INSERT @calculitos (program_id,work_flow_status,estado,programa,responsable,plan_start_date,plan_end_date)
			SELECT 
			a.program_id,
			a.work_flow_status,
			b.workflow_status,
			a.program_name programa,
			SUBSTRING(c.first_name,1,1) + '.' + c.last_name responsable,
			a.initiation_planned_date fecini,
			a.release_date feccom
			FROM art_program a,
			art_program_workflow_status b,
			art_user c WHERE
			a.is_active=1
			AND a.demand_manager=c.uid
			AND b.id=a.work_flow_status


		UPDATE T
		SET T.real_start_date=X.real_start_date,T.real_end_date=X.real_end_date,T.hreal=X.hours
		FROM @calculitos T
		JOIN (
		SELECT program_id,MIN(real_start_date) real_start_date,MAX(real_end_date) real_end_date,SUM(hours) hours FROM
		(
			SELECT a.program_id,MIN(e.task_for_date) real_start_date, MAX(e.task_for_date) real_end_date, SUM(e.hours) hours FROM art_program a
			JOIN art_project_master b ON a.program_id = b.program
			JOIN art_task c ON b.pId = c.pId
			JOIN art_sub_task d ON c.tId = d.task_id
			JOIN art_timesheet e ON d.sub_task_id = e.sub_task_id AND c.tId = e.task_id
			WHERE a.is_active = 1 AND
			b.is_active = 1 AND
			c.is_active = 1 AND
			d.is_deleted = 1 AND
			e.is_deleted = 1
			GROUP BY a.program_id
		UNION ALL 
			SELECT a.program_id, MIN(e.task_for_date) real_start_date, MAX(e.task_for_date) real_end_date, SUM(e.hours) hours FROM art_program a
			JOIN art_project_master b ON a.program_id = b.program
			JOIN art_task c ON b.pId = c.pId
			JOIN art_sub_task d ON c.tId = d.task_id
			JOIN art_timesheet_external e ON d.sub_task_id = e.sub_task_id AND c.tId = e.task_id
			WHERE a.is_active = 1 AND
			b.is_active = 1 AND
			c.is_active = 1 AND
			d.is_deleted = 1 AND
			e.is_deleted = 1
			GROUP BY a.program_id
		) AS TOTAL GROUP BY program_id ) X
		ON 
		T.program_id = X.program_id

		UPDATE T
		SET T.hplan=X.horas
		FROM @calculitos T
		JOIN (
		SELECT program_id,SUM(horas) horas FROM
		(
			SELECT a.program_id,SUM(e.estimated_time) horas FROM art_program a
			JOIN art_project_master b ON a.program_id = b.program
			JOIN art_task c ON b.pId = c.pId
			JOIN art_sub_task d ON c.tId = d.task_id
			JOIN art_sub_task_allocation e ON d.sub_task_id = e.sub_task_id AND c.tId = e.task_id
			WHERE a.is_active = 1 AND
			b.is_active = 1 AND
			c.is_active = 1 AND
			d.is_deleted = 1 AND
			e.is_deleted = 1
			GROUP BY a.program_id
		UNION ALL 
			SELECT a.program_id, SUM(e.estimated_time) horas FROM art_program a
			JOIN art_project_master b ON a.program_id = b.program
			JOIN art_task c ON b.pId = c.pId
			JOIN art_sub_task d ON c.tId = d.task_id
			JOIN art_sub_task_allocation_external e ON d.sub_task_id = e.sub_task_id AND c.tId = e.task_id
			WHERE a.is_active = 1 AND
			b.is_active = 1 AND
			c.is_active = 1 AND
			d.is_deleted = 1 AND
			e.is_deleted = 1
			GROUP BY a.program_id
		) AS TOTAL GROUP BY program_id ) X
		ON 
		T.program_id = X.program_id


		SET @sql =N'SELECT
		a.id id,
		''PROGRAMA'' nivel,
		a.estado,
		a.program_id codigo,
		a.programa,
		a.responsable,
		a.plan_start_date pfecini,
		a.plan_end_date pfecter,
		a.real_start_date rfecini,
		a.real_end_date rfecter,
		ROUND(a.hplan,2) hplan,
		ROUND(a.hreal,2) hreal
		 FROM @calculitos a '


		IF LEN(@Json)>0
		BEGIN
			SET @sql = @sql + 'WHERE ' + @Json

			SET @sql = LEFT(@sql, LEN(@sql) - 4)
		END
	
		IF @PageSize > 0 AND @PageNumber > 0
			SET @sql = @sql + ' ORDER BY a.programa OFFSET @PageSize * (@PageNumber - 1) ROWS FETCH NEXT @PageSize ROWS ONLY'
		ELSE IF @PageSize = 0 AND @PageNumber = 0
			SET @sql = @sql + ' ORDER BY a.programa'


		EXEC sp_executesql  @sql,@ParmDefinition,@calculitos,@PageSize,@PageNumber

END









GO