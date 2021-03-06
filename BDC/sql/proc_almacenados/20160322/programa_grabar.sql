USE [art_live]
GO
/****** Object:  StoredProcedure [art].[programa_grabar]    Script Date: 28-03-2016 10:46:20 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		<Author,,Name>
-- Create date: <Create Date,,>
-- Description:	<Description,,>
-- =============================================
ALTER PROCEDURE [art].[programa_grabar] 
	-- Add the parameters for the stored procedure here
	@program_name nvarchar(1024), 
	@program_description nvarchar(2048),
	@planned_hours int,
	@sap_code int,
	@demand_manager varchar(64),
	@program_manager varchar(64),
	@program_type int,
	@sub_type int,
	@workflow_status int,
	@impact_type int,
	@initiation_planned_date varchar(10),
	@release_date varchar(10),
	@closure_date varchar(10)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @ERROR_CODE INT = 0
	DECLARE @ERROR_TEXT VARCHAR(100) = 'SIN ERROR'
	DECLARE @program_id INT = -1
	DECLARE @uid_demand_manager INT
	DECLARE @uid_program_manager INT 
	DECLARE @pcode INT 
	DECLARE @cp INT 

	BEGIN TRY

	SELECT @cp=COUNT(*) + 1 FROM art_program WHERE creation_date  between DATEADD(mm,DATEDIFF(mm,0,GETDATE()),0) AND DATEADD(ms,-3,DATEADD(mm,0,DATEADD(mm,DATEDIFF(mm,0,GETDATE())+1,0)))

	SELECT @pcode=LEFT(CONVERT(varchar, GetDate(),112),6) + RIGHT(REPLICATE('0', 2) + CAST(@cp AS VARCHAR(2)), 2) 

	BEGIN TRAN 

			SELECT @uid_demand_manager=uid FROM art_user WHERE uname=@demand_manager

			SELECT @uid_program_manager=uid FROM art_user WHERE uname=@program_manager

			INSERT art_program (
			  [program_type]
			  ,[program_sub_type]
			  ,[program_name]
			  ,[program_code]
			  ,[program_description]
			  ,[work_flow_status]
			  ,[demand_manager]
			  ,[program_manager]
			  ,[devison]
			  ,[management]
			  ,[department]
			  ,[impact_type]
			  ,[business_line]
			  ,[sap_code]
			  ,[completion_percentage]
			  ,[creation_date]
			  ,[initiation_planned_date]
			  ,[closure_date]
			  ,[release_date]
			  ,[planned_hours]
			  ,[is_active]

			) VALUES
			(
			@program_type,
			@sub_type,
			@program_name,
			@pcode,
			@program_description,
			@workflow_status,
			@uid_demand_manager,
			@uid_program_manager,
			1,
			2,
			118,
			@impact_type,
			'Not Needed',
			@sap_code,
			0,
			GETDATE(),
			@initiation_planned_date,
			@closure_date,
			@release_date,
			@planned_hours,
			1
			)

			SET @program_id=IDENT_CURRENT('art_program')

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


