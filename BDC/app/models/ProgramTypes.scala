package models

import anorm.SqlParser._
import anorm._
import java.util.Date
import play.api.libs.json.Json

case class ProgramTypeMaster(id: Option[Int], program_type: String, description: String, user_id: Int, creation_date: Date, is_deleted: Boolean)

object ProgramTypeMaster extends CustomColumns{

  val programtypes = {
    get[Option[Int]]("id") ~
      get[String]("program_type") ~
      get[String]("description") ~
      get[Int]("user_id") ~
      get[Date]("creation_date") ~
      get[Boolean]("is_deleted") map {
        case id ~
          program_type ~
          description ~
          user_id ~
          creation_date ~
          is_deleted => ProgramTypeMaster(id, program_type, description, user_id, creation_date, is_deleted)
      }
  }
  implicit val programtypesWrites = Json.writes[ProgramTypeMaster]
}

case class ProgramTypeCase(id: Option[Int], program_type: String, description: String)

object ProgramTypeCase {

  val programType = {
    get[Option[Int]]("id") ~
      get[String]("program_type") ~
      get[String]("description") map {
        case id ~
          program_type ~
          description => ProgramTypeCase(id, program_type, description)
      }
  }
}


case class ProgramWorkflowStatus (id: Option[Int],workflow_status: String)

object ProgramWorkflowStatus {

  val programWorkflowStatus = {
    get[Option[Int]]("id") ~
      get[String]("workflow_status") map {
        case id ~ workflow_status => ProgramWorkflowStatus(id, workflow_status)
      }
  }
  implicit val programaWrites = Json.writes[ProgramWorkflowStatus]
}