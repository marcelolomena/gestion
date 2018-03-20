package services;
import play.api.Play.current
import play.api.db.DB;
import anorm.SqlParser._;
import models._;
import anorm._
import play.Logger
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

  def reportBubble(uid:String): Seq[Bubble] = {

    var sqlString = "EXEC art.bubble "+uid
    DB.withConnection { implicit connection =>
      SQL(sqlString).executeQuery() as (Bubble.bubble *)
    }
  }

  def reportPie(): Seq[Pie] = {

    var sqlString = "EXEC art.porcentaje_programas_for_division"
    DB.withConnection { implicit connection =>
      SQL(sqlString).executeQuery() as (Pie.pie *)
    }
  }

  def reportType(): Seq[Pie] = {

    var sqlString = "EXEC art.porcentaje_programas_for_type"
    DB.withConnection { implicit connection =>
      SQL(sqlString).executeQuery() as (Pie.pie *)
    }
  }

  def reportDepa(): Seq[Pie] = {

    var sqlString = "EXEC art.porcentaje_programas_for_departamento"
    DB.withConnection { implicit connection =>
      SQL(sqlString).executeQuery() as (Pie.pie *)
    }
  }

  def reportSubType(): Seq[Pie] = {

    var sqlString = "EXEC art.porcentaje_programas_for_subtype"
    DB.withConnection { implicit connection =>
      SQL(sqlString).executeQuery() as (Pie.pie *)
    }
  }

  def reportStatus(): Seq[Pie] = {

    var sqlString = "EXEC art.porcentaje_programas_for_status"
    DB.withConnection { implicit connection =>
      SQL(sqlString).executeQuery() as (Pie.pie *)
    }
  }

  def reportSap(): Seq[Pie] = {

    var sqlString = "EXEC art.porcentaje_programas_for_sap"
    DB.withConnection { implicit connection =>
      SQL(sqlString).executeQuery() as (Pie.pie *)
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

      //Logger.debug("ini : " + ini)
      //Logger.debug("end : " + end)
      //Logger.debug("filter : " + filter)
      //Logger.debug("order : " + order)

      val sqlString =
          """SELECT
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
            count_subtask
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
            program_id,
            ISNULL(project_id,0) project_id,
            ISNULL(task_id,0) task_id,
            ISNULL(subtask_id,0) subtask_id,
            program_name,
            nombre_lider,
            program_type,
            work_flow_status,
            name_div,
            name_man,
            name_dep,
            plan_start_date,
            plan_end_date,
            real_start_date,
            real_end_date,
            ROUND(pai,2) pai,
            ROUND(pae,2) pae,
            ROUND(spi,2) spi,
            ROUND(cpi,2) cpi,
            ROUND(hours,2) hours,
            ROUND(allocation,2) allocation,
            pcod,
            foco,
            tamano
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

  def updateTableManager(): Boolean = {

    DB.withConnection { implicit connection =>
      val lola=SQL("exec proc_art_program_management").execute()
      Logger.debug("traza : " + lola )
      lola
    }
  }


}