USE [art_live]
GO
/****** Object:  UserDefinedFunction [dbo].[CalculaIndicadoresDePrograma]    Script Date: 29-03-2016 16:20:13 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
ALTER FUNCTION [dbo].[CalculaIndicadoresDePrograma] (
     @program_id int
)

RETURNS @calculitos TABLE(
		program_id INT,
		spi FLOAT DEFAULT 0,
		cpi FLOAT DEFAULT 0,
		pai FLOAT DEFAULT 0,
		pae FLOAT DEFAULT 0
		)

AS
BEGIN

DECLARE @calculos TABLE(
	    id int identity,
		program_id INT,
		pId INT,
		tId INT,
		sub_task_id INT,
		plan_start_date DATE,
		plan_end_date DATE,
		estimated_time FLOAT DEFAULT 0,
		real_start_date DATE,
		real_end_date DATE,
		hours FLOAT DEFAULT 0,
		completion_percentage FLOAT DEFAULT 0,
		valor_ganado_esperado FLOAT DEFAULT 0,
		valor_ganado FLOAT DEFAULT 0,
		spi FLOAT DEFAULT 0,
		cpi FLOAT DEFAULT 0,
		pai FLOAT DEFAULT 0,
		pae FLOAT DEFAULT 0
		)


	INSERT @calculos (program_id) 
	SELECT 
		a.program_id FROM art_program a
		WHERE 
		a.is_active = 1 AND 
		a.program_id = @program_id


	UPDATE
		t
		SET
		t.pId = x.pId,
		t.tId = x.tId,
		t.sub_task_id = x.sub_task_id
		FROM
		@calculos t
		INNER JOIN ( 
		SELECT p.program project_id,p.pId,t.tId,s.sub_task_id FROM art_project_master p	JOIN art_task t ON t.pId = p.pId
		JOIN art_sub_task s ON s.task_id=t.tId
			WHERE 
			p.is_active = 1 AND 
			t.is_active = 1 AND 
			s.is_deleted = 1 
		) AS x
		ON x.project_id=t.program_id

	UPDATE
		t
		SET
		t.estimated_time = x.estimated_time,
		t.valor_ganado=ISNULL((x.estimated_time*t.completion_percentage)/100,0)
		FROM
		@calculos t
		INNER JOIN (
		SELECT sub_task_id,ISNULL(SUM(estimated_time),0) estimated_time FROM
		(SELECT sub_task_id,ISNULL(SUM(estimated_time),0) estimated_time
		FROM art_sub_task_allocation WHERE is_deleted=1
		GROUP BY sub_task_id
		UNION ALL
		SELECT sub_task_id,ISNULL(SUM(estimated_time),0) estimated_time
		FROM art_sub_task_allocation_external WHERE is_deleted=1
		GROUP BY sub_task_id) AS TOTAL
		GROUP BY sub_task_id
		) AS x
		ON t.sub_task_id = x.sub_task_id

	UPDATE
		t
		SET
		t.hours=ISNULL(y.hours,0),
		t.real_start_date=y.real_start_date,
		t.real_end_date=y.real_end_date
		FROM
		@calculos t
		LEFT OUTER JOIN (
		SELECT sub_task_id,ISNULL(SUM(hours),0) hours,MIN(real_start_date) real_start_date, MAX(real_end_date) real_end_date FROM
		(
		SELECT sub_task_id,ISNULL(SUM(hours),0) hours, MIN(task_for_date) real_start_date, MAX(task_for_date) real_end_date 
		FROM art_timesheet WHERE is_deleted = 1 GROUP BY sub_task_id
		UNION ALL 
		SELECT sub_task_id,ISNULL(SUM(hours),0) hours, MIN(task_for_date) real_start_date, MAX(task_for_date) real_end_date 
		FROM art_timesheet_external WHERE is_deleted = 1 GROUP BY sub_task_id
		) AS TOT 
		GROUP BY sub_task_id) AS y
		ON t.sub_task_id = y.sub_task_id


		UPDATE
		t1
		SET
			t1.valor_ganado_esperado = (CASE WHEN DATEDIFF (day, t2.plan_end_date, GETDATE()) < 0 THEN 0 
											 WHEN DATEDIFF (day, t2.plan_end_date, GETDATE()) <= 0 AND DATEDIFF (day, t2.plan_start_date, GETDATE()) >= 0 THEN 
													IIF(DATEDIFF (day, t2.plan_end_date, DATEADD(day,1,t2.plan_end_date)) > 0,
													 (CAST(DATEDIFF (day, t2.plan_end_date, GETDATE()) AS FLOAT) / DATEDIFF (day, t2.plan_end_date, DATEADD(day,1,t2.plan_end_date) ) )  * t2.estimated_time,
													 0)
											 WHEN DATEDIFF (day, t2.plan_end_date, GETDATE()) > 0 THEN t2.estimated_time
												 END)
		FROM
		@calculos t1
		INNER JOIN @calculos t2 ON t1.sub_task_id = t2.sub_task_id



		UPDATE @calculos
		SET pai=t2.pai,
		pae=t2.pae,
		real_start_date=t2.rfecini,
		real_end_date=t2.rfecter
		FROM  @calculos t1, (SELECT program_id,
									MIN(real_start_date) rfecini,
									 MAX(real_start_date) rfecter,
									IIF(SUM(estimated_time)=0, 100, (SUM(valor_ganado)/SUM(estimated_time)) * 100) pai,
									IIF(SUM(estimated_time)=0, SUM(valor_ganado_esperado), (SUM(valor_ganado_esperado)/SUM(estimated_time)) * 100) pae
								  FROM @calculos
								  GROUP BY program_id)  t2
		WHERE t1.program_id = t2.program_id


		UPDATE @calculos
		SET spi = t2.spi , cpi=t2.cpi
		FROM @calculos t1, (SELECT program_id,
							IIF(SUM(valor_ganado_esperado)=0,SUM(valor_ganado),SUM(valor_ganado) / SUM(valor_ganado_esperado) ) spi,
							IIF(SUM(hours)=0,SUM(valor_ganado),SUM(valor_ganado) / SUM(hours)) cpi,
							IIF(SUM(estimated_time)=0, 100, (SUM(valor_ganado)/SUM(estimated_time)) * 100) pai,
							IIF(SUM(estimated_time)=0, SUM(valor_ganado_esperado), (SUM(valor_ganado_esperado)/SUM(estimated_time)) * 100) pae
                          FROM @calculos
                          GROUP BY program_id)  t2
		WHERE t1.program_id = t2.program_id

		INSERT @calculitos SELECT DISTINCT program_id,ROUND(spi,2) spi,ROUND(cpi,2) cpi, pai,pae FROM @calculos 

		RETURN
--END
END -- End Function