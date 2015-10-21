package models

import anorm._
import anorm.SqlParser._
import play.api.libs.json.Json
import java.util.Date

/**
 * @author marcelo
 */

case class Incident(incident_id: Int,
                    configuration_id: Int,
                    program_id: Int,
                    date_creation: Date,
                    ir_number: String,
                    user_sponsor_id: Int,
                    brief_description: String,
                    extended_description: String,
                    severity_id: Int,
                    date_end: Date,
                    task_owner_id: Int,
                    user_creation_id: Int,
                    task_id: Int,
                    task_title: String,
                    configuration_name: String,
                    program_name: String,
                    sponsor_name: String,
                    owner_name: String,
                    status_id:Int,
                    note:String)

object Incident {
  val incident = {
    get[Int]("incident_id") ~
      get[Int]("configuration_id") ~
      get[Int]("program_id") ~
      get[Date]("date_creation") ~
      get[String]("ir_number") ~
      get[Int]("user_sponsor_id") ~
      get[String]("brief_description") ~
      get[String]("extended_description") ~
      get[Int]("severity_id") ~
      get[Date]("date_end") ~
      get[Int]("task_owner_id") ~
      get[Int]("user_creation_id") ~
      get[Int]("task_id") ~
      get[String]("task_title") ~
      get[String]("configuration_name") ~
      get[String]("program_name") ~
      get[String]("sponsor_name") ~
      get[String]("owner_name") ~
      get[Int]("status_id") ~
      get[String]("note") map {
        case incident_id ~
          configuration_id ~
          program_id ~
          date_creation ~
          ir_number ~
          user_sponsor_id ~
          brief_description ~
          extended_description ~
          severity_id ~
          date_end ~
          task_owner_id ~
          user_creation_id ~
          task_id ~
          task_title ~
          configuration_name ~
          program_name ~
          sponsor_name ~
          owner_name ~
          status_id ~
          note => Incident(incident_id,
          configuration_id,
          program_id,
          date_creation,
          ir_number,
          user_sponsor_id,
          brief_description,
          extended_description,
          severity_id,
          date_end,
          task_owner_id,
          user_creation_id,
          task_id,
          task_title,
          configuration_name,
          program_name,
          sponsor_name,
          owner_name,
          status_id,
          note)
      }

  }
  implicit val incidentWrites = Json.writes[Incident]
}

case class Configuration(
  configuration_id: Int,
  configuration_name: String,
  configuration_description: String,
  configuration_secuence: Int,
  class_id: Int,
  configuration_program_type: Int,
  configuration_project_mode: Int,
  task_discipline_id: Int,
  program_stage_id: Int,
  user_role: Int,
  configuration_deliverable: Int,
  task_type: Int,
  incident_status_id: Int)

object Configuration {
  val configuration = {
    get[Int]("configuration_id") ~
      get[String]("configuration_name") ~
      get[String]("configuration_description") ~
      get[Int]("configuration_secuence") ~
      get[Int]("class_id") ~
      get[Int]("configuration_program_type") ~
      get[Int]("configuration_project_mode") ~
      get[Int]("task_discipline_id") ~
      get[Int]("program_stage_id") ~
      get[Int]("user_role") ~
      get[Int]("configuration_deliverable") ~
      get[Int]("task_type") ~
      get[Int]("incident_status_id") map {
        case configuration_id ~
          configuration_name ~
          configuration_description ~
          configuration_secuence ~
          class_id ~
          configuration_program_type ~
          configuration_project_mode ~
          task_discipline_id ~
          program_stage_id ~
          user_role ~
          configuration_deliverable ~
          task_type ~
          incident_status_id => Configuration(
          configuration_id,
          configuration_name,
          configuration_description,
          configuration_secuence,
          class_id,
          configuration_program_type,
          configuration_project_mode,
          task_discipline_id,
          program_stage_id,
          user_role,
          configuration_deliverable,
          task_type,
          incident_status_id)
      }

  }
  implicit val configurationWrites = Json.writes[Configuration]
}

case class ComboConfiguration(
  configuration_id: Int,
  configuration_name: String)

object ComboConfiguration {
  val comboConfiguration = {
    get[Int]("configuration_id") ~
      get[String]("configuration_name") map {
        case configuration_id ~
          configuration_name => ComboConfiguration(
          configuration_id,
          configuration_name)
      }

  }
  implicit val configurationWrites = Json.writes[ComboConfiguration]
}

case class Severity(
  severity_id: Int,
  class_id: Int,
  severity_code: String,
  severity_description: String,
  severity_days: Int)

object Severity {
  val severity = {
    get[Int]("severity_id") ~
      get[Int]("class_id") ~
      get[String]("severity_code") ~
      get[String]("severity_description") ~
      get[Int]("severity_days") map {
        case severity_id ~
          class_id ~
          severity_code ~
          severity_description ~
          severity_days => Severity(
          severity_id,
          class_id,
          severity_code,
          severity_description,
          severity_days)
      }

  }
  implicit val severityWrites = Json.writes[Severity]
}

case class ErrorIncident(
  error_code: Int,
  error_text: String,
  task_id: Int)

object ErrorIncident {
  val error = {
    get[Int]("error_code") ~
      get[String]("error_text") ~
      get[Int]("task_id") map {
        case error_code ~
          error_text ~
          task_id => ErrorIncident(
          error_code,
          error_text,
          task_id)
      }

  }
  implicit val errorWrites = Json.writes[ErrorIncident]
}  

case class ComboStatus(
  status_id: Int,
  status_name: String)

object ComboStatus {
  val comboComboStatus = {
    get[Int]("status_id") ~
      get[String]("status_name") map {
        case status_id ~
          status_name => ComboStatus(
          status_id,
          status_name)
      }

  }
  implicit val configurationWrites = Json.writes[ComboConfiguration]
}


case class Status(
  log_id: Int,
  incident_id: Int,
  status_name: String,
  log_date: Date,
  note:String)

object Status {
  val status = {
    get[Int]("log_id") ~
      get[Int]("incident_id") ~
      get[String]("status_name") ~
      get[Date]("log_date") ~
      get[String]("note") map {
        case log_id ~
          incident_id ~
          status_name ~
          log_date ~ 
          note => Status(
          log_id,
          incident_id,
          status_name,
          log_date,
          note)
      }

  }
  implicit val statusWrites = Json.writes[Status]
}