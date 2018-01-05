package services

import play.api.Play.current
import play.api.db.DB
import anorm.SqlParser._
import models._
import anorm._
import java.util.Date
import java.text.SimpleDateFormat
import org.apache.commons.lang3.StringUtils
import org.json.JSONObject
import org.json.JSONArray
import org.apache.commons.lang3.time.DateUtils
import java.text.DecimalFormat
import play.Logger

object SubTaskServices extends CustomColumns {

  def insertSubTask(task: SubTaskMaster): Long = {
    DB.withConnection { implicit connection =>

      val test = SQL(
        """
          insert into art_sub_task (task_id,title, description, 
          plan_start_date,plan_end_date,actual_start_date,actual_end_date,priority,
            added_date,note,status, completion_percentage,task_complete,sub_task_depend,dependencies_type,is_deleted, catalogue_id
         ) values (
          {task_id},{title},{description},
          {plan_start_date},{plan_end_date},{actual_start_date}, {actual_end_date},{priority},
          {added_date},{note},{status},{completion_percentage},{task_complete},{sub_task_depend},{dependencies_type},{is_deleted}, {catalogue_id})
          """).on(
          'task_id -> task.task_id,
          'title -> task.title.trim(),
          'description -> task.description,
          'plan_start_date -> task.plan_start_date,
          'plan_end_date -> task.plan_end_date,
          'actual_start_date -> task.actual_start_date,
          'actual_end_date -> task.actual_start_date,
          'priority -> 0,
          'added_date -> task.added_date,
          'note -> "NA",
          'status -> task.status,
          'completion_percentage -> 0,
          'task_complete -> task.task_complete,
          'sub_task_depend -> task.sub_task_depend,
          'dependencies_type -> task.dependencies_type,
          'is_deleted -> 1,
          'catalogue_id -> task.catalogue_id).executeInsert(scalar[Long].singleOpt)

      //'actual_end_date -> newDate,
      //'actual_end_date_final -> newDate ,

      test.last
    }
  }

  def insertSubTaskFromTemplate(plan_start_date: String, plan_end_date: String, task_id: String, project_mode: String): Option[ErrorIncident] = {

    var sqlString = """
      EXEC art.insert_subtask_template {plan_start_date},{plan_end_date},{task_id},{project_mode}
      """

    DB.withConnection { implicit connection =>
      SQL(sqlString).on(
        'plan_start_date -> plan_start_date,
        'plan_end_date -> plan_end_date,
        'task_id -> task_id.toInt,
        'project_mode -> project_mode.toInt).executeQuery() as (ErrorIncident.error.singleOpt)
    }
  }

  def insertSubTaskFromTemplatePert(
    holiday: Boolean,
    fecha_inicio: String,
    id_platilla: String,
    title: String,
    id_tarea: String,
    extended_description: String) = {

    Logger.debug("fecha_inicio : " + fecha_inicio)
    Logger.debug("id_platilla : " + id_platilla)
    Logger.debug("title : " + title)
    Logger.debug("id_tarea : " + id_tarea)

    var sqlString: String = null

    if (holiday)
      sqlString = "EXEC art.pert_discontinuo {fecha_inicio},{id_platilla},{tipo},{title},{id_tarea},{extended_description}"
    else
      sqlString = "EXEC art.incident_pert {fecha_inicio},{id_platilla},{tipo},{title},{id_tarea},{extended_description}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on(
        'fecha_inicio -> fecha_inicio,
        'id_platilla -> id_platilla.toInt,
        'tipo -> 2,
        'title -> title,
        'id_tarea -> id_tarea.toInt,
        'extended_description -> extended_description).executeUpdate()
    }
  }

  def updateSubTask(task: SubTaskMaster): Int = {
    var actual_end_date: Date = null
    //if (!task.actual_end_date.isEmpty) {
    //println(task)
    if (!task.actual_end_date.getOrElse("").toString().isEmpty()) {
      actual_end_date = task.actual_end_date.get
    } else {
      actual_end_date = task.plan_end_date
    }
    DB.withConnection { implicit connection =>
      SQL(
        """
         update art_sub_task
          set 
          title =  {title},
          description={description},
          plan_start_date= {plan_start_date}, 
          plan_end_date= {plan_end_date},
          actual_start_date={actual_start_date},
          actual_end_date={actual_end_date},
          actual_end_date_final={actual_end_date_final},
          status = {status} ,
		  completion_percentage={completion_percentage},
		  task_complete={task_complete},
		  sub_task_depend={sub_task_depend},
		  dependencies_type={dependencies_type},
  		  catalogue_id={catalogue_id}
          where sub_task_id = {sub_task_id}
        """).on(
          'sub_task_id -> task.sub_task_id,
          'task_id -> task.task_id,
          'title -> task.title.trim(),
          'description -> task.description,
          'plan_start_date -> task.plan_start_date,
          'plan_end_date -> task.plan_end_date,
          'actual_start_date -> task.actual_start_date,
          'actual_end_date -> actual_end_date,
          'actual_end_date_final -> task.actual_end_date_final,
          'added_date -> task.added_date,
          'status -> task.status,
          'completion_percentage -> task.completion_percentage,
          'task_complete -> task.task_complete,
          'sub_task_depend -> task.sub_task_depend,
          'dependencies_type -> task.dependencies_type,
          'catalogue_id -> task.catalogue_id).executeUpdate()
    }
  }

  def updateSubTaskPlannedDate(sub_task_id: String, end_date: String): Int = {

    DB.withConnection { implicit connection =>
      SQL(
        """
         update art_sub_task
          set 
          plan_end_date={plan_end_date}
          where sub_task_id = {sub_task_id}
        """).on(
          'sub_task_id -> sub_task_id,
          'plan_end_date -> end_date).executeUpdate()
    }
  }

  def updateSubTaskPlannedStartDate(sub_task_id: String, start_date: String): Int = {

    DB.withConnection { implicit connection =>
      SQL(
        """
         update art_sub_task
          set 
          plan_start_date={plan_start_date}
          where sub_task_id = {sub_task_id}
        """).on(
          'sub_task_id -> sub_task_id,
          'plan_start_date -> start_date).executeUpdate()
    }
  }

  def updateSubTaskActualDate(sub_task_id: String): Int = {

    DB.withConnection { implicit connection =>
      SQL(
        """
         update art_sub_task
          set 
          actual_end_date_final={actual_end_date_final}
          where sub_task_id = {sub_task_id}
        """).on(
          'sub_task_id -> sub_task_id,
          'actual_end_date -> new Date).executeUpdate()
    }
  }

  def saveSubTaskAllocation(subtask: SubTaskAllocation): Long = {

    DB.withConnection { implicit connection =>
      val result = SQL(
        """
          insert into art_sub_task_allocation( sub_task_id, task_id, pId, user_id, estimated_time, status, is_deleted) values (
          {sub_task_id}, {task_id}, {pId}, {user_id}, {estimated_time}, {status},{is_deleted})
          """).on(
          'sub_task_id -> subtask.sub_task_id,
          'task_id -> subtask.task_id,
          'pId -> subtask.pId,
          'user_id -> subtask.user_id,
          'estimated_time -> subtask.estimated_time,
          'status -> subtask.status,
          'is_deleted -> 1).executeInsert(scalar[Long].singleOpt)

      result.last

    }
  }

  def saveSubTaskAllocationExternal(subtask: SubTaskAllocationExternal): Long = {

    DB.withConnection { implicit connection =>
      val result = SQL(
        """
          insert into art_sub_task_allocation_external( sub_task_id, task_id, pId, external_resource_id, estimated_time, status, is_deleted) values (
          {sub_task_id}, {task_id}, {pId}, {external_resource_id}, {estimated_time}, {status},{is_deleted})
          """).on(
          'sub_task_id -> subtask.sub_task_id,
          'task_id -> subtask.task_id,
          'pId -> subtask.pId,
          'external_resource_id -> subtask.external_resource_id,
          'estimated_time -> subtask.estimated_time,
          'status -> subtask.status,
          'is_deleted -> 1).executeInsert(scalar[Long].singleOpt)

      result.last

    }
  }

  def updateSubTaskAllocation(subtask: SubTaskAllocation): Int = {

    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_sub_task_allocation
          set 
          estimated_time = {estimated_time},
          user_id = {user_id},
          status = {status}  
          where id = {id}
          """).on(
          'id -> subtask.id,
          'user_id -> subtask.user_id,
          'estimated_time -> subtask.estimated_time,
          'status -> subtask.status).executeUpdate()
    }
  }

  def updateSubTaskAdvanceRate(sub_task_id: String, completion_percentage: String): Int = {

    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_sub_task
          set 
          completion_percentage = {completion_percentage}
          where sub_task_id = {sub_task_id}
          """).on(
          'completion_percentage -> completion_percentage.toFloat,
          'sub_task_id -> sub_task_id.toInt).executeUpdate()
    }
  }

  def updateSubTaskAllocationExternal(subtask: SubTaskAllocationExternal): Int = {

    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_sub_task_allocation_external
          set 
          estimated_time = {estimated_time},
          external_resource_id = {external_resource_id},
          status = {status}  
          where id = {id}
          """).on(
          'id -> subtask.id,
          'external_resource_id -> subtask.external_resource_id,
          'estimated_time -> subtask.estimated_time,
          'status -> subtask.status).executeUpdate()
    }
  }

  def findSubTaskDetailsBySubtaskId(sub_task_id: String) = {
    var sql = ""
    if (sub_task_id != "") {
      sql = "select t.* from art_sub_task t where is_deleted=1 and t.sub_task_id='" + sub_task_id + "' order by t.added_date desc"

      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(SubTasks.subTask.singleOpt)
        result

      }
    } else {
      null
    }
  }

  def findSubTaskDetailsByTaskIDs(taskIds: String): Seq[SubTasks] = {
    var sql = ""
    sql = "select t.* from art_sub_task t where is_deleted=1 and t.task_id IN (" + taskIds + ") order by t.added_date desc"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(SubTasks.subTask *)
      result
    }

  }

  def findSubTasksBySubTaskId(sub_task_id: String) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_sub_task where is_deleted = 1 and sub_task_id = {sub_task_id}").on(
          'sub_task_id -> sub_task_id).as(
            SubTaskMaster.subTaskMaster.singleOpt)
      result
    }
  }

  def DeleteAllocation(id: String) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "Update art_sub_task_allocation set is_deleted=0 where id='" + id + "'").on(
          'id -> id).executeUpdate()
    }
  }

  def deleteExternalAllocation(id: String) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "Update art_sub_task_allocation_external set is_deleted=0 where id='" + id + "'").on(
          'id -> id).executeUpdate()
    }
  }

  def findSubTasksAllocationByProject(project_id: String): Seq[SubTaskAllocation] = {
    var sql = ""
    if (project_id != "") {
      sql = "select t.* from art_sub_task_allocation t where is_deleted=1 and t.pId='" + project_id + "'"

      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(SubTaskAllocation.taskAllocation *)
        result

      }
    } else {
      null
    }
  }

  def findSubTasksAllocationByProjectExternal(project_id: String): Seq[SubTaskAllocationExternal] = {
    var sql = ""
    if (project_id != "") {
      sql = "select t.* from art_sub_task_allocation_external t where is_deleted=1 and t.pId='" + project_id + "'"

      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(SubTaskAllocationExternal.taskAllocationExternal *)
        result

      }
    } else {
      null
    }
  }

  def findSubTasksAllocationBySubTask(sub_task_id: String) = {
    val sqlString = "select * from art_sub_task_allocation where sub_task_id=" + sub_task_id + " AND is_deleted=1"
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).on(
        'sub_task_id -> sub_task_id).as(
          SubTaskAllocation.taskAllocation *)
      result
    }
  }

  def findSubTasksAllocationExternalBySubTask(sub_task_id: String) = {
    val sqlString = "select * from art_sub_task_allocation_external where sub_task_id =" + sub_task_id + " AND is_deleted=1"

    //println(sqlString)
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).on(
        'sub_task_id -> sub_task_id).as(
          SubTaskAllocationExternal.taskAllocationExternal *)
      result
    }
  }

  def findExternalResuouseDetailsByResouceId(resouce_id: String) = {
    val sqlString = "select * from art_program_members_external where id=" + resouce_id + ""
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(
        ProgramMembersExternal.programMembersExternal.singleOpt)
      //println(result)
      result
    }
  }

  def findTimesheetSubTasksByProject(project_id: String): Seq[Timesheet] = {
    var sql = ""
    if (project_id != "") {
      sql = "select t.* from art_timesheet t where  t.pId='" + project_id + "'"

      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(Timesheet.timesheetLists *)
        result

      }
    } else {
      null
    }
  }
  def findSubTasksAllocationByTaskId(id: String): Seq[SubTaskAllocation] = {
    var sql = ""
    if (id != "") {
      sql = "select t.* from art_sub_task_allocation t where is_deleted=1 and t.task_id='" + id + "'"

      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(SubTaskAllocation.taskAllocation *)
        result

      }
    } else {
      null
    }
  }

  def findSubTasksAllocationExternalByTaskId(id: String): Seq[SubTaskAllocationExternal] = {
    var sql = ""
    if (id != "") {
      sql = "select t.* from art_sub_task_allocation_external t where is_deleted=1 and t.task_id='" + id + "'"

      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(SubTaskAllocationExternal.taskAllocationExternal *)
        result

      }
    } else {
      null
    }
  }

  def findSubTasksAllocationById(id: String) = {
    var sql = ""
    if (id != "") {
      sql = "select t.* from art_sub_task_allocation t where is_deleted=1 and t.id='" + id + "'"

      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(SubTaskAllocation.taskAllocation.singleOpt)
        result

      }
    } else {
      null
    }
  }

  def findSubTasksAllocationExternalById(id: String) = {
    var sql = ""
    if (id != "") {
      sql = "select t.* from art_sub_task_allocation_external t where is_deleted=1 and t.id='" + id + "'"

      // println("m here --------" + sql)
      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(SubTaskAllocationExternal.taskAllocationExternal.singleOpt)
        result

      }
    } else {
      null
    }
  }

  def calculateBudgetSpent(project_id: String): Double = {
    var sql = "";
    var hours: Double = 0
    var sum: Double = 0
    var user_rate = 0
    if (StringUtils.isNotBlank(project_id)) {
      val userlist = findSubTasksAllocationByProject(project_id)
      for (u <- userlist) {
        hours = u.estimated_time.doubleValue()
        user_rate = UserService.findUserOfficeDetailsById(u.user_id).get.rate_hour
        sum = sum + (hours * user_rate.toDouble)

      }
      sum
    } else
      sum
  }

  def calculateActaulBudgetSpent(project_id: String): Double = {
    var sql = ""
    //    /var hours =

    var sum = Double.box(0)
    var user_rate = 0

    if (StringUtils.isNotBlank(project_id)) {
      val userlist = findTimesheetSubTasksByProject(project_id)

      for (u <- userlist) {

        val hours = u.hours.doubleValue
        user_rate = UserService.findUserOfficeDetailsById(u.user_id).get.rate_hour
        sum = sum + (hours * user_rate)
      }
      sum
    } else
      sum
  }

  def getAvailableBudget(staff: Integer, contarctor: Integer, project_id: String) = {
    val spent = calculateBudgetSpent(project_id)
    val available_budget = staff + contarctor - spent
    available_budget
  }

  def findNonProjectTasksById(id: String): Option[NonProjectTask] = {
    var sql = ""
    if (id != "") {
      sql = "select t.* from art_non_project_task t where t.id='" + id + "'"

      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(NonProjectTask.nonProjectTask.singleOpt)
        result

      }
    } else {
      null
    }
  }

  def saveNonProjectsTasks(subtask: NonProjectTask): Int = {

    DB.withConnection { implicit connection =>
      SQL(
        """
          insert into  art_non_project_task(id , task) values (
          {id} ,{task})
          """).on(
          'id -> subtask.id,
          'task -> subtask.task).executeUpdate()

    }
  }

  def findNonProjectTasks: Seq[NonProjectTask] = {
    var sql = ""
    sql = "select * from art_non_project_task"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(NonProjectTask.nonProjectTask *)
      result

    }

  }

  def findAllocatedHoursForSubTask(sub_task: String, user_id: String): BigDecimal = {
    val sqlSting = "SELECT * FROM art_sub_task_allocation WHERE is_deleted=1 and sub_task_id=" + sub_task + " AND user_id='" + user_id + "'"

    DB.withConnection { implicit connection =>
      val result = SQL(sqlSting).as(SubTaskAllocation.taskAllocation *)
      var hours: BigDecimal = 0
      for (r <- result) {
        hours += r.estimated_time
      }
      hours
    }
  }

  def findTotalAllocatedHoursForSubTask(sub_task: String): String = {
    var finalString: Double = 0
    try {
      var sqlSting = "SELECT * FROM art_sub_task_allocation WHERE is_deleted=1 and sub_task_id=" + sub_task
      var hours: Double = 0
      val df = new DecimalFormat("00.00")
      val df2 = new DecimalFormat("00")
      DB.withConnection { implicit connection =>
        val result = SQL(sqlSting).as(SubTaskAllocation.taskAllocation *)
        for (r <- result) {
          hours += r.estimated_time
        }
      }

      sqlSting = "SELECT * FROM art_sub_task_allocation_external WHERE is_deleted=1 AND sub_task_id=" + sub_task
      DB.withConnection { implicit connection =>
        val result = SQL(sqlSting).as(SubTaskAllocationExternal.taskAllocationExternal *)
        for (r <- result) {
          hours += r.estimated_time
        }
      }

      /*val finalResult = df.format(hours).replace(".", ":").split(":")*/ val finalResult = hours.toString().replace(".", ":").split(":")

      var hour = df2.format(finalResult(0).toInt).toInt
      var mins = df2.format(finalResult(1).toInt).toInt

      var index = 1
      if (mins > 59) {
        mins = mins - 60
        hour = hour + 1
        finalString = (hour + "." + mins).toDouble
      } else {
        finalString = (hour + "." + mins).toDouble
      }
    } catch {
      case ex: Exception => {println("error en subtarea : " + sub_task );return "0"}
    }
    /*df.format(finalString)*/ finalString.toString()

  }

  def expectedCompletionPercentage(assigned: String, start_date: Date, end_date: Date): String = {
    var hours: Double = 0
    var final_percentage: Double = 0
    val currentDate = new Date()
    val df = new DecimalFormat("00.00")
    if (!StringUtils.isEmpty(assigned)) {
      hours = assigned.toDouble
    }

    val diff = (end_date.getTime - start_date.getTime()) / (1000 * 60 * 60 * 24) + 1
    if (currentDate.getTime > end_date.getTime) {
      final_percentage = 100
    } else if (start_date.getTime < currentDate.getTime && end_date.getTime > currentDate.getTime) {

      val curr_diff = (currentDate.getTime - start_date.getTime) / (1000 * 60 * 60 * 24) + 1
      val avg = hours / diff

      final_percentage = ((avg * curr_diff) / hours) * 100

    } else {
      final_percentage = 0
    }
    df.format(final_percentage).trim()

  }

  def updateSubTaskAllocationByIdAndEstimationTime(allocation_id: Int, estimated_time: Double): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_sub_task_allocation
          set 
          estimated_time = {estimated_time}
          where id = {id}
          """).on(
          'id -> allocation_id,
          'estimated_time -> estimated_time).executeUpdate()
    }
  }

  def updateExternalSubTaskAllocationByIdAndEstimationTime(allocation_id: Int, estimated_time: Double): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_sub_task_allocation_external
          set 
          estimated_time = {estimated_time}
          where id = {id}
          """).on(
          'id -> allocation_id,
          'estimated_time -> estimated_time).executeUpdate()
    }
  }
  def getAllocationObjIfUserAlreadyAssignedSubtask(sub_task: String, user_id: String): Seq[SubTaskAllocation] = {
    val sqlSting = "SELECT * FROM art_sub_task_allocation WHERE is_deleted=1 and sub_task_id=" + sub_task + " AND user_id='" + user_id + "'"
    DB.withConnection { implicit connection =>
      val result = SQL(sqlSting).as(SubTaskAllocation.taskAllocation *)
      result
    }
  }

  def checkExternalUserAlreadyAssignedSubtask(sub_task: String, user_id: String): Seq[SubTaskAllocationExternal] = {
    val sqlSting = "SELECT * FROM art_sub_task_allocation_external WHERE is_deleted=1 and sub_task_id=" + sub_task + " AND external_resource_id='" + user_id + "'"
    DB.withConnection { implicit connection =>
      val result = SQL(sqlSting).as(SubTaskAllocationExternal.taskAllocationExternal *)
      result
    }
  }

  def findBookedHoursForSubTask(sub_task: String, user_id: String): BigDecimal = {
    val sqlSting = "SELECT * FROM art_timesheet WHERE sub_task_id=" + sub_task + " AND user_id=" + user_id + " AND pId <> -1"
    DB.withConnection { implicit connection =>
      val result = SQL(sqlSting).as(Timesheet.timesheetLists *)
      var hours: BigDecimal = 0
      for (t <- result) {
        hours = hours + t.hours
      }
      hours

    }
  }

  def findSubTasksByTask(taskId: String): Seq[SubTasks] = {
    var sql = ""
    if (taskId != "") {
      sql = "select t.*,m.task_title as task_title from art_sub_task t,art_task m where (t.task_id=m.tId) AND t.is_deleted=1 AND  t.task_id = '" + taskId + "' order by t.plan_start_date asc"
    } else {
      sql = "select t.*,t.title as task_title from art_sub_task t,art_task m where (t.task_id=m.tId) AND t.is_deleted=1 order by t.plan_start_date asc"
    }

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(SubTasks.subTask *)
      result
    }
  }

  def getSubTaskGanttChart(taskId: String): JSONArray = {
    var jsonArr = new JSONArray()
    var id = 1
    var tasksData = ""
    val tasks = TaskService.findSubTaskListByTaskId(taskId)
    for (t <- tasks) {
      var node = new JSONObject()
      var innerNode = new JSONObject()
      var jsonArr2 = new JSONArray()
      node.put("name", t.task)
      node.put("desc", "")
      val formatter = new SimpleDateFormat("yyyy-MM-dd")
      val plan_start_date = formatter.parse(t.plan_start_date.toString())
      val plan_end_date = formatter.parse(t.plan_end_date.toString())

      /*      println("plan_start_date " + plan_start_date)
      println("plan_end_date   " + plan_end_date)*/
      val cal = DateUtils.toCalendar(plan_start_date).getTimeInMillis() - (1000 * 60 * 60 * 24)

      val cal2 = DateUtils.toCalendar(plan_end_date).getTimeInMillis() - (1000 * 60 * 60 * 24)

      innerNode.put("from", "/Date(" + (cal) + ")/")
      innerNode.put("to", "/Date(" + (cal2) + ")/")

      /*      innerNode.put("from", "/Date(" + (t.plan_start_date.getTime() - 86400) + ")/")
      innerNode.put("to", "/Date(" + (t.plan_end_date.getTime() - 86400) + ")/")*/
      //innerNode.put("label", (t.task_id + "_")) //" + t.task"
      var divVal = ""
      var divPer = ""
      var dateDiff = (t.plan_end_date.getTime - t.plan_start_date.getTime) / (1000 * 60 * 60 * 24) + 1
      if (dateDiff == 1) {
        divPer = "<div class='left gantt-progress-percentage'></div>"
      } else {
        if (!t.completion_percentage.isEmpty) {
          divPer = "<div class='left gantt-progress-percentage' >" + t.completion_percentage.get + "%</div>"
        } else {
          divPer = "<div class='left gantt-progress-percentage'>0%</div>"
        }
      }

      if (!t.completion_percentage.isEmpty) {
        divVal = divPer + "<div style='width:" + t.completion_percentage.get + "%!important;' class='gantt-progress'></div>"
      } else {
        divVal = divPer + "<div style='width:0%!important;' class='gantt-progress'></div>"
      }

      innerNode.put("label", (t.sub_task_id.get + "_" + divVal))
      innerNode.put("customClass", ("status_" + t.status))
      jsonArr2.put(innerNode)
      node.put("values", jsonArr2)

      id = id + 1
      jsonArr.put(node)
    }
    jsonArr
  }

  def getCriticalPathSubTasks(taskId: String): JSONArray = {

    var jsonArr = new JSONArray()
    var id = 1
    var tasksData = ""
    var list = new java.util.ArrayList[Int]()

    val tasks = SubTaskServices.findSubTasksByTask(taskId)

    for (t <- tasks) {

      if (!t.sub_task_depend.isEmpty) {
        if (!StringUtils.isEmpty(t.sub_task_depend.get.trim())) {
          var ts = t.sub_task_depend.get.split(",")

          if (ts.length > 0) {
            for (t <- ts) {
              if (!StringUtils.isEmpty(t.trim())) {
                if (!list.contains(Integer.parseInt(t))) {
                  list.add(Integer.parseInt(t))
                }
              }
            }
            if (!list.contains(t.sub_task_id.get)) {
              list.add(t.sub_task_id.get)
            }
          }
        }
      }
    }

    if (list.size() > 0) {
      var newList = list.toString().replace("[", "(")
      newList = newList.replace("]", ")")
      var tasksList = ""
      var finalDiff: Long = -1
      var lastDate: java.util.Date = null;
      var newTaskList = SubTaskServices.findCriticalpathSubTasksList(newList, "desc")
      for (t <- newTaskList) {
        var dateDiff: Long = -1
        if (lastDate != null) {
          dateDiff = (lastDate.getTime() - t.plan_end_date.getTime()) / (1000 * 60 * 60 * 24)
        }

        if (StringUtils.isBlank(tasksList)) {
          tasksList = t.sub_task_id.get.toString
        } else {
          tasksList += "," + t.sub_task_id.get.toString
        }
        //}

        lastDate = t.plan_start_date

        if (finalDiff == -1) {
          finalDiff = dateDiff
        } else if (finalDiff > dateDiff && dateDiff > 0) {
          finalDiff = dateDiff
        }
      }

      if (!StringUtils.isBlank(tasksList)) {
        tasksList = "(" + tasksList + ")"
        newTaskList = SubTaskServices.findCriticalpathSubTasksList(tasksList, "asc")
        for (t <- newTaskList) {
          var node = new JSONObject()
          var innerNode = new JSONObject()
          var jsonArr2 = new JSONArray()
          node.put("name", t.task)
          node.put("desc", "")
          innerNode.put("from", "/Date(" + (t.plan_start_date.getTime() - 86400) + ")/")
          innerNode.put("to", "/Date(" + (t.plan_end_date.getTime() - 86400) + ")/")
          var divVal = ""
          var divPer = ""
          if (!t.completion_percentage.isEmpty) {
            if (t.completion_percentage.get < 90) {
              divPer = "<div class='left gantt-progress-percentage' >" + t.completion_percentage.get + "%</div>"
            }
          } else {
            divPer = "<div class='left gantt-progress-percentage'>0%</div>"
          }

          if (!t.completion_percentage.isEmpty) {
            divVal = "<div style='width:" + t.completion_percentage.get + "%!important;' class='gantt-progress'></div>" + divPer
          } else {
            divVal = "<div style='width:0%!important;' class='gantt-progress'></div>" + divPer
          }

          innerNode.put("label", (t.sub_task_id.get + "_" + divVal))
          innerNode.put("customClass", ("status_" + t.status))
          jsonArr2.put(innerNode)
          node.put("values", jsonArr2)
          node.put("lag", finalDiff)
          id = id + 1
          jsonArr.put(node)
        }
      }
    }

    jsonArr
  }

  def findCriticalpathSubTasksList(sub_task_list: String, order: String): Seq[SubTasks] = {
    DB.withConnection { implicit connection =>
      val sqlString = "select * from art_sub_task where is_deleted=1 and sub_task_id IN " + sub_task_list + " order by plan_start_date " + order
      val result = SQL(sqlString).as(SubTasks.subTask *)
      result
    }
  }

  def sin_avance_en_tareas(uid: String, pid: String): Seq[SubTasks] = {
    var sqlString = "EXEC art.subtarea_sin_avance {uid},{pid}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('uid -> uid.toInt, 'pid -> pid.toInt).executeQuery() as (SubTasks.subTask *)
    }
  }

  def findAllocatedSubTasksByTask(task_id: String): Seq[SubTasks] = {

    var sql = ""
    if (task_id != "")
      sql = "select DISTINCT(m.sub_task_id), m.* from art_sub_task_allocation t, art_sub_task m where m.is_deleted=1 and t.is_deleted=1 and (t.sub_task_id=m.sub_task_id AND t.task_id = '" + task_id + "')"

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(SubTasks.subTask *)
      result
    }
  }

  def findAllocatedExternalSubTasksByTask(task_id: String): Seq[SubTasks] = {

    var sql = ""
    if (task_id != "")
      sql = "select DISTINCT(m.sub_task_id), m.* from art_sub_task_allocation_external t, art_sub_task m where m.is_deleted=1 and t.is_deleted=1 and (t.sub_task_id=m.sub_task_id AND t.task_id = '" + task_id + "')"

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(SubTasks.subTask *)
      result
    }
  }

  def validateSubTask(sub_task_id: Integer, mDate: String) = {
    var sql = ""
    sql = "select * from  art_sub_task where is_deleted=1 and sub_task_id =" + sub_task_id + " and (plan_start_date <='" + mDate + "' and plan_end_date >='" + mDate + "')"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(SubTaskMaster.subTaskMaster.singleOpt)

      result
    }

  }

  def validateSubTaskDependency(sub_tasks: String): Seq[SubTasks] = {
    var sql = ""
    sql = "select * from  art_sub_task where (completion_percentage < 100) AND (sub_task_id IN (" + sub_tasks + ") )"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(SubTasks.subTask *)
      result
    }

  }

  def findAllSubTasks(): Seq[SubTasks] = {

    var sql = ""
    sql = "select * from art_sub_task where is_deleted=1  "

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(SubTasks.subTask *)
      result
    }
  }

  def checkSubTaskValidDependency(sub_task_id: String): Boolean = {
    var isValid = true
    /*
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_timesheet where  (sub_task_id={sub_task_id} AND task_type=1)").on(
          'sub_task_id -> sub_task_id).as(Timesheet.timesheetLists.*)

      if (result.size == 0) {
        //if booked hours found...

        val sub_task = findSubTasksBySubTaskId(sub_task_id)

        val format = new java.text.SimpleDateFormat("yyyy-MM-dd")
        val refDate = new Date();
        val currentDate = format.parse(format.format(refDate))

        if (sub_task.get.plan_start_date.getTime() <= currentDate.getTime()) {
          isValid = false
        }
      } else {
        isValid = false
      }

    }

*/
    isValid
  }

  def getSubTaskDependencyDates(sub_tasks: String) = {
    var minDate: java.util.Date = null
    var maxDate: java.util.Date = null
    var chkDate: java.util.Date = null
    var node = new JSONObject()
    val subtaskList = sub_tasks.split(",")
    for (t <- subtaskList) {
      if (!StringUtils.isEmpty(t.trim())) {
        val task = SubTaskServices.findSubTasksBySubTaskId(t)
        if (!task.isEmpty) {

          if (minDate == null && maxDate == null) {
            minDate = task.get.plan_start_date
            maxDate = task.get.plan_end_date
          } else {
            chkDate = task.get.plan_start_date
            if (chkDate.getTime() <= minDate.getTime()) {
              minDate = chkDate
            }
            chkDate = task.get.plan_end_date
            if (chkDate.getTime() >= maxDate.getTime()) {
              maxDate = chkDate
            }
          }
        }
      }

    }
    if (minDate != null && maxDate != null) {
      node.put("minDate", new SimpleDateFormat("yyyy-MM-dd").format(minDate))
      node.put("maxDate", new SimpleDateFormat("yyyy-MM-dd").format(maxDate))
    }

    node
  }

  def findDependentSubTasksForTask(task_id: String, selected_sub_task: String): Seq[SubTaskMaster] = {
    DB.withConnection { implicit connection =>
      var sqlString = ""
      if (StringUtils.isBlank(selected_sub_task)) {
        sqlString = "select * from  art_sub_task where (completion_percentage IS NULL OR completion_percentage <> 100) AND task_id ='" + task_id + "' AND is_deleted=1"
      } else {
        sqlString = "select * from  art_sub_task where (completion_percentage IS NULL OR completion_percentage <> 100) AND task_id ='" + task_id + "' AND sub_task_id NOT IN (" + selected_sub_task + ") AND is_deleted=1"
      }
      val result = SQL(sqlString).as(SubTaskMaster.subTaskMaster *)
      result
    }
  }

  def findDependentEditSubTasksForTask(currentSub: String, task_id: String, selected_sub_tasks: String): Seq[SubTaskMaster] = {
    DB.withConnection { implicit connection =>
      var newString = ""
      for (t <- selected_sub_tasks.split(",")) {
        if (!StringUtils.isEmpty(t.trim())) {

          if (StringUtils.isEmpty(newString)) {
            newString = t
          } else {
            newString = newString + "," + t
          }
        }
      }
      var sql = ""
      if (!StringUtils.isEmpty(newString)) {
        sql = "select * from  art_sub_task where (completion_percentage IS NULL OR completion_percentage <> 100) AND task_id ='" + task_id + "'AND sub_task_id <>'" + currentSub + "' AND sub_task_id NOT IN (" + newString + ") AND is_deleted=1"
      } else {
        sql = "select * from  art_sub_task where (completion_percentage IS NULL OR completion_percentage <> 100) AND task_id ='" + task_id + "' AND sub_task_id <>'" + currentSub + "' AND is_deleted=1"
      }
      val result = SQL(sql).as(SubTaskMaster.subTaskMaster *)
      result
    }
  }

  def validateForm(form: play.api.data.Form[SubTaskMaster], milestone: Option[models.Tasks], oldId: String) = {

    val format = new java.text.SimpleDateFormat("dd-MM-yyyy")
    var plan_start_date = format.parse(form.data.get("planned_start_date").get)

    var newform: play.api.data.Form[models.SubTaskMaster] = null

    if (plan_start_date.getTime() < milestone.get.plan_start_date.getTime() || plan_start_date.getTime() > milestone.get.plan_end_date.getTime()) {
      newform = form.withError("planned_start_date", "Sub Task start date can not be earlier than task start date.")
      newform.fill(form.get)
    }

    var plan_end_date = format.parse(form.data.get("planned_end_date").get)
    if (plan_end_date.getTime() > milestone.get.plan_end_date.getTime() || plan_end_date.getTime() < milestone.get.plan_start_date.getTime() || plan_start_date.getTime() > plan_end_date.getTime()) {
      //println("m here...")
      newform = form.withError("planned_end_date", "Subtask end date can not be greater than Task end date.")
      newform.fill(form.get)
    }

    val task_depend = form.data.get("sub_task_depend")

    if (!task_depend.isEmpty) {
      val ids = task_depend.get.split(",")
      for (id <- ids) {
        if (!StringUtils.isEmpty(id.trim())) {
          //println("id que busca : " + id.trim())
          val subtask = SubTaskServices.findSubTasksBySubTaskId(id.trim())
          if (!subtask.isEmpty) {
            val minD = subtask.get.plan_start_date.getTime()
            val maxD = subtask.get.plan_end_date.getTime()
            //println("subtask.get.plan_start_date : " + subtask.get.plan_start_date)
            //println("subtask.get.plan_end_date : " + subtask.get.plan_end_date)
            //println("compara con : " + plan_start_date)
            //if ((maxD - 86400) >= (plan_start_date.getTime())) {
            if ((minD - 86400) >= (plan_start_date.getTime())) {
              //newform = form.withError("planned_start_date", "Enter valid start date")
              newform = form.withError("planned_start_date", "No puede iniciar antes que sub tarea dependiente ")
              newform.fill(form.get)
              newform
            }

          }
        }
      }
    }

    if (!form("task_title").value.isEmpty && !StringUtils.isEmpty(form("task_title").value.get)) {
      val subtaskName = form("task_title").value.get.trim
      val subtasks = findSubTaskByName(subtaskName, milestone.get.tId.get.toString)
      if (subtasks.size > 0) {
        for (subtask <- subtasks) {
          if (!StringUtils.equals(subtask.sub_task_id.get.toString(), oldId)) {
            newform = form.withError("task_title", "Same sub-task name is not allowed under the same task.")
            newform.fill(form.get)
            newform
          }
        }
      }
    }
    if (newform != null) {
      newform
    } else {
      form
    }
  }

  def insertSubTaskStatus(pm: SubTaskStatus): Long = {

    DB.withConnection { implicit connection =>
      val result = SQL(
        """
          insert into  art_sub_task_status (
            sub_task_id, status_for_date, reason_for_change, status 
          ) 
          values(
            {sub_task_id}, {status_for_date},{reason_for_change},{status}
          )
          """).on(
          'sub_task_id -> pm.sub_task_id,
          'status_for_date -> new Date(),
          'reason_for_change -> pm.reason_for_change,
          'status -> pm.status).executeInsert(scalar[Long].singleOpt)
      result.last
    }
  }

  def findSubTaskByName(subtaskName: String, taskId: String) = {
    var sqlString = ""
    sqlString = "SELECT * from  art_sub_task where title='" + subtaskName + "' AND task_id = " + taskId + " AND is_deleted=1"

    DB.withConnection { implicit connection =>
      SQL(sqlString).as(SubTasks.subTask *)
    }
  }

  def deleteSubtask(id: String) = {
    DB.withConnection { implicit connection =>
      //println("id =  " + id)
      val result = SQL(
        "Update art_sub_task set is_deleted = 0 where sub_task_id='" + id + "'").on(
          'sub_task_id -> id).executeUpdate()
    }
  }

  def findSubTaskStatus(sub_task_id: String) = {
    var sqlString = ""
    sqlString = "SELECT TOP 1* from  art_sub_task_status where sub_task_id=" + sub_task_id + " order by status_for_date DESC"
    //sqlString = "SELECT * from  art_sub_task_status where sub_task_id=" + sub_task_id + " order by status_for_date DESC LIMIT 0,1"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(SubTaskStatus.stStatus.singleOpt)
    }
  }

  def findAllSubTaskStatus(sub_task_id: String): Seq[SubTaskStatus] = {
    var sqlString = ""
    sqlString = "SELECT * from  art_sub_task_status where sub_task_id=" + sub_task_id + " order by status_for_date DESC"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(SubTaskStatus.stStatus *)
    }
  }
  def findAllocatedSubTaskIdsByTask(task_id: String): Seq[Long] = {
    var sql = "select sub_task_id from  art_sub_task  where task_id = " + task_id
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(scalar[Long] *)
      result
    }
  }

  def findMaxSubtaskEndDate(task_id: String): Option[Date] = {
    var result: Option[Date] = null
    var sql = "select MAX(plan_end_date) from  art_sub_task  where task_id = " + task_id + " AND is_deleted=1"
    try {
      DB.withConnection { implicit connection =>
        result = SQL(sql).as(scalar[Date].singleOpt)
      }
    } catch {
      case e: Exception =>
    }
    result
  }

  def findMinSubtaskEndDate(task_id: String): Option[Date] = {
    var result: Option[Date] = null
    var sql = "select MIN(plan_start_date) from  art_sub_task  where task_id = " + task_id + " AND is_deleted=1"
    try {
      DB.withConnection { implicit connection =>
        result = SQL(sql).as(scalar[Date].singleOpt)
      }
    } catch {
      case e: Exception =>
    }
    result
  }

  def findSubTasksAllocationIdBySubTaskId(sub_task_id: String) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select id from art_sub_task_allocation where sub_task_id = {sub_task_id} and is_deleted = 1").on(
          'sub_task_id -> sub_task_id).as(scalar[Long] *)
      result
    }
  }

  def udpateActualEndDate(id: String, end_date: String) = {
    val new_date = new SimpleDateFormat("dd-MM-yyyy").parse(end_date.trim)
    //println(new SimpleDateFormat("yyyy-MM-dd").format(new_date))
    DB.withConnection { implicit connection =>
      val result = SQL(
        "Update art_sub_task set actual_end_date_final ='" + new SimpleDateFormat("yyyy-MM-dd").format(new_date) + "'  where sub_task_id='" + id + "'").executeUpdate()
    }
  }

  def findSubTasksListForProgram(employee_id: String, program_id: String) = {
    val sqlString = "select [sub_task_id],[task_id],[title],[description],[plan_start_date],[plan_end_date],[actual_start_date] ,[actual_end_date] ,DATEDIFF(day, plan_end_date,GETDATE()) as priority  ,[added_date]  ,[note] ,[status] ,[completion_percentage] ,[task_complete] ,[sub_task_depend] ,[dependencies_type] ,[is_deleted] ,[catalogue_id],[actual_end_date_final] from art_sub_task  where (completion_percentage < 100 OR completion_percentage Is Null) AND sub_task_id IN (select DISTINCT(sub_task_id) from art_sub_task_allocation where is_deleted=1 AND user_id= " + employee_id + " AND pId IN (select DISTINCT(pId) from art_project_master where program=" + program_id + ") ) AND is_deleted=1 AND task_id IN ( select DISTINCT(task_id) from art_task  where is_active=1 AND  pId IN ( select DISTINCT(pId) from art_project_master where is_active=1 AND program =" + program_id + ") )"

    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(SubTasks.subTask *)
      result
    }
  }

  def findAllSubTasksForProgram(program_id: String) = {
    val sqlString ="select *  from art_sub_task  where (completion_percentage < 100 OR completion_percentage Is Null) AND is_deleted=1 AND sub_task_id IN (select DISTINCT(sub_task_id) from art_sub_task_allocation where is_deleted=1 AND  pId IN (select DISTINCT(pId) from art_project_master where is_active=1 AND program=" + program_id + ") ) AND is_deleted=1 AND task_id IN ( select DISTINCT(task_id) from art_task  where is_active=1 AND  pId IN ( select DISTINCT(pId) from art_project_master where is_active=1 AND program =" + program_id + ") )"
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(SubTasks.subTask *)
      result
    }
  }

  def findSubTasksListForProgramIds(employee_id: String, program_ids: String): Seq[SubTasks] = {
    val sqlString = "select * from art_sub_task  where (completion_percentage < 100 OR completion_percentage Is Null) AND sub_task_id IN (select DISTINCT(sub_task_id) from art_sub_task_allocation where is_deleted=1 AND user_id= " + employee_id + " AND pId IN (select DISTINCT(pId) from art_project_master where program IN (" + program_ids + ") ) ) AND is_deleted=1 AND task_id IN ( select DISTINCT(task_id) from art_task  where is_active=1 AND  pId IN ( select DISTINCT(pId) from art_project_master where is_active=1 AND program IN (" + program_ids + ") ) )"
    // println("time sheet " + sqlString)
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(SubTasks.subTask *)
      result
    }
  }
  def findProgramDetailForSubTask(sub_task_id: String) = {
    val sqlString = "Select * from art_program where program_id= ( Select DISTINCT(program) from art_project_master where pId=(Select DISTINCT(pId) from art_task where tId=(SELECT DISTINCT(task_id) FROM art_sub_task where sub_task_id=" + sub_task_id + ")))"
    //println(sqlString)
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(ProgramMaster.pMaster.singleOpt)
      result
    }
  }

  def findActualCostForSubTask(subtask_id: String, start_date: String, end_date: String): Double = {
    var result: Double = 0

    var hour1: Option[Double] = Option(0)
    var hour2: Option[Double] = Option(0)
    var sql = "select SUM(hours) from  art_timesheet  where sub_task_id= " + subtask_id + " AND is_deleted=1 AND  task_type=1 AND ( task_for_date  between CAST('" + start_date + "' as DATE ) AND CAST('" + end_date + "' as DATE ) ) "
    if (subtask_id.toInt == 53792) {
      // println(sql)      
    }

    try {
      DB.withConnection { implicit connection =>
        hour1 = SQL(sql).as(scalar[Double].singleOpt)
      }
    } catch {
      case e: Exception =>
    }
    sql = "select SUM(hours) from  art_timesheet_external  where sub_task_id= " + subtask_id + " AND is_deleted=1 AND  task_type=1 AND ( task_for_date  between CAST('" + start_date + "' as DATE ) AND CAST('" + end_date + "' as DATE ) ) "
    //sql = "select SUM(hours) from  art_timesheet_external  where sub_task_id= " + subtask_id + " AND is_deleted=1 AND task_type=1 AND task_for_date between ( '" + start_date + "' AND '" + end_date + "' ) "

    try {
      DB.withConnection { implicit connection =>
        hour2 = SQL(sql).as(scalar[Double].singleOpt)
      }
    } catch {
      case e: Exception =>
    }
    // println(hour1 +"---"+hour2)
    result = hour1.get + hour2.get

    result
  }
  /*
  def findActualStartDateForSubTask(subtask_id: String): Option[Date] = {
    var result: Option[Date] = null
    var date1: Option[Date] = null
    var date2: Option[Date] = null

    var sql = "select MIN(task_for_date) from  art_timesheet  where sub_task_id= " + subtask_id + " AND is_deleted=1 AND task_type=1"

    try {
      DB.withConnection { implicit connection =>
        date1 = SQL(sql).as(scalar[Date].singleOpt)
      }
    } catch {
      case e: Exception =>
    }

    sql = "select MIN(task_for_date) from  art_timesheet_external  where sub_task_id= " + subtask_id + " AND is_deleted=1 AND task_type=1"

    try {
      DB.withConnection { implicit connection =>
        date2 = SQL(sql).as(scalar[Date].singleOpt)
      }
    } catch {
      case e: Exception =>
    }

    if (date1 != null && date2 != null) {
      if (date1.get.getTime > date2.get.getTime) {
        result = date1
      } else {
        result = date2
      }
    } else {
      if (date1 != null) {
        result = date1
      } else if (date2 != null) {
        result = date2
      }
    }

    result
  }
*/

  def findActualStartDateForSubTask(subtask_id: String): Option[Date] = {
    var result: Option[Date] = null

    var sql = "SELECT MIN(task_for_date) FROM (select MIN(task_for_date) task_for_date from  art_timesheet  where sub_task_id= " + subtask_id + " AND is_deleted=1 AND task_type=1 UNION ALL select MIN(task_for_date) from  art_timesheet_external  where sub_task_id= " + subtask_id + " AND is_deleted=1 AND task_type=1) AS FECHA"
    //println(sql)
    try {
      DB.withConnection { implicit connection =>
        result = SQL(sql).as(scalar[Date].singleOpt)
      }
    } catch {
      case e: Exception =>
    }

    result
  }

  def findActualStartDateForSubTask2(subtask_id: String): Option[String] = {
    var result: Option[String] = null

    //var sql = "SELECT ISNULL(CONVERT(nVarChar(10),MIN(task_for_date), 110), 'NA') FROM (select MIN(task_for_date) task_for_date from  art_timesheet  where sub_task_id= " + subtask_id + " AND is_deleted=1 AND task_type=1 UNION ALL select MIN(task_for_date) from  art_timesheet_external  where sub_task_id= " + subtask_id + " AND is_deleted=1 AND task_type=1) AS FECHA"
    var sql = "SELECT ISNULL(REPLACE ( CONVERT(varchar(10), MIN(task_for_date), 103), '/','-'),'NA') FROM (select MIN(task_for_date) task_for_date from  art_timesheet  where sub_task_id= " + subtask_id + " AND is_deleted=1 AND task_type=1 UNION ALL select MIN(task_for_date) from  art_timesheet_external  where sub_task_id= " + subtask_id + " AND is_deleted=1 AND task_type=1) AS FECHA"

    try {
      DB.withConnection { implicit connection =>
        result = SQL(sql).as(scalar[String].singleOpt)
      }
    } catch {
      case e: Exception =>
    }

    result
  }

  def findActualEndDateForSubTask(subtask_id: String): Option[Date] = {
    var result: Option[Date] = null

    var sql = "select MAX(task_for_date) FROM (select MAX(task_for_date) task_for_date from  art_timesheet  where sub_task_id= " + subtask_id + " AND is_deleted=1 AND task_type=1 UNION ALL select MAX(task_for_date) from  art_timesheet_external  where sub_task_id= " + subtask_id + " AND is_deleted=1 AND task_type=1) AS FECHA"

    try {
      DB.withConnection { implicit connection =>
        result = SQL(sql).as(scalar[Date].singleOpt)
      }
    } catch {
      case e: Exception =>
    }

    result
  }

  def findActualEndDateForSubTask2(subtask_id: String): Option[String] = {
    var result: Option[String] = null

    //var sql = "select ISNULL(CONVERT(nVarChar(10),MAX(task_for_date), 110), 'NA') FROM (select MAX(task_for_date) task_for_date from  art_timesheet  where sub_task_id= " + subtask_id + " AND is_deleted=1 AND task_type=1 UNION ALL select MAX(task_for_date) from  art_timesheet_external  where sub_task_id= " + subtask_id + " AND is_deleted=1 AND task_type=1) AS FECHA"
    var sql = "select ISNULL(REPLACE ( CONVERT(varchar(10), MAX(task_for_date), 103), '/','-'),'NA') FROM (select MAX(task_for_date) task_for_date from  art_timesheet  where sub_task_id= " + subtask_id + " AND is_deleted=1 AND task_type=1 UNION ALL select MAX(task_for_date) from  art_timesheet_external  where sub_task_id= " + subtask_id + " AND is_deleted=1 AND task_type=1) AS FECHA"

    try {
      DB.withConnection { implicit connection =>
        result = SQL(sql).as(scalar[String].singleOpt)
      }
    } catch {
      case e: Exception =>
    }

    result
  }

  def validateSubTasksDependency(task_id: String, sub_task_id: String) = {

    var project_id = ""
    var isValid = true

    val task = TaskService.findTaskDetailsByTaskId(task_id.toInt)
    if (!task.isEmpty) {
      project_id = task.get.pId.toString()

      val tasks = TaskService.findTaskListByProjectId(project_id)
      if (tasks.size > 0) {
        for (t <- tasks) {

          val sub_tasks = SubTaskServices.findSubTasksByTask(t.tId.get.toString())

          for (s <- sub_tasks) {
            if (!s.sub_task_depend.isEmpty) {
              var tasks_depend_aarray = s.sub_task_depend.get.split(",")
              for (td <- tasks_depend_aarray) {

                var task_id = StringUtils.trim(td).replace("(", "")
                task_id = task_id.replace(")", "")

                if (!StringUtils.isEmpty(task_id.toString().trim)) {

                  if (task_id.toInt == sub_task_id.toInt) {
                    isValid = false
                  }
                }
              }
            }
          }
        }
      }
    }

    isValid

  }

  def updateSubTaskDependecy(sub_task_id: String, sub_task_depends: String): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_sub_task
          set 
            sub_task_depend={sub_task_depend}
          where sub_task_id = {sub_task_id}
          """).on(
          'sub_task_id -> sub_task_id, 'sub_task_depend -> sub_task_depends).executeUpdate()
    }
  }

  def updateCompletionPercentage(sub_task_id: String, completion_percentage: String, plan_start_date: String, plan_end_date: String): Int = {

    DB.withConnection { implicit connection =>
      SQL(
        """
         update art_sub_task
          set 
          completion_percentage={completion_percentage},
          plan_start_date={plan_start_date},
          plan_end_date={plan_end_date}
          where sub_task_id = {sub_task_id}
        """).on(
          'sub_task_id -> sub_task_id.toInt,
          'completion_percentage -> completion_percentage.toInt,
          'plan_start_date -> plan_start_date,
          'plan_end_date -> plan_end_date).executeUpdate()
    }
  }

  def findSubTasksforDependentTasks(tasks_ids: String): String = {
    var sql = "SELECT SUBSTRING((SELECT ',' + CONVERT(VARCHAR(12), sub_task_id) from art_sub_task where task_id IN (  " + tasks_ids + " ) AND is_deleted=1 FOR XML PATH('')),2,200000) AS CSV"
    var finalString = ""
    if (!StringUtils.isEmpty(tasks_ids)) {
      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(scalar[String].singleOpt)
        if (!result.isEmpty) {
          finalString = result.get.toString()
        }
      }
    }
    finalString
  }

  def findAllAllocatedSubTasks = {
    val sqlString = "select * from art_sub_task where sub_task_id IN (select DISTINCT(sub_task_id) from art_sub_task_allocation where is_deleted=1 AND  pId IN (select DISTINCT(pId) from art_project_master where is_active=1 ) ) AND is_deleted=1 AND task_id IN ( select DISTINCT(task_id) from art_task  where is_active=1 AND  pId IN ( select DISTINCT(pId) from art_project_master where is_active=1) )"
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(SubTasks.subTask *)
      result
    }
  }

  def findDetailInformation(parent_type: String, parent_id: String) = {
    DB.withConnection { implicit connection =>
      var sql = ""

      parent_type match {
        case "PROGRAM" =>
          sql = "select pro.program_id, 0 as project_id, 0 as task_id, 0 as sub_task  from  art_program pro where  pro.program_id= " + parent_id + ""
        case "PROJECT" =>
          sql = "select  pro.program_id, pr.pId as project_id, 0 as task_id, 0 as sub_task from  art_program pro,art_project_master pr where   pro.program_id = pr.program AND pr.pId= " + parent_id + ""
        case "TASK" =>
          sql = "select pro.program_id, pr.pId as project_id, t.tId as task_id, 0 as sub_task as   from  art_program pro,art_project_master pr,art_task t where   pro.program_id = pr.program AND pr.pId=t.pId AND t.tId= " + parent_id + ""
        case "SUBTASK" =>
          sql = "select pro.program_id, pr.pId as project_id, t.tId as task_id,s.sub_task_id as sub_task from  art_program pro,art_project_master pr,art_task t,art_sub_task s where   pro.program_id = pr.program AND pr.pId=t.pId AND t.tId= s.task_id and s.sub_task_id=" + parent_id + ""

      }
      //  println(sql + "----------------")
      val result =
        SQL(sql).as(SubTaskDetail.searchResultObject.singleOpt)
      result

    }

  }

  /* 
    If  FNOW > FTP
then %AVE = 100%.
otherwise
  If FNOW >= FIP and FNOW <= FTP
      then %AVE=((FNOW-FIP)/(FTP-FIP+1)) *100
      otherwise %AVE = 0*/
  def getSubTaskAVE(sub_task_id: String) = {
    var sql = "select * from art_sub_task where is_deleted=1 AND sub_task_id = " + sub_task_id
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(SubTaskMaster.subTaskMaster.singleOpt)
      if (!result.isEmpty) {
        if (System.currentTimeMillis() > result.get.plan_end_date.getTime()) {
          100
        } else if (System.currentTimeMillis() >= result.get.plan_start_date.getTime() && System.currentTimeMillis() <= result.get.plan_end_date.getTime()) {

        } else {
          0
        }
      }
    }
  }

  def getSubTaskEarnValue(sub_task_id: String) = {
    var sql = """     SELECT SUM(estimated_time) estimated_time FROM
                      (SELECT ISNULL(SUM(estimated_time),0) estimated_time FROM art_sub_task_allocation WHERE sub_task_id="""" + sub_task_id + """ AND is_deleted=1
                      UNION ALL
                      SELECT ISNULL(SUM(estimated_time),0) estimated_time FROM art_sub_task_allocation_external WHERE sub_task_id="""" + sub_task_id + """ AND is_deleted=1
                      ) AS TOTAL"""

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(scalar[Double].singleOpt)
      result
    }
  }

  def getSubTaskActualCost(sub_task_id: String) = {
    var sql = """    
                SELECT SUM(hours) hours FROM (
                SELECT ISNULL(SUM(hours),0) hours  
                FROM art_timesheet d 
                INNER JOIN art_sub_task a
                ON d.sub_task_id=a.sub_task_id
                WHERE a.sub_task_id = """ + sub_task_id + """  AND
                a.completion_percentage  = 100 AND
                a.is_deleted=1 AND
                d.is_deleted=1
                UNION ALL
                SELECT ISNULL(SUM(hours),0) hours  
                FROM art_timesheet_external d 
                INNER JOIN art_sub_task a
                ON d.sub_task_id=a.sub_task_id
                WHERE a.sub_task_id = """ + sub_task_id + """  AND
                a.completion_percentage  = 100 AND
                a.is_deleted=1 AND
                d.is_deleted=1
                ) AS TOTAL
                """
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(scalar[Double].singleOpt)
      result
    }
  }

  def getSubTaskPlannedValue(sub_task_id: String) = {
    var sql = """   SELECT SUM(estimated_time) estimated_time FROM
                    (SELECT ISNULL(SUM(estimated_time),0) estimated_time FROM art_sub_task_allocation WHERE 
                    sub_task_id IN (SELECT sub_task_id FROM art_sub_task WHERE plan_end_date < GETDATE() AND task_id IN (SELECT tId FROM art_task WHERE pId=""" + sub_task_id + """ AND is_deleted=1) AND is_deleted=1)  AND is_deleted=1
                    UNION ALL
                    SELECT ISNULL(SUM(estimated_time),0) estimated_time FROM art_sub_task_allocation_external WHERE
                    sub_task_id IN (SELECT sub_task_id FROM art_sub_task WHERE plan_end_date < GETDATE() AND task_id IN (SELECT tId FROM art_task WHERE pId=""" + sub_task_id + """ AND is_deleted=1) AND is_deleted=1) AND is_deleted=1) AS TOTAL """

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(scalar[Double].singleOpt)
      result
    }
  }
}