package models
import anorm.SqlParser._
import play.api.Play.current
import java.util.Date
import anorm._
import play.api.db.DB

case class Departments(dId: Option[Int], department: String, user_id: Long, report_type: Int, report_to: Int, organization_depth: Int, updated_by: Option[Int], updation_date: Option[Date], is_deleted: Int)

object Departments extends CustomColumns {

  val department = {
    get[Option[Int]]("dId") ~ get[String]("department") ~ get[Long]("user_id") ~ get[Int]("report_type") ~ get[Int]("report_to") ~ get[Int]("organization_depth") ~ get[Option[Int]]("updated_by") ~ get[Option[Date]]("updation_date") ~ get[Int]("is_deleted") map {
      case dId ~ department ~ user_id ~ report_type ~ report_to ~ organization_depth ~ updated_by ~ updation_date ~ is_deleted => Departments(dId, department, user_id, report_type, report_to, organization_depth, updated_by, updation_date, is_deleted)
    }
  }
}

case class TaskType(taskTypeId: Long, dId: Long, TaskType: String)

object TaskType {

}