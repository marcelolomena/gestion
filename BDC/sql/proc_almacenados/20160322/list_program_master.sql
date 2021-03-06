USE [art_live]
GO
/****** Object:  StoredProcedure [art].[list_program_master]    Script Date: 24-03-2016 16:38:50 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Marcelo Lomeña
-- Create date: 09/11/2015
-- Description:	Busqueda recursiva de programas
-- =============================================
ALTER PROCEDURE [art].[list_program_master] 
	@uid INT, 
	@PageSize iNT,
	@page INT,
	@order VARCHAR(255),
	@json VARCHAR(MAX)
AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @email VARCHAR(100)
	DECLARE @rol VARCHAR(3)
	DECLARE @sql NVARCHAR(MAX) = ''
	DECLARE @ParmDefinition1 NVARCHAR(MAX) = N'@order varchar(255), @PageSize INT, @page INT'
	DECLARE @ParmDefinition2 NVARCHAR(MAX) = N'@periodo INT,@email varchar(255), @order varchar(255), @PageSize int, @page INT'
	DECLARE @ParmDefinition3 NVARCHAR(MAX) = N'@uid INT,  @order varchar(255), @PageSize INT, @page int'
	DECLARE @csub INT
	DECLARE @periodo INT


	SELECT @email=email,@rol=RTRIM(CAST(user_profile AS VARCHAR)) FROM art_user WHERE uid=@uid

	IF @rol = 'su' OR @rol = 'cl'
	BEGIN 
			  SET @sql =N'SELECT  
					X.program_id,
					X.dId,
					X.division,
					X.program_type_id,
					X.program_type,
					X.sub_type,
					X.workflow_status,
					X.work_flow_status,
					X.program_name,
					ISNULL(X.program_description,'''') program_description,
					ISNULL(X.program_code,0) program_code,
					X.initiation_planned_date,
					X.closure_date,
					X.release_date,
					ISNULL(X.planned_hours,0) planned_hours,
					ROUND(ISNULL(f.pai,0),2) pai,
					ROUND(ISNULL(f.pae,0),2) pae,
					ROUND(ISNULL(f.spi,0),2) spi,
					ROUND(ISNULL(f.cpi,0),2) cpi,
					X.impact_type,
					X.impact_type_id,
					X.sap sap_number,
					X.sap_code,
					X.uname_demand,
					X.demand_manager_name,
					X.uname_program,
					X.program_manager_name
					FROM (
							SELECT a.program_id,
							d.dId,
							d.division,
							t1.id program_type_id,
							t1.program_type,
							t2.sub_type,
							w.workflow_status,
							a.work_flow_status,
							a.program_name,
							a.program_description,
							a.program_code,
							a.initiation_planned_date,
							a.closure_date,
							a.release_date,
							a.planned_hours,
							i.impact_type,
							i.id impact_type_id,
							(SELECT STUFF(
								(SELECT CAST('','' AS VARCHAR(MAX)) + CAST(sap_number AS VARCHAR(MAX))
								FROM art_program_sap_master WHERE is_active=1 AND program_id = a.program_id
								ORDER BY sap_number
								FOR XML PATH('''')
								), 1, 1, '''') ) sap,
							a.sap_code,
							u1.uname uname_demand,
							u1.first_name + '' '' + u1.last_name demand_manager_name,
							u2.uname uname_program,
							u2.first_name + '' '' + u2.last_name program_manager_name
						  FROM 
						  art_program a,
						  art_program_type t1,
						  art_program_sub_type t2,
						  art_program_workflow_status w,
						  art_division_master d,
						  art_program_impact_type i,
						  art_user u1,
						  art_user u2
						WHERE
						 a.program_type = t1.id AND
						 a.program_sub_type = t2.id AND
						 a.work_flow_status = w.id AND
						 a.devison = d.dId AND
						 a.impact_type=i.id AND
						 a.demand_manager=u1.uid AND
						 a.program_manager=u2.uid AND
		 				 a.is_active = 1 AND
						 t1.is_deleted = 0 AND
						 t2.is_deleted = 0 AND
						 d.is_deleted  = 0 
					 ) X
			CROSS APPLY dbo.CalculaIndicadoresDePrograma(X.program_id) f 
			WHERE X.program_id = f.program_id '

			IF LEN(@json) = 0
			BEGIN
				SET @sql = @sql + 'AND (X.work_flow_status=1 OR X.work_flow_status=3 OR X.work_flow_status=4 OR X.work_flow_status=5) '
			END

			IF LEN(@json)>0
			BEGIN
				SET @sql = @sql + ' AND ' + @json

				SET @sql = LEFT(@sql, LEN(@sql) - 4)
			END

			IF LEN(@order)>0
			BEGIN
				SET @sql = @sql + 'ORDER BY ' + @order
			END


			IF @PageSize > 0 AND @page > 0
			BEGIN
				SET @sql = @sql + ' OFFSET @PageSize * (@page - 1) ROWS FETCH NEXT @PageSize ROWS ONLY'
			END

			SET @sql = @sql + ' OPTION (FORCE ORDER)'

			--PRINT @sql

			EXEC sp_executesql  @sql,@ParmDefinition1,@order,@PageSize,@page
	END
	ELSE
	BEGIN
		SELECT @csub=dbo.CantidadSubalternos(@uid)
		IF @csub>1 --es jefe
		BEGIN
			  SELECT @periodo=MAX(PERIODO) FROM RecursosHumanos
			  SET @sql =N'WITH tblSubalternos AS
						(
						  SELECT LEFT(emailTrab, CHARINDEX(''@'', emailTrab) -1 ) uname,numRut,periodo FROM RecursosHumanos WHERE emailTrab = @email AND periodo=@periodo AND emailTrab IS NOT NULL 
						  UNION ALL
							SELECT LEFT(emailTrab, CHARINDEX(''@'', emailTrab) -1 ) uname,RecursosHumanos.numRut,RecursosHumanos.periodo 
							FROM RecursosHumanos JOIN tblSubalternos ON RecursosHumanos.rutJefe = tblSubalternos.numRut AND 
							RecursosHumanos.periodo=@periodo AND tblSubalternos.periodo=@periodo AND RecursosHumanos.emailTrab IS NOT NULL AND LEN(RecursosHumanos.emailTrab)>1
						) SELECT 
					X.program_id,
					X.dId,
					X.division,
					X.program_type_id,
					X.program_type,
					X.sub_type,
					X.workflow_status,
					X.program_name,
					ISNULL(X.program_description,'''') program_description,
					ISNULL(X.program_code,0) program_code,
					X.initiation_planned_date,
					X.closure_date,
					X.release_date,
					ISNULL(X.planned_hours,0) planned_hours,
					ROUND(ISNULL(f.pai,0),2) pai,
					ROUND(ISNULL(f.pae,0),2) pae,
					ROUND(ISNULL(f.spi,0),2) spi,
					ROUND(ISNULL(f.cpi,0),2) cpi,
					X.impact_type,
					X.impact_type_id,
					X.sap sap_number,
					X.sap_code,
					X.uname_demand,
					X.demand_manager_name,
					X.uname_program,
					X.program_manager_name
					FROM (
							SELECT DISTINCT a.program_id,
							d.dId,
							d.division,
							t1.id program_type_id,
							t1.program_type,
							t2.sub_type,
							w.workflow_status,
							a.program_name,
							a.program_description,
							a.program_code,
							a.initiation_planned_date,
							a.closure_date,
							a.release_date,
							a.planned_hours,
							i.impact_type,
							i.id impact_type_id,
							(SELECT STUFF(
								(SELECT CAST('','' AS VARCHAR(MAX)) + CAST(sap_number AS VARCHAR(MAX))
								FROM art_program_sap_master WHERE is_active=1 AND program_id = a.program_id
								ORDER BY sap_number
								FOR XML PATH('''')
								), 1, 1, '''') ) sap,
							a.sap_code,
							u1.uname uname_demand,
							u1.first_name + '' '' + u1.last_name demand_manager_name,
							u2.uname uname_program,
							u2.first_name + '' '' + u2.last_name program_manager_name
						  FROM
						  art_user u,
						  art_program_members m,
						  tblSubalternos, 
						  art_program a,
						  art_program_type t1,
						  art_program_sub_type t2,
						  art_program_workflow_status w,
						  art_division_master d,
						  art_program_impact_type i,
						  art_user u1,
						  art_user u2
						WHERE
						 u.uid=m.member_id AND
				         a.program_id=m.program_id AND
						 tblSubalternos.uname=u.uname AND
						 tblSubalternos.periodo=@periodo AND
						 a.program_type = t1.id AND
						 a.program_sub_type = t2.id AND
						 a.work_flow_status = w.id AND
						 a.devison = d.dId AND
						 a.impact_type=i.id AND
 						 a.demand_manager=u1.uid AND
						 a.program_manager=u2.uid AND
						 m.is_active = 0 AND
		 				 a.is_active = 1 AND
						 t1.is_deleted = 0 AND
						 t2.is_deleted = 0 AND
						 d.is_deleted  = 0
					 ) X
			CROSS APPLY dbo.CalculaIndicadoresDePrograma(X.program_id) f '	
			
			IF LEN(@json) = 0
			BEGIN
				SET @sql = @sql + 'AND (X.work_flow_status=1 OR X.work_flow_status=3 OR X.work_flow_status=4 OR X.work_flow_status=5) '
			END					  

			IF LEN(@json)>0
			BEGIN
				SET @sql = @sql + ' AND ' + @json

				SET @sql = LEFT(@sql, LEN(@sql) - 4)
			END

			IF LEN(@order)>0
			BEGIN
				SET @sql = @sql + 'ORDER BY ' + @order
			END
	
			IF @PageSize > 0 AND @page > 0
			BEGIN
				SET @sql = @sql + ' OFFSET @PageSize * (@page - 1) ROWS FETCH NEXT @PageSize ROWS ONLY'
			END

			SET @sql = @sql + ' OPTION(MAXRECURSION 32767)'

			--PRINT @email
			--PRINT @sql
			EXEC sp_executesql  @sql,@ParmDefinition2,@periodo,@email,@order,@PageSize,@page

		END
		ELSE IF @csub=1 /*No es jefe*/
		BEGIN
			SET @sql =N'SELECT 
					X.program_id,
			    	X.dId,
					X.division,
					X.program_type_id,
					X.program_type,
					X.sub_type,
					X.workflow_status,
					X.program_name,
					ISNULL(X.program_description,'''') program_description,
					ISNULL(X.program_code,0) program_code,
					X.initiation_planned_date,
					X.closure_date,
					X.release_date,
					ISNULL(X.planned_hours,0) planned_hours,
					ROUND(ISNULL(f.pai,0),2) pai,
					ROUND(ISNULL(f.pae,0),2) pae,
					ROUND(ISNULL(f.spi,0),2) spi,
					ROUND(ISNULL(f.cpi,0),2) cpi,
					X.impact_type,
					X.impact_type_id,
					X.sap sap_number,
					X.sap_code,
					X.uname_demand,
					X.demand_manager_name,
					X.uname_program,
					X.program_manager_name
			 FROM (SELECT DISTINCT 
					a.program_id,
					d.dId,
					d.division,
					t1.id program_type_id,
					t1.program_type,
					t2.sub_type,
					w.workflow_status,
					a.program_name,
					a.program_description,
					a.program_code,
					a.initiation_planned_date,
					a.closure_date,
					a.release_date,
					a.planned_hours,
					i.impact_type,
					i.id impact_type_id,
							(SELECT STUFF(
								(SELECT CAST('','' AS VARCHAR(MAX)) + CAST(sap_number AS VARCHAR(MAX))
								FROM art_program_sap_master WHERE is_active=1 AND program_id = a.program_id
								ORDER BY sap_number
								FOR XML PATH('''')
								), 1, 1, '''') ) sap,
					a.sap_code,
					u1.uname uname_demand,
					u1.first_name + '' '' + u1.last_name demand_manager_name,
					u2.uname uname_program,
					u2.first_name + '' '' + u2.last_name program_manager_name
				  FROM 
				  art_program a,
				  art_user u,
				  art_program_members m,
				  art_program_type t1,
				  art_program_sub_type t2,
				  art_program_workflow_status w,
				  art_division_master d,
				  art_program_impact_type i,
				  art_user u1,
				  art_user u2
				WHERE
				 u.uid=m.member_id AND
				 a.program_id=m.program_id AND
				 a.program_type = t1.id AND
				 a.program_sub_type = t2.id AND
				 a.work_flow_status = w.id AND
				 a.devison = d.dId AND
				 a.impact_type=i.id AND
		 		 a.is_active = 1 AND
				 m.is_active  = 0 AND
				 a.demand_manager=u1.uid AND
				 a.program_manager=u2.uid AND
				 t1.is_deleted = 0 AND
				 t2.is_deleted = 0 AND
				 d.is_deleted  = 0 AND 
				 u.uid=@uid) X 
			CROSS APPLY dbo.CalculaIndicadoresDePrograma(X.program_id) f
			WHERE X.program_id = f.program_id '

			IF LEN(@json) = 0
			BEGIN
				SET @sql = @sql + 'AND (X.work_flow_status=1 OR X.work_flow_status=3 OR X.work_flow_status=4 OR X.work_flow_status=5) '
			END

			IF LEN(@json)>0
			BEGIN
				SET @sql = @sql + ' AND ' + @json

				SET @sql = LEFT(@sql, LEN(@sql) - 4)
			END

			IF LEN(@order)>0
			BEGIN
				SET @sql = @sql + 'ORDER BY ' + @order
			END
	
			IF @PageSize > 0 AND @page > 0
			BEGIN
				SET @sql = @sql + ' OFFSET @PageSize * (@page - 1) ROWS FETCH NEXT @PageSize ROWS ONLY'
			END

			--print @sql
			
			EXEC sp_executesql  @sql,@ParmDefinition3,@uid,@order,@PageSize,@page
		END
	END
END



