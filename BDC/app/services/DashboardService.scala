package services;
import play.api.Play.current
import play.api.db.DB;
import anorm.SqlParser._;
import models._;
import anorm._

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

  def cantidadProgramaPorSapFiltrado(did: String, Json: String): Int = {
    //println(Json)
    var sqlString = "EXEC art.cantidad_programas_por_sap_filtrado {did},{Json}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('did -> did.toInt, 'Json -> Json).executeQuery() as (scalar[Int].single)
    }
  }  
  

  def reportBubble(): Seq[Bubble] = {

    var sqlString = "EXEC art.bubble"
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
  
  def getProgramExcel(pid: String): Seq[ATM] = {

    var sqlString = "EXEC art.excel {pid}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('pid -> pid.toInt).executeQuery() as (ATM.atm *)
    }
  }

  def reportProgram(pageSize: String, pageNumber: String, Json: String): Seq[ATM] = {

    var sqlString = "EXEC art.programa {PageSize},{PageNumber},{Json}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt, 'Json -> Json).executeQuery() as (ATM.atm *)
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
}