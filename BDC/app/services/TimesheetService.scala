package services
import play.api.Play.current
import play.api.db.DB
import anorm.SqlParser._
import models._
import anorm._
import java.util.Date
import com.typesafe.plugin._
import org.apache.commons.lang3.StringUtils
import SqlParser._
import scala.util.control.Exception._
import java.text.DecimalFormat
import java.util.concurrent.TimeUnit

/**
 * Created with IntelliJ IDEA.
 * User: aditi
 * Date: 22/05/14
 * Time: 4:03 PM
 * To change this template use File | Settings | File Templates.
 */
object TimesheetService extends CustomColumns {

  /**
   * save timesheet
   */
  def addTimesheet(timesheet: Timesheet): Long = {

    DB.withConnection { implicit connection =>
      val result = SQL(
        """
        insert into art_timesheet( task_type, task_for_date, sub_task_id, task_id,notes, pId, hours, user_id,is_deleted,booked_by)values (
         {task_type}, {task_for_date}, {sub_task_id}, {task_id}, {notes}, {pId}, {hours}, {user_id},{is_deleted},{booked_by} )
        """).on(
          'task_type -> timesheet.task_type,
          'sub_task_id -> timesheet.sub_task_id,
          'task_id -> timesheet.task_id,
          'user_id -> timesheet.user_id,
          'pId -> timesheet.pId,
          'notes -> timesheet.notes,
          'task_for_date -> timesheet.task_for_date,
          'hours -> timesheet.hours.bigDecimal,
          'is_deleted -> 1,
          'booked_by -> timesheet.booked_by).executeInsert(scalar[Long].singleOpt)

      result.last
    }
  }

  def addTimesheetExternal(timesheet: TimesheetExternal): Long = {

    DB.withConnection { implicit connection =>
      val result = SQL(
        """
        insert into art_timesheet_external( task_type, task_for_date, sub_task_id, task_id,notes, pId, hours, resource_id,is_deleted)values (
         {task_type}, {task_for_date}, {sub_task_id}, {task_id}, {notes}, {pId}, {hours}, {resource_id},{is_deleted} )
        """).on(
          'task_type -> timesheet.task_type,
          'sub_task_id -> timesheet.sub_task_id,
          'task_id -> timesheet.task_id,
          'resource_id -> timesheet.resource_id,
          'pId -> timesheet.pId,
          'notes -> timesheet.notes,
          'task_for_date -> timesheet.task_for_date,
          'hours -> timesheet.hours.bigDecimal,
          'is_deleted -> 1).executeInsert(scalar[Long].singleOpt)

      result.last
    }
  }
  /**
   * update team member information
   */
  def updateTimesheet(timesheet: Timesheet): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
         update art_timesheet
          set 
          notes =  {notes},
          hours={hours}
          where tmid = {tmid}
          """).on(
          'tmid -> timesheet.Id,
          'notes -> timesheet.notes,
          'hours -> timesheet.hours).executeUpdate()

    }
  }

  /**
   * delete Timesheet
   */
  def deleteTimesheet(Id: Integer) = {
    DB.withConnection { implicit connection =>
      SQL(
        """
            delete from art_timesheet where id = {Id}
        """).on(
          'Id -> Id).executeUpdate()
    }
  }

  /**
   * list Timesheets in various formats
   * a. User views his list for a given period
   * b. Project Manager / CEO / Admin views his selected users' list of tasks for a given period
   */
  def getUserTimesheets(user_id: Int, task_for_date: String): Seq[Timesheet] = {
    val sql = "select DISTINCT(at.id), at.* from art_timesheet at  where at.user_id = " + user_id + " AND at.task_for_date = '" + task_for_date + "'";
    //println(sql);
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(Timesheet.timesheetLists *)
      result
    }
  }

  def getExternalUserTimesheets(user_id: Int, task_for_date: String): Seq[TimesheetExternal] = {
    val sql = "select  at.* from art_timesheet_external at where at.resource_id = " + user_id + " AND at.task_for_date = '" + task_for_date + "'";

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(TimesheetExternal.timesheetLists *)
      result
    }
  }

  def getUserTimesheetsList(user_id: String, sub_task_id: String): Seq[Timesheet] = {
    val sql = "select DISTINCT(at.id), at.* from art_timesheet at where at.sub_task_id=" + sub_task_id + " AND at.user_id = " + user_id + " ORDER BY at.task_for_date asc";
    println(sql)
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(Timesheet.timesheetLists *)
      result
    }
  }
  def getUserTimesheetsListExternal(user_id: String, sub_task_id: String): Seq[TimesheetExternal] = {
    val sql = "select DISTINCT(at.id), at.* from art_timesheet_external at where at.sub_task_id=" + sub_task_id + " AND at.resource_id = " + user_id + " ORDER BY at.task_for_date asc";

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(TimesheetExternal.timesheetLists *)
      result
    }
  }


  def checkTaskPlanning(sub_task_id: String): Boolean = {
    var isPresent = false

    var sql = ""
    sql = "select * from art_timesheet where sub_task_id=" + sub_task_id + " AND task_type=1 and is_deleted=1"

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(Timesheet.timesheetLists *)

      if (result.size > 0) {
        isPresent = true
      }
    }

    sql = "select * from art_timesheet_external where sub_task_id=" + sub_task_id + ""
    
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(TimesheetExternal.timesheetLists *)

      if (result.size > 0) {
        isPresent = true
      }
    }

    isPresent
  }

  def getTimesheetUsers(): List[Int] = {
    val sql = "select DISTINCT(t.user_id) from art_timesheet t"
    DB.withConnection { implicit connection =>
      val result = SQL("select DISTINCT(t.user_id) from art_timesheet t")
      val finalresult = result().map(row =>
        row[Int]("user_id")).toList
      finalresult
    }
  }

  def getTimesheetProjects(from: String, to: String): List[Int] = {
    DB.withConnection { implicit connection =>
      var result: anorm.SqlQuery = null
      if (StringUtils.equals(from, "NA") && StringUtils.equals(to, "NA")) {
        result = SQL("select DISTINCT(t.pId) from art_timesheet t")
      } else {
        result = SQL("select DISTINCT(t.pId)  from art_timesheet t where t.task_for_date  between '" + from + "' and '" + to + "'")
      }

      val finalresult = result().map(row =>
        row[Int]("pId")).toList
      finalresult
    }
  }

  def getTimesheetPerProjects: List[Int] = {
    DB.withConnection { implicit connection =>
      var result: anorm.SqlQuery = null
      result = SQL("select DISTINCT(t.pId) from art_timesheet t")
      val finalresult = result().map(row =>
        row[Int]("pId")).toList
      finalresult
    }
  }
  def getTimesheetForUser(user_id: String): List[String] = {
    val sql = "select DISTINCT(t.pId) from art_timesheet t where t.user_id=" + user_id
    DB.withConnection { implicit connection =>
      val result = SQL(sql)
      val finalresult = result().map(row =>
        row[String]("pId")).toList
      finalresult

    }
  }

  def getUserTimesheetsForProject(pId: String): Seq[Timesheet] = {
    val sql = "select at.* from art_timesheet at   where at.pId = '" + pId + "'";
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(Timesheet.timesheetLists *)
      result
    }
  }

  def getUserTimesheetsForProjectAndUser(user_id: Int, pId: String): Seq[Timesheet] = {
    val sql = "select at.* from art_timesheet at   where at.user_id = " + user_id + " AND  at.pId = '" + pId + "'";
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(Timesheet.timesheetLists *)
      result
    }
  }

  def getUserTimesheetsPerProject(pId: String, from: String, to: String): Seq[Timesheet] = {
    var sql = ""
    if (StringUtils.equals(from, "NA") && StringUtils.equals(to, "NA")) {
      sql = "select at.* from art_timesheet at   where at.pId = '" + pId + "'";
    } else {
      sql = "select at.* from art_timesheet at   where at.pId = '" + pId + "' and task_for_date  between '" + from + "' and '" + to + "'"
    }

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(Timesheet.timesheetLists *)
      result
    }
  }

  def validateUserForHistoricalTimebooking(sub_task_id: String, user_id: String): Boolean = {
    var isValid = true

    var sql = ""

    val user = UserService.findUserOfficeDetails(Integer.parseInt(user_id))
    user match {
      case None => isValid = false
      case Some(u: Office) =>
        //0 normal
        //1 admin
        //2 PMo
        //3 ceo
        //4 PL

        if (u.isadmin == 1 || u.isadmin == 2 || u.isadmin == 4) {
          val subtask = SubTaskServices.findSubTasksBySubTaskId(sub_task_id)
          subtask match {
            case None =>
              isValid = false
            case Some(s: SubTaskMaster) =>
              val task = TaskService.findTaskDetailsByTaskId(s.task_id.toInt)
              task match {
                case None =>
                  isValid = false
                case Some(t: Tasks) =>
                  val project = ProjectService.findProject(t.pId)
                  project match {
                    case None =>
                      isValid = false
                    case Some(p: Project) =>
                      if (p.project_manager.toString == user_id || u.isadmin == 1) {
                        isValid = true
                      } else {
                        isValid = false
                      }
                  }
              }
          }
        }

    }
    isValid
  }

  def getTimesheetsForSubTaskAndUser(user_id: String, sub_task_id: String): Seq[Timesheet] = {
    val sql = "select at.* from art_timesheet at where at.user_id = " + user_id + " AND at.task_type='1' AND at.sub_task_id = '" + sub_task_id + "' AND is_deleted=1";

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(Timesheet.timesheetLists *)
      result
    }
  }

  def getTimesheetsForSubTaskAndExternalUser(user_id: String, sub_task_id: String): Seq[TimesheetExternal] = {
    val sql = "select at.* from art_timesheet_external at where at.resource_id = " + user_id + " AND at.task_type='1' AND at.sub_task_id = '" + sub_task_id + "' AND is_deleted=1";

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(TimesheetExternal.timesheetLists *)
      result
    }
  }

  def getTimesheetsDetailsById(id: String): Option[Timesheet] = {
    val sql = "select at.* from art_timesheet at where at.id = " + id + " AND at.task_type='1' AND is_deleted=1";

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(Timesheet.timesheetLists.singleOpt)
      result
    }
  }

  def getExternalTimesheetsDetailsById(id: String): Option[TimesheetExternal] = {
    val sql = "select at.* from art_timesheet_external at where at.id = " + id + " AND at.task_type='1' AND is_deleted=1";

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(TimesheetExternal.timesheetLists.singleOpt)
      result
    }
  }

  def getAvailableHoursforUser(user_id: String, sub_task_id: String, allocated_hours: Double): Double = {
    var final_hour: Double = 0
    val timesheet = TimesheetService.getTimesheetsForSubTaskAndUser(user_id, sub_task_id)
    var totalHours: scala.math.BigDecimal = 0
    for (t <- timesheet) {
      totalHours += t.hours
    }
    final_hour = totalHours.toDouble
    final_hour
  }

  def getFormatedAvailableHoursforUser(user_id: String, sub_task_id: String): String = {
    var final_hour: Double = 0.0
    var df = new DecimalFormat("00.00");

    var final_new_hour = "00.00"
    val timesheet = TimesheetService.getTimesheetsForSubTaskAndUser(user_id, sub_task_id)
    var totalHours: scala.math.BigDecimal = 0
    var mins = 0
    var hr = 0;
    for (t <- timesheet) {
      totalHours += t.hours
      hr = hr + t.hours.toString().replace(".", "-").split("-")(0).toString().toInt
      mins = mins + t.hours.toString().replace(".", "-").split("-")(1).toString().toInt
    }

    val format = new java.text.SimpleDateFormat("yyyy-MM-dd")
    val SECOND = 1000;
    val MINUTE = 60 * SECOND;
    val HOUR = 60 * MINUTE;
    val ms = totalHours * 60
    //println(mins + "====" + hr);
    while (mins > 60) {
      hr = hr + 1;
      mins = mins - 60;
    }
    //println(hr + ":" +mins )
    //println(ms.toLong + "-=-============")
    /* val fh :Double= ms/HOUR
    val hDiff = ms.toLong / 3600 / 1000;
     val minDiff = ms.toLong / 60 / 1000;
     var msi = minDiff - 60 * hDiff
     
   //println(totalHours + " ---- big dec" + mins + "--"+ms / 60 + "min" + ms % 60)*/

    val hours = TimeUnit.MINUTES.toHours(ms.toLong);
    val remainMinute = ms.toLong - TimeUnit.HOURS.toMinutes(hours);

    //println(hours + ":" + remainMinute + "=========------7777777")
    //val result = String.format("%02d", hours) + ":" + String.format("%02d", remainMinute);
    final_hour = totalHours.toDouble
    val temp_string = df.format(final_hour).replace(".", ":").split(":")//una tontera lo arregle poniendo una , en vez de un punto

    if (temp_string.size > 0) {
      var hours = temp_string(0).toInt
      var min = temp_string(1).toInt

      if (min > 59) {
        val newtmp = min % 60

        min = min - 60
        hours = hours + 1

      }

    }
    if (mins < 10) {
      mins = Integer.parseInt("0" + mins)
      val tmp = (hr + "." + ("0" + mins)).toDouble
      final_new_hour = df.format(tmp)
    } else {
      val tmp = (hr + "." + mins).toDouble
      final_new_hour = df.format(tmp)
    }

    //final_new_hour = df.format(tmp)
    final_new_hour
  }

  def getBookedHoursforUser(user_id: String, sub_task_id: String): Double = {
    var final_hour: Double = 0.0
    val timesheet = TimesheetService.getTimesheetsForSubTaskAndUser(user_id, sub_task_id)
    var totalHours: scala.math.BigDecimal = 0
    for (t <- timesheet) {
      totalHours += t.hours
    }
    final_hour = totalHours.toDouble
    final_hour
  }

  def getAvailableHoursforExternalUser(user_id: String, sub_task_id: String, allocated_hours: Double): Double = {
    var final_hour: Double = 0.0
    val timesheet = TimesheetService.getTimesheetsForSubTaskAndExternalUser(user_id, sub_task_id)
    var totalHours: scala.math.BigDecimal = 0
    for (t <- timesheet) {
      totalHours += t.hours
    }
    final_hour = totalHours.toDouble
    final_hour
  }

  def getFormattedAvailableHoursforExternalUser(user_id: String, sub_task_id: String): String = {
    var final_hour: Double = 0.0
    var df = new DecimalFormat("00.00");
    var final_new_hour = ""

    val timesheet = TimesheetService.getTimesheetsForSubTaskAndExternalUser(user_id, sub_task_id)
    var totalHours: scala.math.BigDecimal = 0
    var mins = 0
    var hr = 0;
    for (t <- timesheet) {
      totalHours += t.hours
      hr = hr + t.hours.toString().replace(".", "-").split("-")(0).toString().toInt
      mins = mins + t.hours.toString().replace(".", "-").split("-")(1).toString().toInt

    }
    mins = mins * 60 / 100

    val format = new java.text.SimpleDateFormat("yyyy-MM-dd")
    val SECOND = 1000;
    val MINUTE = 60 * SECOND;
    val HOUR = 60 * MINUTE;
    val ms = totalHours * 60
    //println(mins + "====" + hr);
    while (mins > 60) {
      hr = hr + 1;
      mins = mins - 60;
    }
    //println(hr + ":" +mins )
    //println(ms.toLong + "-=-============")
    /* val fh :Double= ms/HOUR
    val hDiff = ms.toLong / 3600 / 1000;
     val minDiff = ms.toLong / 60 / 1000;
     var msi = minDiff - 60 * hDiff
     
   //println(totalHours + " ---- big dec" + mins + "--"+ms / 60 + "min" + ms % 60)*/

    val hours = TimeUnit.MINUTES.toHours(ms.toLong);
    val remainMinute = ms.toLong - TimeUnit.HOURS.toMinutes(hours);

    //println(hours + ":" + remainMinute + "=========------7777777")
    //val result = String.format("%02d", hours) + ":" + String.format("%02d", remainMinute);
    final_hour = totalHours.toDouble
    val temp_string = df.format(final_hour).replace(".", ":").split(":")

    if (temp_string.size > 0) {
      var hours = temp_string(0).toInt
      var min = temp_string(1).toInt

      if (min > 59) {
        val newtmp = min % 60

        min = min - 60
        hours = hours + 1

      }

    }
    if (mins < 10) {
      mins = Integer.parseInt("0" + mins)
      val tmp = (hr + "." + ("0" + mins)).toDouble
      final_new_hour = df.format(tmp)
    } else {
      val tmp = (hr + "." + mins).toDouble
      final_new_hour = df.format(tmp)
    }

    //final_new_hour = df.format(tmp)
    final_new_hour
  }

  def getBookedHoursforExternalUser(user_id: String, sub_task_id: String): Double = {
    var final_hour: Double = 0.0
    val timesheet = TimesheetService.getTimesheetsForSubTaskAndExternalUser(user_id, sub_task_id)
    var totalHours: scala.math.BigDecimal = 0
    for (t <- timesheet) {
      totalHours += t.hours
    }
    final_hour = totalHours.toDouble
    final_hour
  }

  def getUserAllocatedHoursForSubtask(user_id: String, sub_task_id: String): Double = {
    var final_hour: Double = 0.0
    var allocated_hours = SubTaskServices.findAllocatedHoursForSubTask(user_id, sub_task_id)
    val timesheet = TimesheetService.getTimesheetsForSubTaskAndUser(sub_task_id, user_id)
    var totalHours: scala.math.BigDecimal = 0
    for (t <- timesheet) {
      totalHours += t.hours
    }
    final_hour = allocated_hours.toDouble - totalHours.toDouble
    final_hour

  }

  def getUserBookedHourForDay(user_id: Int, task_for_date: String): Double = {
    val sql = "select DISTINCT(at.id), at.* from art_timesheet at ,art_task am where at.user_id = " + user_id + " AND at.task_for_date = '" + task_for_date + "' and is_deleted=1";
    var final_hours: Double = 0
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(Timesheet.timesheetLists *)

      for (r <- result) {
        final_hours += r.hours.toDouble
      }
      final_hours
    }
  }

  def getAllUserBookedHourForDay(user_id: Int, task_for_date: String, user_type: String): Double = {

    var final_hours: Double = 0
    if (StringUtils.equals(user_type, "1")) {
      val sql = "select DISTINCT(at.id), at.* from art_timesheet at ,art_task am where at.user_id = " + user_id + " AND at.task_for_date = '" + task_for_date + "' and is_deleted=1";

      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(Timesheet.timesheetLists *)

        for (r <- result) {
          final_hours += r.hours.toDouble
        }
        final_hours
      }
    } else if (StringUtils.equals(user_type, "0")) {
      val sql = "select DISTINCT(at.id), at.* from art_timesheet_external at ,art_task am where at.resource_id = " + user_id + " AND at.task_for_date = '" + task_for_date + "' and is_deleted=1";

      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(TimesheetExternal.timesheetLists *)

        for (r <- result) {
          final_hours += r.hours.toDouble
        }
        final_hours
      }
    } else {
      final_hours = 0
    }
    final_hours
  }

  def getBookedHourForSubTask(sub_task: String): String = {
    DB.withConnection { implicit connection =>
      SQL("EXEC programa.getTimeSheetToHH {stid}").on(
        'stid -> sub_task.toInt).executeQuery().as(scalar[String].single)
    }
  }

  def getAllTimesheetIds() = {
    val sql = "select DISTINCT(sub_task_id) from art_timesheet "
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(scalar[Long] *)
      result
    }
  }

  /**
   * delete Timesheet Book Time External
   */
  def deleteTimesheetBookTimeExt(Id: Integer) = {
    DB.withConnection { implicit connection =>
      SQL(
        """
            delete from art_timesheet_external where id = {Id}
        """).on(
          'Id -> Id).executeUpdate()
    }
  }

  def updateTimesheetBookTimeDirect(id: String, hours: Double) = {
    if (StringUtils.isNotEmpty(id)) {
      var sql = "Update art_timesheet set hours = " + hours + " where id=" + id
      DB.withConnection { implicit connection =>
        val result = SQL(sql).executeUpdate()
        result.toString
      }
    }

  }

  def updateTimesheetBookTimeDirectExternal(id: String, hours: Double) = {
    if (StringUtils.isNotEmpty(id)) {
      var sql = "Update art_timesheet_external set hours = " + hours + " where id=" + id
      DB.withConnection { implicit connection =>
        val result = SQL(sql).executeUpdate()
        result.toString
      }
    }

  }

  /**
   * update Timesheet Book Time
   */
  def updateTimesheetBookTime(data: String, Id: Integer, hours: Double, c_date_data_new: String, user: String): String = {
    /*var status = ""
    var df = new DecimalFormat("00.00");
    var final_new_hour :Double = 0
    val temp_string = df.format(hours).replace(".", ":").split(":")
    if (temp_string.size > 0) {
      var hours = temp_string(0).toInt
      var min = temp_string(1).toInt
      min = min * 100/60
      if (min > 59) {
        min = min - 60
        hours = hours + 1
      }
      val tmp = (hours + "." + min).toDouble
      final_new_hour = tmp
    }
println(final_new_hour)*/
    var status = ""
    var final_new_hour: Double = 0
    final_new_hour = hours
    if (data.equals("int")) {

      val timesheet = getTimesheetsDetailsById(Id.toString());
      if (!timesheet.isEmpty) {
        val old_value = timesheet.get.hours
        val total_hours = getAllUserBookedHourForDay(user.toInt, c_date_data_new, "1")

        val final_hour = total_hours - old_value + final_new_hour
        //println(final_hour + "-----------------------1")
        if (final_new_hour > 24) {
          status = "fail"
        } else {
          var sql = "Update art_timesheet set hours = " + final_new_hour + " where id = " + Id
          DB.withConnection { implicit connection =>
            val result = SQL(sql).executeUpdate()
            result.toString
          }
          status = "success"
        }

      }
    }

    if (data.equals("ext")) {
      val timesheet = getExternalTimesheetsDetailsById(Id.toString());
      if (!timesheet.isEmpty) {
        val old_value = timesheet.get.hours
        val total_hours = getAllUserBookedHourForDay(user.toInt, c_date_data_new, "0")
        // val final_hour = total_hours - old_value + final_new_hour
        //println(total_hours + "-----------------------1")
        if (final_new_hour > 24) {
          status = "fail"
        } else {
          var sql = "Update art_timesheet_external set hours = " + final_new_hour + " where id = " + Id
          DB.withConnection { implicit connection =>
            val result = SQL(sql).executeUpdate()
            result.toString
          }
          status = "success"
        }
      }
    }
    status
  }

  def formatTimesheetHour(hour: Double): String = {
    // println("hour" + hour)
    var df = new DecimalFormat("00.00");
    var final_new_hour = "00.00"
    val temp_string = df.format(hour).replace(".", ":").split(":")
    if (temp_string.size > 0) {
      var hours = temp_string(0).toInt
      var min = temp_string(1).toInt

      min = min * 60 / 100

      if (min > 59) {
        min = min - 60
        hours = hours + 1
      }

      if (min < 10) {
        min = Integer.parseInt("0" + min)
        val tmp = (hours + "." + ("0" + min)).toDouble
        final_new_hour = df.format(tmp)
      } else {
        val tmp = (hours + "." + min).toDouble
        final_new_hour = df.format(tmp)
      }
      //      val tmp = (hours + "." + min).toDouble
      //      final_new_hour = df.format(tmp)
    }
    /*  var h = hour.toLong * 60
    val hours2 = TimeUnit.MINUTES.toHours(h.toLong);
    val remainMinute = h.toLong - TimeUnit.HOURS.toMinutes(hours2);
    
     val tmp = (hours2 + "." + remainMinute).toDouble
      final_new_hour = df.format(tmp)*/
    final_new_hour.replace(".", ":")
  }

  def formatTimesheetHour2(hour: Double): String = {

    var df = new DecimalFormat("00.00");
    var final_new_hour = "00.00"
    println("hour:"+hour)
    println("format:"+df.format(hour))
    val temp_string = df.format(hour).replace(".", ":").split(":")//una tontera lo arregle poniendo una , en vez de un punto
    println("temp_string:"+temp_string.toString())
    if (temp_string.size > 0) {
      var hours = temp_string(0).toInt
      var min = temp_string(1).toInt

      min = min * 60 / 100
      while (min > 60) {
        hours = hours + 1;
        min = min - 60;
      }
      if (min < 10) {
        min = Integer.parseInt("0" + min)
        val tmp = (hours + "." + ("0" + min)).toDouble
        final_new_hour = df.format(tmp)
      } else {
        val tmp = (hours + "." + min).toDouble
        final_new_hour = df.format(tmp)
      }

      //final_new_hour = df.format(tmp)
      final_new_hour
      //      val tmp = (hours + "." + min).toDouble
      //      final_new_hour = df.format(tmp)
    }

    /*  var h = hour.toLong * 60
    val hours2 = TimeUnit.MINUTES.toHours(h.toLong);
    val remainMinute = h.toLong - TimeUnit.HOURS.toMinutes(hours2);
    
     val tmp = (hours2 + "." + remainMinute).toDouble
      final_new_hour = df.format(tmp)*/
    println("final_new_hour:" + final_new_hour)
    final_new_hour.replace(".", ":")//otra tontera una coma en vez del punto
  }

}
