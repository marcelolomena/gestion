USE [art_live]
GO
/****** Object:  StoredProcedure [art].[update_incident]    Script Date: 17-03-2016 16:07:50 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Marcelo Lomeña
-- Create date: 18/10/2015
-- Description:	Ingreso de una incidencia
-- =============================================
ALTER PROCEDURE [art].[update_incident] 
	(
	  @severity_id int,
	  @date_end varchar(10),
      @incident_id int,
      @status_id int,
      @user_creation_id int,
      @note varchar(1000),
	  @configuration_id int,
	  @program_id int,
	  @task_owner_id int,
	  @alm_number int,
	  @user_sponsor_id varchar(255)

	)
AS
BEGIN
		SET NOCOUNT ON;
		DECLARE @ERROR_CODE INT = 0
		DECLARE @ERROR_TEXT VARCHAR(100) = 'SIN ERROR'
		DECLARE @insert_log_id INT = 0
		DECLARE @task_id INT = 0
		DECLARE @completo INT = 0 --no esta completo
		DECLARE @current_status_id INT = 0
		DECLARE @current_plan_end_date DATETIME
		DECLARE @new_plan_end_date DATETIME
		DECLARE @JSON VARCHAR(MAX)=''
		DECLARE @project_id INT
		DECLARE @uname varchar(50)
	DECLARE @password NVARCHAR(200) = N'$2a$10$GAAmbU/Wb/uIOtXvn53AmOLWd/st6HV/CUrUlBCBCyQd8KT4CBFyS'
	DECLARE @verify_code NVARCHAR(100) = N'4a89f4e5-d2ee-4889-9ce6-1030b8f37637'
	DECLARE @uid INT = 0
	DECLARE @nombre varchar(255)
	DECLARE @apellido varchar(255)

		IF EXISTS (SELECT * FROM art_project_master where program=@program_id)
		BEGIN
		BEGIN TRY
			BEGIN TRAN
			SET @uname = @user_sponsor_id

			SELECT @nombre = nombre, @apellido=apellido FROM RecursosHumanos WHERE emailTrab = @uname+'@bancochile.cl'

			IF NOT EXISTS (SELECT * FROM art_user WHERE uname=@uname AND status=1)
			BEGIN
				INSERT art_user (uname,password,first_name,last_name,division,gerencia,department,email,birth_date,office_number,joining_date, isadmin,isverify,verify_code,verify_date,status,added_date,rut_number,rate_hour,contact_number,user_type,work_hours,bonus_app,designation,user_profile) VALUES
			 (@uname,@password,@nombre,@apellido,1,1,100, @uname+'@bancochile.cl',GETDATE(),'9999999999',GETDATE(),1,1,@verify_code,GETDATE(),1,GETDATE(),'Default_RUT',10,'26532273',1,8,0,NULL,'bu')
				SET @uid=IDENT_CURRENT('art_user')
			END
			BEGIN
				SELECT @uid=uid FROM art_user WHERE uname=@uname AND status=1
			END


			SELECT @project_id=pId FROM art_project_master where program=@program_id

				SELECT @current_status_id=status_id FROM art_incident_status WHERE status_id=@status_id;
				SELECT @task_id=task_id FROM art_incident WHERE incident_id = @incident_id;
				SELECT @current_plan_end_date=plan_end_date from art_task WHERE tId=@task_id;
				SELECT @completo=IIF(100 * count(*)=CAST(SUM(completion_percentage) AS INT),1,0) FROM art_sub_task WHERE task_id=@task_id AND is_deleted=1 GROUP BY task_id;

				IF @current_status_id = 8 AND @completo = 0
					THROW 51000,'La incidencia no puede quedar resuelta mientras existan sub-tareas sin completar',1;

				UPDATE art_sub_task_allocation SET pId=@project_id WHERE task_id=@task_id;
				UPDATE art_sub_task_allocation_external SET pId=@project_id WHERE task_id=@task_id;
				UPDATE art_timesheet SET pId=@project_id WHERE task_id=@task_id;
				UPDATE art_timesheet_external SET pId=@project_id WHERE task_id=@task_id;
				UPDATE art_task SET pId=@project_id WHERE tId=@task_id;
				UPDATE art_task SET owner=@task_owner_id WHERE tId=@task_id;
				UPDATE art_incident SET configuration_id=@configuration_id WHERE incident_id = @incident_id;
				UPDATE art_incident SET program_id=@program_id WHERE incident_id = @incident_id;
				UPDATE art_incident SET task_owner_id=@task_owner_id WHERE incident_id = @incident_id;
				UPDATE art_incident SET alm_number=@alm_number WHERE incident_id = @incident_id;
				UPDATE art_incident SET user_sponsor_id=@uid WHERE incident_id = @incident_id;


				IF((select plan_end_date from art_task where tId=@task_id)!=@date_end)
				BEGIN
					
					INSERT art_baseline (change_set, user_id, changed_at, object_type, ref_id) VALUES 
					('[{"new_value":"'+CAST(convert(varchar, CAST(@date_end AS DATETIME2(0)), 105) AS VARCHAR(50))+'","fieldName":"Planned End Date","org_value":"'+CAST(convert(varchar, (select plan_end_date from art_task where tId=@task_id), 105) AS VARCHAR(50))+'"}]',@user_creation_id,GETDATE(),'task',@task_id)
				END

				UPDATE art_task SET plan_end_date = @date_end WHERE tId=@task_id;
				UPDATE art_incident SET severity_id = @severity_id,date_end=@date_end WHERE incident_id = @incident_id;

				

				INSERT art_incident_log VALUES (@incident_id,@status_id,@user_creation_id,GETDATE(),@note);
				SELECT @new_plan_end_date=plan_end_date from art_task WHERE tId=@task_id;

				/*
				SET @JSON ='[{"new_value":"' + 
				CONVERT(VARCHAR(10),@new_plan_end_date,105)  + 
				'","fieldName":"Planned End Date","org_value":"' + 
				CONVERT(VARCHAR(10),@current_plan_end_date,105) + '"}]' 

				INSERT art_baseline VALUES(@JSON,
				@user_creation_id,
				GETDATE(),
				'task',
				@task_id);
				*/
				SET @insert_log_id=IDENT_CURRENT('art_incident_log')

				SELECT @ERROR_CODE error_code,@ERROR_TEXT error_text, @insert_log_id task_id
			COMMIT TRAN
		END TRY

		BEGIN CATCH
			ROLLBACK TRAN
			SET @ERROR_CODE = 1
			SET @ERROR_TEXT = ERROR_MESSAGE()
			SELECT @ERROR_CODE error_code,@ERROR_TEXT error_text, @insert_log_id task_id 
		END CATCH
	END
	ELSE
	BEGIN
			SET @ERROR_CODE = 1
			SET @ERROR_TEXT = 'NO EXISTE UN PROYECTO'
			SELECT @ERROR_CODE error_code,@ERROR_TEXT error_text, @incident_id task_id 
	END
	
END





