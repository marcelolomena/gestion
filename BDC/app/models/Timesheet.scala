package models;
import anorm.SqlParser._;
import play.api.Play.current;
import java.util.Date;
import anorm._;
import play.api.db.DB;
import com.typesafe.plugin._;

/**
 * basic class for Timesheet
 */
/**
 * Created with IntelliJ IDEA.
 * User: aditi
 * Date: 22/05/14
 * Time: 2:11 PM
 * To change this template use File | Settings | File Templates.
 */
case class Timesheet(Id: Option[Int], task_type: Integer, sub_task_id: Int, task_id: Int, user_id: Int, pId: Int, task_for_date: Date, notes: String, hours: BigDecimal,booked_by:Option[Int])

object Timesheet {

  val timesheetLists = {
    get[Option[Int]]("id") ~
      get[Int]("task_type") ~
      get[Int]("sub_task_id") ~
      get[Int]("task_id") ~
      get[Int]("user_id") ~
      get[Int]("pId") ~
      get[Date]("task_for_date") ~
      get[String]("notes") ~
      get[java.math.BigDecimal]("hours") ~ 
      get[Option[Int]]("booked_by") map {
        case id ~ task_type ~ sub_task_id ~ task_id ~ user_id ~ pId ~ task_for_date ~ notes ~ hours ~ booked_by=>
          Timesheet(id, task_type, sub_task_id, task_id, user_id, pId, task_for_date, notes, hours , booked_by)
      }
  }
}

case class TimesheetExternal(Id: Option[Int], task_type: Integer, sub_task_id: Int, task_id: Int, 
    resource_id: Int, pId: Int, task_for_date: Date, notes: String, hours: BigDecimal)

object TimesheetExternal {

  val timesheetLists = {
    get[Option[Int]]("id") ~
      get[Int]("task_type") ~
      get[Int]("sub_task_id") ~
      get[Int]("task_id") ~
      get[Int]("resource_id") ~
      get[Int]("pId") ~
      get[Date]("task_for_date") ~
      get[String]("notes") ~
      get[java.math.BigDecimal]("hours") map {
        case id ~ task_type ~ sub_task_id ~ task_id ~ resource_id ~ pId ~ task_for_date ~ notes ~ hours =>
          TimesheetExternal(id, task_type, sub_task_id, task_id, resource_id, pId, task_for_date, notes, hours)
      }
  }
}

case class TimesheetMaster(Id: Option[Int], task_type: Int, sub_task_id: Int, task_id: Int, user_id: Int, pId: Int, task_for_date: Date, notes: String, hours: BigDecimal)

object TimesheetMaster {

}