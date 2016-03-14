USE [art_live]
GO
/****** Object:  StoredProcedure [art].[update_task]    Script Date: 14-03-2016 14:07:00 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Cristian Guevara
-- Create date: 14/03/2016
-- Description:	Edición de tarea
-- =============================================
CREATE PROCEDURE [art].[update_task] 
	-- Add the parameters for the stored procedure here
	@tId int,
	@pId int,
    @task_title varchar(1000),
    @task_code varchar(1000),
    @plan_start_date VARCHAR(10),
    @plan_end_date VARCHAR(10),
    @task_description varchar(1000),
    @plan_time decimal(10,2),
    @creation_date VARCHAR(10),
    @task_status int,
    @status int ,
    @owner int,
  	@task_discipline int,
  	@completion_percentage decimal(10,2),
  	@remark varchar(1000),
  	@task_depend varchar(500),
  	@dependencies_type int,
  	@stage int,
  	@user_role int,
  	@deliverable int

AS
BEGIN
	update art_task
		set 
		pId =  @pId,
		task_title=@task_title,
		task_code =@task_code,
		plan_start_date =@plan_start_date,
		plan_end_date =@plan_end_date,
		task_description = @task_description,
		plan_time=@plan_time,
		creation_date = @creation_date,
		task_status=@task_status,
		status = @status ,
		owner = @owner,
  		task_discipline = @task_discipline,
  		completion_percentage = @completion_percentage,
  		remark = @remark,
  		task_depend=@task_depend,
  		dependencies_type=@dependencies_type,
  		stage=@stage,
  		user_role=@user_role,
  		deliverable=@deliverable
		where tId = @tId

	update art_incident set task_owner_id=@owner where task_id=@tId
	update art_incident set brief_description=@task_title where task_id=@tId
	update art_incident set extended_description=@task_description where task_id=@tId
	update art_incident set date_creation=@plan_start_date where task_id=@tId
	update art_incident set date_end=@plan_end_date where task_id=@tId

	

END
GO
