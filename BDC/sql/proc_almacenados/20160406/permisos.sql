USE [art_live]
GO
/****** Object:  StoredProcedure [art].[permisos]    Script Date: 06-04-2016 18:16:54 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Cristian Guevara
-- Create date: 05/04/2016
-- Description:	Devuelve 1 si tiene permiso y 0 si no tiene permiso
-- =============================================
ALTER PROCEDURE [art].[permisos]
@tipo varchar(255),-- 1:Programa    2:Proyecto    3:Tarea    4: Subtarea
@id int,
@uid varchar(255)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @rolPrincipal varchar(4)
	DECLARE @idTarea int
	DECLARE @idProyecto int
	DECLARE @idPrograma int
	DECLARE @respuesta bit
	SET @respuesta = 0
	SELECT @rolPrincipal=user_profile FROM art_user WHERE uid=@uid

	IF(@rolPrincipal='su' OR @rolPrincipal='cl')
		BEGIN
			set @respuesta=1
		END
	IF(@tipo=1)
		BEGIN
			IF EXISTS(SELECT * from art_program where demand_manager=@uid AND program_id=@id) set @respuesta=1
		END
	IF(@tipo=2)
		BEGIN
			SELECT @idPrograma=program from art_project_master where pId=@id
			IF EXISTS(SELECT * from art_program where demand_manager=@uid AND program_id=@idPrograma) set @respuesta=1
			IF EXISTS(SELECT * from art_project_master where project_manager=@uid AND pId=@id) set @respuesta=1
		END
	IF(@tipo=3)
		BEGIN
			SELECT @idProyecto=pId from art_task where tId=@id
			SELECT @idPrograma=program from art_project_master where pId=@idProyecto
			IF EXISTS(SELECT * from art_program where demand_manager=@uid AND program_id=@idPrograma) set @respuesta=1
			IF EXISTS(SELECT * from art_project_master where project_manager=@uid AND pId=@idProyecto) set @respuesta=1
			IF EXISTS(SELECT * from art_task where owner=@uid AND tId=@id) set @respuesta=1
		END
	IF(@tipo=4)
		BEGIN
			SELECT @idTarea=task_id from art_sub_task where sub_task_id=@id
			SELECT @idProyecto=pId from art_task where tId=@idTarea
			SELECT @idPrograma=program from art_project_master where pId=@idProyecto
			IF EXISTS(SELECT * from art_program where demand_manager=@uid AND program_id=@idPrograma) set @respuesta=1
			IF EXISTS(SELECT * from art_project_master where project_manager=@uid AND pId=@idProyecto) set @respuesta=1
			IF EXISTS(SELECT * from art_task where owner=@uid AND tId=@idTarea) set @respuesta=1
		END
	IF(@respuesta=1) 
		BEGIN
			SELECT 1 as rta 
		END
	IF(@respuesta=0)
		BEGIN 
			SELECT 0 as rta
		END
END
