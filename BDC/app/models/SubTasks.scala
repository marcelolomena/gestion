package models
import anorm.SqlParser._
import play.api.Play.current
import java.util.Date
import anorm._
import play.api.db.DB
import play.api.libs.json.Json
import play.api.libs.json._

case class SubTaskAllocation(id: Option[Int], sub_task_id: Long, task_id: Long, pId: Int, user_id: Long,
  estimated_time: Double, status: Integer)

case class SubTaskAllocationExternal(id: Option[Int], sub_task_id: Long, task_id: Long, pId: Int, external_resource_id: Int,
  estimated_time: Double, status: Integer, is_deleted: Int)

object SubTaskAllocation extends CustomColumns {

  val taskAllocation = {
    get[Option[Int]]("id") ~
      get[Long]("sub_task_id") ~
      get[Long]("task_id") ~
      get[Int]("pId") ~
      get[Long]("user_id") ~
      get[Double]("estimated_time") ~
      get[Int]("status") map {
        case id ~ sub_task_id ~ task_id ~ pId ~ user_id ~ estimated_time ~ status =>
          SubTaskAllocation(id, sub_task_id, task_id, pId, user_id, estimated_time, status)
      }
  }/*
  implicit val SubTaskAllocationWrites = new Writes[SubTaskAllocation] {
    def writes(tasks: Tasks) = Json.obj(
      "tId" -> tasks.tId.toString,
      "pId" -> tasks.pId.toString,
      "task_title" -> tasks.task_title.toString,
      "task_code" -> tasks.task_code.toString,
      "plan_start_date" -> tasks.plan_start_date.toString(),
      "plan_end_date" -> tasks.plan_end_date.toString(),
      "task_description" -> tasks.task_description.toString(),
      "plan_time" -> tasks.plan_time.toString(),
      "creation_date" -> tasks.creation_date.toString(),
      "task_status" -> tasks.task_status.toString(),
      "status" -> tasks.status.toString(),
      "owner" -> tasks.owner.toString(),
      "task_discipline" -> tasks.task_discipline.toString(),
      "completion_percentage" -> tasks.completion_percentage.toString(),
      "remark" -> tasks.remark.toString(),
      "task_depend" -> tasks.task_depend.toString(),
      "dependencies_type" -> tasks.dependencies_type.toString(),
      "stage" -> tasks.stage.toString(),
      "user_role" -> tasks.user_role.toString(),
      "deliverable" -> tasks.deliverable.toString(),
      "task_type" -> tasks.task_type.toString(),
      "is_active" -> tasks.is_active.toString())
      
      
  }*/
  implicit val SubTaskAllocationWrites = Json.writes[TaskStatus]
 
}

object SubTaskAllocationExternal extends CustomColumns {

  val taskAllocationExternal = {
    get[Option[Int]]("id") ~
      get[Long]("sub_task_id") ~
      get[Long]("task_id") ~
      get[Int]("pId") ~
      get[Int]("external_resource_id") ~
      get[Double]("estimated_time") ~
      get[Int]("status") ~
      get[Int]("is_deleted") map {
        case id ~ sub_task_id ~ task_id ~ pId ~ external_resource_id ~ estimated_time ~ status ~ is_deleted =>
          SubTaskAllocationExternal(id, sub_task_id, task_id, pId, external_resource_id, estimated_time, status, is_deleted)
      }
  }

}

case class NonProjectTask(id: Option[Int], task: String)

object NonProjectTask {

  val nonProjectTask = {
    get[Option[Int]]("id") ~
      get[String]("task") map {
        case id ~ task => NonProjectTask(id, task)
      }
  }
}

case class SubTaskMaster(sub_task_id: Option[Int], task_id: Long, title: String, description: String,
  plan_start_date: Date, plan_end_date: Date, actual_start_date: Date, actual_end_date: Option[Date], actual_end_date_final: Option[Date], added_date: Date,
  status: Int, completion_percentage: Option[Double], task_complete: Int, sub_task_depend: Option[String],
  dependencies_type: Option[Int], catalogue_id: Option[Int])

case class SubTasks(sub_task_id: Option[Int], task_id: Int, task: String, task_Details: String,
  plan_start_date: Date, plan_end_date: Date, actual_start_date: Date, actual_end_date: Option[Date], actual_end_date_final: Option[Date], priority: Int,
  added_date: Date, note: String, status: Int, completion_percentage: Option[Double], task_complete: Int,
  sub_task_depend: Option[String], dependencies_type: Option[Int], catalogue_id: Int)

object SubTaskMaster extends CustomColumns {
  val subTaskMaster = {
    get[Option[Int]]("sub_task_id") ~
      get[Long]("task_id") ~
      get[String]("title") ~
      get[String]("description") ~
      get[Date]("plan_start_date") ~
      get[Date]("plan_end_date") ~
      get[Date]("actual_start_date") ~
      get[Option[Date]]("actual_end_date") ~
      get[Option[Date]]("actual_end_date_final") ~
      get[Date]("added_date") ~
      get[Int]("status") ~
      get[Option[Double]]("completion_percentage") ~
      get[Int]("task_complete") ~
      get[Option[String]]("sub_task_depend") ~
      get[Option[Int]]("dependencies_type") ~
      get[Option[Int]]("catalogue_id") map {
        case sub_task_id ~ task_id ~ title ~ description ~ plan_start_date ~ plan_end_date ~ actual_start_date ~ actual_end_date ~ actual_end_date_final ~ added_date ~ status ~ completion_percentage ~ task_complete ~ sub_task_depend ~ dependencies_type ~ catalogue_id =>
          SubTaskMaster(sub_task_id, task_id, title, description, plan_start_date, plan_end_date, actual_start_date, actual_end_date, actual_end_date_final, added_date, status, completion_percentage, task_complete, sub_task_depend, dependencies_type, catalogue_id)
      }
  }
}

object SubTasks extends CustomColumns {

  val subTask = {
    get[Option[Int]]("sub_task_id") ~
      get[Int]("task_id") ~
      get[String]("title") ~
      get[String]("description") ~
      get[Date]("plan_start_date") ~
      get[Date]("plan_end_date") ~
      get[Date]("actual_start_date") ~
      get[Option[Date]]("actual_end_date") ~
      get[Option[Date]]("actual_end_date_final") ~
      get[Int]("priority") ~
      get[Date]("added_date") ~
      get[String]("note") ~
      get[Int]("status") ~
      get[Option[Double]]("completion_percentage") ~
      get[Int]("task_complete") ~
      get[Option[String]]("sub_task_depend") ~
      get[Option[Int]]("dependencies_type") ~
      get[Int]("catalogue_id") map {
        case sub_task_id ~
          task_id ~
          title ~
          description ~
          plan_start_date ~
          plan_end_date ~
          actual_start_date ~
          actual_end_date ~
          actual_end_date_final ~
          priority ~
          added_date ~
          note ~
          status ~
          completion_percentage ~
          task_complete ~
          sub_task_depend ~
          dependencies_type ~
          catalogue_id =>
          SubTasks(
            sub_task_id,
            task_id,
            title,
            description,
            plan_start_date,
            plan_end_date,
            actual_start_date,
            actual_end_date,
            actual_end_date_final,
            priority,
            added_date,
            note,
            status,
            completion_percentage,
            task_complete,
            sub_task_depend,
            dependencies_type,
            catalogue_id)
      }

  }
  implicit val subtaskWrites = Json.writes[SubTasks]
}
case class SubTaskStatus(id: Option[Int], sub_task_id: Int, status_for_date: Date, reason_for_change: String, status: Int)

object SubTaskStatus {

  val stStatus = {
    get[Option[Int]]("id") ~ get[Int]("sub_task_id") ~ get[Date]("status_for_date") ~ get[String]("reason_for_change") ~
      get[Int]("status") map {
        case id ~ sub_task_id ~ status_for_date ~ reason_for_change ~ status =>
          SubTaskStatus(id, sub_task_id, status_for_date, reason_for_change, status)
      }

  }
  implicit val statusWrites = Json.writes[SubTaskStatus]
}

case class SubTaskDetail(program_id: Option[Int], project_id: Option[Int], task_id: Option[Int],
  sub_task: Option[Int])

object SubTaskDetail {
  val searchResultObject = {
    get[Option[Int]]("program_id") ~
      get[Option[Int]]("project_id") ~
      get[Option[Int]]("task_id") ~
      get[Option[Int]]("sub_task") map {
        case program_id ~ project_id ~ task_id ~ sub_task =>
          SubTaskDetail(program_id, project_id, task_id, sub_task)
      }
  }
}