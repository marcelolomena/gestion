package services;
import play.api.Play.current
import play.api.db.DB
import anorm.SqlParser._
import models._
import anorm._
import play.{Logger, Play}
import org.apache.poi.xssf.usermodel._
import java.io.File
import java.io.PrintWriter
import java.io.FileOutputStream
import java.util.Date


object DashboardService {

  def reporteProgramaFiltrado(did: String, pageSize: String, pageNumber: String, Json: String): Seq[Panel] = {
    //println(Json)
    var sqlString = "EXEC art.programas_por_division_filtrado {did},{PageSize},{PageNumber},{Json}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('did -> did.toInt, 'PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt, 'Json -> Json).executeQuery() as (Panel.panel *)
    }
  }

  def cantidadProgramaFiltrado(did: String, Json: String): Int = {
    //println(Json)
    var sqlString = "EXEC art.cantidad_programas_por_division_filtrado {did},{Json}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('did -> did.toInt, 'Json -> Json).executeQuery() as (scalar[Int].single)
    }
  }

  def reporteProgramaPorTipoFiltrado(did: String, pageSize: String, pageNumber: String, Json: String): Seq[Panel] = {
    //println(Json)
    var sqlString = "EXEC art.programas_por_tipo_filtrado {did},{PageSize},{PageNumber},{Json}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('did -> did.toInt, 'PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt, 'Json -> Json).executeQuery() as (Panel.panel *)
    }
  }

  def cantidadProgramaPorTipoFiltrado(did: String, Json: String): Int = {
    //println(Json)
    var sqlString = "EXEC art.cantidad_programas_por_tipo_filtrado {did},{Json}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('did -> did.toInt, 'Json -> Json).executeQuery() as (scalar[Int].single)
    }
  }

  def reporteProgramaPorSubTipoFiltrado(did: String, pageSize: String, pageNumber: String, Json: String): Seq[Panel] = {
    //println(Json)
    var sqlString = "EXEC art.programas_por_subtipo_filtrado {did},{PageSize},{PageNumber},{Json}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('did -> did.toInt, 'PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt, 'Json -> Json).executeQuery() as (Panel.panel *)
    }
  }

  def cantidadProgramaPorSubTipoFiltrado(did: String, Json: String): Int = {
    //println(Json)
    var sqlString = "EXEC art.cantidad_programas_por_subtipo_filtrado {did},{Json}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('did -> did.toInt, 'Json -> Json).executeQuery() as (scalar[Int].single)
    }
  }

  def reporteProgramaPorEstadoFiltrado(did: String, pageSize: String, pageNumber: String, Json: String): Seq[Panel] = {
    //println(Json)
    var sqlString = "EXEC art.programas_por_estado_filtrado {did},{PageSize},{PageNumber},{Json}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('did -> did.toInt, 'PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt, 'Json -> Json).executeQuery() as (Panel.panel *)
    }
  }

  def cantidadProgramaPorEstadoFiltrado(did: String, Json: String): Int = {
    //println(Json)
    var sqlString = "EXEC art.cantidad_programas_por_estado_filtrado {did},{Json}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('did -> did.toInt, 'Json -> Json).executeQuery() as (scalar[Int].single)
    }
  }

  ///
  def reporteProgramaPorSapFiltrado(did: String, pageSize: String, pageNumber: String, Json: String): Seq[Panel] = {
    //println(Json)
    var sqlString = "EXEC art.programas_por_sap_filtrado {did},{PageSize},{PageNumber},{Json}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('did -> did.toInt, 'PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt, 'Json -> Json).executeQuery() as (Panel.panel *)
    }
  }

  def reporteProgramaPorDepartamentoFiltrado(did: String, pageSize: String, pageNumber: String, Json: String): Seq[PanelDepartamento] = {
    println(did)
	println(pageSize)
	println(pageNumber)
	println(Json)
    var sqlString = "EXEC art.programas_por_departamento_filtrado {did},{PageSize},{PageNumber},{Json}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('did -> did.toInt, 'PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt, 'Json -> Json).executeQuery() as (PanelDepartamento.panelDepa *)
    }
  }

  def reportDepartamentExcel(Json: String): Seq[PanelDepartamento] = {
    //println(Json)
    var sqlString = "EXEC art.programas_por_departamento_excel {Json}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('Json -> Json).executeQuery() as (PanelDepartamento.panelDepa *)
    }
  }

  def cantidadProgramaPorSapFiltrado(did: String, Json: String): Int = {
    //println(Json)
    var sqlString = "EXEC art.cantidad_programas_por_sap_filtrado {did},{Json}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('did -> did.toInt, 'Json -> Json).executeQuery() as (scalar[Int].single)
    }
  }

  def cantidadProgramaPorDepartamentoFiltrado(did: String, Json: String): Int = {
    println(Json)
    var sqlString = "EXEC art.cantidad_programas_por_departamento_filtrado {did},{Json}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('did -> did.toInt, 'Json -> Json).executeQuery() as (scalar[Int].single)
    }
  }

  def reportBubble(uid:String): Seq[Report.Point] = {

    //var sqlString = "EXEC art.bubble "+uid
    val sqlString =
      """
        |select a.cpi x, a.spi y, a.program_id z,a.program_name programa
        |from art_program_management a join art_program_members b on a.program_id = b.program_id
        |where
        | a.tipo ='PROGRAMA' and
        | b.is_active = 0 and
        | b.member_id = {uid}
      """.stripMargin
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('uid->uid.toInt) as (Report.Point.point *)
    }
  }

  def reportPie(id: Int): Seq[Report.Pie] = {

    var sqlString = ""

    id match {
      case 1 =>
        sqlString =
          """
            |;WITH T
            |AS
            |(
            |	SELECT COUNT(*) AS Total
            |	FROM art_program_management where tipo='PROGRAMA'
            |),
            |G AS
            |(
            |	SELECT ISNULL(cod_div,0) dId, ISNULL(name_div,'N/A') name, COUNT(*) AS y
            |	FROM art_program_management where tipo='PROGRAMA'
            |	GROUP BY name_div,cod_div
            |)
            |SELECT
            |	G.dId, G.name, G.y,
            |	ROUND(CAST(G.y AS float) / CAST(T.Total AS float) * 100 , 2) AS porcentaje
            |FROM
            |	G CROSS JOIN T
          """.stripMargin
      case 6 =>
        sqlString =
          """
            |;WITH T
            |AS
            |(
            |	SELECT COUNT(*) AS Total
            |	FROM art_program_management where tipo='PROGRAMA'
            |),
            |G AS
            |(
            |	SELECT ISNULL(cod_man,0) dId, ISNULL(name_man,'N/A') name, COUNT(*) AS y
            |	FROM art_program_management where tipo='PROGRAMA'
            |	GROUP BY name_man,cod_man
            |)
            |SELECT
            |	G.dId, G.name, G.y,
            |	ROUND(CAST(G.y AS float) / CAST(T.Total AS float) * 100 , 2) AS porcentaje
            |FROM
            |	G CROSS JOIN T
          """.stripMargin
      case 7 =>
        sqlString =
          """
            |;WITH T
            |AS
            |(
            |	SELECT COUNT(*) AS Total
            |	FROM art_program_management where tipo='PROGRAMA'
            |),
            |G AS
            |(
            |	SELECT ISNULL(cod_dep,0) dId, ISNULL(name_dep,'N/A') name, COUNT(*) AS y
            |	FROM art_program_management where tipo='PROGRAMA'
            |	GROUP BY name_dep,cod_dep
            |)
            |SELECT
            |	G.dId, G.name, G.y,
            |	ROUND(CAST(G.y AS float) / CAST(T.Total AS float) * 100 , 2) AS porcentaje
            |FROM
            |	G CROSS JOIN T
          """.stripMargin
    }

    DB.withConnection { implicit connection =>
      SQL(sqlString).executeQuery() as (Report.Pie.pie *)
    }
  }

  def reportType(): Seq[Report.Pie] = {

    //var sqlString = "EXEC art.porcentaje_programas_for_type"
    val sqlString =
      """
        |;WITH T
        |AS
        |(
        |	SELECT COUNT(*) AS Total
        |	FROM art_program_management where tipo='PROGRAMA'
        |),
        |G AS
        |(
        |	SELECT b.id dId, a.program_type name, COUNT(*) AS y
        |	FROM art_program_management a join art_program_type b on a.program_type = b.program_type
        |	where a.tipo='PROGRAMA' AND a.program_type is not null and b.is_deleted = 0
        |	GROUP BY a.program_type,b.id
        |)
        |SELECT
        |	G.dId, G.name, G.y,
        |	ROUND(CAST(G.y AS float) / CAST(T.Total AS float) * 100 , 2) AS porcentaje
        |FROM
        |	G CROSS JOIN T
      """.stripMargin
    DB.withConnection { implicit connection =>
      SQL(sqlString).executeQuery() as (Report.Pie.pie *)
    }
  }

  def reportImpact(): Seq[Report.Pie] = {

    //var sqlString = "EXEC art.porcentaje_programas_for_departamento"
    val sqlString =
      """
        |;WITH T
        |AS
        |(
        |	SELECT COUNT(*) AS Total
        |	FROM art_program_management where tipo='PROGRAMA'
        |),
        |G AS
        |(
        |	SELECT b.id dId, a.impact_type name, COUNT(*) AS y
        |	FROM art_program_management a join art_program_impact_type b on a.impact_type = b.impact_type
        |	where a.tipo='PROGRAMA' AND a.impact_type is not null
        |	GROUP BY a.impact_type,b.id
        |)
        |SELECT
        |	G.dId, G.name, G.y,
        |	ROUND(CAST(G.y AS float) / CAST(T.Total AS float) * 100 , 2) AS porcentaje
        |FROM
        |	G CROSS JOIN T
      """.stripMargin

    DB.withConnection { implicit connection =>
      SQL(sqlString).executeQuery() as (Report.Pie.pie *)
    }
  }

  def reportSubType(): Seq[Report.Pie] = {

    //var sqlString = "EXEC art.porcentaje_programas_for_subtype"
    val sqlString =
      """
        |;WITH T
        |AS
        |(
        |	SELECT COUNT(*) AS Total
        |	FROM art_program_management where tipo='PROGRAMA'
        |),
        |G AS
        |(
        |	SELECT b.id dId, a.foco name, COUNT(*) AS y
        |	FROM art_program_management a join art_program_sub_type b on a.foco = b.sub_type
        |	where a.tipo='PROGRAMA' AND a.foco is not null and b.is_deleted = 0
        |	GROUP BY a.foco,b.id
        |)
        |SELECT
        |	G.dId, G.name, G.y,
        |	ROUND(CAST(G.y AS float) / CAST(T.Total AS float) * 100 , 2) AS porcentaje
        |FROM
        |	G CROSS JOIN T
      """.stripMargin
    DB.withConnection { implicit connection =>
      SQL(sqlString).executeQuery() as (Report.Pie.pie *)
    }
  }

  def reportStatus(): Seq[Report.Pie] = {

    //var sqlString = "EXEC art.porcentaje_programas_for_status"
    val sqlString =
      """
        |;WITH T
        |AS
        |(
        |	SELECT COUNT(*) AS Total
        |	FROM art_program_management where tipo='PROGRAMA'
        |),
        |G AS
        |(
        |	SELECT b.id dId, a.work_flow_status name, COUNT(*) AS y
        |	FROM art_program_management a join art_program_workflow_status b on a.work_flow_status = b.workflow_status
        |	where a.tipo='PROGRAMA' AND a.work_flow_status is not null
        |	GROUP BY a.work_flow_status,b.id
        |)
        |SELECT
        |	G.dId, G.name, G.y,
        |	ROUND(CAST(G.y AS float) / CAST(T.Total AS float) * 100 , 2) AS porcentaje
        |FROM
        |	G CROSS JOIN T
      """.stripMargin
    DB.withConnection { implicit connection =>
      SQL(sqlString).executeQuery() as (Report.Pie.pie *)
    }
  }

  def reportSap(): Seq[Report.Pie] = {

    var sqlString = "EXEC art.porcentaje_programas_for_sap"
    DB.withConnection { implicit connection =>
      SQL(sqlString).executeQuery() as (Report.Pie.pie *)
    }
  }

  def getIndicadores(pid: String): Seq[Indicadores] = {

    var sqlString = "SELECT ROUND(ISNULL(spi,0),2) spi,ROUND(ISNULL(cpi,0),2) cpi,ROUND(ISNULL(pae,0),2) pae FROM dbo.CalcProgramInd({pid})"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('pid -> pid.toInt).executeQuery() as (Indicadores.ind *)
    }
  }
  
  def getProgramExcel(pid: String): Seq[ATM] = {

    var sqlString = "EXEC art.excel {pid}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('pid -> pid.toInt).executeQuery() as (ATM.atm *)
    }
  }

  def reportProgram(pageSize: String, pageNumber: String, Json: String): Seq[ReportePrograma] = {

    var sqlString = "EXEC art.reporte_programa {PageSize},{PageNumber},{Json}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt, 'Json -> Json).executeQuery() as (ReportePrograma.rpt *)
    }
  }

  def reportProject(pid: String, pageSize: String, pageNumber: String): Seq[ATM] = {

    var sqlString = "EXEC art.proyecto {pid},{PageSize},{PageNumber}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('pid -> pid.toInt, 'PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt).executeQuery() as (ATM.atm *)
    }
  }

  def reportSubTask(pid: String, pageSize: String, pageNumber: String): Seq[ATM] = {

    var sqlString = "EXEC art.sub_tarea {pid},{PageSize},{PageNumber}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('pid -> pid.toInt, 'PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt).executeQuery() as (ATM.atm *)
    }
  }

  def reportStateSubTaskCount(Json: String): Int = {

    var sqlString = "EXEC art.cantidad_estado_sub_tarea {Json}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('Json -> Json).executeQuery() as (scalar[Int].single)
    }
  }

  def countSubTaskCount(Json: String): Int = {

    var sqlString = "EXEC art.count_subtasks {Json}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('Json -> Json).executeQuery() as (scalar[Int].single)
    }
  }

  def reportStateSubTask(pageSize: String, pageNumber: String, json: String): Seq[StateSubTarea] = {

    var sqlString = "EXEC art.estado_sub_tarea {PageSize},{PageNumber},{json}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on(
        'PageSize -> pageSize.toInt,
        'PageNumber -> pageNumber.toInt,
        'json -> json).executeQuery() as (StateSubTarea.state *)
    }
  }

  def programCount(Json: String): Int = {

    var sqlString = "EXEC art.cantidad_programa {Json}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('Json -> Json).executeQuery() as (scalar[Int].single)
    }
  }

  def projectCount(pid: String): Int = {
    DB.withConnection { implicit connection =>
      var sqlString = ""
      sqlString = "SELECT count(*) FROM art_project_master WHERE program={pid} and is_active=1"
      val count: Int = SQL(sqlString).on('pid -> pid.toInt).as(scalar[Int].single)
      count
    }
  }

  def subtaskCount(pid: String): Int = {
    DB.withConnection { implicit connection =>
      var sqlString = ""
      sqlString = "SELECT count(*) FROM art_sub_task a JOIN (SELECT * FROM art_task) b ON a.task_id=b.tId WHERE a.is_deleted=1 AND b.is_active=1 AND b.pId={pid}"
      val count: Int = SQL(sqlString).on('pid -> pid.toInt).as(scalar[Int].single)
      count
    }
  }

  def programSubtaskCount(pid: String): Int = {
    DB.withConnection { implicit connection =>
      var sqlString = ""
      sqlString = "SELECT count(*) FROM art_program a JOIN (SELECT * FROM art_project_master) b ON a.program_id=b.program JOIN (SELECT * FROM art_task) c ON b.pId=c.pId JOIN (SELECT * FROM art_sub_task) d ON d.task_id=c.tId WHERE a.is_active = 1 AND b.is_active = 1 AND c.is_active = 1 AND d.is_deleted = 1 AND  a.program_id={pid}"
      val count: Int = SQL(sqlString).on('pid -> pid.toInt).as(scalar[Int].single)
      count
    }
  }

  def manager(page: Int, end: Int, filter: String, order: String): Seq[Report] = {
    DB.withConnection { implicit connection =>
      val ini = end * (page - 1)
      val sqlString =
          """SELECT
            tipo,
            program_id,
            ISNULL(project_id,0) project_id,
            ISNULL(task_id,0) task_id,
            ISNULL(subtask_id,0) subtask_id,
            program_name,
            nombre_lider,
            program_type,
            work_flow_status,
            impact_type,
            name_div,
            name_man,
            name_dep,
            plan_start_date,
            plan_end_date,
            real_start_date,
            real_end_date,
            release_date,
            ROUND(pai,2) pai,
            ROUND(pae,2) pae,
            ROUND(spi,2) spi,
            ROUND(cpi,2) cpi,
            hours,
            allocation,
            pcod,
            foco,
            tamano,
            count_project,
            count_task,
            count_subtask,
            pmo,
            count_subtask_usr
            FROM art_program_management
            WHERE """ + filter + order  +
            " OFFSET " + ini + " ROWS FETCH NEXT " + end + " ROWS ONLY"

        //Logger.debug(sqlString)

        SQL(sqlString).as(Report.report * )
    }
  }

  def managerWwithoutPage(filter: String, order: String): Seq[Report] = {
    DB.withConnection { implicit connection =>

      val sqlString =
        """
        SELECT
        tipo,
        pcod,
        program_id,
        ISNULL(project_id,0) project_id,
        ISNULL(task_id,0) task_id,
        ISNULL(subtask_id,0) subtask_id,
        program_name,
        ISNULL(foco, '') foco,
        ISNULL(tamano,'') tamano,
        ISNULL(nombre_lider,'') nombre_lider,
        ISNULL(program_type,'') program_type,
        ISNULL(work_flow_status,'') work_flow_status,
        ISNULL(impact_type,'') impact_type,
        ISNULL(name_div,'') name_div,
        ISNULL(name_man,'') name_man,
        ISNULL(name_dep,'') name_dep,
        ISNULL(plan_start_date,'') plan_start_date,
        ISNULL(plan_end_date,'') plan_end_date,
        real_start_date,
        real_end_date,
        release_date,
        ISNULL(spi,0) spi,
        ISNULL(cpi,0) cpi,
        ISNULL(pai,0) pai,
        ISNULL(pae,0) pae,
        count_project,
        count_task,
        count_subtask,
        ISNULL(pmo,'') pmo,
        ISNULL(hours,0) hours,
        ISNULL(allocation,0) allocation,
        count_subtask_usr
        FROM art_program_management
        WHERE """ + filter + order  + """
          """.stripMargin

      SQL(sqlString).as(Report.report * )
    }
  }



  def countManager(filter: String): Int = {
    DB.withConnection { implicit connection =>
      var sqlString = ""
      sqlString =
        """
            SELECT count(*)
            FROM art_program_management
            WHERE """ + filter
      SQL(sqlString).as(scalar[Int].single)

    }
  }


  def findAllDivisionRRHH(): Seq[DivisionsList] = {
    DB.withConnection { implicit connection =>
      val sqlstr =
        """
          |SELECT DISTINCT codDivision,glosaDivision FROM RecursosHumanos
          |WHERE periodo=(SELECT MAX(periodo) FROM RecursosHumanos)
          |AND codDivision in (SELECT DISTINCT cod_div FROM art_program_management)
          |ORDER BY glosaDivision
        """.stripMargin

      SQL(sqlstr).as(DivisionsList.divisionList *)
    }
  }


  def findAllManagerRRHH(): Seq[DivisionsList] = {
    DB.withConnection { implicit connection =>
      val sqlstr =
        """
          |SELECT DISTINCT codArea AS codDivision,glosaArea AS glosaDivision FROM RecursosHumanos
          |WHERE periodo=(SELECT MAX(periodo) FROM RecursosHumanos)
          |AND codArea in (SELECT DISTINCT cod_man FROM art_program_management)
          |ORDER BY glosaArea
        """.stripMargin

      SQL(sqlstr).as(DivisionsList.divisionList *)
    }
  }

  def findAllDepartamentRRHH(): Seq[DivisionsList] = {
    DB.withConnection { implicit connection =>
      val sqlstr =
        """
          |SELECT DISTINCT codDepartamento AS codDivision,glosaDepartamento AS glosaDivision FROM RecursosHumanos
          |WHERE periodo=(SELECT MAX(periodo) FROM RecursosHumanos)
          |AND codDepartamento in (SELECT DISTINCT cod_dep FROM art_program_management)
          |ORDER BY glosaDepartamento
        """.stripMargin

      SQL(sqlstr).as(DivisionsList.divisionList *)
    }
  }

  def findAllUserActiveProgram(): Seq[DivisionsList] = {
    DB.withConnection { implicit connection =>
      val sqlstr =
        """
          |select DISTINCT uid AS codDivision,nombre_lider AS glosaDivision from art_program_management where tipo='PROGRAMA' ORDER BY nombre_lider
        """.stripMargin

      SQL(sqlstr).as(DivisionsList.divisionList *)
    }
  }

  def findAllSubType(): Seq[DummyList] = {
    DB.withConnection { implicit connection =>
      val sqlstr =
        """
          |select DISTINCT foco AS value,foco AS name from art_program_management where tipo='PROGRAMA' and foco is not null ORDER BY foco
        """.stripMargin

      SQL(sqlstr).as(DummyList.dummyList *)
    }
  }

  def findAllImpactType(): Seq[DummyList] = {
    DB.withConnection { implicit connection =>
      val sqlstr =
        """
          |select DISTINCT impact_type AS value,impact_type AS name from art_program_management where tipo='PROGRAMA' ORDER BY impact_type
        """.stripMargin

      SQL(sqlstr).as(DummyList.dummyList *)
    }
  }

  def findAllInternalState(): Seq[DummyList] = {
    DB.withConnection { implicit connection =>
      val sqlstr =
        """
          |select DISTINCT tamano AS value,tamano AS name from art_program_management where tipo='PROGRAMA' and tamano != '' ORDER BY tamano
        """.stripMargin

      SQL(sqlstr).as(DummyList.dummyList *)
    }
  }

  def findAllStatusProgram(): Seq[DummyList] = {
    DB.withConnection { implicit connection =>
      val sqlstr =
        """
          |SELECT  DISTINCT work_flow_status name,work_flow_status value FROM art_program_management WHERE work_flow_status IS NOT NULL AND tipo='PROGRAMA'
        """.stripMargin

      SQL(sqlstr).as(DummyList.dummyList *)
    }
  }

  def findAllTypeProgram(): Seq[DummyList] = {
    DB.withConnection { implicit connection =>
      val sqlstr =
        """
          |SELECT  DISTINCT program_type name, program_type value FROM art_program_management WHERE program_type IS NOT NULL AND tipo='PROGRAMA'
        """.stripMargin

      SQL(sqlstr).as(DummyList.dummyList *)
    }
  }

  def updateTableManager(): Int = {

    DB.withConnection { implicit connection =>
      SQL("EXEC art.proc_art_program_management").executeQuery() as (scalar[Int].single)
    }
  }

  def createReportFabricas(): Seq[Report] = {

    var sqlString =
      """
        |SELECT
        |tipo,
        |pcod,
        |program_id,
        |ISNULL(project_id,0) project_id,
        |ISNULL(task_id,0) task_id,
        |ISNULL(subtask_id,0) subtask_id,
        |program_name,
        |ISNULL(foco, '') foco,
        |ISNULL(tamano,'') tamano,
        |ISNULL(nombre_lider,'') nombre_lider,
        |ISNULL(program_type,'') program_type,
        |ISNULL(work_flow_status,'') work_flow_status,
        |ISNULL(impact_type,'') impact_type,
        |ISNULL(name_div,'') name_div,
        |ISNULL(name_man,'') name_man,
        |ISNULL(name_dep,'') name_dep,
        |ISNULL(plan_start_date,'') plan_start_date,
        |ISNULL(plan_end_date,'') plan_end_date,
        |real_start_date ,
        |real_end_date ,
        |release_date ,
        |ISNULL(spi,0) spi,
        |ISNULL(cpi,0) cpi,
        |ISNULL(pai,0) pai,
        |ISNULL(pae,0) pae,
        |count_project ,
        |count_task ,
        |count_subtask ,
        |ISNULL(pmo,'') pmo,
        |ISNULL(hours,0) hours,
        |ISNULL(allocation,0) allocation,
        |count_subtask_usr
        |FROM art_program_management WHERE tipo IN ('PROGRAMA','PROYECTO', 'TAREA')
        |UNION
        |SELECT
        |tipo,
        |pcod ,
        |program_id,
        |ISNULL(project_id,0) project_id,
        |ISNULL(task_id,0) task_id,
        |ISNULL(subtask_id,0) subtask_id,
        |program_name ,
        |ISNULL(foco, '') foco,
        |ISNULL(tamano,'') tamano,
        |ISNULL(nombre_lider,'') nombre_lider,
        |ISNULL(program_type,'') program_type,
        |ISNULL(work_flow_status,'') work_flow_status,
        |ISNULL(impact_type,'') impact_type,
        |ISNULL(name_div,'') name_div,
        |ISNULL(name_man,'') name_man,
        |ISNULL(name_dep,'') name_dep,
        |ISNULL(plan_start_date,'') plan_start_date,
        |ISNULL(plan_end_date,'') plan_end_date,
        |min(real_start_date) real_start_date,
        |max(real_end_date) real_end_date,
        |release_date ,
        |ISNULL(spi,0) spi,
        |ISNULL(cpi,0) cpi,
        |max(ISNULL(pai,0)) pai,
        |max(ISNULL(pae,0)) pae,
        |count_project ,
        |count_task ,
        |count_subtask ,
        |ISNULL(pmo,'') pmo,
        |sum(ISNULL(hours,0)) hours,
        |sum(ISNULL(allocation,0)) allocation,
        |count_subtask_usr
        |FROM art_program_management WHERE tipo ='SUBTAREA'
        |group by tipo, pcod, program_id, project_id, task_id, subtask_id, program_name, foco, tamano, nombre_lider, program_type, work_flow_status, impact_type, name_div, name_man, name_dep, plan_start_date, plan_end_date, release_date, spi, cpi, count_project, count_task, count_subtask, pmo, count_subtask_usr
        |order by program_id,project_id,task_id,subtask_id
      """.stripMargin

    DB.withConnection { implicit connection =>
      SQL(sqlString).executeQuery() as (Report.report *)
    }
  }

  def createExcel() = {
    DB.withConnection { implicit connection =>
      val sqlstr =
        """
         |SELECT
         |tipo,
         |pcod,
         |program_id,
         |ISNULL(project_id,0) project_id,
         |ISNULL(task_id,0) task_id,
         |ISNULL(subtask_id,0) subtask_id,
         |program_name,
         |ISNULL(foco, '') foco,
         |ISNULL(tamano,'') tamano,
         |ISNULL(nombre_lider,'') nombre_lider,
         |ISNULL(program_type,'') program_type,
         |ISNULL(work_flow_status,'') work_flow_status,
         |ISNULL(impact_type,'') impact_type,
         |ISNULL(name_div,'') name_div,
         |ISNULL(name_man,'') name_man,
         |ISNULL(name_dep,'') name_dep,
         |ISNULL(plan_start_date,'') plan_start_date,
         |ISNULL(plan_end_date,'') plan_end_date,
         |real_start_date,
         |real_end_date,
         |release_date,
         |ISNULL(spi,0) spi,
         |ISNULL(cpi,0) cpi,
         |ISNULL(pai,0) pai,
         |ISNULL(pae,0) pae,
         |count_project,
         |count_task,
         |count_subtask,
         |ISNULL(pmo,'') pmo,
         |ISNULL(hours,0) hours,
         |ISNULL(allocation,0) allocation,
         |count_subtask_usr
         |FROM art_program_management
         |order by program_id,project_id,task_id,subtask_id
        """.stripMargin

      val data=SQL(sqlstr).as(Report.report *)
      System.out.println("filas query:"+data.length)

      val file = new File("reporte.xlsx")
      val fileOut = new FileOutputStream(file);

      val wb = new XSSFWorkbook
      val sheet = wb.createSheet("ART")

      val rowHead = sheet.createRow(0)
      val style = wb.createCellStyle()
      val font = wb.createFont()

      var rNum = 1
      var cNum = 0
      var counter = 0

      font.setFontName(org.apache.poi.hssf.usermodel.HSSFFont.FONT_ARIAL)
      font.setFontHeightInPoints(26)
      font.setBold(true)
      style.setFont(font)

      rowHead.createCell(0).setCellValue("Tipo")
      rowHead.createCell(1).setCellValue("Número")
      rowHead.createCell(2).setCellValue("Programa")
      rowHead.createCell(3).setCellValue("Foco")
      rowHead.createCell(4).setCellValue("Tamaño")
      rowHead.createCell(5).setCellValue("Lider")
      rowHead.createCell(6).setCellValue("Tipo programa")
      rowHead.createCell(7).setCellValue("Estado")
      rowHead.createCell(8).setCellValue("Impacto")
      rowHead.createCell(9).setCellValue("División")
      rowHead.createCell(10).setCellValue("Gerencia")
      rowHead.createCell(11).setCellValue("Departamento")
      rowHead.createCell(12).setCellValue("Inicio")
      rowHead.createCell(13).setCellValue("Término")
      rowHead.createCell(14).setCellValue("Liberación")
      rowHead.createCell(15).setCellValue("Spi")
      rowHead.createCell(16).setCellValue("Cpi")
      rowHead.createCell(17).setCellValue("informado")
      rowHead.createCell(18).setCellValue("Esperado")
      rowHead.createCell(19).setCellValue("N° proyectos")
      rowHead.createCell(20).setCellValue("N° tareas")
      rowHead.createCell(21).setCellValue("N° subtareas")
      rowHead.createCell(22).setCellValue("Pmo")
      rowHead.createCell(23).setCellValue("Consumidas")
      rowHead.createCell(24).setCellValue("Asignadas")
      rowHead.createCell(25).setCellValue("recursos sin horas")

      for (j <- 0 to 25)
        rowHead.getCell(j).setCellStyle(style)

      for (s <- data) {
        val row = sheet.createRow(rNum)

        val cel0 = row.createCell(cNum)
        cel0.setCellValue(s.tipo.getOrElse(""))

        val cel1 = row.createCell(cNum + 1)
        cel1.setCellValue(s.pcod.getOrElse(0).toString)

        val cel2 = row.createCell(cNum + 2)
        cel2.setCellValue(s.program_name.getOrElse(""))

        val cel3 = row.createCell(cNum + 3)
        cel3.setCellValue(s.foco.getOrElse(""))

        val cel4 = row.createCell(cNum + 4)
        cel4.setCellValue(s.tamano.getOrElse(""))

        val cel5 = row.createCell(cNum + 5)
        cel5.setCellValue(s.nombre_lider.getOrElse(""))

        val cel6 = row.createCell(cNum + 6)
        cel6.setCellValue(s.program_type.getOrElse(""))

        val cel7 = row.createCell(cNum + 7)
        cel7.setCellValue(s.work_flow_status.getOrElse(""))

        val cel8 = row.createCell(cNum + 8)
        cel8.setCellValue(s.impact_type.getOrElse(""))

        val cel9 = row.createCell(cNum + 9)
        cel9.setCellValue(s.name_div.getOrElse(""))

        val cel10 = row.createCell(cNum + 10)
        cel10.setCellValue(s.name_man.getOrElse(""))

        val cel11 = row.createCell(cNum + 11)
        cel11.setCellValue(s.name_dep.getOrElse(""))

        val cel12 = row.createCell(cNum + 12)
        cel12.setCellValue(s.plan_start_date.getOrElse("").toString)

        val cel13 = row.createCell(cNum + 13)
        cel13.setCellValue(s.plan_end_date.getOrElse(0).toString())

        val cel14 = row.createCell(cNum + 14)
        cel14.setCellValue(s.release_date.getOrElse(0).toString())

        val cel15 = row.createCell(cNum + 15)
        cel15.setCellValue(s.spi.getOrElse(0).toString())

        val cel16 = row.createCell(cNum + 16)
        cel16.setCellValue(s.cpi.getOrElse(0).toString())

        val cel17 = row.createCell(cNum + 17)
        cel17.setCellValue(s.pai.getOrElse(0).toString)

        val cel18 = row.createCell(cNum + 18)
        cel18.setCellValue(s.pae.getOrElse(0).toString)

        val cel19 = row.createCell(cNum + 19)
        cel19.setCellValue(s.count_project.getOrElse(0).toString)

        val cel20 = row.createCell(cNum + 20)
        cel20.setCellValue(s.count_task.getOrElse(0).toString)

        val cel21 = row.createCell(cNum + 21)
        cel21.setCellValue(s.count_subtask.getOrElse(0).toString)

        val cel22 = row.createCell(cNum + 22)
        cel22.setCellValue(s.pmo.getOrElse(""))

        val cel23 = row.createCell(cNum + 23)
        cel23.setCellValue(s.hours.getOrElse(0).toString)

        val cel24 = row.createCell(cNum + 24)
        cel24.setCellValue(s.allocation.getOrElse(0).toString)

        val cel25 = row.createCell(cNum + 25)
        cel25.setCellValue(s.count_subtask_usr.getOrElse(0).toString)

        rNum = rNum + 1
        cNum = 0
        counter = counter + 1
      }
      System.out.println("counter:"+counter)
      for (a <- 0 to 25) {
        sheet.autoSizeColumn((a.toInt));
      }
      wb.write(fileOut)
      fileOut.close()
    }
  }
  
  def reportDepa(): Seq[Pie] = {

    var sqlString = "EXEC art.porcentaje_programas_for_departamento"
    DB.withConnection { implicit connection =>
      SQL(sqlString).executeQuery() as (Pie.pie *)
    }
  }

  def reporteExcel(): Seq[Report] = {
    DB.withConnection { implicit connection =>

      val sqlString =
        """
          |SELECT
          |tipo,
          |pcod 'número',
          |program_id,
          |ISNULL(project_id,0) project_id,
          |ISNULL(task_id,0) task_id,
          |ISNULL(subtask_id,0) subtask_id,
          |program_name ,
          |ISNULL(foco, '') foco,
          |ISNULL(tamano,'') 'tamaño',
          |ISNULL(nombre_lider,'') lider,
          |ISNULL(program_type,'') 'tipo programa',
          |ISNULL(work_flow_status,'') estado,
          |ISNULL(impact_type,'') impacto,
          |ISNULL(name_div,'') 'división',
          |ISNULL(name_man,'') 'gerencia',
          |ISNULL(name_dep,'') 'departamento',
          |ISNULL(plan_start_date,'') 'inicio plan',
          |ISNULL(plan_end_date,'') 'término plan',
          |real_start_date 'inicio real',
          |real_end_date 'término real',
          |release_date 'liberación',
          |ISNULL(spi,0) spi,
          |ISNULL(cpi,0) cpi,
          |ISNULL(pai,0) '% informado',
          |ISNULL(pae,0) '% esperado',
          |count_project 'N° proyectos',
          |count_task 'N° tareas',
          |count_subtask 'N° subtareas',
          |ISNULL(pmo,'') pmo,
          |ISNULL(hours,0) consumidas,
          |ISNULL(allocation,0) asignadas,
          |count_subtask_usr 'recursos sin horas'
          |FROM art_program_management WHERE tipo IN ('PROGRAMA','PROYECTO', 'TAREA')
          |--order by program_id,project_id,task_id,subtask_id)
          |union
          |SELECT
          |tipo,
          |pcod 'número',
          |program_id,
          |ISNULL(project_id,0) project_id,
          |ISNULL(task_id,0) task_id,
          |ISNULL(subtask_id,0) subtask_id,
          |program_name ,
          |ISNULL(foco, '') foco,
          |ISNULL(tamano,'') 'tamaño',
          |ISNULL(nombre_lider,'') lider,
          |ISNULL(program_type,'') 'tipo programa',
          |ISNULL(work_flow_status,'') estado,
          |ISNULL(impact_type,'') impacto,
          |ISNULL(name_div,'') 'división',
          |ISNULL(name_man,'') 'gerencia',
          |ISNULL(name_dep,'') 'departamento',
          |ISNULL(plan_start_date,'') 'inicio plan',
          |ISNULL(plan_end_date,'') 'término plan',
          |min(real_start_date) 'inicio real',
          |max(real_end_date) 'término real',
          |release_date 'liberación',
          |ISNULL(spi,0) spi,
          |ISNULL(cpi,0) cpi,
          |max(ISNULL(pai,0)) '% informado',
          |max(ISNULL(pae,0)) '% esperado',
          |count_project 'N° proyectos',
          |count_task 'N° tareas',
          |count_subtask 'N° subtareas',
          |ISNULL(pmo,'') pmo,
          |sum(ISNULL(hours,0)) consumidas,
          |sum(ISNULL(allocation,0)) asignadas,
          |count_subtask_usr 'recursos sin horas'
          |FROM art_program_management WHERE tipo ='SUBTAREA'
          |group by tipo, pcod, program_id, project_id, task_id, subtask_id, program_name, foco, tamano, nombre_lider, program_type, work_flow_status, impact_type, name_div, name_man, name_dep, plan_start_date, plan_end_date, release_date, spi, cpi, count_project, count_task, count_subtask, pmo, count_subtask_usr
          |order by program_id,project_id,task_id,subtask_id
        """.stripMargin

      SQL(sqlString).as(Report.report * )
    }
  }


  def createExcel2() = {
    DB.withConnection { implicit connection =>
      System.out.println("en createExcel")
      val sqlstr =
        """
          |SELECT
          |tipo,
          |pcod,
          |program_id,
          |ISNULL(project_id,0) project_id,
          |ISNULL(task_id,0) task_id,
          |ISNULL(subtask_id,0) subtask_id,
          |program_name,
          |ISNULL(foco, '') foco,
          |ISNULL(tamano,'') tamano,
          |ISNULL(nombre_lider,'') nombre_lider,
          |ISNULL(program_type,'') program_type,
          |ISNULL(work_flow_status,'') work_flow_status,
          |ISNULL(impact_type,'') impact_type,
          |ISNULL(name_div,'') name_div,
          |ISNULL(name_man,'') name_man,
          |ISNULL(name_dep,'') name_dep,
          |ISNULL(plan_start_date,'') plan_start_date,
          |ISNULL(plan_end_date,'') plan_end_date,
          |real_start_date,
          |real_end_date,
          |release_date,
          |ISNULL(spi,0) spi,
          |ISNULL(cpi,0) cpi,
          |ISNULL(pai,0) pai,
          |ISNULL(pae,0) pae,
          |count_project,
          |count_task,
          |count_subtask,
          |ISNULL(pmo,'') pmo,
          |ISNULL(hours,0) hours,
          |ISNULL(allocation,0) allocation,
          |count_subtask_usr
          |FROM art_program_management
          |order by program_id,project_id,task_id,subtask_id
        """.stripMargin

      val data=SQL(sqlstr).as(Report.report *)
      System.out.println("ejecuto query")

      var fila1 ="Tipo	Número	Programa	Foco	Tamaño	Lider	Tipo programa	Estado	Impacto	División	Gerencia	Departamento	Inicio	Término	Liberación	Spi	Cpi	informado	Esperado	N° proyectos	N° tareas	N° subtareas	Pmo	Consumidas	Asignadas	recursos sin horas"
      var cuerpo = ""
      cuerpo = cuerpo + fila1
      var i =0

      for (s <- data) {
          cuerpo += s.tipo.getOrElse("")+"\t"
          cuerpo += s.pcod.getOrElse(0).toString+"\t"
          cuerpo += s.program_name.getOrElse("")+"\t"
          cuerpo += s.foco.getOrElse("")+"\t"
          cuerpo += s.tamano.getOrElse("")+"\t"
          cuerpo += s.nombre_lider.getOrElse("")+"\t"
          cuerpo += s.program_type.getOrElse("")+"\t"
          cuerpo += s.work_flow_status.getOrElse("")+"\t"
          cuerpo += s.impact_type.getOrElse("")+"\t"
          cuerpo += s.name_div.getOrElse("")+"\t"
          cuerpo += s.name_man.getOrElse("")+"\t"
          cuerpo += s.name_dep.getOrElse("")+"\t"
          cuerpo += s.plan_start_date.getOrElse("").toString+"\t"
          cuerpo += s.plan_end_date.getOrElse(0).toString()+"\t"
          cuerpo += s.release_date.getOrElse(0).toString()+"\t"
          cuerpo += s.spi.getOrElse(0).toString()+"\t"
          cuerpo += s.cpi.getOrElse(0).toString()+"\t"
          cuerpo += s.pai.getOrElse(0).toString+"\t"
          cuerpo += s.pae.getOrElse(0).toString+"\t"
          cuerpo += s.count_project.getOrElse(0).toString+"\t"
          cuerpo += s.count_task.getOrElse(0).toString+"\t"
          cuerpo += s.count_subtask.getOrElse(0).toString+"\t"
          cuerpo += s.pmo.getOrElse("")+"\t"
          cuerpo += s.hours.getOrElse(0).toString+"\t"
          cuerpo += s.allocation.getOrElse(0).toString+"\t"
          cuerpo += s.count_subtask_usr.getOrElse(0).toString+"\t"
          cuerpo += "\n"
          i = i +1
          System.out.print(".")
      }
      cuerpo.toString

    }
  }

  def generaReporteHorasFabrica() {

    var sqlString = "EXEC art.reporte_horas_automatico 2418"
    System.out.println("generaReporteHorasFabrica")
    DB.withConnection { implicit connection =>
      SQL(sqlString).execute
    }
  }

  def reportHorasFabrica() = {
    DB.withConnection { implicit connection =>
      val sqlstr ="select * from art_reporte_horas".stripMargin

      //SQL("EXEC art.reporte_horas_automatico 1234").executeQuery() as (scalar[Int].single)

      System.out.println("reportHorasFabrica")
      val data=SQL(sqlstr).as(ReportHoras.reporthoras *)


      val file = new File(Play.application().configuration().getString("bdc.documents.location") + "/alldocuments/reportehorasfabrica.xlsx")
      val fileOut = new FileOutputStream(file)
      val wb = new XSSFWorkbook
      val sheet = wb.createSheet("ART")

      val rowHead = sheet.createRow(0)
      val style = wb.createCellStyle()
      val font = wb.createFont()

      var rNum = 1
      var cNum = 0

      font.setFontName(org.apache.poi.hssf.usermodel.HSSFFont.FONT_ARIAL)
      font.setFontHeightInPoints(12)
      font.setBold(true)
      style.setFont(font)


      rowHead.createCell(0).setCellValue("Nombre")
      rowHead.createCell(1).setCellValue("Mes")
      rowHead.createCell(2).setCellValue("Programa")
      rowHead.createCell(3).setCellValue("Proyecto")
      rowHead.createCell(4).setCellValue("Tarea")
      rowHead.createCell(5).setCellValue("Subtarea")
      rowHead.createCell(6).setCellValue("Horas")
      rowHead.createCell(7).setCellValue("Area")
      rowHead.createCell(8).setCellValue("Departamento")


      for (j <- 0 to 8)
        rowHead.getCell(j).setCellStyle(style)
      //nombre	mes	programa	proyecto	tarea	subtarea	horas
      for (s <- data) {
        val row = sheet.createRow(rNum)

        val cel0 = row.createCell(cNum)
        cel0.setCellValue(s.nombre)

        val cel1 = row.createCell(cNum + 1)
        cel1.setCellValue(s.mes)

        val cel2 = row.createCell(cNum + 2)
        cel2.setCellValue(s.programa)

        val cel3 = row.createCell(cNum + 3)
        cel3.setCellValue(s.proyecto)

        val cel4 = row.createCell(cNum + 4)
        cel4.setCellValue(s.tarea)

        val cel5 = row.createCell(cNum + 5)
        cel5.setCellValue(s.subtarea)

        val cel6 = row.createCell(cNum + 6)
        cel6.setCellValue(s.horas)

        val cel7 = row.createCell(cNum + 7)
        cel7.setCellValue(s.area)

        val cel8 = row.createCell(cNum + 8)
        cel8.setCellValue(s.departamento)

        rNum = rNum + 1
        cNum = 0

      }

      for (a <- 0 to 8) {
        sheet.autoSizeColumn((a.toInt));
      }
      wb.write(fileOut)
      fileOut.close()

    }
  }
}