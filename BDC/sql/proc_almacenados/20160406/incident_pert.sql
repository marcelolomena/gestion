USE [art_live]
GO
/****** Object:  StoredProcedure [art].[incident_pert]    Script Date: 06-04-2016 17:28:04 ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO
-- =============================================
-- Author:		Marcelo Lomeña
-- Create date: 28-05-2015
-- Description:	Implementacion metodo PERT
-- =============================================
ALTER PROCEDURE [art].[incident_pert]
@fecha_inicio varchar(10), @id_platilla int, @tipo int, @title nvarchar(64), @id_tarea int, @extended_description nvarchar(255)
AS
BEGIN
	SET NOCOUNT ON;
	DECLARE @pert TABLE(
	    id int identity,
		desde int,
		hasta int,
		duracion float,
		nivel int NULL,
		fpi int,
		fti int,
		fpf int,
		ftf int
		)

	DECLARE @pert_c TABLE(
	    id int identity,
		desde int,
		hasta int,
		duracion float,
		fpi int,
		fti int,
		fpf int,
		ftf int
		)

	DECLARE @conversion TABLE(
		id_real int,
		id_plantilla int
		)
	
	DECLARE @DIA int = 0
	DECLARE @c_id int = 0
	DECLARE @c_nivel int = 0
	DECLARE @c_duracion int = 0
	DECLARE @c_desde int = 0
	DECLARE @c_hasta int = 0
	DECLARE @max_fti int = 0
	DECLARE @max_nivel int = 0
	DECLARE @count int = 0
	DECLARE @c_fpi int = 0
	DECLARE @c_fti int = 0
	DECLARE @c_fpf int = 0
	DECLARE @c_ftf int = 0
	DECLARE @max_tarea int = 0
	DECLARE @cont_tarea int = 0
	DECLARE @max_tarea_borde int = 0
	DECLARE @diferencia_borde int = 0
	DECLARE @cont_uno int = 0
	DECLARE @cont_dos int = 0
	DECLARE @FechaInicio AS Date
	DECLARE @duracion_proyecto int = 0
	DECLARE @minima_fecha_inicio AS Date
	DECLARE @maxima_fecha_termino AS Date
	DECLARE @Random INT
	DECLARE @Upper INT = 1
	DECLARE @Lower INT = 9999
	DECLARE @ERROR_CODE INT = 0
	DECLARE @ERROR_TEXT VARCHAR(100) = 'SIN ERROR'

	BEGIN TRY
	BEGIN TRAN

	SELECT @FechaInicio=CONVERT(date, REPLACE(@fecha_inicio,'-',''),112)

	;WITH tmp(tId,plan_time,DESDE, task_depend) as (
	SELECT tId,plan_time,IIF(LEFT(CAST(task_depend AS VARCHAR), CHARINDEX(',',task_depend+',')-1)=0,NULL,LEFT(CAST(task_depend AS VARCHAR), CHARINDEX(',',task_depend+',')-1)),
		STUFF(CAST(task_depend AS VARCHAR), 1, CHARINDEX(',',task_depend+','), '')
		 FROM art_generic_task WHERE is_active=1 AND task_mode=@id_platilla
	UNION ALL
	SELECT tId,plan_time, LEFT(CAST(task_depend AS VARCHAR), CHARINDEX(',',task_depend+',')-1),
		STUFF(CAST(task_depend AS VARCHAR), 1, CHARINDEX(',',task_depend+','), '')
	FROM tmp
	WHERE task_depend > ''
	)

	INSERT INTO @pert (desde,hasta,duracion)
	SELECT DESDE,tId HASTA,plan_time DURACION
	FROM tmp
	ORDER BY tId

	;WITH Niveles AS
	(
	   SELECT desde, hasta, 0 AS nivel
	   FROM @pert
	   WHERE desde IS NULL
	   UNION ALL
	   SELECT P.desde, N.hasta, P.nivel + 1
	   FROM Niveles AS P
		  INNER JOIN @pert AS N
		  ON P.hasta = N.desde
	)


	UPDATE t1
	  SET t1.nivel = t2.nivel
	  FROM @pert AS t1
	  INNER JOIN 
	  (SELECT hasta, max(nivel) nivel FROM Niveles group by hasta) AS t2
	  ON t1.hasta = t2.hasta

	IF EXISTS (SELECT * FROM @pert WHERE duracion <= 0) THROW 66101, 'No se admiten duraciones negativas', 1 

	SELECT @cont_uno=COUNT(*) FROM @pert

	SELECT @cont_dos=COUNT(*) FROM art_generic_task WHERE is_active=1 AND task_mode=@id_platilla

	IF @cont_uno=@cont_dos
	BEGIN
		SELECT @max_tarea_borde= MAX(duracion) FROM @pert 
		DECLARE @fpi_ant INT=0
		DECLARE @fti_ant INT=0
		DECLARE ArrowNull CURSOR FOR SELECT id,duracion,desde FROM @pert ORDER BY nivel ASC
		OPEN ArrowNull
			FETCH NEXT FROM ArrowNull INTO @c_id,@c_duracion,@c_desde
			WHILE @@fetch_status = 0
			BEGIN
				IF @c_id=1
				BEGIN
				UPDATE @pert SET fpi=@DIA ,fti=@c_duracion,ftf=@max_tarea_borde,fpf=@max_tarea_borde - @c_duracion + @DIA WHERE id=@c_id
				END
				ELSE
				BEGIN
					SELECT @fpi_ant=fpi,@fti_ant=fti FROM @pert WHERE id=@c_id - 1
					UPDATE @pert SET fpi=@fti_ant,fti=@fti_ant+@c_duracion,ftf=@max_tarea_borde,fpf=@max_tarea_borde - @c_duracion + @DIA WHERE id=@c_id
				END
				FETCH NEXT FROM ArrowNull INTO @c_id,@c_duracion,@c_desde
			END
		CLOSE ArrowNull
		DEALLOCATE ArrowNull
	END
	ELSE
	BEGIN
		SELECT @max_nivel = MAX(nivel) FROM @pert
		SELECT @max_tarea = MAX(hasta) FROM @pert where nivel=@max_nivel -- Mas de un registro
		DECLARE CurPertAsc CURSOR FOR SELECT id,nivel,duracion,desde,hasta FROM @pert ORDER BY nivel ASC
		OPEN CurPertAsc
			FETCH NEXT FROM CurPertAsc INTO @c_id,@c_nivel,@c_duracion,@c_desde,@c_hasta
			WHILE @@fetch_status = 0
			BEGIN
				IF @c_nivel=0
				BEGIN
					UPDATE @pert SET fpi=@DIA,fti=@c_duracion WHERE nivel=@c_nivel AND hasta=@c_hasta
				END
				ELSE
				BEGIN
					SELECT @count=COUNT(*) FROM @pert WHERE hasta=(SELECT hasta FROM @pert WHERE desde=@c_desde AND id=@c_id)
					IF @count > 1
					BEGIN
						SELECT @max_fti=MAX(fti) FROM @pert WHERE hasta IN (SELECT desde FROM @pert WHERE hasta=(SELECT hasta FROM @pert WHERE desde=@c_desde AND id=@c_id))
						UPDATE @pert SET fpi=@DIA + @max_fti,fti=@c_duracion+@max_fti WHERE desde=@c_desde AND id=@c_id
					END
					ELSE
					BEGIN
						SELECT @max_fti=MAX(fti) FROM @pert WHERE hasta=@c_desde
						UPDATE @pert SET fpi=@DIA + @max_fti,fti=@c_duracion+@max_fti WHERE desde=@c_desde AND id=@c_id
					END
				END

				FETCH NEXT FROM CurPertAsc INTO @c_id,@c_nivel,@c_duracion,@c_desde,@c_hasta
			END
		CLOSE CurPertAsc
		DEALLOCATE CurPertAsc
	
		/*RETORNO*/
		DECLARE CurPertDes CURSOR FOR SELECT id,nivel,duracion,desde,hasta,fti FROM @pert ORDER BY nivel DESC
		OPEN CurPertDes
			FETCH NEXT FROM CurPertDes INTO @c_id,@c_nivel,@c_duracion,@c_desde,@c_hasta,@c_fti
			WHILE @@fetch_status = 0
			BEGIN
				IF @c_nivel=@max_nivel
				BEGIN
					--BORDE OTRA TAREA CON MAS DURACION
					SELECT @max_tarea_borde= MAX(duracion) FROM @pert 
					IF @c_fti<@max_tarea_borde
					BEGIN
						SET @diferencia_borde=@max_tarea_borde - @c_fti
						UPDATE @pert SET ftf=@max_tarea_borde,fpf=@max_tarea_borde - @c_duracion + @DIA WHERE nivel=@max_nivel
					END
					ELSE
					BEGIN
						UPDATE @pert SET ftf=fti,fpf=fti - @c_duracion + @DIA WHERE nivel=@max_nivel
					END
				END
				ELSE
				BEGIN
					IF @c_desde IS NULL
					BEGIN
						SELECT @count=COUNT(*) FROM @pert WHERE desde=(SELECT hasta FROM @pert WHERE desde IS NULL AND id=@c_id)
					END
					ELSE
					BEGIN
						SELECT @count=COUNT(*) FROM @pert WHERE desde=(SELECT hasta FROM @pert WHERE desde=@c_desde AND id=@c_id)
					END
					IF @count > 1
					BEGIN

						IF @c_desde IS NOT NULL
						BEGIN
							SELECT @max_fti=MIN(fpf) FROM @pert WHERE desde=@c_hasta
							UPDATE @pert SET ftf=@max_fti - @DIA ,fpf=(@max_fti - @DIA) - @c_duracion + @DIA WHERE desde=@c_desde AND id=@c_id
						END
						IF @c_desde IS NULL
						BEGIN
							SELECT @max_fti=MIN(fpf) FROM @pert WHERE desde IN (SELECT hasta FROM @pert WHERE desde IS NULL)
							UPDATE @pert SET ftf=@max_fti - @DIA ,fpf=(@max_fti - @DIA) - @c_duracion + @DIA WHERE desde IS NULL AND id=@c_id
						END

					END

					ELSE
					BEGIN
						IF @c_desde IS NULL
						BEGIN
							IF NOT EXISTS(SELECT * FROM @pert WHERE desde=@c_hasta)
							BEGIN
								SELECT @max_tarea_borde= MAX(duracion) FROM @pert
								UPDATE @pert SET ftf=@max_tarea_borde - @DIA,fpf=(@max_tarea_borde - @DIA) - @c_duracion + @DIA WHERE desde IS NULL AND id=@c_id
							END							
							ELSE
							BEGIN
								SELECT @max_fti=fpf FROM @pert WHERE desde=(SELECT hasta FROM @pert WHERE desde IS NULL AND id=@c_id)
								UPDATE @pert SET ftf=@max_fti - @DIA,fpf=(@max_fti - @DIA) - @c_duracion + @DIA WHERE desde IS NULL AND id=@c_id
							END
						END
						ELSE
						BEGIN
							--PREGUNTAR SI ES NODO TERMINAL
							IF NOT EXISTS(SELECT * FROM @pert WHERE desde=@c_hasta)
							BEGIN
								SELECT @max_tarea_borde= MAX(duracion) FROM @pert
								UPDATE @pert SET ftf=@max_tarea_borde,fpf=@max_tarea_borde - @c_duracion + @DIA  WHERE desde=@c_desde AND id=@c_id
							END
							ELSE
							BEGIN
								SELECT @max_fti=MIN(fpf) FROM @pert WHERE desde=@c_hasta/*MAL 12/06/2015*/
								--UPDATE @pert SET ftf=@max_fti + @diferencia_borde,fpf=@max_fti - @c_duracion + @DIA + @diferencia_borde WHERE desde=@c_desde AND id=@c_id
								UPDATE @pert SET ftf=@max_fti,fpf=@max_fti - @c_duracion + @DIA WHERE desde=@c_desde AND id=@c_id
							END
						END
					END

				END
				FETCH NEXT FROM CurPertDes INTO @c_id,@c_nivel,@c_duracion,@c_desde,@c_hasta,@c_fti
			END
		CLOSE CurPertDes
		DEALLOCATE CurPertDes
	END

	IF @tipo=0
	BEGIN
		SELECT * FROM @pert
	END
	IF @tipo=1
	BEGIN

		DECLARE CurPertDesF CURSOR FOR SELECT desde,hasta,duracion,fpi,fti,fpf,ftf FROM @pert
		OPEN CurPertDesF
			FETCH NEXT FROM CurPertDesF INTO @c_desde,@c_hasta,@c_duracion,@c_fpi,@c_fti,@c_fpf,@c_ftf
			WHILE @@fetch_status = 0
			BEGIN
				IF NOT EXISTS (SELECT * FROM  @pert_c WHERE hasta=@c_hasta) 
				BEGIN
					INSERT INTO @pert_c (desde,hasta,duracion,fpi,fti,fpf,ftf) VALUES (@c_desde,@c_hasta,@c_duracion,@c_fpi,@c_fti,@c_fpf,@c_ftf)
				END
				FETCH NEXT FROM CurPertDesF INTO @c_desde,@c_hasta,@c_duracion,@c_fpi,@c_fti,@c_fpf,@c_ftf
			END
		CLOSE CurPertDesF
		DEALLOCATE CurPertDesF

		SELECT T1.id,T1.hasta tarea,T2.task_title,T1.duracion,T1.fpi,T1.fti,T1.fpf,T1.ftf,T1.ftf-T1.fti ml 
		FROM @pert_c T1
		INNER JOIN
		(SELECT * FROM art_generic_task WHERE is_active=1 AND task_mode=@id_platilla
		/*(SELECT id FROM art_project_type_master WHERE project_type=
		(SELECT id FROM art_program_generic_project_type WHERE id=@id_platilla))*/ )  T2 
		ON T1.hasta=T2.tId ORDER BY T1.id ASC
	END
	IF @tipo=2
	BEGIN
		--SELECT @generic_project_type=generic_project_type FROM art_program_generic_project_type WHERE id=@id_platilla

		DECLARE CurPertDesF CURSOR FOR SELECT desde,hasta,duracion,fpi,fti,fpf,ftf FROM @pert
		OPEN CurPertDesF
			FETCH NEXT FROM CurPertDesF INTO @c_desde,@c_hasta,@c_duracion,@c_fpi,@c_fti,@c_fpf,@c_ftf
			WHILE @@fetch_status = 0
			BEGIN
				IF NOT EXISTS (SELECT * FROM  @pert_c WHERE hasta=@c_hasta) 
				BEGIN
					INSERT INTO @pert_c (desde,hasta,duracion,fpi,fti,fpf,ftf) VALUES (@c_desde,@c_hasta,@c_duracion,@c_fpi,@c_fti,@c_fpf,@c_ftf)
				END
				FETCH NEXT FROM CurPertDesF INTO @c_desde,@c_hasta,@c_duracion,@c_fpi,@c_fti,@c_fpf,@c_ftf
			END
		CLOSE CurPertDesF
		DEALLOCATE CurPertDesF

		--CALCULO DE VARIABLES
		SELECT @duracion_proyecto=SUM(duracion)
		FROM @pert_c T1
		INNER JOIN
		(SELECT * FROM art_generic_task WHERE is_active=1 AND task_mode=@id_platilla
		/*(SELECT id FROM art_project_type_master WHERE project_type=
		(SELECT id FROM art_program_generic_project_type WHERE id=@id_platilla))*/ )  T2 
		ON T1.hasta=T2.tId 

		SELECT @minima_fecha_inicio=MIN(DATEADD(day,T1.fpi,@FechaInicio)),@maxima_fecha_termino=MAX(DATEADD(day,T1.fti,@FechaInicio)) 
		FROM @pert_c T1
		INNER JOIN
		(SELECT * FROM art_generic_task WHERE is_active=1 AND task_mode=@id_platilla
		/*(SELECT id FROM art_project_type_master WHERE project_type=
		(SELECT id FROM art_program_generic_project_type WHERE id=@id_platilla))*/ )  T2 
		ON T1.hasta=T2.tId 

		SELECT @Random = ROUND(((@Upper - @Lower -1) * RAND() + @Lower), 0)
			
		INSERT art_sub_task
		(task_id,
		title,
		description,
		plan_start_date,
		plan_end_date,
		actual_start_date,
		actual_end_date,
		priority,
		added_date,
		note,
		status,
		completion_percentage,
		task_complete,
		sub_task_depend,
		dependencies_type,
		is_deleted,
		catalogue_id,
		actual_end_date_final) OUTPUT inserted.sub_task_id,CAST(inserted.sub_task_depend AS int) INTO @conversion SELECT 
		@id_tarea,
		T2.task_title + @title,
		T2.task_description,
		DATEADD(day,T1.fpi,@FechaInicio),
		DATEADD(day,T1.fti - 1, @FechaInicio),
		DATEADD(day,T1.fpi,@FechaInicio),
		DATEADD(day,T1.fti - 1, @FechaInicio),
		0,
		GETDATE(),
		'NA',
		0,
		0,
		0,
		CAST(T1.hasta AS NVARCHAR),
		0,
		1,
		T2.catalogue_service,
		DATEADD(day,T1.fti - 1, @FechaInicio)
		FROM @pert_c T1
		INNER JOIN
		(SELECT * FROM art_generic_task WHERE is_active=1 AND task_mode=@id_platilla
		/*(SELECT id FROM art_project_type_master WHERE project_type=
		(SELECT id FROM art_program_generic_project_type WHERE id=@id_platilla))*/ )  T2 
		ON T1.hasta=T2.tId 	

		DECLARE @c_task_depend nvarchar(50)
		--DECLARE @c_tId int
		DECLARE @c_new_task_depend nvarchar(50)
		DECLARE @c_id_real int = 0
		DECLARE @c_id_tpl int = 0

		DECLARE CurSplit CURSOR FOR SELECT id_real,id_plantilla FROM @conversion
		OPEN CurSplit
			FETCH NEXT FROM CurSplit INTO @c_id_real,@c_id_tpl
			WHILE @@fetch_status = 0
			BEGIN

			SELECT @c_task_depend=task_depend FROM art_generic_task WHERE tId=@c_id_tpl AND is_active=1 AND task_mode=@id_platilla
										--(SELECT id FROM art_project_type_master WHERE project_type=
										--(SELECT id FROM art_program_generic_project_type WHERE id=@id_platilla))


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
		
	END
	COMMIT TRAN
	END TRY

	BEGIN CATCH
	SELECT ERROR_MESSAGE()
		ROLLBACK TRAN
		SELECT @@ERROR 
	END CATCH

END
