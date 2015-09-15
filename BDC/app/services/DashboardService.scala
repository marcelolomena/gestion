package services;
import play.api.Play.current
import play.api.db.DB;
import anorm.SqlParser._;
import models._;
import anorm._

object DashboardService {

  def reporteProgramaFiltrado(pageSize: String, pageNumber: String, Json: String): Seq[Panel] = {
    //println(Json)
    var sqlString = "EXEC dashboard.programas_por_division_filtrado {PageSize},{PageNumber},{Json}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt, 'Json -> Json).executeQuery() as (Panel.panel *)
    }
  }

  def cantidadProgramaFiltrado(Json: String): Int = {
    //println(Json)
    var sqlString = "EXEC dashboard.cantidad_programas_por_division_filtrado {Json}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('Json -> Json).executeQuery() as (scalar[Int].single)
    }
  }

  def reportBubble(): Seq[Bubble] = {

    var sqlString = "EXEC dashboard.bubble"
    DB.withConnection { implicit connection =>
      SQL(sqlString).executeQuery() as (Bubble.bubble *)
    }
  }

  def getProgramExcel(pid: String): Seq[ATM] = {

    var sqlString = "EXEC reporte.excel {pid}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('pid -> pid.toInt).executeQuery() as (ATM.atm *)
    }
  }

  def reportProgram(pageSize: String, pageNumber: String, Json: String): Seq[ATM] = {

    var sqlString = "EXEC reporte.programa {PageSize},{PageNumber},{Json}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt, 'Json -> Json).executeQuery() as (ATM.atm *)
    }
  }

  def reportProject(pid: String, pageSize: String, pageNumber: String): Seq[ATM] = {

    var sqlString = "EXEC reporte.proyecto {pid},{PageSize},{PageNumber}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('pid -> pid.toInt, 'PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt).executeQuery() as (ATM.atm *)
    }
  }

  def reportSubTask(pid: String, pageSize: String, pageNumber: String): Seq[ATM] = {

    var sqlString = "EXEC reporte.sub_tarea {pid},{PageSize},{PageNumber}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('pid -> pid.toInt, 'PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt).executeQuery() as (ATM.atm *)
    }
  }


  def reportStateSubTaskCount(Json: String): Int = {

    var sqlString = "EXEC reporte.cantidad_estado_sub_tarea {Json}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('Json -> Json).executeQuery() as (scalar[Int].single)
    }
  }

  def reportStateSubTask(pageSize: String, pageNumber: String, Json: String): Seq[StateSubTarea] = {

    var sqlString = "EXEC reporte.estado_sub_tarea {PageSize},{PageNumber},{Json}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt, 'Json -> Json).executeQuery() as (StateSubTarea.state *)
    }
  }  
  
  def programCount(Json: String): Int = {

    var sqlString = "EXEC reporte.cantidad_programa {Json}"

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