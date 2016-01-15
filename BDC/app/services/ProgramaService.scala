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
    
    DB.withConnection { implicit connection =>
      SQL("EXEC art.list_program_master {uid},{PageSize},{page},{order},{json}").on(
        'uid -> uid,
        'PageSize -> PageSize,
        'page -> page,
        'order -> order,
        'json -> json).executeQuery().as(Programa.programa *)
    }
  }
  
  def listadoRecursos(pid: String): Seq[Recurso] = {
    
    DB.withConnection { implicit connection =>
      SQL("EXEC art.list_member_activity {pid}").on(
        'pid -> pid.toInt).executeQuery().as(Recurso.recurso *)
    }
  }  

  def cantidad(uid: Int, json: String): Int = {
    DB.withConnection { implicit connection =>
      SQL("EXEC art.count_program_master {uid},{json}").on(
        'uid -> uid, 'json -> json).executeQuery().as(scalar[Int].single)
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
}