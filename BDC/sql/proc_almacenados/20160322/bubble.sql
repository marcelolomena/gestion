USE [art_live]
GO
/****** Object:  StoredProcedure [art].[bubble]    Script Date: 29-03-2016 9:58:33 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- ===============================================
-- Author:		Marcelo Lomeña 
-- Create date: 29/07/2015
-- Update date: 11/09/2015
-- Description:	Calculos para gràfico de burbujas
-- ===============================================
ALTER PROCEDURE [art].[bubble] 
@uid int
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.
	SET NOCOUNT ON;

	DECLARE @calculos TABLE(
	    id int identity,
		division VARCHAR(255),
		programa VARCHAR(255),
		program_id int,
		pId int,
		tId int,
		sub_task_id int,
		responsable VARCHAR(255),
		fecini DATE,
		feccom DATE,
		plan_start_date DATE,
		plan_end_date DATE,
		completion_percentage float,
		estimated_time float,
		estimated_percentage float,
		real_start_date DATE,
		real_end_date DATE,
		hours float,
		valor_ganado_esperado float,
		valor_ganado float,
		pai float,
		pae float,
		spi float,
		cpi float/*,
		inversion numeric(18,0),
		gasto numeric(18,0)*/
	)

	DECLARE @hoy DATE=GETDATE()

	INSERT @calculos (division,programa,program_id,pId,tId,sub_task_id,responsable,fecini,feccom,plan_start_date,plan_end_date,completion_percentage)
	SELECT e.division,
		a.program_name programa,
		a.program_id,
		b.pId,
		c.tId,
		d.sub_task_id,
		SUBSTRING(f.first_name,1,1) + '.' + f.last_name responsable,
		a.initiation_planned_date fecini,
		a.release_date feccom,
		d.plan_start_date,
		d.plan_end_date,
		ISNULL(d.completion_percentage,0) completion_percentage FROM art_program a
		JOIN
		(SELECT * FROM art_project_master) b ON a.program_id=b.program
		JOIN 
		(SELECT * FROM art_task) c ON c.pId = b.pId
		JOIN 
		(SELECT * FROM art_sub_task) d ON d.task_id=c.tId
		JOIN 
		(SELECT * FROM art_division_master) e ON e.dId=a.devison
		JOIN
		(SELECT * FROM art_user) f ON f.uid=a.demand_manager
		JOIN
		(SELECT * FROM art_program_members) m ON @uid=m.member_id AND
				 a.program_id=m.program_id
		WHERE 
		a.is_active = 1 AND 
		b.is_active = 1 AND 
		c.is_active = 1 AND 
		d.is_deleted = 1 AND
		(a.work_flow_status = 1 OR a.work_flow_status=3 OR a.work_flow_status=4 OR a.work_flow_status=5)

		
	
		UPDATE
		t
		SET
			t.estimated_time = ISNULL(x.estimated_time,0),
			t.valor_ganado=ISNULL((x.estimated_time*t.completion_percentage)/100,0)
		FROM
		@calculos t
		INNER JOIN (
		SELECT sub_task_id,SUM(estimated_time) estimated_time FROM
		(SELECT sub_task_id,SUM(estimated_time) estimated_time
		FROM art_sub_task_allocation WHERE is_deleted=1
		GROUP BY sub_task_id
		UNION ALL
		SELECT sub_task_id,SUM(estimated_time) estimated_time
		FROM art_sub_task_allocation_external WHERE is_deleted=1
		GROUP BY sub_task_id) AS TOTAL
		GROUP BY sub_task_id
		) AS x
		ON
		 t.sub_task_id = x.sub_task_id

		UPDATE
		t
		SET
			t.hours=y.hours,
			t.real_start_date=y.real_start_date,
			t.real_end_date=y.real_end_date
		FROM
		@calculos t
		INNER JOIN (
		SELECT sub_task_id,ISNULL(SUM(hours),0) hours,MIN(real_start_date) real_start_date, MAX(real_end_date) real_end_date FROM
		(
		SELECT sub_task_id,SUM(hours) hours, MIN(task_for_date) real_start_date, MAX(task_for_date) real_end_date 
		FROM art_timesheet WHERE is_deleted = 1 GROUP BY sub_task_id
		UNION ALL 
		SELECT sub_task_id,SUM(hours) hours, MIN(task_for_date) real_start_date, MAX(task_for_date) real_end_date 
		FROM art_timesheet_external WHERE is_deleted = 1 GROUP BY sub_task_id
		) AS TOT 
		GROUP BY sub_task_id) AS y
		ON t.sub_task_id = y.sub_task_id


		UPDATE
		t1
		SET
			t1.valor_ganado_esperado = (CASE WHEN DATEDIFF (day, t2.plan_end_date, @hoy) < 0 THEN 0 
											 WHEN DATEDIFF (day, t2.plan_end_date, @hoy) <= 0 AND DATEDIFF (day, t2.plan_start_date, @hoy) >= 0 THEN 
													IIF(DATEDIFF (day, t2.plan_end_date, DATEADD(day,1,t2.plan_end_date)) > 0,
													 (CAST(DATEDIFF (day, t2.plan_end_date, @hoy) AS FLOAT) / DATEDIFF (day, t2.plan_end_date, DATEADD(day,1,t2.plan_end_date) ) )  * t2.estimated_time,
													 0)
											 WHEN DATEDIFF (day, t2.plan_end_date, @hoy) > 0 THEN t2.estimated_time
												 END)
		FROM
		@calculos t1
		INNER JOIN @calculos t2 ON t1.sub_task_id = t2.sub_task_id


UPDATE @calculos
SET spi = t2.spi , cpi=t2.cpi
FROM @calculos t1, (SELECT program_id,
							IIF(SUM(valor_ganado_esperado)=0,SUM(valor_ganado),SUM(valor_ganado) / SUM(valor_ganado_esperado) ) spi,
							IIF(SUM(hours)=0,SUM(valor_ganado),SUM(valor_ganado) / SUM(hours)) cpi
                          FROM @calculos
                          GROUP BY program_id)  t2
WHERE t1.program_id = t2.program_id


SELECT 
 ROUND(ISNULL(MAX(cpi),0),2) x, 
 ROUND(ISNULL(MAX(spi),0),2) y, 
 program_id z, 
 programa
 FROM @calculos WHERE (cpi<> 0 AND spi<> 0) AND (cpi < 2.5 AND spi < 2.5) GROUP BY programa,program_id ORDER BY programa
END








