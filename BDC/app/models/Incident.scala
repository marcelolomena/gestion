package models

import anorm._
import anorm.SqlParser._
import java.util.Date
import play.api.libs.json._

/**
 * @author marcelo
 */

case class Incident(incident_id: Int,
                    configuration_id: Int,
                    program_id: Int,
                    date_creation: Option[Date],
                    ir_number: String,
					          alm_number: Option[String],
                    user_sponsor_id: Int,
                    brief_description: String,
                    extended_description: String,
                    severity_id: Int,
                    date_end: Option[Date],
                    task_owner_id: Int,
                    project_manager_id:Int,
                    program_manager_id:Int,
                    user_creation_id: Int,
                    task_id: Int,
                    task_title: String,
                    configuration_name: String,
                    program_name: String,
                    sponsor_name: String,
                    owner_name: String,
                    note: String,
                    severity_description: String,
                    dId: Int,
                    department: String,
                    status_id: Int,
                    status_name: String)

object Incident {
  val incident = {
    get[Int]("incident_id") ~
      get[Int]("configuration_id") ~
      get[Int]("program_id") ~
      get[Option[Date]]("date_creation") ~
      get[String]("ir_number") ~
	    get[Option[String]]("alm_number") ~
      get[Int]("user_sponsor_id") ~
      get[String]("brief_description") ~
      get[String]("extended_description") ~
      get[Int]("severity_id") ~
      get[Option[Date]]("date_end") ~
      get[Int]("task_owner_id") ~
      get[Int]("project_manager_id") ~
      get[Int]("program_manager_id") ~
      get[Int]("user_creation_id") ~
      get[Int]("task_id") ~
      get[String]("task_title") ~
      get[String]("configuration_name") ~
      get[String]("program_name") ~
      get[String]("sponsor_name") ~
      get[String]("owner_name") ~
      get[String]("note") ~
      get[String]("severity_description") ~
      get[Int]("dId") ~
      get[String]("department") ~
      get[Int]("status_id") ~
      get[String]("status_name") map {
        case incident_id ~
          configuration_id ~
          program_id ~
          date_creation ~
          ir_number ~
		      alm_number ~
          user_sponsor_id ~
          brief_description ~
          extended_description ~
          severity_id ~
          date_end ~
          task_owner_id ~
          project_manager_id ~
          program_manager_id ~
          user_creation_id ~
          task_id ~
          task_title ~
          configuration_name ~
          program_name ~
          sponsor_name ~
          owner_name ~
          note ~
          severity_description ~
          dId ~
          department ~
          status_id ~
          status_name => Incident(incident_id,
          configuration_id,
          program_id,
          date_creation,
          ir_number,
		      alm_number,
          user_sponsor_id,
          brief_description,
          extended_description,
          severity_id,
          date_end,
          task_owner_id,
          project_manager_id,
          program_manager_id,
          user_creation_id,
          task_id,
          task_title,
          configuration_name,
          program_name,
          sponsor_name,
          owner_name,
          note,
          severity_description,
          dId,
          department,
          status_id,
          status_name)
      }

  }
  implicit val incidentWrites = new Writes[Incident] {
    def writes(incident: Incident) = Json.obj(
      "incident_id" -> incident.incident_id.toInt,
      "configuration_id" -> incident.configuration_id.toInt,
      "program_id" -> incident.program_id.toInt,
      "date_creation" -> incident.date_creation.get,
      "ir_number" -> incident.ir_number.toString(),
	    "alm_number" -> incident.alm_number.toString(),
      "user_sponsor_id" -> incident.user_sponsor_id.toInt,
      "brief_description" -> incident.brief_description.toString(),
      "extended_description" -> incident.extended_description.toString(),
      "severity_id" -> incident.severity_id.toInt,
      "date_end" -> incident.date_end.get,
      "task_owner_id" -> incident.task_owner_id.toInt,
      "project_manager_id" -> incident.project_manager_id.toInt,
      "program_manager_id" -> incident.program_manager_id.toInt,
      "user_creation_id" -> incident.user_creation_id.toInt,
      "task_id" -> incident.task_id.toInt,
      "task_title" -> incident.task_title.toString(),
      "configuration_name" -> incident.configuration_name.toString(),
      "program_name" -> incident.program_name.toString(),
      "sponsor_name" -> incident.sponsor_name.toString(),
      "owner_name" -> incident.owner_name.toString(),
      "note" -> incident.note.toString(),
      "severity_description" -> incident.severity_description.toString(),
      "dId" -> incident.dId.toInt,
      "department" -> incident.department.toString(),
      "status_id" -> incident.status_id.toInt,
      "status_name" -> incident.status_name.toString())
  }
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
  severity_days: Int,
  project_mode: Int,
  configuration_id: Int
  )

object Severity {
  val severity = {
    get[Int]("severity_id") ~
      get[Int]("class_id") ~
      get[String]("severity_code") ~
      get[String]("severity_description") ~
      get[Int]("severity_days") ~
      get[Int]("project_mode") ~
      get[Int]("configuration_id") map {
        case severity_id ~
          class_id ~
          severity_code ~
          severity_description ~
          severity_days ~
          project_mode ~
          configuration_id => Severity(
          severity_id,
          class_id,
          severity_code,
          severity_description,
          severity_days,
          project_mode,
          configuration_id)
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

case class NameUsr(
  value: String,
  label: String)

object NameUsr {
  val name = {
    get[String]("value") ~
      get[String]("label") map {
        case value ~ label => NameUsr(
          value, label)
      }

  }
  implicit val nameUsr = Json.writes[NameUsr]
}

case class ComboStatus(
  status_id: Int,
  status_name: String)

object ComboStatus {
  val comboStatus = {
    get[Int]("status_id") ~
      get[String]("status_name") map {
        case status_id ~
          status_name => ComboStatus(
          status_id,
          status_name)
      }

  }
  implicit val configurationWrites = Json.writes[ComboStatus]
}

case class ComboDepartament(
  dId: Int,
  department: String)

object ComboDepartament {
  val comboDepartament = {
    get[Int]("dId") ~
      get[String]("department") map {
        case dId ~
          department => ComboDepartament(
          dId,
          department)
      }

  }
  implicit val configurationWrites = Json.writes[ComboDepartament]
}

case class Status(
  log_id: Int,
  incident_id: Int,
  status_name: String,
  log_date: Date,
  note: String,
  user_creation_name: String)

object Status {
  val status = {
    get[Int]("log_id") ~
      get[Int]("incident_id") ~
      get[String]("status_name") ~
      get[Date]("log_date") ~
      get[String]("note") ~
      get[String]("user_creation_name") map {
        case log_id ~
          incident_id ~
          status_name ~
          log_date ~
          note ~
          user_creation_name => Status(
          log_id,
          incident_id,
          status_name,
          log_date,
          note,
          user_creation_name)
      }

  }
  implicit val statusWrites = Json.writes[Status]
}

case class Hours(
    task_owner_id: Int,
  task_id: Int,
  sub_task_id: Int,
  uid: Int,
  nombre: String,
  planeadas: Double,
  trabajadas: Double,
  ingresadas: Double,
  nota: String)

object Hours {
  val hours = {
    get[Int]("task_owner_id") ~
    get[Int]("task_id") ~
      get[Int]("sub_task_id") ~
      get[Int]("uid") ~
      get[String]("nombre") ~
      get[Double]("planeadas") ~
      get[Double]("trabajadas") ~
      get[Double]("ingresadas") ~
      get[String]("nota") map {
        case
        task_owner_id ~
        task_id ~
          sub_task_id ~
          uid ~
          nombre ~
          planeadas ~
          trabajadas ~
          ingresadas ~
          nota => Hours(
          task_owner_id,    
          task_id,
          sub_task_id,
          uid,
          nombre,
          planeadas,
          trabajadas,
          ingresadas,
          nota)
      }

  }
  implicit val hoursWrites = Json.writes[Hours]
}

case class IncidentSubTask(
    sno:Int,
    cantidad:Int,
  sub_task_id: Int,
  task_id: Int,
  task_owner_id: Int,
  project_manager_id: Int,
  program_manager_id: Int,
  title: String,
  description: String,
  plan_start_date: Option[Date],
  plan_end_date: Option[Date],
  real_start_date: Option[Date],
  real_end_date: Option[Date],
  completion_percentage: Double,
  hours: Double,
  expected_percentage: Double,
  fecini: String)

object IncidentSubTask {
  val incidentsubtask = {
    get[Int]("sno") ~
    get[Int]("cantidad") ~
    get[Int]("sub_task_id") ~
    get[Int]("task_id") ~
    get[Int]("task_owner_id") ~
    get[Int]("project_manager_id") ~
    get[Int]("program_manager_id") ~
      get[String]("title") ~
      get[String]("description") ~
      get[Option[Date]]("plan_start_date") ~
      get[Option[Date]]("plan_end_date") ~
      get[Option[Date]]("real_start_date") ~
      get[Option[Date]]("real_end_date") ~
      get[Double]("completion_percentage") ~
      get[Double]("hours") ~
      get[Double]("expected_percentage") ~
      get[String]("fecini") map {
        case sno ~
        cantidad ~
        sub_task_id ~
        task_id ~
        task_owner_id ~
        project_manager_id ~
        program_manager_id ~
          title ~
          description ~
          plan_start_date ~
          plan_end_date ~
          real_start_date ~
          real_end_date ~
          completion_percentage ~
          hours ~
          expected_percentage ~
          fecini => IncidentSubTask(
              sno,
              cantidad,
          sub_task_id,
          task_id,
          task_owner_id,
          project_manager_id,
          program_manager_id,
          title,
          description,
          plan_start_date,
          plan_end_date,
          real_start_date,
          real_end_date,
          completion_percentage,
          hours,
          expected_percentage,
          fecini)
      }

  }
  //implicit val hoursWrites = Json.writes[IncidentSubTask]
  implicit val hoursWrites = new Writes[IncidentSubTask] {
    def writes(incident: IncidentSubTask) = Json.obj(
      "sno" -> incident.sno.toInt,
      "cantidad" -> incident.cantidad.toInt,
      "sub_task_id" -> incident.sub_task_id.toInt,
      "task_id" -> incident.task_id.toInt,
      "task_owner_id" -> incident.task_owner_id.toInt,
      "title" -> incident.toString(),
      "plan_start_date" -> incident.plan_start_date.get,
      "plan_end_date" -> incident.plan_end_date.get,
      "real_start_date" -> incident.real_start_date.get,
      "real_end_date" -> incident.real_end_date.get,
      "completion_percentage" -> incident.completion_percentage.toDouble,
      "hours" -> incident.hours.toDouble,
      "expected_percentage" -> incident.expected_percentage.toDouble)
  }  
  
}


