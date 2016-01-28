package services

import play.api.Play.current
import play.api.db.DB;
import anorm.SqlParser._;
import models._;
import anorm._
import com.typesafe.plugin._;
import play.api.data.Form
import play.i18n._
import play.mvc._

/**
 * @author marcelo
 */
object ProgramaService {
  def listado(uid: Int, PageSize: Int, page: Int, order: String, json: String): Seq[Programa] = {
    /*
println("uid:" + uid)
println("PageSize:" + PageSize)
println("page:" + page)
println("order:" +order)
println("json:" + json)
    */
    DB.withConnection { implicit connection =>
      SQL("EXEC art.list_program_master {uid},{PageSize},{page},{order},{json}").on(
        'uid -> uid,
        'PageSize -> PageSize,
        'page -> page,
        'order -> order,
        'json -> json).executeQuery().as(Programa.programa *)
    }
  }

  def listadoRecursos(pid: String, SortColumnName: String, SortOrderBy: String, NumberOfRows: Int, StartRow: Int): Seq[Recurso] = {

    DB.withConnection { implicit connection =>
      SQL("EXEC art.list_member_activity {pid},{SortColumnName},{SortOrderBy},{NumberOfRows},{StartRow}").on(
        'pid -> pid.toInt,
        'SortColumnName -> SortColumnName,
        'SortOrderBy -> SortOrderBy,
        'NumberOfRows -> NumberOfRows,
        'StartRow -> StartRow).executeQuery().as(Recurso.recurso *)
    }
  }

  def listadoAsignacionDependiente(uid: String, fecini: String, fecfin: String, size: String, page: String): Seq[Asignado] = {

    DB.withConnection { implicit connection =>
      SQL("EXEC art.asignacion_dependiente {uid},{fecini},{fecfin},{size},{page}").on(
        'uid -> uid.toInt,
        'fecini -> fecini,
        'fecfin -> fecfin,
        'size -> size.toInt,
        'page -> page.toInt).executeQuery().as(Asignado.asignado *)
    }
  }

  def cantidadSubalternos(uid: String): Int = {

    DB.withConnection { implicit connection =>
      SQL("EXEC art.cantidad_subalternos  {uid}").on(
        'uid -> uid.toInt).executeQuery().as(scalar[Int].single)
    }
  }

  def cantidad(uid: Int, json: String): Int = {
    DB.withConnection { implicit connection =>
      SQL("EXEC art.count_program_master {uid},{json}").on(
        'uid -> uid, 'json -> json).executeQuery().as(scalar[Int].single)
    }
  }

  def listPersonal(term: String): Seq[NameUsr] = {
    DB.withConnection { implicit connection =>
      SQL("EXEC art.list_program_demand {term}").on(
        'term -> term).executeQuery().as(NameUsr.name *)
    }
  }

  def grabar(program_name: String,
             program_description: String,
             planned_hours: String,
             sap_code: String,
             demand_manager: String,
             program_manager: String,
             program_type: String,
             sub_type: String,
             workflow_status: String,
             impact_type: String,
             initiation_planned_date: String,
             release_date: String,
             closure_date: String): Int = {
    DB.withConnection { implicit connection =>
      SQL("EXEC art.programa_grabar {program_name},{program_description},{planned_hours},{sap_code},{demand_manager},{program_manager},{program_type},{sub_type},{workflow_status},{impact_type},{initiation_planned_date},{release_date},{closure_date}").on(
        'program_name -> program_name,
        'program_description -> program_description,
        'planned_hours -> planned_hours.toInt,
        'sap_code -> sap_code.toInt,
        'demand_manager -> demand_manager,
        'program_manager -> program_manager,
        'program_type -> program_type.toInt,
        'sub_type -> sub_type.toInt,
        'workflow_status -> workflow_status.toInt,
        'impact_type -> impact_type.toInt,
        'initiation_planned_date -> initiation_planned_date,
        'release_date -> release_date,
        'closure_date -> closure_date).executeQuery().as(scalar[Int].single)
    }
  }

  def actualizar(
    program_id: String,
    program_name: String,
    program_description: String,
    planned_hours: String,
    sap_code: String,
    demand_manager: String,
    program_manager: String,
    program_type: String,
    sub_type: String,
    workflow_status: String,
    impact_type: String,
    initiation_planned_date: String,
    release_date: String,
    closure_date: String): Int = {
    DB.withConnection { implicit connection =>
      
  /*    
    exec art.programa_actualizar 2433,'programa truchoX','programa truchoX',1000,66699,'Raquel de las Merced Bravo Farias','Jimena Kirsinger',3,5,3,3,'2016-01-31','2016-01-31','2016-01-31'  
      println("program_id:" + program_id)
      println("program_name:" + program_name)
      println("program_description:" + program_description)
      println("planned_hours:" + planned_hours)
      println("sap_code:" + sap_code)

      println("demand_manager:" + demand_manager)
      println("program_manager:" + program_manager)
      println("program_type:" + program_type)
      println("sub_type:" + sub_type)
      println("workflow_status:" + workflow_status)

      println("impact_type:" + impact_type)
      println("initiation_planned_date:" + initiation_planned_date)
      println("release_date:" + release_date)
      println("closure_date:" + closure_date)
  
*/      
      SQL("EXEC art.programa_actualizar {program_id},{program_name},{program_description},{planned_hours},{sap_code},{demand_manager},{program_manager},{program_type},{sub_type},{workflow_status},{impact_type},{initiation_planned_date},{release_date},{closure_date}").on(
        'program_id -> program_id.toInt,
        'program_name -> program_name,
        'program_description -> program_description,
        'planned_hours -> planned_hours.toInt,
        'sap_code -> sap_code.toInt,
        'demand_manager -> demand_manager,
        'program_manager -> program_manager,
        'program_type -> program_type.toInt,
        'sub_type -> sub_type.toInt,
        'workflow_status -> workflow_status.toInt,
        'impact_type -> impact_type.toInt,
        'initiation_planned_date -> initiation_planned_date,
        'release_date -> release_date,
        'closure_date -> closure_date).executeQuery().as(scalar[Int].single)
    }
  }

  def borrar(
    program_id: String): Int = {
    DB.withConnection { implicit connection =>
      SQL("EXEC art.programa_borrar {program_id}").on(
        'program_id -> program_id).executeQuery().as(scalar[Int].single)
    }
  }
}