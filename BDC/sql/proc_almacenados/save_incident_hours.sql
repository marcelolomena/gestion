USE [art_live4]
GO
/****** Object:  StoredProcedure [art].[save_incident_hours]    Script Date: 16-03-2016 10:55:25 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Marcelo Lomeña
-- Create date: 26/10/2015
-- Description:	Ingreso de horas
-- =============================================
ALTER PROCEDURE [art].[save_incident_hours] 
	( @task_for_date varchar(10),
	  @nota varchar(1000),
	  @planeadas float,
      @ingresadas float,
      @sub_task_id int,
      @task_id int,
      @uid int,
      @user_creation_id int
	)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @ERROR_CODE INT = 0
	DECLARE @ERROR_TEXT VARCHAR(100) = 'SIN ERROR'
	DECLARE @pId INT = 0
	DECLARE @insert_timesheet_id INT=0

	SELECT @pId=pId FROM art_task WHERE tId=@task_id
		
		BEGIN TRY

			BEGIN TRAN 

			IF EXISTS (SELECT * FROM art_sub_task_allocation WHERE sub_task_id=@sub_task_id AND task_id = @task_id AND user_id=@uid AND is_deleted = 1)
			BEGIN
				IF(SELECT estimated_time from art_sub_task_allocation WHERE sub_task_id=@sub_task_id AND task_id = @task_id AND user_id=@uid AND is_deleted = 1)<@planeadas
				BEGIN
					UPDATE art_task set plan_time=plan_time+(@planeadas-(SELECT estimated_time from art_sub_task_allocation WHERE sub_task_id=@sub_task_id AND task_id = @task_id AND user_id=@uid AND is_deleted = 1))
				END
				UPDATE art_sub_task_allocation SET estimated_time=@planeadas WHERE sub_task_id=@sub_task_id AND task_id = @task_id AND user_id=@uid
			END

		  IF @ingresadas > 0
		  BEGIN
			INSERT art_timesheet
			([task_type]
			  ,[task_for_date]
			  ,[sub_task_id]
			  ,[task_id]
			  ,[notes]
			  ,[pId]
			  ,[hours]
			  ,[user_id]
			  ,[is_deleted]
			  ,[booked_by]
			) VALUES 
			(1,
			@task_for_date,
			@sub_task_id,
			@task_id,
			@nota,
			@pId,
			@ingresadas,
			@uid,
			1,
			@user_creation_id
			)
			END

			SET @insert_timesheet_id=IDENT_CURRENT('art_timesheet')

			SELECT @ERROR_CODE error_code,@ERROR_TEXT error_text, @insert_timesheet_id task_id
			COMMIT TRAN
		END TRY

		BEGIN CATCH
			ROLLBACK TRAN
			SET @ERROR_CODE = 1

			SET @ERROR_TEXT = ERROR_MESSAGE()
			SELECT @ERROR_CODE error_code,@ERROR_TEXT error_text, @insert_timesheet_id task_id 
		END CATCH
	
END






