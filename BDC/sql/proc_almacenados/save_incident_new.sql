USE [art_live]
GO
/****** Object:  StoredProcedure [art].[save_incident]    Script Date: 16-02-2016 12:43:12 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Marcelo Lomeña
-- Create date: 18/10/2015
-- Description:	Ingreso de una incidencia
-- =============================================
ALTER PROCEDURE [art].[save_incident] 
	(
      @configuration_id int,
      @program_id int,
      @date_creation char(10),
      @ir_number int,
	  @alm_number varchar(20),
      @user_sponsor_id varchar(255),
      @brief_description nvarchar(1000),
      @extended_description nvarchar(1000),
      @severity_id int,
      @date_end char(10),
      @task_owner_id int,
      @user_creation_id int
	)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @ERROR_CODE INT = 0
	DECLARE @ERROR_TEXT VARCHAR(100) = 'SIN ERROR'
	DECLARE @insert_task_id INT = 0
	DECLARE @project_id INT
	DECLARE @Random INT
	DECLARE @Upper INT = 1
	DECLARE @Lower INT = 9999

	DECLARE @task_discipline_id INT = 0
	DECLARE @user_role INT = 0
	DECLARE @task_type INT = 0
	DECLARE @configuration_project_mode INT = 0
	DECLARE @incident_status_id INT = 0
	DECLARE @incident_id INT = 0
	DECLARE @program_stage_id INT = 0
	DECLARE @configuration_deliverable INT = 0
	DECLARE @task_title NVARCHAR(64)
	DECLARE @uname varchar(50)
	DECLARE @password NVARCHAR(200) = N'$2a$10$GAAmbU/Wb/uIOtXvn53AmOLWd/st6HV/CUrUlBCBCyQd8KT4CBFyS'
	DECLARE @verify_code NVARCHAR(100) = N'4a89f4e5-d2ee-4889-9ce6-1030b8f37637'
	DECLARE @uid INT = 0
	--DECLARE @c_new_task_depend nvarchar(50)
	--DECLARE @c_id_real int = 0
	--DECLARE @c_id_tpl int = 0

	--DECLARE @conversion TABLE(
	--	id_real int,
	--	id_plantilla int
	--)

	IF EXISTS (SELECT * FROM art_project_master where program=@program_id AND @date_creation between start_date and final_release_date)
	BEGIN

		BEGIN TRY
			SELECT @Random = ROUND(((@Upper - @Lower -1) * RAND() + @Lower), 0)

			--SELECT @uname=LEFT(emailTrab, CHARINDEX('@', emailTrab) - 1 ) FROM RecursosHumanos WHERE nombre = RTRIM(@user_sponsor_id)
			SELECT @uname=LEFT(emailTrab, CHARINDEX('@', emailTrab) - 1 ) FROM RecursosHumanos WHERE (SELECT RTRIM(LTRIM(nombre)) + ' ' + RTRIM(LTRIM(apellido)))=@user_sponsor_id AND periodo=(select max(periodo) from RecursosHumanos)

			IF NOT EXISTS (SELECT * FROM art_user WHERE uname=@uname AND status=1)
			BEGIN
				INSERT art_user (uname,password,first_name,last_name,division,gerencia,department,email,birth_date,office_number,joining_date, isadmin,isverify,verify_code,verify_date,status,added_date,rut_number,rate_hour,contact_number,user_type,work_hours,bonus_app,designation,user_profile) VALUES
			 (@uname,@password,LEFT(@user_sponsor_id,50),LEFT(@user_sponsor_id,50),1,1,100, @uname+'@bancochile.cl',GETDATE(),'9999999999',GETDATE(),1,1,@verify_code,GETDATE(),1,GETDATE(),'Default_RUT',10,'26532273',1,8,0,NULL,'bu')
				SET @uid=IDENT_CURRENT('art_user')
			END
			BEGIN
				SELECT @uid=uid FROM art_user WHERE uname=@uname AND status=1
			END
			
			SELECT @task_discipline_id = task_discipline_id,
					@user_role = user_role,
					@task_type = task_type,
					--@configuration_project_mode = configuration_project_mode,
					@incident_status_id = incident_status_id,
					@program_stage_id = program_stage_id,
					@configuration_deliverable = configuration_deliverable
			 FROM art_incident_configuration WHERE configuration_id=@configuration_id

			 SELECT @configuration_project_mode=project_mode FROM art_incident_severity
			 WHERE severity_id=@severity_id

			BEGIN TRAN 

				SELECT @project_id=pId FROM art_project_master where program=@program_id AND @date_creation between start_date and final_release_date

				INSERT art_task
				(pId,
				task_title,
				task_code,
				plan_start_date,
				plan_end_date,
				task_description,
				plan_time,
				creation_date,
				task_status,
				status,
				owner,
				task_discipline,
				completion_percentage,
				stage,
				user_role,
				deliverable,
				task_type,
				is_active
				) VALUES
				(@project_id,
				'IR' + CAST(@ir_number AS VARCHAR) + ' ' + @brief_description,
				'SYS' + CAST(@Random AS VARCHAR),
				CAST(@date_creation AS DATETIME2(0)),
				CAST(@date_end AS DATETIME2(0)),
				@extended_description,
				0,
				GETDATE(),
				0,
				1,
				@task_owner_id,
				@task_discipline_id,
				0,
				@program_stage_id,
				@user_role,
				@configuration_deliverable,
				@task_type,
				1
				)
							
				SET @insert_task_id=IDENT_CURRENT('art_task')
				SET @task_title=' IR' + CAST(@ir_number AS VARCHAR)
				--@fecha_inicio varchar(10), @id_platilla int, @tipo int, @title nvarchar(64), @id_tarea int, @extended_description nvarchar(255), @uid int
				EXECUTE art.incident_pert @date_creation,@configuration_project_mode,2, @task_title,@insert_task_id,''

				/*
				INSERT art_sub_task
				(task_id
				  ,title 
				  ,description
				  ,plan_start_date
				  ,plan_end_date
				  ,actual_start_date
				  ,priority
				  ,added_date
				  ,note
				  ,status
				  ,sub_task_depend
				  ,is_deleted
				  ,catalogue_id
				) OUTPUT inserted.sub_task_id,CAST(inserted.sub_task_depend AS int) INTO @conversion
				SELECT @insert_task_id
					  ,task_title + ' IR' + CAST(@ir_number AS VARCHAR)
					  ,task_description
					  ,@date_creation
					  ,@date_end
					  ,@date_creation
					  ,0
					  ,@date_creation
					  ,'NA'
					  ,0
					  ,tId
					  ,1
					  ,catalogue_service
				FROM art_generic_task where task_mode=@configuration_project_mode

				DECLARE CurSplit CURSOR FOR SELECT id_real,id_plantilla FROM @conversion
				OPEN CurSplit
				FETCH NEXT FROM CurSplit INTO @c_id_real,@c_id_tpl
				WHILE @@fetch_status = 0
				BEGIN

				SELECT @c_task_depend=task_depend FROM art_generic_task WHERE tId=@c_id_tpl AND
				 is_active=1 AND task_mode=@configuration_project_mode
	
				SELECT @c_new_task_depend=
				  STUFF(
					(
					SELECT ',' + CAST(id_real AS VARCHAR(10)) FROM @conversion WHERE id_plantilla IN ( SELECT CAST(Item AS int) FROM dbo.Split(@c_task_depend,',') )
					FOR XML PATH('')
					), 1, 1, '' )


				UPDATE art_sub_task SET sub_task_depend=@c_new_task_depend WHERE sub_task_id=@c_id_real


					FETCH NEXT FROM CurSplit INTO @c_id_real,@c_id_tpl
				END
				CLOSE CurSplit
				DEALLOCATE CurSplit
				*/

				INSERT art_incident
				(
				  configuration_id,
				  program_id,
				  date_creation,
				  ir_number,
				  alm_number,
				  user_sponsor_id,
				  brief_description,
				  extended_description,
				  severity_id,
				  date_end,
				  task_owner_id,
				  user_creation_id,
				  task_id,
				  is_deleted
				) VALUES
				(
				  @configuration_id,
				  @program_id,
				  @date_creation,
				  @ir_number,
				  @alm_number,
				  @uid,--@user_sponsor_id
				  @brief_description,
				  @extended_description,
				  @severity_id,
				  @date_end,
				  @task_owner_id,
				  @user_creation_id,
				  @insert_task_id,
				  1
				) 

				SET @incident_id=IDENT_CURRENT('art_incident')

				INSERT art_incident_log VALUES (@incident_id,@incident_status_id,@user_creation_id,GETDATE(),'inicio')

				SELECT @ERROR_CODE error_code,@ERROR_TEXT error_text, @insert_task_id task_id
			COMMIT TRAN
		END TRY

		BEGIN CATCH
			ROLLBACK TRAN
			SET @ERROR_CODE = 1
			--SET @ERROR_TEXT = 'NO SE PUDO INGRESAR UNA INCIDENCIA : ' + CAST(@@TRANCOUNT AS VARCHAR)
			SET @ERROR_TEXT = ERROR_MESSAGE()
			SELECT @ERROR_CODE error_code,@ERROR_TEXT error_text, @insert_task_id task_id 
		END CATCH

	END
	ELSE
	BEGIN
			SET @ERROR_CODE = 1
			SET @ERROR_TEXT = 'NO EXISTE UN PROYECTO'
			SELECT @ERROR_CODE error_code,@ERROR_TEXT error_text, @insert_task_id task_id 
	END
	
END





