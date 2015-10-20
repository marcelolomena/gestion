package services

import play.api.Play.current
import play.api.db.DB
import models.Incident
import models.Configuration
import models.ComboConfiguration
import models.ProgramCombo
import models.Severity
import models.ComboStatus
import models.ErrorIncident
import anorm._
import anorm.SqlParser._

/**
 * @author marcelo
 */
object IncidentService {

  def list(pageSize: String, pageNumber: String, Json: String): Seq[Incident] = {

    var sqlString = "EXEC art.list_incident {PageSize},{PageNumber},{Json}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt, 'Json -> Json).executeQuery() as (Incident.incident *)
    }
  }

  def validateCodIR(id: String): Int = {
    var sqlString = ""
    sqlString = "EXEC art.validate_incident_codir {codir}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('codir -> id).as(scalar[Int].single)
    }
  }

  def delete(id: String): Int = {
    var sqlString = ""
    sqlString = "EXEC art.delete_incident {id}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('id -> id.toInt).as(scalar[Int].single)
    }
  }

  def update(incident_id: String,
             status_id: String,
             user_creation_id:String,
             note: String): Option[ErrorIncident] = {

    var sqlString = """
      EXEC art.update_incident {incident_id},{status_id},
      {user_creation_id},{note}
      """

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('incident_id -> incident_id.toInt,
        'status_id -> status_id.toInt,
        'user_creation_id -> user_creation_id.toInt,
        'note -> note).executeQuery() as (ErrorIncident.error.singleOpt)
    }
  }

  def save(configuration_id: String,
           program_id: String,
           date_creation: String,
           ir_number: String,
           user_sponsor_id: String,
           brief_description: String,
           extended_description: String,
           severity_id: String,
           date_end: String,
           task_owner_id: String,
           user_creation_id: String): Option[ErrorIncident] = {

    var sqlString = """
      EXEC art.save_incident {configuration_id},{program_id},
      {date_creation},{ir_number},{user_sponsor_id},{brief_description},
      {extended_description},{severity_id},{date_end},{task_owner_id},{user_creation_id}
      """

    //println(sqlString)

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('configuration_id -> configuration_id.toInt,
        'program_id -> program_id.toInt,
        'date_creation -> date_creation,
        'ir_number -> ir_number,
        'user_sponsor_id -> user_sponsor_id.toInt,
        'brief_description -> brief_description,
        'extended_description -> extended_description,
        'severity_id -> severity_id.toInt,
        'date_end -> date_end,
        'task_owner_id -> task_owner_id.toInt,
        'user_creation_id -> user_creation_id.toInt).executeQuery() as (ErrorIncident.error.singleOpt)
    }
  }

  def count(Json: String): Int = {

    var sqlString = "EXEC art.count_incident {Json}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('Json -> Json).executeQuery() as (scalar[Int].single)
    }
  }

  def selectTypeFromId(id: String): Int = {
    var sqlString = ""
    sqlString = "SELECT configuration_program_type FROM art_incident_configuration WHERE configuration_id={id}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('id -> id.toInt).as(scalar[Int].single)
    }
  }

  def selectSeverityDays(id: String): Int = {
    var sqlString = ""
    sqlString = "SELECT severity_days FROM art_incident_severity WHERE severity_id={id}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('id -> id.toInt).as(scalar[Int].single)
    }
  }

  def selectTypeIncident: Seq[ComboConfiguration] = {
    var sqlString = ""
    sqlString = "SELECT configuration_id, RTRIM(configuration_name) configuration_name from art_incident_configuration where class_id = 1"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ComboConfiguration.comboConfiguration *)
    }
  }

  def selectStatusIncident: Seq[ComboStatus] = {
    var sqlString = ""
    sqlString = "SELECT status_id, RTRIM(status_name) status_name from art_incident_status where class_id = 1"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ComboStatus.comboComboStatus *)
    }
  }

  def selectProgramForType(id: String): Seq[ProgramCombo] = {
    var sqlString = ""
    sqlString = "SELECT a.program_id,RTRIM(a.program_name) program_name from art_program a, art_incident_configuration b WHERE a.program_type=b.configuration_program_type AND b.configuration_program_type={id} AND a.is_active=1"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('id -> id.toInt).as(ProgramCombo.pCombo *)
    }
  }

  def selectSeverity: Seq[Severity] = {
    var sqlString = ""
    sqlString = "SELECT * FROM art_incident_severity"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(Severity.severity *)
    }
  }

}