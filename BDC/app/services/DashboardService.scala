package services;
import play.api.Play.current
import play.api.db.DB;
import anorm.SqlParser._;
import models._;
import anorm._
//import com.typesafe.plugin._;

object DashboardService {

  /*
  def cuentaRegistros(): Int = {
    DB.withConnection { implicit connection =>
      SQL("EXEC programa.panel_principal_count").executeQuery().as(scalar[Int].single)
    }
  }
  
  def reportPanel(): Seq[PanelExcel] = {

    var sqlString = "EXEC dashboard.reporte_excel"
    DB.withConnection { implicit connection =>
      SQL(sqlString).executeQuery() as (PanelExcel.panelexcel *)
    }
  }
  */
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

  def getProgramExcel(pid: String): Seq[ATMExcel] = {

    var sqlString = "EXEC reporte.excel {pid}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('pid -> pid.toInt).executeQuery() as (ATMExcel.atmExcel *)
    }
  }

  def reportProgram(pageSize: String, pageNumber: String, Json: String): Seq[ATM] = {

    var sqlString = "EXEC reporte.programa_dash {PageSize},{PageNumber},{Json}"
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

  def programCount(Json: String): Int = {

    var sqlString = "EXEC reporte.cantidad_programa_dash {Json}"

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
}