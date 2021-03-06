USE [art_live4]
GO
/****** Object:  StoredProcedure [art].[save_incident_member]    Script Date: 16-03-2016 10:55:28 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Marcelo Lomeña
-- Create date: 08/11/2015
-- Description:	Ingreso de horas
-- =============================================
ALTER PROCEDURE [art].[save_incident_member] 
	( @name varchar(100),
	  @task_for_date varchar(10),
	  @nota varchar(1000),
	  @planeadas float,
      @ingresadas float,
      @sub_task_id int,
      @user_creation_id int
	)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @ERROR_CODE INT = 0
	DECLARE @ERROR_TEXT VARCHAR(100) = 'SIN ERROR'
	DECLARE @pId INT = 0
	DECLARE @uid INT = 0
	DECLARE @task_id INT = 0
	DECLARE @insert_timesheet_id INT = 0
	DECLARE @program_id INT  = 0
	DECLARE @role_id INT = 9 /*EN DURO*/
	--DECLARE @password NVARCHAR(200) = N'$2a$10$GAAmbU/Wb/uIOtXvn53AmOLWd/st6HV/CUrUlBCBCyQd8KT4CBFyS'
	--DECLARE @verify_code NVARCHAR(100) = N'4a89f4e5-d2ee-4889-9ce6-1030b8f37637'
	--DECLARE @uname varchar(50)

	/*
	IF NOT EXISTS (SELECT * FROM art_user WHERE first_name + ' ' + last_name = @name)
	BEGIN

		SELECT @uname=LEFT(emailTrab, CHARINDEX('@', emailTrab) - 1 ) FROM RecursosHumanos WHERE nombre = @name

		INSERT art_user (uname,password,first_name,last_name,division,gerencia,department,email,birth_date,office_number,joining_date, isadmin,isverify,verify_code,verify_date,status,added_date,rut_number,rate_hour,contact_number,user_type,work_hours,bonus_app,designation,user_profile) VALUES
			 (@uname,@password,@name,@name,1,1,100, @uname+'@bancochile.cl',GETDATE(),'9999999999',GETDATE(),1,1,@verify_code,GETDATE(),1,GETDATE(),'Default_RUT',10,'26532273',1,8,0,NULL,'bu')
				SET @uid=IDENT_CURRENT('art_user')
		SET @uid=IDENT_CURRENT('art_user')
	END
	ELSE
	BEGIN
		SELECT @uid=uid FROM art_user WHERE first_name + ' ' + last_name = @name
	END
	*/

	SELECT @uid=uid FROM art_user WHERE first_name + ' ' + last_name = @name

	IF @uid=0
	BEGIN
		SELECT -1 error_code,'usuario modificado' error_text, 0 task_id 
	END
	ELSE
	BEGIN

		SELECT @task_id=task_id FROM art_sub_task WHERE sub_task_id = @sub_task_id

		SELECT @pId=pId FROM art_task WHERE tId=@task_id

		SELECT @program_id=program FROM art_project_master WHERE pId=@pId
		
			BEGIN TRY

				BEGIN TRAN 

				IF NOT EXISTS (SELECT * FROM art_program_members where program_id=@program_id AND member_id = @uid AND is_active  = 0)
				BEGIN
					INSERT art_program_members
					([program_id]
					,[role_id]
					,[member_id]
					,[is_active]) VALUES
					 (@program_id,
					 @role_id,
					 @uid,
					 0
					 ) 
				END

				INSERT art_sub_task_allocation 
				([sub_task_id]
				  ,[task_id]
				  ,[pId]
				  ,[user_id]
				  ,[estimated_time]
				  ,[status]
				  ,[is_deleted]
				  ) VALUES 
				  (
				  @sub_task_id,
				  @task_id,
				  @pId,
				  @uid,
				  @planeadas,
				  0,
				  1
				  )
				  IF((select plan_time from art_task where tId=@task_id)<@planeadas)
				  BEGIN
					update art_task set plan_time = plan_time+@planeadas where tid=@task_id
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

					SET @insert_timesheet_id=IDENT_CURRENT('art_timesheet')
				END

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
END







