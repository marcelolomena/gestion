package services;
import play.api.Play.current
import play.api.db.DB;
import anorm.SqlParser._;
import models._;
import anorm._
//import com.typesafe.plugin._;

object DashboardService {

  def cuentaRegistros(): Int = {
    DB.withConnection { implicit connection =>
      SQL("EXEC programa.panel_principal_count").executeQuery().as(scalar[Int].single)
    }
  }

  def reportPanel(): Seq[Panel] = {

    var sqlString = "EXEC programa.panel_principal"
    DB.withConnection { implicit connection =>
      SQL(sqlString).executeQuery() as (Panel.panel *)
    }
  }

  def reportPanelPaginado(pageSize: String, pageNumber: String): Seq[Panel] = {

    var sqlString = "EXEC programa.panel_principal_paginado {PageSize},{PageNumber}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt).executeQuery() as (Panel.panel *)
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

  def reportProgram(pageSize: String, pageNumber: String): Seq[ATM] = {

    var sqlString = "EXEC reporte.programa {PageSize},{PageNumber}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt).executeQuery() as (ATM.atm *)
    }
  }

  def reportProject(pid: String, pageSize: String, pageNumber: String): Seq[ATM] = {

    var sqlString = "EXEC reporte.proyecto {pid},{PageSize},{PageNumber}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('pid -> pid.toInt,'PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt).executeQuery() as (ATM.atm *)
    }
  }

  def reportSubTask(pid: String, pageSize: String, pageNumber: String): Seq[ATM] = {

    var sqlString = "EXEC reporte.sub_tarea {pid},{PageSize},{PageNumber}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('pid -> pid.toInt,'PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt).executeQuery() as (ATM.atm *)
    }
  }

  def programCount(): Int = {
    DB.withConnection { implicit connection =>
      var sqlString = ""
      sqlString = "SELECT count(*) FROM art_program WHERE is_active=1"
      val count: Int = SQL(sqlString).as(scalar[Int].single)
      count
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