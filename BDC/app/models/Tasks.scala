package models
import anorm.SqlParser._
import play.api.Play.current
import java.util.Date
import anorm._
import play.api.db.DB
import java.text.SimpleDateFormat
import java.util.Calendar
import org.apache.commons.lang3.StringUtils

import services.ProjectService

/*case class TaskMaster(tId: Option[Int], project: Int, task_title: String, task_code: String,
	plan_start_date: Date, plan_end_date: Date, task_description: String, plan_time: BigDecimal, task_status: Int,
	status: Int, owner: Int, task_discipline: Option[Int], completion_percentage: Option[Double],
	remark: Option[String], task_depend: Option[String], dependencies_type: Option[Int])*/
/**
 * basic class for Milestone task...
 */
/*case class Tasks(tId: Option[Int], pId: Int, task_title: String, task_code: String,
	plan_start_date: Date, plan_end_date: Date, actual_start_date: Date, actual_end_date: Date,
	task_description: String, plan_time: BigDecimal, creation_date: Date,
	task_status: Int, status: Int, owner: Integer, task_discipline: Option[Int],
	completion_percentage: Option[Double], remark: Option[String],
	task_depend: Option[String], dependencies_type: Option[Int])*/

/**
 * user Role
 */
case class UserRole(rId: Option[Int], role: String)

object UserRole {

  val userRole = {
    get[Option[Int]]("rId") ~
      get[String]("role") map {
        case rId ~
          role =>
          UserRole(
            rId,
            role)
      }
  }

}

case class TaskStatus(id: Option[Int], task_id: Int, status_for_date: Date, reason_for_change: String, status: Int)

object TaskStatus {

  val tStatus = {
    get[Option[Int]]("id") ~ get[Int]("task_id") ~ get[Date]("status_for_date") ~ get[String]("reason_for_change") ~
      get[Int]("status") map {
        case id ~ task_id ~ status_for_date ~ reason_for_change ~ status =>
          TaskStatus(id, task_id, status_for_date, reason_for_change, status)
      }

  }
}

case class Tasks(tId: Option[Int]=None, pId: Int, task_title: String, task_code: String,
                 plan_start_date: Date, plan_end_date: Date, task_description: String, plan_time: BigDecimal,
                 creation_date: Date, task_status: Int, status: Int, owner: Integer,
                 task_discipline: Option[Int], completion_percentage: Option[Double], remark: Option[String], task_depend: Option[String],
                 dependencies_type: Option[Int], stage: Option[Int], user_role: Option[Int], deliverable: Option[Int], task_type: Int, is_active: Int)

/*case class Tasks(tId: Option[Int], pId: Int, task_title: String, task_code: String,
  plan_start_date: Date, plan_end_date: Date, task_description: String, plan_time: BigDecimal,
  creation_date: Date, task_status: Int, status: Int, owner: Integer,
  task_discipline: Option[Int], completion_percentage: Option[Double], remark: Option[String], task_depend: Option[String],
  dependencies_type: Option[Int], stage: Option[Int], user_role: Option[Int], deliverable: Option[Int], task_type: Int)
*/
object Tasks extends CustomColumns {

  val tasks = {
    get[Option[Int]]("tId") ~
      get[Int]("pId") ~
      get[String]("task_title") ~
      get[String]("task_code") ~
      get[Date]("plan_start_date") ~
      get[Date]("plan_end_date") ~
      get[String]("task_description") ~
      get[java.math.BigDecimal]("plan_time") ~
      get[Date]("creation_date") ~
      get[Int]("task_status") ~
      get[Int]("status") ~
      get[Int]("owner") ~
      get[Option[Int]]("task_discipline") ~
      get[Option[Double]]("completion_percentage") ~
      get[Option[String]]("remark") ~
      get[Option[String]]("task_depend") ~
      get[Option[Int]]("dependencies_type") ~
      get[Option[Int]]("stage") ~
      get[Option[Int]]("user_role") ~
      get[Option[Int]]("deliverable") ~
      get[Int]("task_type") ~
      get[Int]("is_active") map {
        case tId ~ pId ~ task_title ~ task_code ~ plan_start_date ~ plan_end_date ~
          task_description ~
          plan_time ~ creation_date ~ task_status ~ status ~ owner ~ task_discipline ~
          completion_percentage ~ remark ~ task_depend ~ dependencies_type ~ stage ~ user_role ~ deliverable ~ task_type ~ is_active =>
          Tasks(tId, pId, task_title, task_code, plan_start_date, plan_end_date,
            task_description,
            plan_time, creation_date, task_status, status, owner, task_discipline,
            completion_percentage, remark, task_depend, dependencies_type, stage, user_role, deliverable, task_type, is_active)
      }
  }
}

case class TaskMaster(tId: Option[Int], project: Int, task_title: String,
                      plan_start_date: Date, plan_end_date: Date, task_description: String, plan_time: BigDecimal, task_status: Int,
                      status: Int, owner: Int, task_discipline: Int, completion_percentage: Option[Double],
                      remark: Option[String], task_depend: Option[String], dependencies_type: Option[Int], task_details: TaskDetails)

object TaskMaster {

}
case class TaskDetails(task_type: Int, task_code: String, stage: Int, user_role: Int, deliverable: Option[Int])

object TaskDetails {

}
