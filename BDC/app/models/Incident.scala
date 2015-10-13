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
    user_creation_id:Int,
    task_id:Int,
    is_deleted:Int
    )

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
      get[Int]("is_deleted")map {
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
        is_deleted => Incident(incident_id,
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
            is_deleted)
      }
    
  }
  implicit val incidentWrites = Json.writes[Incident]
}  
  
