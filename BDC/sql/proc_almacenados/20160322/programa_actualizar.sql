USE [art_live]
GO
/****** Object:  StoredProcedure [art].[programa_actualizar]    Script Date: 28-03-2016 11:11:27 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
ALTER PROCEDURE [art].[programa_actualizar] 
	@program_id INT, 
	@program_name nvarchar(1024), 
	@program_description nvarchar(2048),
	@planned_hours INT,
	@sap_code INT,
	@demand_manager varchar(64),
	@program_manager varchar(64),
	@program_type INT,
	@sub_type INT,
	@workflow_status INT,
	@impact_type INT,
	@initiation_planned_date varchar(10),
	@release_date varchar(10),
	@closure_date varchar(10)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @ERROR_CODE INT = 0
	DECLARE @ERROR_TEXT VARCHAR(100) = 'SIN ERROR'
	DECLARE @program_ret INT = -1
	DECLARE @uid_demand_manager INT
	DECLARE @demand_manager_last_name VARCHAR(128)
	DECLARE @uid_program_manager INT 
	BEGIN TRY


	BEGIN TRAN 

			SELECT @uid_demand_manager=uid FROM art_user WHERE uname=@demand_manager

			SELECT @uid_program_manager=uid FROM art_user WHERE uname=@program_manager

			UPDATE art_program SET 
			  program_type=@program_type
			  ,program_sub_type=@sub_type
			  ,program_name=@program_name
			  ,program_description=@program_description
			  ,work_flow_status=@workflow_status
			  ,demand_manager=@uid_demand_manager
			  ,program_manager=@uid_program_manager
			  ,devison=1
			  ,management=2
			  ,department=118
			  ,impact_type=@impact_type
			  ,business_line='Not Needed'
			  ,sap_code=@sap_code
			  ,completion_percentage=0
			  ,initiation_planned_date=@initiation_planned_date
			  ,closure_date=@closure_date
			  ,release_date=@release_date
			  ,planned_hours=@planned_hours
			WHERE program_id=@program_id

			COMMIT TRAN

			SELECT @ERROR_CODE error_code,@ERROR_TEXT error_text, @program_id id 

		END TRY

		BEGIN CATCH
			ROLLBACK TRAN
			SET @ERROR_CODE = ERROR_NUMBER()
			SET @ERROR_TEXT = ERROR_MESSAGE()
			SELECT @ERROR_CODE error_code,@ERROR_TEXT error_text, @program_id id 
		END CATCH

END


