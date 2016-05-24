package models

import anorm._
import anorm.SqlParser._
import java.util.Date
import play.api.libs.json._

/**
 * @author cristian
 */

case class UserStory(us_id: Int,
                    us_code: String,
                    //program_id: Int,
                    //program_name: String,
                    rol: String,
                    funcion: String,
					          resultado: String,
                    descripcion:Option[String],
                    epica: Option[String],
                    tema: Option[String],
                    created_by: Int,
                    created_by_name: String)

object UserStory {
  val userStory = {
    get[Int]("us_id") ~
      get[String]("us_code") ~
      //get[Int]("program_id") ~
      //get[String]("program_name") ~
      get[String]("rol") ~
	    get[String]("funcion") ~
      get[String]("resultado") ~
      get[Option[String]]("descripcion") ~
      get[Option[String]]("epica") ~
      get[Option[String]]("tema") ~
      get[Int]("created_by") ~
      get[String]("created_by_name")  map {
        case us_id ~
          us_code ~
          //program_id ~
          //program_name ~
          rol ~
		      funcion ~
          resultado ~
          descripcion ~
          epica ~
          tema ~
          created_by ~
          created_by_name  => UserStory(us_id,
          us_code,
          //program_id,
          //program_name,
          rol,
		      funcion,
          resultado,
          descripcion,
          epica,
          tema,
          created_by,
          created_by_name)
      }

  }
  /*
  implicit val incidentWrites = new Writes[Incident] {
    def writes(incident: Incident) = Json.obj(
      "incident_id" -> incident.incident_id.toInt,
      "configuration_id" -> incident.configuration_id.toInt,
      "program_id" -> incident.program_id.toInt,
      "date_creation" -> incident.date_creation.get,
      "ir_number" -> incident.ir_number.toString(),
	    "alm_number" -> incident.alm_number.toString(),
      "uname" -> incident.uname.toString(),
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
  
  */
}
/*
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
*/

