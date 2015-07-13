package models
import anorm.SqlParser._
import anorm._
import java.util.Date

case class ProjectWorkflow(id: Option[Int], project_workflow_status: String, description: String)

object ProjectWorkflow {

  val projectWorkflow = {
    get[Option[Int]]("id") ~
      get[String]("project_workflow_status") ~
      get[String]("description") map {
        case id ~ project_workflow_status ~ description => ProjectWorkflow(id, project_workflow_status, description)
      }
  }
}

case class ProjectWorkflowMaster(id: Option[Int], project_workflow_status: String, description: String, created_by: Int, updation_date: Option[Date], is_deleted: Boolean);

object ProjectWorkflowMaster extends CustomColumns{

  val projectWorkflowMaster = {
    get[Option[Int]]("id") ~
      get[String]("project_workflow_status") ~
      get[String]("description") ~
      get[Int]("created_by") ~
      get[Option[Date]]("updation_date") ~
      get[Boolean]("is_deleted") map {
        case id ~ project_workflow_status ~ description ~ created_by ~ updation_date ~ is_deleted => ProjectWorkflowMaster(id, project_workflow_status, description, created_by, updation_date, is_deleted)
      }
  }
}