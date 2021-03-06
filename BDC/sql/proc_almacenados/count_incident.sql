USE [art_live]
GO
/****** Object:  StoredProcedure [art].[count_incident]    Script Date: 22-01-2016 10:51:56 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Marcelo Lomeña
-- Create date: 13/10/2015
-- Description:	Lista de incidencias para JQGrid
-- =============================================
ALTER PROCEDURE [art].[count_incident] 
@Json NVARCHAR(MAX)
AS
BEGIN
	-- SET NOCOUNT ON added to prevent extra result sets from
	-- interfering with SELECT statements.

	SET NOCOUNT ON;

	DECLARE @res TABLE(
		[incident_id] INT
      ,[configuration_id] INT
      ,[program_id] INT
      ,[date_creation] DATE
      ,[ir_number] VARCHAR(10)
	  ,[alm_number] VARCHAR(20)
      ,[user_sponsor_id] INT
      ,[brief_description] VARCHAR(MAX)
      ,[extended_description] VARCHAR(MAX)
      ,[severity_id] INT
      ,[date_end] DATE
      ,[task_owner_id] INT
      ,[user_creation_id] INT
      ,[task_id] INT
      ,[task_title] VARCHAR(MAX)
	  ,[configuration_name] VARCHAR(MAX)
	  ,[program_name] VARCHAR(MAX)
	  ,[sponsor_name] VARCHAR(MAX)
	  ,[owner_name] VARCHAR(MAX)
	  ,[note] VARCHAR(MAX)
	  ,[severity_description] VARCHAR(MAX)
	  ,[dId] INT
	  ,[department] VARCHAR(MAX)
	  ,[status_id] INT
	  ,[status_name] VARCHAR(MAX)
	)

	INSERT INTO @res
	 (incident_id,
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
	 task_title,
	 configuration_name,
	 program_name,
	 sponsor_name,
	 owner_name,
	 note,
	 severity_description,
	 dId,
	 department,
	 status_id,
	 status_name
	) 
	EXEC art.list_incident 0,0,@Json

	SELECT count(*) FROM @res

END





