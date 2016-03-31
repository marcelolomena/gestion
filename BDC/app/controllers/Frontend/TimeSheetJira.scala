package controllers.Frontend

import play.api._
import play.api.mvc._
import play.api.libs.json._
import java.text.SimpleDateFormat
import java.util.Date
import org.apache.commons.lang3.StringUtils
import org.json.JSONObject
//import org.codehaus.jackson.JsonNode
import play.api.libs.json.{ JsNull, Json, JsString, JsValue }
import anorm.NotAssigned
import models.Activity
import models.ActivityTypes
import models.SubTasks
import models.Timesheet
import play.api.mvc.Action
import play.api.mvc.Controller
import services.ProjectService
import services.SubTaskServices
import services.TaskService
import services.DocumentService
import services.TimesheetService
import java.util.Calendar
import models.Baseline
import play.api.libs.functional.syntax._
//import javassist.CtField.NewInitializer
import java.util.regex.Pattern
import models.TimesheetExternal
import java.text.DecimalFormat
//import com.google.gson.JsonObject
import java.util.ArrayList
import org.json.JSONArray

import scala.math.BigDecimal.RoundingMode

object TimeSheetJira extends Controller {

  def productsTimesheet(uId: String) = Action { implicit request =>
    var subtareas = new JSONArray;
    var subtareasNonProject = new JSONArray;
    var respuesta = new JSONArray;
      
      // val currentSubTasks = TaskService.getAllCurrentAllocatedSubTask(uId)
      // val futureSubTasks = TaskService.getAllFutureAllocatedSubTask(uId)
      val subTasks = TaskService.getAllAllocatedSubTask(uId);
      subtareas.put(subTasks)
      val nonProjectTasks = TaskService.getAllNonProjectTask
      subtareasNonProject.put(nonProjectTasks)
      respuesta.put(subtareas)
      respuesta.put(subtareasNonProject)
      Ok(subtareasNonProject.toString())
  }

  /**
   *
   */
  def addRow = Action { implicit request =>
    request.session.get("username").map { user =>
      val user_id = request.session.get("uId").get
      val utype = Integer.parseInt(request.session.get("utype").get.toString())

      val milestones = TaskService.getUserAssignedProjects(user_id);
      val subTasks = TaskService.getAllAllocatedSubTask(user_id);

      Ok(views.html.frontend.timesheet.panelProjectsTimeSheetAddRow(milestones)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }

  }

  /**
   * Save timsheet plan for a user
   */
  def saveTaskPlan() = Action { implicit request =>
    request.session.get("username").map { user =>
      val user_id = Integer.parseInt(request.session.get("uId").get.toString())
      val utype = Integer.parseInt(request.session.get("utype").get.toString())
      val sub_task = Integer.parseInt(request.body.asFormUrlEncoded.get("sub_task")(0).toString())
      val timesheet_activity = Integer.parseInt(request.body.asFormUrlEncoded.get("timesheet_activity")(0))
      val task_for_date = new SimpleDateFormat("yyyy-MM-dd").parse(request.body.asFormUrlEncoded.get("task_for_date")(0))
      val notes = request.body.asFormUrlEncoded.get("notes")(0).toString()
      val hours = BigDecimal(request.body.asFormUrlEncoded.get("hours")(0).toString())

      if (timesheet_activity == 1) {
        val pDetails = SubTaskServices.findSubTaskDetailsBySubtaskId(sub_task.toString)
        if (pDetails != null) {
          val m_id = pDetails.get.task_id
          val milestone = TaskService.findTaskDetailsByTaskId(m_id)
          val pId = milestone.get.pId
          val planDetails = Timesheet(None, 1, sub_task, m_id, user_id, pId, task_for_date, notes, hours, Option(0))
          val last = TimesheetService.addTimesheet(planDetails);

          /**
           * Activity log
           */
          val act = Activity(ActivityTypes.Timesheet.id, "Timesheet entry made by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), last.toInt)
          Activity.saveLog(act)

          /**
           * update actual date....
           */
          //TaskService.updateActualDate(m_id.toString, sub_task.toString, task_for_date)
        }

      } else {
        val planDetails = Timesheet(None, 2, sub_task, timesheet_activity, user_id, -1, task_for_date, notes, hours, Option(0))
        val last = TimesheetService.addTimesheet(planDetails);

        /**
         * Activity log
         */
        val act = Activity(ActivityTypes.Timesheet.id, "Timesheet entry made by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), last.toInt)
        Activity.saveLog(act)
      }

      Ok("Success")

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * Save hours plan for a subtask
   */

  def saveHoursForSubtask(_date: String,user_id: Int) = Action { implicit request =>
    
      val task_for_date = new SimpleDateFormat("yyyy-MM-dd").parse(_date)
      request.body.asJson.map { jjjson =>
        var hashMap = new java.util.HashMap[String, String]()
        var subtasks = jjjson.asOpt[JsArray].get.value
        for (subtask <- subtasks) {
          var subtask_id = subtask.\\("subtask_id").iterator.next().toString()
          var hours1 = subtask.\\("value").iterator.next().toString().replace("\"", "")
          /* println(hours1 + "hours1")*/
          var new_hour = hours1.replace(".", "_").split("_").apply(0).toDouble
          var new_min = hours1.replace(".", "_").split("_").apply(1).toDouble
          var actual_hour: Double = 0
          /*      println(new_hour + "new_hour")
          println(new_min + "new_min")*/
          var final_hour_string: Double = 0
          if (new_min < 10) {
            new_min = new_min * 100 / 60
            actual_hour = new_hour + Math.ceil(new_min) / 100
          } else {
            final_hour_string = new_min.toDouble
            final_hour_string = final_hour_string * 100 / 60
            if (new_hour < 10) {
              new_hour = ("0" + new_hour).toDouble
            }
            actual_hour = (new_hour.toInt + "." + Math.ceil(final_hour_string.toDouble).toInt).toDouble
          }

          if (!subtask_id.isEmpty() && subtask_id.matches("(?i:.*sub_.*)")) {
            val arr = subtask_id.split('_');
            subtask_id = arr.apply(1).substring(0, arr.apply(1).length() - 1)
            val pDetails = SubTaskServices.findSubTaskDetailsBySubtaskId(subtask_id)
            if (!pDetails.isEmpty) {
              val m_id = pDetails.get.task_id
              val milestone = TaskService.findTaskDetailsByTaskId(m_id)
              val pId = milestone.get.pId
              val planDetails = Timesheet(None, 1, subtask_id.toInt, m_id, user_id, pId, task_for_date, "", actual_hour, Option(0))
              val last = TimesheetService.addTimesheet(planDetails);
              
              /**
               * Activity log
               */
              val act = Activity(ActivityTypes.Timesheet.id, "Timesheet entry made by Jira ", new Date(), user_id, last.toInt)
              Activity.saveLog(act)            
            }
          } else if (!subtask_id.isEmpty() && subtask_id.matches("(?i:.*nproj_.*)")) {
            val arr = subtask_id.split('_');
            subtask_id = arr.apply(1).substring(0, arr.apply(1).length() - 1)
            val notes = ""
            val planDetails = Timesheet(None, 2, subtask_id.toInt, 2, user_id, -1, task_for_date, notes, actual_hour, Option(0))
            val last = TimesheetService.addTimesheet(planDetails);
            
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Timesheet.id, "Timesheet entry made by Jira ", new Date(), user_id, last.toInt)
            Activity.saveLog(act)            
          }
        }
      }.getOrElse {
        BadRequest("Expecting Json data")
      }
    
    Ok("Success")
  }

  /**
   *
   */
  def getUserTasks() = Action { implicit request =>
    request.session.get("username").map { user =>
      println("Entro")
      val uId = request.session.get("uId").get
      println(uId)
      val startDate = request.getQueryString("sd").get
      println(startDate)
      val tasks = TimesheetService.getUserTimesheets(uId.toInt, startDate.toString())
      for(task <- tasks) {
        println("tarea: "+task.task_id)
      }
      /*    var task_list = Seq
      var total_hrs: BigDecimal = 0.0

      val list = new ArrayList
      for (task <- tasks) {
        val hr = task.hours.toString().trim().replace(".", "_").split("_").apply(0)
        val min = task.hours.toString().trim().replace(".", "_").split("_").apply(1)
        var minutes = 0
        if (!min.isEmpty()) {
          minutes = min.toInt * 60 / 100
        }
        var hours = (hr.toString() + "." + minutes.toString()).toDouble
        total_hrs += hours
        total_hrs
        val tmsht = Timesheet(task.Id, task.task_type, task.sub_task_id, task.task_id, task.user_id, task.pId, task.task_for_date, task.notes, total_hrs, task.booked_by)
        // list.add(tmsht.toString())
      }*/
      Ok(views.html.frontend.timesheet.projectsTimeSheetList(tasks))
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * Delete timesheet entry
   */
  def deleteTimesheet(tid:String) = Action { implicit request =>
    
      TimesheetService.deleteTimesheet(Integer.parseInt(tid.toString()))
      /**
       * Activity log
       */
      val act = Activity(ActivityTypes.Timesheet.id, "Timesheet entry deleted by Jira" , new Date(), 1202, Integer.parseInt(tid))
      Activity.saveLog(act)

      Ok("success")
  }

  def getProjectSubtaskList(user_id: String) = Action { implicit request =>
    var finalString = ""
    if (StringUtils.isNotBlank(user_id)) {
      val subTasks = TaskService.getAllAllocatedSubTask(user_id);
      Ok(views.html.frontend.timesheet.projectsSubtaskList(subTasks))
    } else {
      Redirect(routes.Login.loginUser())
    }
  }

  def getProjectTasks(user_id: String) = Action { implicit request =>
    var finalString = ""
    if (StringUtils.isNotBlank(user_id)) {
      val subTasks = TaskService.getAllAllocatedSubTask(user_id);
      finalString = "<option value=''>--Select Sub Task--</option>"
      for (s <- subTasks) {
        val task = TaskService.findTaskDetailsByTaskId(s.task_id)
        if (!task.isEmpty) {
          val project = ProjectService.findProject(task.get.pId)
          finalString = finalString + " <option value='" + s.sub_task_id.get + "'>" + project.get.project_name + " - " + s.task + "</option>"
        }
      }
    }
    Ok(finalString)
  }

  def getNonProjectTasks = Action { implicit request =>
    var finalString = ""
    val nonProjectTask = TaskService.getAllNonProjectTask
    finalString = "<option value=''>--Select Non Project Task--</option>"
    for (p <- nonProjectTask) {
      finalString = finalString + " <option value='" + p.id + "'>" + p.task + "</option>"
    }

    Ok(finalString)
  }

  def getSubTaskValidation(subTask: String, tDate: String) = Action { implicit request =>
    var finalString = ""
    var node = new JSONObject()
    val uId = request.session.get("uId").get
    var isAvailable = false;
    if (StringUtils.isNotBlank(subTask)) {
      val subTasks = SubTaskServices.findSubTaskDetailsBySubtaskId(subTask);
      val format = new java.text.SimpleDateFormat("dd-MM-yyyy")
      val todaydate = format.parse(tDate)
      val newformat = new java.text.SimpleDateFormat("yyyy-MM-dd")
      val newDate = newformat.format(todaydate)
      val record = SubTaskServices.validateSubTask(subTasks.get.sub_task_id.get, newDate)
      if (!record.isEmpty) {
        isAvailable = true
      }
      val timsheetData = SubTaskServices.findBookedHoursForSubTask(subTask, uId)
      val allocation = SubTaskServices.findAllocatedHoursForSubTask(subTask, uId)
      val avilable = allocation - timsheetData

      node.put("isAvailable", isAvailable)
      node.put("Allocated", allocation.toString)
      node.put("Booked", timsheetData.toString)
      node.put("Available", avilable.toString)

      var depend_name = "None"
      if (!subTasks.get.sub_task_depend.isEmpty) {
        for (s <- subTasks.get.sub_task_depend.get.split(",")) {
          if (!StringUtils.isBlank(s.trim())) {
            depend_name = SubTaskServices.findSubTasksBySubTaskId(s).get.title
          }
        }
      }
      val baselineCount = Baseline.getBaselineCount(subTasks.get.sub_task_id.get, "subtask")
      var baselineAvailable: Boolean = false;
      if (baselineCount > 0) {
        baselineAvailable = true;
      }
      var baseline = "No"
      if (baselineAvailable) {
        baseline = "YES"
      }

      var status = "status_0"

      subTasks.get.status match {
        case 0 => status = "status_0"
        case 1 => status = "status_1"
        case 2 => status = "status_2"
        case _ => status = "status_0"
      }

      node.put("title", subTasks.get.task)
      node.put("description", subTasks.get.task_Details)
      node.put("status", status)
      node.put("start_date", subTasks.get.plan_start_date)
      node.put("end_date", subTasks.get.plan_end_date)
      node.put("depend_name", depend_name)
      node.put("baselineAvailable", baseline)
    }
    Ok(node.toString())
  }

  def getDocumentListForSubtask(subtask_id: String) = Action { implicit request =>
    val documents = DocumentService.findAllDocuments(subtask_id, "SUBTASK", "", "", "")
    Ok(views.html.frontend.timesheet.subtaskDocumentListing(documents, subtask_id))
  }
  def validateDependency(subTask: String) = Action { implicit request =>
    var finalString = ""
    var node = new JSONObject()
    val uId = request.session.get("uId").get
    var isAvailable = false;
    if (StringUtils.isNotBlank(subTask)) {
      val subTasks = SubTaskServices.findSubTaskDetailsBySubtaskId(subTask);
      subTasks match {
        case None =>
        case Some(subTask: SubTasks) =>
          val task_id = subTask.task_id
          if (!subTask.sub_task_depend.isEmpty) {
            val sub_task_dependency = subTask.sub_task_depend.get
            val validateSubTask = SubTaskServices.validateSubTaskDependency(sub_task_dependency)
            if (validateSubTask.size > 0) {
              isAvailable = false
              node.put("sub_task", "Please check sub task dependency.")
            }
            val task = TaskService.findTaskDetailsByTaskId(task_id.toInt)
            if (!task.get.task_depend.isEmpty) {
              val validateTask = TaskService.validateTaskDependency(task.get.task_depend.get)
              if (validateTask.size > 0) {
                isAvailable = false
                node.put("task", "Please check task dependency.")
              }

            }

          }

      }

      node.put("isAvailable", isAvailable)

    }
    Ok(node.toString())
  }

  /**
   * Book Time for an employee by PMO user for sub task under a Task
   * user : Balkrishna
   * date 09/12/14
   *
   */
  def bookTime(sub_task_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      //if (TimesheetService.validateUserForHistoricalTimebooking(sub_task_id, request.session.get("uId").get)) {
      val subtask = SubTaskServices.findSubTasksBySubTaskId(sub_task_id)
      subtask match {
        case None =>
          Redirect(routes.Login.loginUser())
        case Some(s: models.SubTaskMaster) =>
          val task = TaskService.findTaskDetailsByTaskId(s.task_id.toInt)
          val project = ProjectService.findProject(task.get.pId)
          val start_date = project.get.start_date
          Ok(views.html.frontend.timesheet.bookTime(subtask, start_date)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      }

      //} //else {
      //        val subtask = SubTaskServices.findSubTasksBySubTaskId(sub_task_id)
      //        subtask match {
      //          case None =>
      //            Redirect(routes.Login.loginUser())
      //          case Some(s: models.SubTaskMaster) =>
      //            Redirect(routes.Task.projectTaskDetails(s.task_id.toString))
      //        }
      //      }
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def timeBooked(sub_task: String, user_id: String, user_hour: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val sub_task_detail = SubTaskServices.findSubTaskDetailsBySubtaskId(sub_task)
      sub_task_detail match {
        case None =>
          Ok("Fail")
        case Some(s: SubTasks) =>
          var today = s.plan_start_date;
          var booking_hours = Integer.parseInt(user_hour)
          var FormattedDATE = new SimpleDateFormat("yyyy-MM-dd");
          var c = Calendar.getInstance();
          var total = TimesheetService.getUserAllocatedHoursForSubtask(sub_task, user_id)

          var index = 0
          var book_hour: Double = 0
          while (booking_hours > 0) {
            if (booking_hours > 12) {
              booking_hours = booking_hours - 12
              book_hour = 12
            } else {
              book_hour = booking_hours
              booking_hours = 0
            }

            c.setTime(today)
            c.add(Calendar.DATE, index); // number of days to add      
            var tommorrow = FormattedDATE.format(c.getTime()).toString();
            val tms = TimesheetService.getUserBookedHourForDay(Integer.parseInt(user_id), tommorrow)

            if (tms < 12) {
              var bookDate = FormattedDATE.parse(tommorrow)
              val project_id = TaskService.findTaskDetailsByTaskId(s.task_id).get.pId
              val planDetails = Timesheet(None, 1, Integer.parseInt(sub_task), s.task_id, Integer.parseInt(user_id), project_id, bookDate, "ADDED BY PROJECT MANAGER", book_hour.toInt, Option(1))
              val last = TimesheetService.addTimesheet(planDetails);
              /**
               * Activity log
               */
              val act = Activity(ActivityTypes.Timesheet.id, "Timesheet time booked by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), last.toInt)
              Activity.saveLog(act)
            }
            index += 1

          }
          Ok("Success")

      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def bookedTimeTimeSheet(sub_task_id: String, user_id: String, user_type: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      if (StringUtils.isNotBlank(sub_task_id) && StringUtils.isNotBlank(user_id) && StringUtils.isNotBlank(user_type)) {
        var subtaskBCH: Seq[Timesheet] = null
        var subtaskEX: Seq[TimesheetExternal] = null

        if (user_type.equals("0")) {
          subtaskEX = TimesheetService.getUserTimesheetsListExternal(user_id, sub_task_id)
          Ok(views.html.frontend.timesheet.bookTimeTimesheet(subtaskBCH, subtaskEX))
        } else {
          subtaskBCH = TimesheetService.getUserTimesheetsList(user_id, sub_task_id)
          Ok(views.html.frontend.timesheet.bookTimeTimesheet(subtaskBCH, subtaskEX))
        }

      } else {
        Redirect(routes.Login.loginUser())
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def timeBookedExternal(sub_task: String, user_id: String, user_hour: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val sub_task_detail = SubTaskServices.findSubTaskDetailsBySubtaskId(sub_task)
      sub_task_detail match {
        case None =>
          Ok("Fail")
        case Some(s: SubTasks) =>
          var today = s.plan_start_date;
          var booking_hours = Integer.parseInt(user_hour)
          var FormattedDATE = new SimpleDateFormat("yyyy-MM-dd");
          var c = Calendar.getInstance();
          val project_id = TaskService.findTaskDetailsByTaskId(s.task_id).get.pId
          // var total = TimesheetService.getUserAllocatedHoursForSubtask(sub_task, user_id)

          val planDetails = TimesheetExternal(None, 1, Integer.parseInt(sub_task), s.task_id, Integer.parseInt(user_id), project_id, new Date(), "ADDED BY PROJECT MANAGER", user_hour.toInt)
          val last = TimesheetService.addTimesheetExternal(planDetails);
          /**
           * Activity log
           */
          val act = Activity(ActivityTypes.Timesheet.id, "Timesheet time booked external by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), last.toInt)
          Activity.saveLog(act)
          Ok("Success")

      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * Delete timesheet book time entry
   */
  def daleteTimesheetBookTime() = Action { implicit request =>
    request.session.get("username").map { user =>
      val id = request.getQueryString("id").get;
      val data = request.getQueryString("data").get;
      if (data == "int") {
        TimesheetService.deleteTimesheet(Integer.parseInt(id.toString()));
      }
      if (data == "ext") {
        TimesheetService.deleteTimesheetBookTimeExt(Integer.parseInt(id.toString()));
      }

      /**
       * Activity log
       */
      val act = Activity(ActivityTypes.Timesheet.id, "Timesheet book time entry deleted by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), Integer.parseInt(id))
      Activity.saveLog(act)

      Ok("success")
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * Update timesheet book time entry
   */
  def updateTimesheetBookTime() = Action { implicit request =>
    request.session.get("username").map { user =>

      val node = new JSONObject()
      var status = "fail"
      if (StringUtils.isNotEmpty(request.getQueryString("c_val").get.replace(":", ".").toString().trim())) {
        val id = request.getQueryString("id").get;
        val data = request.getQueryString("data").get;
        val c_val = request.getQueryString("c_val").get.replace(":", ".").toString();
        val c_date_data_new = request.getQueryString("c_date_data_new");
        val user = request.getQueryString("user").get;
        var new_hour: Double = c_val.toString().replace(".", "-").split("-")(0).toDouble
        var new_min: Double = c_val.toString().replace(".", "-").split("-")(1).toDouble
        var actual_hour: Double = 0
        /*new_min = new_min * 100 / 60
        var finalHr = new_hour + new_min / 100
        println("final_hour_string---"+finalHr)
        println(id+"-------------id"+finalHr)*/
        var final_hour_string: Double = 0
        if (new_min < 10) {
          //final_hour_string = ("0" + new_min).toString().toDouble
          new_min = new_min * 100 / 60

          actual_hour = new_hour + Math.ceil(new_min) / 100
        } else {

          final_hour_string = new_min.toDouble
          final_hour_string = final_hour_string * 100 / 60
          if (new_hour < 10) {
            new_hour = ("0" + new_hour).toDouble
          }
          actual_hour = (new_hour.toInt + "." + Math.ceil(final_hour_string.toDouble).toInt).toDouble
        }
        //println(actual_hour)
        status = TimesheetService.updateTimesheetBookTime(data, Integer.parseInt(id.toString()), actual_hour, c_date_data_new.get, user);
        if (!c_date_data_new.isEmpty && "int".equals(data)) {
          val timesheet = TimesheetService.getTimesheetsDetailsById(id);
          if (!timesheet.isEmpty) {
            val internal_user_total_hrs = TimesheetService.getFormatedAvailableHoursforUser(user, timesheet.get.sub_task_id.toString())

            node.put("internal_user_total_hrs", internal_user_total_hrs)
          }

        } else if (!c_date_data_new.isEmpty && "ext".equals(data)) {
          val timesheet = TimesheetService.getExternalTimesheetsDetailsById(id);
          if (!timesheet.isEmpty) {
            val old_value = timesheet.get.hours
            val external_user_total_hrs = TimesheetService.getFormattedAvailableHoursforExternalUser(user, timesheet.get.sub_task_id.toString())
            node.put("internal_user_total_hrs", external_user_total_hrs)
          }
        }

        /**
         * Activity log
         */
        val act = Activity(ActivityTypes.Timesheet.id, "Timesheet book time entry updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), Integer.parseInt(id))
        Activity.saveLog(act)
      }
      node.put("status", status)
      Ok(node.toString())
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def newBookedTimeTimeSheet(sub_task_id: String, user_id: String, user_type: String, start_date: String, end_date: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      if (StringUtils.isNotBlank(sub_task_id) && StringUtils.isNotBlank(user_id) && StringUtils.isNotBlank(user_type) && StringUtils.isNotBlank(start_date) && StringUtils.isNotBlank(end_date)) {
        var subtaskBCH: Seq[Timesheet] = null
        var subtaskEX: Seq[TimesheetExternal] = null

        var FormattedDATE = new SimpleDateFormat("dd-MM-yyyy")
        var today = FormattedDATE.parse(start_date)
        var eDate = FormattedDATE.parse(end_date)
        var dateMap = new java.util.LinkedHashMap[String, String]()
        var diffInDays = (eDate.getTime - today.getTime) / (1000 * 60 * 60 * 24)
        var index = 0
        var tommorrow = ""

        if (diffInDays >= 0) {

          while (diffInDays >= 0) {
            var c = Calendar.getInstance();
            c.setTime(today)
            c.add(Calendar.DATE, index); // number of days to add      
            tommorrow = FormattedDATE.format(c.getTime()).toString();

            dateMap.put(index.toString(), tommorrow)
            diffInDays = diffInDays - 1
            index = index + 1
          }
        }

        //        @for(key <- benefit_description.keySet()){
        //println(benefit_bid.get(key))
        //}
        if (user_type.equals("0")) {

          subtaskEX = TimesheetService.getUserTimesheetsListExternal(user_id, sub_task_id)
          Ok(views.html.frontend.timesheet.newBookTimeTimesheet(sub_task_id, user_id, user_type, dateMap))
        } else {
          subtaskBCH = TimesheetService.getUserTimesheetsList(user_id, sub_task_id)
          Ok(views.html.frontend.timesheet.newBookTimeTimesheet(sub_task_id, user_id, user_type, dateMap))
        }

      } else {
        Redirect(routes.Login.loginUser())
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def submitNewBookedTimeTimeSheet() = Action { implicit request =>
    request.session.get("username").map { user =>
      var node = new JSONObject()

      var user_id = request.body.asFormUrlEncoded.get("user_id")(0);
      var sub_task = request.body.asFormUrlEncoded.get("sub_task_id")(0);
      var user_type = Integer.parseInt(request.body.asFormUrlEncoded.get("user_type")(0));

      val sub_task_detail = SubTaskServices.findSubTaskDetailsBySubtaskId(sub_task)
      sub_task_detail match {
        case None =>
          node.put("status", "fail")
        case Some(s: SubTasks) =>
          var lCount = request.body.asFormUrlEncoded.get("curr_hours[]").size;
          var j = 0;

          var FormattedDATE = new SimpleDateFormat("dd-MM-yyyy")
          var FormattedDATE2 = new SimpleDateFormat("yyyy-MM-dd")
          val project_id = TaskService.findTaskDetailsByTaskId(s.task_id).get.pId

          while (lCount - 1 >= 0) {
            if (!request.body.asFormUrlEncoded.get("curr_hours[]").lift(j).isEmpty || StringUtils.isNotBlank(request.body.asFormUrlEncoded.get("curr_hours[]").lift(j).get)) {
              //
              if (StringUtils.isNotEmpty(request.body.asFormUrlEncoded.get("curr_hours[]").lift(j).get.trim())) {
                //println(request.body.asFormUrlEncoded.get("curr_hours[]").lift(j).get)    
                var rec_hour = request.body.asFormUrlEncoded.get("curr_hours[]").lift(j).get.trim().toString().split(":")
                var actual_hour: Double = 0
                //var actual_hour = ""
                /*                var df = new DecimalFormat("00.00");
                var hour: Double = rec_hour(0).toString().toDouble
                var minutes: Double = 0
                if (rec_hour(1).toString().toDouble > 30) {
                  minutes = rec_hour(1).toString().toDouble % (24 * 60) / 60
                  println("minutes------------" + minutes)
                  println("hour---------" + hour)
                  actual_hour = hour + minutes
                } else {
                  
                }
*/
                var actual_hour1 = ""
                actual_hour1 = request.body.asFormUrlEncoded.get("curr_hours[]").lift(j).get.trim().toString().replace(":", ".").toString()

                //println(df.format(actual_hour))
                var df = new DecimalFormat("00.00");
                var new_date = FormattedDATE2.format(FormattedDATE.parse(request.body.asFormUrlEncoded.get("curr_date[]").lift(j).get.trim().toString()))
                var rec_date = FormattedDATE2.parse(new_date)
                //println(actual_hour1 + "-----------")

                var new_hour: Double = actual_hour1.toString().replace(".", "-").split("-")(0).toDouble
                var new_min: Double = actual_hour1.toString().replace(".", "-").split("-")(1).toDouble
                //println(new_hour + "new_hour")
                //println(new_min + "new_min")
                //new_min = new_min * 100 / 60
                // var finalHr = new_hour + new_min / 100

                var final_hour_string: Double = 0
                if (new_min < 10) {
                  //final_hour_string = ("0" + new_min).toString().toDouble
                  new_min = new_min * 100 / 60

                  actual_hour = new_hour + Math.ceil(new_min) / 100
                } else {

                  final_hour_string = new_min.toDouble
                  final_hour_string = final_hour_string * 100 / 60
                  if (new_hour < 10) {
                    new_hour = ("0" + new_hour).toDouble
                  }
                  actual_hour = (new_hour.toInt + "." + Math.ceil(final_hour_string.toDouble).toInt).toDouble
                }

                /**
                 * Internal user book time time sheet..
                 */
                if (user_type == 1) {
                  val timsheets = TimesheetService.getUserTimesheets(Integer.parseInt(user_id), new_date)

                  if (timsheets.size > 0) {
                    var isAvailable = false
                    var previousBookedHour: Double = 0
                    var id = 0
                    for (t <- timsheets) {
                      if (t.sub_task_id == Integer.parseInt(sub_task)) {
                        isAvailable = true
                        previousBookedHour = t.hours.toDouble
                        id = t.Id.get
                      }
                    }
                    val hour: Double = previousBookedHour + actual_hour.toDouble

                    if (isAvailable) {
                      /*
                       * update existing time sheet entry
                       */
                      if (id == 0) {
                        id = timsheets(0).Id.get.toInt
                      }
                      //val id = timsheets(0).Id.get.toString()
                      if (hour > 24.01) {
                        node.put("status", "fail")
                      } else {
                        TimesheetService.updateTimesheetBookTimeDirect(id.toString(), hour)
                        node.put("status", "success")
                        /**
                         * Activity log
                         */
                        val act = Activity(ActivityTypes.Timesheet.id, "Timesheet book time entry updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), id)
                        Activity.saveLog(act)
                      }

                    } else {

                      /*
                       * update new time sheet entry
                       */
                      if (actual_hour.toDouble > 24.01) {
                        node.put("status", "fail")
                      } else {
                        val planDetails = Timesheet(None, 1, Integer.parseInt(sub_task), s.task_id, Integer.parseInt(user_id), project_id, rec_date, "ADDED BY PROJECT MANAGER", actual_hour.toDouble, Option(1))
                        val last = TimesheetService.addTimesheet(planDetails);
                        node.put("status", "success")

                        /**
                         * Activity log
                         */
                        val act = Activity(ActivityTypes.Timesheet.id, "Timesheet book time entry updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), last.toInt)
                        Activity.saveLog(act)
                      }

                    }

                  } else {

                    if (actual_hour.toDouble > 24.01) {
                      node.put("status", "fail")
                    } else {
                      val planDetails = Timesheet(None, 1, Integer.parseInt(sub_task), s.task_id, Integer.parseInt(user_id), project_id, rec_date, "ADDED BY PROJECT MANAGER", actual_hour.toDouble, Option(1))
                      val last = TimesheetService.addTimesheet(planDetails);
                      node.put("status", "success")
                    }

                  }

                  val new_hours = TimesheetService.getFormatedAvailableHoursforUser(user_id, sub_task)
                  node.put("new_hours", new_hours)
                }

                /**
                 * External User timesheet
                 */
                if (user_type == 0) {
                  val timsheets = TimesheetService.getExternalUserTimesheets(Integer.parseInt(user_id), new_date)

                  if (timsheets.size > 0) {
                    var isAvailable = false
                    var previousBookedHour: Double = 0
                    var id = 0
                    for (t <- timsheets) {

                      if (t.sub_task_id == Integer.parseInt(sub_task)) {
                        isAvailable = true
                        previousBookedHour = t.hours.toDouble
                        id = t.Id.get
                      }
                    }
                    val hour: Double = previousBookedHour + actual_hour.toDouble
                    if (isAvailable) {
                      /*
                       * update existing time sheet entry
                       */

                      if (id == 0) {
                        id = timsheets(0).Id.get.toInt
                      }
                      if (hour > 24.01) {
                        node.put("status", "fail")
                      } else {
                        TimesheetService.updateTimesheetBookTimeDirectExternal(id.toString(), hour)
                        node.put("status", "success")
                      }
                    } else {
                      /*
                       * update new time sheet entry
                       */
                      if (actual_hour.toDouble > 24.01) {
                        node.put("status", "fail")
                      } else {
                        val planDetails = TimesheetExternal(None, 1, Integer.parseInt(sub_task), s.task_id, Integer.parseInt(user_id), project_id, rec_date, "ADDED BY PROJECT MANAGER", actual_hour.toDouble)
                        val last = TimesheetService.addTimesheetExternal(planDetails);
                        node.put("status", "success")

                      }

                    }
                  } else {

                    if (actual_hour.toDouble > 24.01) {
                      node.put("status", "fail")
                    } else {
                      val planDetails = TimesheetExternal(None, 1, Integer.parseInt(sub_task), s.task_id, Integer.parseInt(user_id), project_id, rec_date, "ADDED BY PROJECT MANAGER", actual_hour.toDouble)
                      val last = TimesheetService.addTimesheetExternal(planDetails);
                      node.put("status", "success")
                    }

                  }

                  val new_hours = TimesheetService.getFormattedAvailableHoursforExternalUser(user_id, sub_task)
                  node.put("new_hours", new_hours)

                }

              }

              lCount = lCount - 1;
              j = j + 1;
            }

          }

          node.put("user_id", user_id)

      }

      Ok(node.toString())

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def updateAllocationHours(sub_task_allocation: String, input_hours: String, allocation_type: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var node = new JSONObject()

      if (!sub_task_allocation.isEmpty() && !input_hours.isEmpty()) {

        if (!allocation_type.isEmpty() && "internal".equals(allocation_type.trim())) {
          val subtaskAlloc = SubTaskServices.findSubTasksAllocationById(sub_task_allocation)
          val subtaskAllocexternal = SubTaskServices.findSubTasksAllocationExternalById(sub_task_allocation)
          if (!subtaskAlloc.isEmpty) {

            var task_id = subtaskAlloc.get.task_id
            var sub_task_id = subtaskAlloc.get.sub_task_id
            var user_id = subtaskAlloc.get.user_id
            var old_allocated_hours = subtaskAlloc.get.estimated_time

            //// var booked_hour = TimesheetService.getBookedHoursforUser(user_id.toString, sub_task_id.toString())
            val taskobj = TaskService.findTaskDetailsByTaskId(task_id.toInt)
            var bankhours = TaskService.getAllocatedHours(task_id.toString());
            var internal_hours = TaskService.getExternalResouceAllocatedHours(task_id.toString());

            var finalhours = taskobj.get.plan_time - (internal_hours + bankhours)
            finalhours += old_allocated_hours
            //println("internal  finalhours   " + finalhours)
            if (!input_hours.trim().isEmpty()) {
              if (input_hours.toDouble <= finalhours) { //&& input_hours.toDouble > booked_hour
                var rounded_input_hours: scala.math.BigDecimal = input_hours.toDouble
                rounded_input_hours = rounded_input_hours.setScale(2, RoundingMode.HALF_UP);
                SubTaskServices.updateSubTaskAllocationByIdAndEstimationTime(sub_task_allocation.toInt, rounded_input_hours.toDouble)
                node.put("status", "success")
                node.put("rounded_input_hours", rounded_input_hours)
                node.put("message", "Allocated hours updated successfuly")
              } else {
                if (input_hours.toDouble > finalhours) { //|| booked_hour < input_hours.toDouble
                  node.put("status", "fail")
                  node.put("message", "Allocated hours cannot be more than available hours")
                }
                /*if (booked_hour > input_hours.toDouble) {
                  node.put("status", "fail")
                  node.put("message", "booked hours are more than allocated hours")
                }*/
              }
            }
          } else {
            node.put("status", "fail")
            node.put("message", "Sub Task allocation object cannot be empty")
          }
        }
        if (!allocation_type.isEmpty() && "external".equals(allocation_type.trim())) {
          val subtaskAllocexternal = SubTaskServices.findSubTasksAllocationExternalById(sub_task_allocation)
          if (!subtaskAllocexternal.isEmpty) {

            var task_id = subtaskAllocexternal.get.task_id
            var sub_task_id = subtaskAllocexternal.get.sub_task_id
            var user_id = subtaskAllocexternal.get.external_resource_id
            var old_allocated_hours = subtaskAllocexternal.get.estimated_time

            /////   var booked_hour = TimesheetService.getBookedHoursforExternalUser(user_id.toString, sub_task_id.toString())

            val taskobj = TaskService.findTaskDetailsByTaskId(task_id.toInt)
            var bankhours = TaskService.getAllocatedHours(task_id.toString())
            var external_hours = TaskService.getExternalResouceAllocatedHours(task_id.toString());
            // println("ext  external_hours   " + external_hours)
            var finalhours = taskobj.get.plan_time - (external_hours + bankhours)
            finalhours += old_allocated_hours

            //println("external  bankhours   " + bankhours)
            // println("booked_hour   " + booked_hour + "bankhours   " + bankhours + " finalhours-" + finalhours)
            if (!input_hours.trim().isEmpty()) {
              if (input_hours.toDouble <= finalhours) { //&& input_hours.toDouble > booked_hour
                var rounded_input_hours: scala.math.BigDecimal = input_hours.toDouble
                rounded_input_hours = rounded_input_hours.setScale(2, RoundingMode.HALF_UP);
                SubTaskServices.updateExternalSubTaskAllocationByIdAndEstimationTime(sub_task_allocation.toInt, rounded_input_hours.toDouble)
                node.put("status", "success")
                node.put("rounded_input_hours", rounded_input_hours)
                node.put("message", "Allocated hours updated successfuly")
              } else {
                if (input_hours.toDouble > finalhours) { //|| booked_hour < input_hours.toDouble
                  node.put("status", "fail")
                  node.put("message", "Allocated hours cannot be more than available hours")
                }
                /*     if (booked_hour > input_hours.toDouble) {
                  node.put("status", "fail")
                  node.put("message", "booked hours are more than allocated hours")
                }*/
              }

            }
          } else {
            node.put("status", "fail")
            node.put("message", "Allocated hours not available ")
          }

        }
      } else if (input_hours.isEmpty()) {
        node.put("status", "fail")
        node.put("message", "Sub Task allocation hours cannot be empty")
      } else {
        node.put("status", "fail")
        node.put("message", "Sub Task allocation cannot be empty")
      }

      Ok(node.toString())
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }

  }
}

