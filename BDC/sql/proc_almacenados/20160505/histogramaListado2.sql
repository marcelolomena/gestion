USE [art_live]
GO
/****** Object:  StoredProcedure [art].[histogramaListado]    Script Date: 05-05-2016 16:56:51 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Cristian Guevara
-- Create date: 18-04-2016
-- Description:	Obtiene las horas informadas en un periodo
-- =============================================
ALTER PROCEDURE [art].[histogramaListado2]
	@uid INT,
	@mes INT
AS
BEGIN
	--DECLARE @uid int = 341
	--DECLARE @mes int = 2
	SET NOCOUNT ON;
	DECLARE @programaName VARCHAR(255)
	DECLARE @proyectoName VARCHAR(255)
	DECLARE @tareaName VARCHAR(255)
	DECLARE @programaId INT
	DECLARE @proyectoId INT
	DECLARE @tareaId INT
	DECLARE @idsubtarea INT
	DECLARE @subtarea VARCHAR(255)
	DECLARE @fecha VARCHAR(20)
	DECLARE @cont INT
	DECLARE @contHasta INT
	DECLARE @horas FLOAT
	DECLARE @horasTotal VARCHAR(MAX)
	DECLARE @programas TABLE (
		programa VARCHAR(255),
		proyecto VARCHAR(255),
		tarea VARCHAR(255),
		subtarea VARCHAR(255),
		horas varchar(255)
	)
	
	DECLARE SUBTAREAS cursor for
	select distinct sub_task_id from art_timesheet where user_id=@uid and task_type=1 and month(task_for_date)=@mes and year(task_for_date)=2016 order by sub_task_id
	open SUBTAREAS
	fetch next from SUBTAREAS
	into @idsubtarea	
	while @@fetch_status = 0	
	BEGIN
		select @tareaId=task_id,@subtarea=title from art_sub_task where sub_task_id=@idsubtarea
		select @tareaName=task_title, @proyectoId=pId from art_task where tId=@tareaId
		select @programaId=program, @proyectoName=project_name from art_project_master where pId=@proyectoId
		select @programaName=program_name from art_program where program_id=@programaId		
		SET @cont = 1
		SET @contHasta = 31 
		SET @horasTotal = ''
		IF(@mes=2)
		BEGIN
			SET @contHasta=29
		END
		IF(@mes=4)
		BEGIN
			SET @contHasta=30
		END
		
		while @cont <=@contHasta
		begin
			SET @horas = 0.0
			select @horas=sum(a.hours) from art_timesheet a where a.sub_task_id=@idsubtarea AND a.user_id=@uid and task_type=1 and a.task_for_date=CAST('2016-'+CONVERT(varchar(10), @mes)+'-'+CAST(@cont AS varchar(10)) AS DATETIME2)
			print @horas
			if @horas>0.0 
			begin				
				set @horasTotal=@horasTotal+CAST(@horas AS varchar(10))
				print('tiene horas')
				print(@horasTotal)
			end
			else
			begin
				set @horasTotal=@horasTotal+'0'
				print('no tiene horas')
			end
			set @cont = @cont+1
			if @cont<=31 
			begin
				set @horasTotal=@horasTotal+';'
			end
		end
		insert into @programas values(@programaName,@proyectoName,@tareaName,@subtarea,@horasTotal)
		fetch next from SUBTAREAS 
		into @idsubtarea 
	END
	close SUBTAREAS 
	deallocate SUBTAREAS
	
	DECLARE SUBTAREASEXTRA cursor for
	select a.id idsubtarea,a.task subtarea from art_non_project_task a 
	open SUBTAREASEXTRA
	fetch next from SUBTAREASEXTRA
	into @idsubtarea,@subtarea	
	while @@fetch_status = 0	
	BEGIN	
		SET @cont = 1
		SET @horasTotal = ''
		while @cont <=@contHasta
		begin
			SET @horas = 0
			select @horas=sum(a.hours) from art_timesheet a where a.sub_task_id=@idsubtarea AND a.user_id=@uid and task_type=2 and a.task_for_date=CAST('2016-'+CONVERT(varchar(10), @mes)+'-'+CAST(@cont AS varchar(10)) AS DATETIME2)
			print @horas
			if @horas>0 
			begin				
				set @horasTotal=@horasTotal+CAST(@horas AS varchar(10))
				print('tiene horas')
				print(@horasTotal)
			end
			else
			begin
				set @horasTotal=@horasTotal+'0'
				print('no tiene horas')
			end
			set @cont = @cont+1
			if @cont<=31 
			begin
				set @horasTotal=@horasTotal+';'
			end
		end
		insert into @programas values('-','Actividades','Miscelaneas',@subtarea,@horasTotal)
		fetch next from SUBTAREASEXTRA 
		into @idsubtarea,@subtarea 
	END
	close SUBTAREASEXTRA 
	deallocate SUBTAREASEXTRA


	SELECT * FROM @programas

END

