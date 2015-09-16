package services;
import play.api.Play.current
import play.api.db.DB
import anorm.SqlParser._
import models._
import anorm.Id
import anorm._
import org.joda.time._
import com.typesafe.plugin._
import org.apache.commons.lang3.time.DateUtils
import java.util.Date
import java.text.SimpleDateFormat
import java.util.Calendar
import org.apache.commons.lang3.StringUtils
import java.text.DecimalFormat
import org.json.JSONObject
import play.api.data.Form
import org.json.JSONArray
import play.i18n._
import sun.util.calendar.Gregorian
import java.util.GregorianCalendar
import scala.math.BigDecimal.RoundingMode

object TaskService extends CustomColumns {

  val langObj = new Lang(Lang.forCode("es-ES"))
  /**
   * insert new task information into a database..
   */
  def insertTask(task: Tasks): Long = {
    DB.withConnection { implicit connection =>

      val lastSave = SQL(
        """
          insert into art_task ( pId, task_title, task_code,
            plan_start_date, plan_end_date, 
            task_description,plan_time,creation_date,task_status, status, owner,task_discipline,
					  completion_percentage,remark,task_depend,dependencies_type,
					  stage,user_role,deliverable,task_type,is_active
         ) values (
            {pId},{task_title},{task_code},
            {plan_start_date},{plan_end_date},
            {task_description},{plan_time},{creation_date},{task_status},{status}, 
  					{owner},{task_discipline},{completion_percentage},{remark},{task_depend},{dependencies_type},
  					{stage},{user_role},{deliverable},{task_type},{is_active}
					)
          """).on(
          'pId -> task.pId,
          'task_title -> task.task_title,
          'task_code -> task.task_code,
          'plan_start_date -> task.plan_start_date,
          'plan_end_date -> task.plan_end_date,
          'task_description -> task.task_description,
          'plan_time -> task.plan_time.bigDecimal,
          'creation_date -> task.creation_date,
          'task_status -> task.task_status,
          'status -> task.status,
          'owner -> task.owner,
          'task_discipline -> task.task_discipline,
          'completion_percentage -> task.completion_percentage,
          'remark -> task.remark,
          'task_depend -> task.task_depend,
          'dependencies_type -> task.dependencies_type,
          'stage -> task.stage,
          'user_role -> task.user_role,
          'deliverable -> task.deliverable,

          'task_type -> task.task_type, 'is_active -> 1).executeInsert(scalar[Long].singleOpt)

      lastSave.last
    }
  }

  /**
   * Update task detail information...
   */
  def updateTask(task: Tasks): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_task
          set 
            pId =  {pId},
            task_title={task_title},
            task_code ={task_code},
            plan_start_date ={plan_start_date},
            plan_end_date ={plan_end_date},
            task_description = {task_description},
            plan_time={plan_time},
            creation_date = {creation_date},
            task_status={task_status},
            status = {status} ,
            owner = {owner},
  					task_discipline = {task_discipline},
  					completion_percentage = {completion_percentage},
  					remark = {remark},
  					task_depend={task_depend},
  					dependencies_type={dependencies_type},
  					stage={stage},
  					user_role={user_role},
  					deliverable={deliverable}
  					
          where tId = {tId}
          """).on(
          'tId -> task.tId,
          'pId -> task.pId,
          'task_title -> task.task_title,
          'task_code -> task.task_code,
          'plan_start_date -> task.plan_start_date,
          'plan_end_date -> task.plan_end_date,
          'task_description -> task.task_description,
          'plan_time -> task.plan_time.bigDecimal,
          'creation_date -> task.creation_date,
          'task_status -> task.task_status,
          'status -> task.status,
          'owner -> task.owner,
          'task_discipline -> task.task_discipline,
          'completion_percentage -> task.completion_percentage,
          'remark -> task.remark,
          'task_depend -> task.task_depend,
          'dependencies_type -> task.dependencies_type,
          'stage -> task.stage,
          'user_role -> task.user_role,
          'deliverable -> task.deliverable).executeUpdate()
    }
  }

  /**
   * delete milestone information
   */
  def DeleteTask(Id: Integer) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "Update  art_task set is_active = 0 where tId='" + Id + "' ").on(
          'tId -> Id).executeUpdate()
    }
  }

  /**
   * insert role into a database
   */
  def insertRole(userRole: UserRole): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          insert into art_user_role(rId,role)
          values({rId},{role})
          """).on(
          'rId -> userRole.rId,
          'role -> userRole.role).executeUpdate()

    }
  }

  def taskBasline(milestone: Option[Tasks], plan_start_date: Date, plan_end_date: Date, user_id: String) = {
    var dates_changed: Boolean = false;
    var changeState = new JSONArray();
    if (!plan_start_date.equals(milestone.get.plan_start_date)) {
      dates_changed = true;
      var changeStateObject = new JSONObject();
      changeStateObject.put("fieldName", "Planned Start Date");
      changeStateObject.put("org_value", new SimpleDateFormat("dd-MM-yyyy").format(milestone.get.plan_start_date));
      changeStateObject.put("new_value", new SimpleDateFormat("dd-MM-yyyy").format(plan_start_date));
      changeState.put(changeStateObject);
    }
    if (!plan_end_date.equals(milestone.get.plan_end_date)) {
      dates_changed = true;
      var changeStateObject = new JSONObject();
      changeStateObject.put("fieldName", "Planned End Date");
      changeStateObject.put("org_value", new SimpleDateFormat("dd-MM-yyyy").format(milestone.get.plan_end_date));

      changeStateObject.put("new_value", new SimpleDateFormat("dd-MM-yyyy").format(plan_end_date));
      changeState.put(changeStateObject);
    }
    if (dates_changed) {
      val baseline = Baseline(None, changeState.toString(), Integer.parseInt(user_id), new Date(), "task", Integer.parseInt(milestone.get.tId.get.toString()));
      Baseline.insert(baseline);
    }
  }

  /**
   * get all tasks list
   */
  def findAllTasks(): Seq[Tasks] = {
    DB.withConnection { implicit connection =>
      SQL("SELECT  * FROM art_task where is_active = 1").as(Tasks.tasks *)
    }
  }

  def findTaskListByProjectId(pId: String): Seq[Tasks] = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_task where pId = {pId} AND is_active = 1 order by plan_start_date asc").on(
          'pId -> pId).as(Tasks.tasks *)
      result
    }
  }

  def getTaskGanttChart(projectId: String): JSONArray = {
    var jsonArr = new JSONArray()
    var id = 1
    var tasksData = ""
    var df = new DecimalFormat("00");
    val milestone = findTaskListByProjectId(projectId)
    for (m <- milestone) {
      var node = new JSONObject()
      var innerNode = new JSONObject()
      var jsonArr2 = new JSONArray()
      node.put("name", m.task_title)
      node.put("desc", "")
      val formatter = new SimpleDateFormat("yyyy-MM-dd")
      val plan_start_date = formatter.parse(m.plan_start_date.toString())
      val plan_end_date = formatter.parse(m.plan_end_date.toString())

      var dateDiff = (m.plan_end_date.getTime - m.plan_start_date.getTime) / (1000 * 60 * 60 * 24) + 1

      /*      println("plan_start_date " + plan_start_date)
      println("plan_end_date   " + plan_end_date)*/
      val cal = DateUtils.toCalendar(plan_start_date).getTimeInMillis() - (1000 * 60 * 60 * 24)

      val cal2 = DateUtils.toCalendar(plan_end_date).getTimeInMillis() - (1000 * 60 * 60 * 24)

      innerNode.put("from", "/Date(" + (cal) + ")/")
      innerNode.put("to", "/Date(" + (cal2) + ")/")

      var divVal = ""
      var divPer = ""
      //val c_per = completionPercentageForTask(m.tId.get.toString())
      val c_per = SpiCpiCalculationsService.findIndicators(m.tId.get.toString(), 0)
      for (s <- c_per) {
        //println(c_per)
        if (dateDiff == 1) {

          divPer = "<div class='left gantt-progress-percentage' ></div>"
        } else {
          //divPer = "<div class='left gantt-progress-percentage' >" + df.format(c_per) + "%</div>"
          divPer = "<div class='left gantt-progress-percentage' >" + s.pai + "%</div>"
        }

        //if (c_per < 90) {
        if (s.pai < 90) {
          divVal = divPer + "<div style='width:" + c_per + "%!important;' class='gantt-progress'></div>"
        } else {
          divVal = divPer + "<div style='width:100%!important;' class='gantt-progress gantt-progress-new'></div>"
        }
      }

      innerNode.put("label", (m.tId.get + "_" + divVal))
      innerNode.put("customClass", ("task_status_" + m.task_status))
      jsonArr2.put(innerNode)
      node.put("values", jsonArr2)

      id = id + 1
      jsonArr.put(node)
    }
    jsonArr
  }

  def completionPercentageForTask(task_id: String): scala.math.BigDecimal = {

    val taskDetail = TaskService.findActiveTaskDetailsByTaskId(Integer.parseInt(task_id))
    val total_time = taskDetail.get.plan_time
    val subtasks = TaskService.findSubTaskListByTaskId(task_id)

    var compl_per_task: scala.math.BigDecimal = 0
    var actual_hours_completed_for_task: scala.math.BigDecimal = 0
    var actual_completion_date: Date = null

    var isValid = true
    for (subtask <- subtasks) {
      if (!subtask.completion_percentage.isEmpty) {
        if (subtask.completion_percentage.get != 100) {
          isValid = false
        }
        var actual_completion: Date = null
        if (!subtask.actual_end_date.isEmpty) {
          if (!subtask.actual_end_date_final.isEmpty) {
            if (subtask.actual_end_date.get.getTime > subtask.actual_end_date_final.get.getTime) {
              actual_completion = subtask.actual_end_date.get
            } else {
              actual_completion = subtask.actual_end_date_final.get
            }
          } else {
            actual_completion = subtask.actual_end_date.get
          }
        }
        if (actual_completion_date == null) {
          actual_completion_date = actual_completion
        } else if (actual_completion.getTime > actual_completion_date.getTime) {
          actual_completion_date = actual_completion
        }

      }
      val allocationsubtasks = SubTaskServices.findSubTasksAllocationBySubTask(subtask.sub_task_id.get.toString())
      var hrs_allocated_to_subtask = 0.0
      var acutal_hours_completed_for_subtask: scala.math.BigDecimal = 0
      for (suballoc <- allocationsubtasks) {
        hrs_allocated_to_subtask += suballoc.estimated_time.toDouble
        // println("hrs_allocated_to_subtask = " + suballoc.estimated_time.toDouble + "subtask completion_percentage =  " + subtask.completion_percentage.get)
      }
      val allocationsubtasksexternal = SubTaskServices.findSubTasksAllocationExternalBySubTask(subtask.sub_task_id.get.toString())
      for (a <- allocationsubtasksexternal) {
        hrs_allocated_to_subtask += a.estimated_time.toDouble
      }
      if (!subtask.completion_percentage.isEmpty) {
        acutal_hours_completed_for_subtask = (hrs_allocated_to_subtask * subtask.completion_percentage.get / 100)
      } else {
        acutal_hours_completed_for_subtask = 0
      }
      actual_hours_completed_for_task += acutal_hours_completed_for_subtask
    }

    if (!isValid) {
      actual_completion_date = null

    }
    var completion_percentage_forTask: scala.math.BigDecimal = 0

    if (total_time.!=(0)) {
      completion_percentage_forTask = ((actual_hours_completed_for_task / total_time) * 100).setScale(2, RoundingMode.HALF_UP);
    }
    //println(completion_percentage_forTask + "-------------------")
    completion_percentage_forTask
  }

  def getTaskCriticalPath(pId: String): JSONArray = {
    var jsonArr = new JSONArray()
    var tasksData = ""
    var list = new java.util.ArrayList[Int]()
    val milestone = TaskService.findCriticalpathTasksByProjectId(pId)
    for (m <- milestone) {
      if (!m.task_depend.isEmpty) {
        if (!StringUtils.isEmpty(m.task_depend.get.trim())) {
          var ts = m.task_depend.get.split(",")
          if (ts.length > 0) {
            for (t <- ts) {
              if (!StringUtils.isEmpty(t.trim())) {
                if (!list.contains(Integer.parseInt(t))) {
                  list.add(Integer.parseInt(t))
                }
              }

            }
            if (!list.contains(m.tId.get)) {
              list.add(m.tId.get)
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
      var newTaskList = TaskService.findCriticalpathTasksList(newList, "desc")
      for (m <- newTaskList) {
        var dateDiff: Long = -1
        if (lastDate != null) {
          dateDiff = (lastDate.getTime() - m.plan_end_date.getTime()) / (1000 * 60 * 60 * 24)
        }
        //if (dateDiff == 0 || lastDate == null) {

        if (StringUtils.isBlank(tasksList)) {
          tasksList = m.tId.get.toString
        } else {
          tasksList += "," + m.tId.get.toString
        }
        //}
        lastDate = m.plan_start_date

        if (finalDiff == -1) {
          finalDiff = dateDiff
        } else if (finalDiff > dateDiff && dateDiff >= 0) {
          finalDiff = dateDiff
        }

      }

      if (!StringUtils.isBlank(tasksList)) {
        tasksList = "(" + tasksList + ")"
        newTaskList = TaskService.findCriticalpathTasksList(tasksList, "asc")
        for (m <- newTaskList) {
          var node = new JSONObject()
          var innerNode = new JSONObject()
          var jsonArr2 = new JSONArray()

          var dateDiff = (m.plan_end_date.getTime - m.plan_start_date.getTime) / (1000 * 60 * 60 * 24) + 1

          node.put("name", m.task_title)
          node.put("desc", "")
          innerNode.put("from", "/Date(" + (m.plan_start_date.getTime() - 86400) + ")/")
          innerNode.put("to", "/Date(" + (m.plan_end_date.getTime() - 86400) + ")/")
          var divVal = ""
          var divPer = ""
          if (dateDiff == 1) {
            divPer = "<div class='left gantt-progress-percentage'></div>"
          } else {
            if (!m.completion_percentage.isEmpty) {
              if (m.completion_percentage.get < 90) {
                divPer = "<div class='left gantt-progress-percentage' >" + m.completion_percentage.get + "%</div>"
              }
            } else {
              divPer = "<div class='left gantt-progress-percentage'>0%</div>"
            }
          }

          if (!m.completion_percentage.isEmpty) {
            divVal = "<div style='width:" + m.completion_percentage.get + "%!important;' class='gantt-progress'></div>" + divPer
          } else {
            divVal = "<div style='width:0%!important;' class='gantt-progress'></div>" + divPer
          }
          innerNode.put("label", (m.tId + "_" + divVal))
          innerNode.put("customClass", ("task_status_" + m.task_status))
          jsonArr2.put(innerNode)

          node.put("values", jsonArr2)
          node.put("lag", finalDiff)
          jsonArr.put(node)
          lastDate = m.plan_start_date
        }
      }

    }

    jsonArr
  }

  def findCriticalpathTasksByProjectId(pId: String): Seq[Tasks] = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_task where is_active = 1 AND pId = {pId} order by plan_start_date desc").on(
          'pId -> pId).as(Tasks.tasks *)
      result
    }
  }

  def findCriticalpathTasksList(task_list: String, order: String): Seq[Tasks] = {
    DB.withConnection { implicit connection =>
      val sqlString = "select * from art_task where is_active = 1 AND tId IN " + task_list + " order by plan_start_date " + order
      val result = SQL(sqlString).as(Tasks.tasks *)
      result
    }
  }

  /**
   * get milestone details by milestone id
   */
  def findActiveTaskDetailsByTaskId(tId: Integer) = {
    val sqlString = "select * from art_task where is_active = 1 AND tId = " + tId
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(
        Tasks.tasks.singleOpt)
      result
    }
  }

  def findTaskDetailsByTaskId(tId: Integer) = {
    val sqlString = "select * from art_task where tId = " + tId
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(
        Tasks.tasks.singleOpt)
      result
    }
  }

  /**
   * get project details for a start date and end  date and project name
   */

  def findProjectTaskCount(pId: String): Long = {
    DB.withConnection { implicit connection =>
      val result: Long = SQL(
        "SELECT COUNT(*) FROM art_task WHERE is_active = 1 AND  pId = '" + pId + "'").as(scalar[Long].single)

      result
    }

  }

  def findSubTaskListByTaskId(task_id: String): Seq[SubTasks] = {
    var sql = ""
    if (task_id != "") {
      sql = "select t.*,m.task_title as task_title from art_sub_task t,art_task m where t.is_deleted=1 AND m.is_active=1 AND (t.task_id=m.tId) AND task_id = '" + task_id + "' order by t.plan_start_date asc"
    } else {
      sql = "select t.*,t.title as task_title from art_sub_task t,art_task m where t.is_deleted=1 AND m.is_active=1 AND (t.task_id=m.tId) order by t.plan_start_date asc"
    }

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(SubTasks.subTask *)
      result
    }
  }

  def dateDifferanceUpdate(pId: Integer, release_date: Date) = {

    /**
     * check for milestone date
     */
    val result = ProjectService.findProject(pId)

    val pStart = result.get.start_date
    val pEnd = result.get.final_release_date

    val diffStart = release_date.compareTo(pStart)
    val diffEnd = release_date.compareTo(pEnd)

    /**
     * project start date change
     */
    if (diffStart == -1) {
      val today = Calendar.getInstance()
      today.setTime(release_date)

      today.add(Calendar.DATE, -1)
      val previousDate = new SimpleDateFormat("dd-MM-yyyy").parse(today.get(Calendar.DATE) + "-" + today.get(Calendar.MONTH) + "-" + today.get(Calendar.YEAR))
      ProjectService.updateStartEndDate(result.get.pId, previousDate, result.get.final_release_date)
    }

    /**
     * project end date change
     */
    if (diffEnd == 1) {
      val today = Calendar.getInstance()
      today.setTime(release_date)
      today.add(Calendar.DATE, 1)
      today.add(Calendar.MONTH, 1)
      val nextDate = new SimpleDateFormat("dd-MM-yyyy").parse(today.get(Calendar.DATE) + "-" + today.get(Calendar.MONTH) + "-" + today.get(Calendar.YEAR))

      ProjectService.updateStartEndDate(result.get.pId, result.get.start_date, nextDate)
    }

  }

  def getAllTask(user_id: String): Seq[SubTasks] = {
    var sql = ""
    if (user_id != "")
      sql = "select t.*, m.* from art_sub_task t,art_task m where (t.task_id=m.tId ) AND  ( t.user_id = " + user_id + ")"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(SubTasks.subTask *)
      result
    }
  }

  /*  def getAllAllocatedSubTask(user_id: String): Seq[SubTasks] = {
    var sql = ""
    //( t.completion_percentage >= 0 || t.completion_percentage < 100 ) AND 
    if (user_id != "")
      sql = "select DISTINCT(t.sub_task_id), t.* from art_sub_task t, art_sub_task_allocation al where (t.task_id=al.task_id ) AND t.completion_percentage < 100 AND t.is_deleted=1 AND  ( al.user_id = " + user_id + ")"

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(SubTasks.subTask *)
      result
    }
  }*/
  def getAllAllocatedSubTask(user_id: String): Seq[SubTasks] = {
      var sqlString ="EXEC art.list_subtask {uid}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('uid -> user_id).executeQuery()as(SubTasks.subTask *)
    }
    /*
    var sql = ""
    val ids = findProgramIdListForUserId(user_id)
    var program_ids = ""
    for (id <- ids) {
      if (StringUtils.isEmpty(program_ids))
        program_ids = id.toString()
      else
        program_ids = program_ids + "," + id.toString()
    }
    
    //  println(program_ids + "------------")
    var result: Seq[SubTasks] = null;
    if (StringUtils.isNotEmpty(program_ids)) {
      result = SubTaskServices.findSubTasksListForProgramIds(user_id, program_ids)
    }
    result
    * 
    */
  }

  def findProgramIdListForUserId(user_id: String): Seq[Long] = {
    val sqlString = "select program_id from art_program where is_active=1 AND program_id IN(select DISTINCT(program) from art_project_master where is_active=1 AND pId IN ( select DISTINCT(pId) from art_task where is_active=1 AND tId IN ( select DISTINCT(task_id) from art_sub_task where (completion_percentage < 100 OR completion_percentage Is Null) AND is_active=1 AND sub_task_id IN (select DISTINCT(sub_task_id) from art_sub_task_allocation where user_id =" + user_id + " AND is_deleted = 1) )))"

    DB.withConnection { implicit connection =>
      SQL(sqlString).as(scalar[Long] *)
    }
  }

  def getAllCurrentAllocatedSubTask(user_id: String): Seq[SubTasks] = {
    var sql = ""

    val findDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date())

    if (user_id != "")
      sql = "select DISTINCT(t.sub_task_id), t.* from art_sub_task t, art_sub_task_allocation al where ( t.completion_percentage > 0 OR t.completion_percentage < 100 OR completion_percentage Is Null) AND (t.task_id=al.task_id ) AND  ( al.user_id = " + user_id + ") AND ('" + findDate + "' between t.plan_start_date and t.plan_end_date)"

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(SubTasks.subTask *)
      result
    }
  }

  def getAllFutureAllocatedSubTask(user_id: String): Seq[SubTasks] = {
    var sql = ""

    val findDate = new SimpleDateFormat("yyyy-MM-dd").format(new Date())

    if (user_id != "") {
      sql = "select DISTINCT(t.sub_task_id), t.* from art_sub_task t, art_sub_task_allocation al where ( t.completion_percentage > 0 OR t.completion_percentage < 100 ) AND (t.task_id=al.task_id ) AND  ( al.user_id = " + user_id + ") AND (t.plan_start_date > GETDATE())"
      //  sql = "select DISTINCT(t.sub_task_id), t.* from art_sub_task t, art_sub_task_allocation al where ( t.completion_percentage > 0 OR t.completion_percentage < 100 ) AND (t.task_id=al.task_id ) AND  ( al.user_id = " + user_id + ") AND (t.plan_start_date > CURDATE())"
    }

    //println(sql);

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(SubTasks.subTask *)
      result
    }
  }
  def getUserAssignedProjects(user_id: String): Seq[Project] = {
    var sql = ""
    if (user_id != "")
      sql = "SELECT * FROM art_project_master WHERE  pId IN( select pm.pId from art_user_project_mapping pm where ( pm.uId = " + user_id + "))"

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(Project.project *)
      result
    }
  }

  def getAllUserProjects(user_id: String): Seq[Project] = {
    var sql = ""
    if (user_id != "")
      sql = "SELECT * FROM art_project_master WHERE  pId IN( select m.pId from art_sub_task_allocation m where ( m.user_id = " + user_id + "))"

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(Project.project *)
      result
    }
  }

  def getAllocatedHours(task_id: String): Double = {
    var sql = ""
    var defaultValue: Double = 0
    val isPresent = SubTaskServices.findAllocatedSubTasksByTask(task_id)
    if (isPresent.size > 0) {
      if (task_id != "")
        sql = "select SUM(t.estimated_time) from art_sub_task_allocation t where t.is_deleted=1 AND t.sub_task_id IN (select sub_task_id from art_sub_task where task_id = '" + task_id + "' and is_deleted=1)"

      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(scalar[Double].single)

        if (!result.isNaN()) {
          defaultValue = result
        }
        defaultValue
      }
    } else {
      //  println("----------------" + defaultValue)
      defaultValue
    }

  }

  def getExternalResouceAllocatedHours(task_id: String): Double = {
    var sql = ""
    var defaultValue: Double = 0
    val isPresent = SubTaskServices.findAllocatedExternalSubTasksByTask(task_id)
    if (isPresent.size > 0) {
      if (task_id != "")
        sql = "select SUM(t.estimated_time) from art_sub_task_allocation_external t where t.is_deleted=1 AND t.sub_task_id IN (select sub_task_id from art_sub_task where task_id = '" + task_id + "' and is_deleted=1)"

      // println(sql + "------->")
      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(scalar[Double].single)
        result
      }
    } else {
      defaultValue
    }
  }

  def getAllNonProjectTask: Seq[NonProjectTask] = {
    var sql = ""
    sql = "select * from art_non_project_task"

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(NonProjectTask.nonProjectTask *)
      result
    }
  }

  def updateTaskStatus(sub_task: String): Int = {
    val result = 1
    var isRed: Boolean = false
    var isAmber: Boolean = false
    var isGreen: Boolean = false

    val subTask = SubTaskServices.findSubTasksBySubTaskId(sub_task)

    if (!subTask.isEmpty) {
      val task_id = subTask.get.task_id
      val subtasks = findSubTaskListByTaskId(task_id.toString)
      if (subtasks.size > 0) {

        for (s <- subtasks) {
          if (s.status == 2) {
            isRed = true
          }
          if (s.status == 1) {
            isAmber = true
          }
          if (s.status == 0) {
            isGreen = true
          }
        }

        if (isRed) {
          updateStatus(task_id.toString, 2)
        } else if (isAmber) {
          updateStatus(task_id.toString, 1)
        } else {
          updateStatus(task_id.toString, 0)
        }

      }
    }

    result
  }

  def updateStatus(task_id: String, status: Integer): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
         update art_task
          set 
          task_status = {task_status} 
          where tId = {tId}
        """).on(
          'tId -> task_id,
          'task_status -> status).executeUpdate()
    }
  }

  def findAllocatedHoursForTask(task_id: String): BigDecimal = {
    val sqlSting = "SELECT * FROM art_sub_task_allocation WHERE task_id=" + task_id
    DB.withConnection { implicit connection =>
      val result = SQL(sqlSting).as(SubTaskAllocation.taskAllocation *)
      var hours: BigDecimal = 0
      for (r <- result) {
        hours += r.estimated_time
      }
      hours
    }
  }

  def findBookedHoursForTask(task_id: String): BigDecimal = {
    var hours: BigDecimal = 0
    var sqlSting = "SELECT * FROM art_timesheet WHERE task_id=" + task_id + " AND task_type=1"
    DB.withConnection { implicit connection =>
      val result = SQL(sqlSting).as(Timesheet.timesheetLists *)

      for (t <- result) {
        hours = hours + t.hours
      }
      hours

    }

    sqlSting = "SELECT * FROM art_timesheet_external WHERE task_id=" + task_id + " AND task_type=1"
    DB.withConnection { implicit connection =>
      val result = SQL(sqlSting).as(TimesheetExternal.timesheetLists *)

      for (t <- result) {
        hours = hours + t.hours
      }
      hours

    }
  }

  /*def updateActualDate(task_id: String, sub_task: String, task_for_date: Date) = {
		val sqlSting = "SELECT * FROM art_timesheet WHERE sub_task_id=" + sub_task
		DB.withConnection { implicit connection =>
			val result = SQL(sqlSting).as(Timesheet.timesheetLists *)
			if (result.size == 1) {
				val newSql = "SELECT * FROM art_task WHERE tId=" + task_id
				val newResult = SQL(newSql).as(Tasks.tasks.singleOpt)
				if (!newResult.isEmpty) {
					val taskDetails = Tasks(newResult.get.tId, newResult.get.pId, newResult.get.task_title, newResult.get.task_code, newResult.get.plan_start_date, newResult.get.plan_end_date, newResult.get.task_description, newResult.get.plan_time, newResult.get.creation_date, newResult.get.task_status, newResult.get.status, newResult.get.owner, newResult.get.task_discipline, newResult.get.completion_percentage, newResult.get.remark, newResult.get.task_depend, newResult.get.dependencies_type)
					updateTask(taskDetails)
				}
			}
		}
	}*/

  def calculateTaskEarnValue(id: String) = {
    val taskDetail = TaskService.findActiveTaskDetailsByTaskId(Integer.parseInt(id))
    var FormattedDATE = new SimpleDateFormat("dd-MM-yyyy")
    var today = taskDetail.get.plan_start_date
    var eDate = taskDetail.get.plan_end_date
    var total_hours = taskDetail.get.plan_time
    var c_per = completionPercentageForTask(id)
    var diffInDays = (eDate.getTime - today.getTime) / (1000 * 60 * 60 * 24)
    var index = 0
    var tommorrow = ""

    val earn_value = c_per * total_hours
    var avg_per_day: Double = 0
    if (total_hours > 0) {
      avg_per_day = total_hours.toDouble / diffInDays.toInt
    }
    var plaaned_hours: Double = 0

    val subTasks = TaskService.findSubTaskListByTaskId(taskDetail.get.tId.get.toString())
    if (subTasks.size > 0) {
      for (t <- subTasks) {
        val tasks = services.SubTaskServices.findSubTasksAllocationBySubTask(t.sub_task_id.get.toString)
        for (ss <- tasks) {
          plaaned_hours += ss.estimated_time
        }

        val etasks = services.SubTaskServices.findSubTasksAllocationExternalBySubTask(t.sub_task_id.get.toString)
        for (ss <- etasks) {
          plaaned_hours += ss.estimated_time
        }
      }
    }

    if (diffInDays >= 0) {
      while (diffInDays >= 0) {
        var c = Calendar.getInstance();
        c.setTime(today)
        c.add(Calendar.DATE, index);
        tommorrow = FormattedDATE.format(c.getTime()).toString();

        diffInDays = diffInDays - 1
        index = index + 1
      }
    }

  }

  def validateForm(form: Form[TaskMaster], oldId: String) = {
    //println(form.get.task_depend +" " +form.get.dependencies_type);
    val format = new java.text.SimpleDateFormat("dd-MM-yyyy")
    val task_depend = form.data.get("task_depend")
    var newform: play.api.data.Form[models.TaskMaster] = null
    val projectDetail = ProjectService.findProject(Integer.parseInt(form.data.get("pId").get))
    if (!form.data.get("plan_start_date").get.isEmpty() && !form.data.get("plan_end_date").get.isEmpty()) {
      var plan_start_date = format.parse(form.data.get("plan_start_date").get)
      var plan_end_date = format.parse(form.data.get("plan_end_date").get)

      if (plan_start_date.after(plan_end_date)) {
        newform = form.withError("plan_start_date", Messages.get(langObj, "taskstartdate.validation.error"))
      }

      val db_project_start_date = Calendar.getInstance();
      db_project_start_date.setTime(projectDetail.get.start_date);

      val form_task_start_date = Calendar.getInstance();
      form_task_start_date.setTime(plan_start_date);

      val db_project_End_date = Calendar.getInstance();
      db_project_End_date.setTime(projectDetail.get.final_release_date);

      val form_plan_end_date = Calendar.getInstance();
      form_plan_end_date.setTime(plan_end_date);

      if (form_plan_end_date.after(db_project_End_date)) {
        newform = form.withError("plan_end_date", Messages.get(langObj, "taskenddate.validation.error"))
      }

      if (!StringUtils.isEmpty(oldId)) {
        var subtaskEndDate = SubTaskServices.findMaxSubtaskEndDate(oldId);
        var subtaskStartDate = SubTaskServices.findMinSubtaskEndDate(oldId);
        if (subtaskEndDate != null) {
          if (!subtaskEndDate.isEmpty) {
            val subTaskEndDt = Calendar.getInstance();
            subTaskEndDt.setTime(subtaskEndDate.get);
            if (form_plan_end_date.before(subTaskEndDt)) {
              newform = form.withError("plan_end_date", "Task end date can not be before subtask end date.");
            }
          }
        }
        if (subtaskStartDate != null) {
          if (!subtaskStartDate.isEmpty) {
            val subTaskStartDt = Calendar.getInstance();
            subTaskStartDt.setTime(subtaskStartDate.get);
            if (subTaskStartDt.before(form_task_start_date)) {
              newform = form.withError("plan_start_date", "Task start date can not be after subtask start date.");
            }
          }
        }

      }

      if (db_project_start_date.after(form_task_start_date)) {
        newform = form.withError("plan_start_date", Messages.get(langObj, "taskstartdate.validation.error"))
      }

      if (!task_depend.isEmpty) {
        val project = ProjectService.findProject(Integer.parseInt(form.data.get("pId").get))
        val ids = task_depend.get.split(",")
        for (id <- ids) {
          if (!StringUtils.isEmpty(id.trim())) {
            val task = findActiveTaskDetailsByTaskId(Integer.parseInt(id.trim()))
            if (!task.isEmpty) {
              val minD = task.get.plan_start_date.getTime()
              val maxD = task.get.plan_end_date.getTime()
              val dependencies_type = form.data.get("dependencies_type").get
              dependencies_type match {
                case "1" =>
                  if ((maxD - 86400) >= (plan_start_date.getTime())) {
                    newform = form.withError("plan_start_date", "This Task is dependent on another task, Please enter valid start date.")
                    //newform.fill(form.get)
                    //newform
                  }
                /*  case "2" =>
          if ((minD - 86400) >= plan_start_date.getTime()) {
            newform = form.withError("plan_start_date", "Enter valid start date")
            newform.fill(form.get)
          }
        case "3" =>
          if ((minD - 86400) >= plan_end_date.getTime()) {
            newform = form.withError("plan_start_date", "Enter valid start date")
            newform.fill(form.get)
          }
        case "4" =>
          if ((maxD - 86400) >= plan_end_date.getTime()) {
            newform = form.withError("plan_end_date", "Enter valid end date")
            newform.fill(form.get)
          }*/

              }
            }

          }

        }

      }
    }

    //println(task_depend.isEmpty);

    val project_id = form.data.get("pId").get
    val project_details = ProjectService.findProject(Integer.parseInt(project_id))
    if (!project_details.isEmpty) {

      var project_planned_hours: Double = 0
      if (!project_details.get.planned_hours.isEmpty) {
        project_planned_hours = project_details.get.planned_hours.get
        var current_hours: Double = 0
        if (!form.data.get("mId").isDefined) {
          val tasks = TaskService.findTaskListByProjectId(project_id)
          for (t <- tasks) {
            current_hours += t.plan_time.toDouble
          }

          if (!form.data.get("plan_time").isEmpty && !StringUtils.isEmpty(form.data.get("plan_time").get.trim())) {
            current_hours = current_hours + form.data.get("plan_time").get.toDouble
          }
          /*if (!form.data.get("plan_time").isEmpty && form.data.get("plan_time").isDefined) {
            current_hours += form.data.get("plan_time").get.toDouble
          }*/

          if (project_planned_hours < current_hours) {
            newform = form.withError("plan_time", "Enter valid hours.")
          }

        } else {
          val task_id = form.data.get("mId").get
          val tasks = TaskService.findTaskListByProjectId(project_id)
          for (t <- tasks) {
            if (t.tId.get != Integer.parseInt(task_id)) {
              current_hours += t.plan_time.toDouble
            }
          }
          if (!form.data.get("plan_time").isEmpty) {
            current_hours = current_hours + form.data.get("plan_time").get.toDouble
          }

          /*if (!form.data.get("plan_time").isEmpty && form.data.get("plan_time").isDefined) {
            current_hours += form.data.get("plan_time").get.toDouble
          }*/

        }

        if (project_planned_hours < current_hours) {
          newform = form.withError("plan_time", "Enter valid hours.")
        }
      }
    }

    /**
     * This is to check if allocated sub task hours with sub task hours...
     *
     */

    if (form.data.get("mId").isDefined) {
      var sub_task_planned_hours: Double = 0
      val task_id = form.data.get("mId").get
      var current_hours: Double = 0
      if (!form.data.get("plan_time").isEmpty) {
        current_hours = current_hours + form.data.get("plan_time").get.toDouble
      }
      val subtasks = SubTaskServices.findSubTasksByTask(task_id)
      if (!subtasks.isEmpty) {
        for (s <- subtasks) {
          val internalAllocations = SubTaskServices.findSubTasksAllocationBySubTask(s.sub_task_id.get.toString())
          if (!internalAllocations.isEmpty) {
            for (a <- internalAllocations) {
              sub_task_planned_hours += a.estimated_time
            }
          }
          val externalAllocations = SubTaskServices.findSubTasksAllocationExternalBySubTask(s.sub_task_id.get.toString())
          if (!externalAllocations.isEmpty) {
            for (a <- externalAllocations) {
              sub_task_planned_hours += a.estimated_time
            }
          }

        }
      }

      if (current_hours < sub_task_planned_hours) {
        newform = form.withError("plan_time", "Enter valid hours.")
      }

    }

    if (!form("title").value.isEmpty && !StringUtils.isEmpty(form("title").value.get)) {
      val taskName = form("title").value.get.trim

      val projectId = form("pId").value.get.trim
      val tasks = findTaskWithSameName(taskName, projectId)
      for (task <- tasks) {
        if (StringUtils.equalsIgnoreCase(taskName.trim(), task.task_title.trim())) {
          if (!StringUtils.equals(task.tId.get.toString(), oldId)) {
            newform = form.withError("title", "Same task name is not allowed under the same project.")
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

  /**
   * get milestone details by milestone id
   */
  def findTaskWithSameName(taskTitle: String, projectId: String) = {
    val sqlString = "select * from art_task where is_active = 1 AND task_title = '" + taskTitle + "' AND pId=" + projectId
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(
        Tasks.tasks *)
      result
    }
  }

  def getDependecyDate(ids: String) = {
    var node = new JSONObject()
    var minDate: java.util.Date = null
    var maxDate: java.util.Date = null
    var chkDate: java.util.Date = null
    val taskList = ids.split(",")
    for (t <- taskList) {
      if (!StringUtils.isEmpty(t.trim())) {
        val task = TaskService.findActiveTaskDetailsByTaskId(Integer.parseInt(t.trim()))
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
    //println(minDate.getTime() + " - " + maxDate);
    if (minDate != null && maxDate != null) {
      node.put("minDate", new SimpleDateFormat("yyyy-MM-dd").format(minDate))
      node.put("maxDate", new SimpleDateFormat("yyyy-MM-dd").format(maxDate))
    }

    node
  }

  def checkBookedHoursForTask(task_id: String): Boolean = {
    var isValid = true
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_timesheet where (task_id={task_id} AND task_type=1)").on(
          'task_id -> task_id).as(Timesheet.timesheetLists.*)

      if (result.size == 0)
        isValid = false
    }
    isValid
  }

  def checkValidDependency(task_id: String): Boolean = {

    var isValid = true

    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_timesheet where (task_id={task_id} AND task_type=1)").on(
          'task_id -> task_id).as(Timesheet.timesheetLists.*)

      if (result.size == 0) {
        //if booked hours found...

        val task = findActiveTaskDetailsByTaskId(Integer.parseInt(task_id))

        val format = new java.text.SimpleDateFormat("yyyy-MM-dd")
        val refDate = new Date();
        val currentDate = format.parse(format.format(refDate))

        if (task.get.plan_start_date.getTime() <= currentDate.getTime()) {
          isValid = false
        }
      } else {
        isValid = false
      }

    }
    isValid
  }

  def findDependentTasksForProject(pId: String, selected_task: String): Seq[Tasks] = {
    var sqlString = ""
    if (StringUtils.isBlank(selected_task) || StringUtils.equals(selected_task.trim(), "NaN")) {
      sqlString = "select * from art_task where pId ='" + pId + "'AND (completion_percentage IS NULL OR completion_percentage <> 100) AND is_active=1"
    } else {
      sqlString = "select * from art_task where pId ='" + pId + "'AND (completion_percentage IS NULL OR completion_percentage <> 100) AND tId NOT IN (" + selected_task + ") AND is_active=1"
    }

    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(Tasks.tasks *)
      result
    }
  }

  def findDependentEditTasksForProject(predessor_task: String, pId: String, selected_tasks: String): Seq[Tasks] = {
    var newString = ""
    for (t <- selected_tasks.split(",")) {
      if (!StringUtils.isEmpty(t.trim())) {
        if (StringUtils.isEmpty(newString)) {
          newString = t
        } else {
          newString = newString + "," + t
        }
      }
    }
    newString = ""
    DB.withConnection { implicit connection =>
      var sql = ""
      if (StringUtils.isEmpty(newString)) {
        sql = "select * from art_task where is_active = 1 AND pId = '" + pId + "' AND (completion_percentage IS NULL OR completion_percentage <> 100) AND tId <>'" + predessor_task + "'"
      } else {
        sql = "select * from art_task where is_active = 1 AND pId = '" + pId + "' AND (completion_percentage IS NULL OR completion_percentage <> 100) AND tId NOT IN (" + newString + ") AND tId <>'" + predessor_task + "'"

      }
      val result = SQL(sql).on(
        'pId -> pId).as(Tasks.tasks *)
      result
    }
  }

  def validateTaskDependency(tasks: String): Seq[Tasks] = {
    var sql = "select * from  art_task where is_active = 1 AND (completion_percentage < 100) AND (tId IN (" + tasks + ") )"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(Tasks.tasks *)
      result
    }

  }
  def insertTaskStatus(pm: TaskStatus): Long = {

    DB.withConnection { implicit connection =>
      val result = SQL(
        """
          insert into  art_task_status (
            task_id, status_for_date, reason_for_change, status 
          ) 
          values(
            {task_id}, {status_for_date},{reason_for_change},{status}
          )
          """).on(
          'task_id -> pm.task_id,
          'status_for_date -> new Date(),
          'reason_for_change -> pm.reason_for_change,
          'status -> pm.status).executeInsert(scalar[Long].singleOpt)
      result.last
    }
  }

  def findTaskStatus(task_id: String) = {
    var sqlString = ""
    sqlString = "SELECT TOP 1* from  art_task_status where task_id=" + task_id + " order by status_for_date DESC"
    //sqlString = "SELECT * from  art_task_status where task_id=" + task_id + " order by status_for_date DESC LIMIT 0,1"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(TaskStatus.tStatus.singleOpt)
    }
  }
  
  def findAllTaskStatus(task_id: String): Seq[TaskStatus] = {
    var sqlString = ""
    sqlString = "SELECT * from  art_task_status where task_id=" + task_id + " order by status_for_date DESC"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(TaskStatus.tStatus *)
    }
  }  

  def changeDependentTaskDates(task_id: String, hours_change: Integer) = {
    if (StringUtils.isEmpty(task_id)) {
      val taskDetails = findActiveTaskDetailsByTaskId(Integer.parseInt(task_id))
      var isSuccessor = false
      var successors = ""
      if (!taskDetails.isEmpty) {
        val project = taskDetails.get.pId.toString()
        //find all tasks from same project..
        val tasks = findTaskListByProjectId(project)
        for (t <- tasks) {
          val dpends = t.task_depend.get.split(",")
          for (d <- dpends) {
            val ts = StringUtils.trim(d)
            if (StringUtils.equals(ts, task_id)) {
              isSuccessor = true
              successors += "," + task_id
            }
          }
        }
      }

      if (isSuccessor) {
        val newtasks = successors.split(",")
        for (t <- newtasks) {

        }
      }

    }
  }

  def findAllTaskIdListByProjectId(pId: String): Seq[Long] = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select tId from art_task where is_active = 1 AND pId = {pId} ").on(
          'pId -> pId).as(scalar[Long] *)
      result
    }
  }

  def findProgramDetailForTask(task_id: String) = {
    val sqlString = "Select * from art_program where program_id= ( Select DISTINCT(program) from art_project_master where pId=(Select DISTINCT(pId) from art_task where tId=" + task_id + "))"
    //println(sqlString)
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(ProgramMaster.pMaster.singleOpt)
      result
    }
  }

  def findMaxTaskEndDate(subtask_id: String): Option[Date] = {
    var result: Option[Date] = null
    var sql = "select MAX(plan_end_date) from  art_task  where pId = " + subtask_id + " AND is_active=1"
    try {
      DB.withConnection { implicit connection =>
        result = SQL(sql).as(scalar[Date].singleOpt)
      }
    } catch {
      case e: Exception =>
    }
    result
  }

  def findMinTaskEndDate(subtask_id: String): Option[Date] = {
    var result: Option[Date] = null
    var sql = "select MIN(plan_start_date) from  art_task  where pId = " + subtask_id + " AND is_active=1"
    try {
      DB.withConnection { implicit connection =>
        result = SQL(sql).as(scalar[Date].singleOpt)
      }
    } catch {
      case e: Exception =>
    }

    result
  }

  def validateTasksDependency(project_id: String, tId: String) = {

    var isValid = true
    val tasks = findTaskListByProjectId(project_id)
    if (tasks.size > 0) {
      for (t <- tasks) {
        if (!t.task_depend.isEmpty) {
          var tasks_depend_aarray = t.task_depend.get.split(",")
          for (td <- tasks_depend_aarray) {
            var task_id = StringUtils.trim(td)
            if (!StringUtils.isEmpty(task_id)) {
              if (task_id.toInt == tId.toInt) {
                isValid = false
              }
            }
          }
        }

      }
    }

    isValid

  }

  def updateTaskDependecy(tId: String, task_depends: String): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_task
          set 
            task_depend={task_depend}
          where tId = {tId}
          """).on(
          'tId -> tId, 'task_depend -> task_depends).executeUpdate()
    }
  }
  def findActualStartDateForTask(task_id: String): Option[String] = {
    var result: Option[String] = null

    //var sql = "select ISNULL(CONVERT(nVarChar(10),MIN(task_for_date), 110), 'NA') from (select MIN(task_for_date) task_for_date from  art_timesheet  where task_id= " + task_id + " AND is_deleted=1 AND task_type=1 UNION ALL select MIN(task_for_date) task_for_date from  art_timesheet_external  where task_id= " + task_id + " AND is_deleted=1 AND task_type=1) as fecha"
    var sql = "select ISNULL(REPLACE ( CONVERT(varchar(10), MIN(task_for_date), 103), '/','-'),'NA') from (select MIN(task_for_date) task_for_date from  art_timesheet  where task_id= " + task_id + " AND is_deleted=1 AND task_type=1 UNION ALL select MIN(task_for_date) task_for_date from  art_timesheet_external  where task_id= " + task_id + " AND is_deleted=1 AND task_type=1) as fecha"

    try {
      DB.withConnection { implicit connection =>
        result = SQL(sql).as(scalar[String].singleOpt)
      }
    } catch {
      case e: Exception =>
    }
    result
  }

  def findActualEndDateForTask(task_id: String): Option[String] = {
    var result: Option[String] = null

    //var sql = "select ISNULL(CONVERT(nVarChar(10),MAX(task_for_date), 110), 'NA') from (select MAX(task_for_date) task_for_date from  art_timesheet  where task_id= " + task_id + " AND is_deleted=1 AND task_type=1 UNION ALL select MAX(task_for_date) task_for_date from  art_timesheet_external  where task_id= " + task_id + " AND is_deleted=1 AND task_type=1) as fecha"
 	var sql = "select ISNULL(REPLACE ( CONVERT(varchar(10), MAX(task_for_date), 103), '/','-'),'NA') from (select MAX(task_for_date) task_for_date from  art_timesheet  where task_id= " + task_id + " AND is_deleted=1 AND task_type=1 UNION ALL select MAX(task_for_date) task_for_date from  art_timesheet_external  where task_id= " + task_id + " AND is_deleted=1 AND task_type=1) as fecha"

    try {
      DB.withConnection { implicit connection =>
        result = SQL(sql).as(scalar[String].singleOpt)
      }
    } catch {
      case e: Exception =>
    }
    result
  }

  def updateTaskPlannedEndDate(task_id: String, end_date: String): Int = {

    DB.withConnection { implicit connection =>
      SQL(
        """
         update art_task
          set 
          plan_end_date={plan_end_date}
          where tId = {tId}
        """).on(
          'tId -> task_id,
          'plan_end_date -> end_date).executeUpdate()
    }
  }

  def updateTaskPlannedStartDate(task_id: String, start_date: String): Int = {

    DB.withConnection { implicit connection =>
      SQL(
        """
         update art_task
          set 
          plan_start_date={plan_start_date}
          where tId = {tId}
        """).on(
          'tId -> task_id,
          'plan_start_date -> start_date).executeUpdate()
    }
  }

  //VP
  def getTaskPlannedValue(task_id: String) = {
    DB.withConnection { implicit connection =>
      SQL("EXEC art.calc_task {tId},{tipo}").on(
        'tId -> task_id.toInt, 'tipo -> 0).executeQuery().as(scalar[Double].singleOpt)
    }
  }

  def getTaskSPI(task_id: String) = {
    DB.withConnection { implicit connection =>
      SQL("EXEC art.calc_task {tId},{tipo}").on(
        'tId -> task_id.toInt, 'tipo -> 3).executeQuery().as(scalar[Double].singleOpt)
    }
  }
  def getTaskCPI(task_id: String) = {
    DB.withConnection { implicit connection =>
      SQL("EXEC art.calc_task {tId},{tipo}").on(
        'tId -> task_id.toInt, 'tipo -> 4).executeQuery().as(scalar[Double].singleOpt)
    }
  }
  def getTaskAEC(task_id: String) = {
    DB.withConnection { implicit connection =>
      SQL("EXEC art.calc_task {tId},{tipo}").on(
        'tId -> task_id.toInt, 'tipo -> 5).executeQuery().as(scalar[Double].singleOpt)
    }
  }
  def getTaskETC(task_id: String) = {
    DB.withConnection { implicit connection =>
      SQL("EXEC art.calc_task {tId},{tipo}").on(
        'tId -> task_id.toInt, 'tipo -> 6).executeQuery().as(scalar[Double].singleOpt)
    }
  }

  ///VA
  def getTaskValueAssigned(task_id: String) = {
    var sql = """    SELECT SUM (estimated_time) estimated_time FROM
  (SELECT ISNULL (SUM(estimated_time), 0) estimated_time FROM art_sub_task_allocation WHERE task_id = """ + task_id + """ AND is_deleted = 1
    UNION ALL
    SELECT ISNULL(SUM(estimated_time), 0) estimated_time FROM art_sub_task_allocation_external WHERE task_id = """ + task_id + """ AND is_deleted = 1) AS TOTAL  """
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(scalar[Double].singleOpt)
      result
    }
  }

  //VG Expected earned value
  def getTaskEarnValue(task_id: String) = {
    var sql = """   
        SELECT SUM(estimated_time) estimated_time FROM
        (SELECT ISNULL(SUM(estimated_time),0) estimated_time  FROM art_sub_task_allocation WHERE 
        sub_task_id IN (SELECT sub_task_id FROM art_sub_task WHERE plan_end_date < GETDATE() AND task_id=""" + task_id + """ AND is_deleted=1) AND is_deleted=1
        UNION ALL
        SELECT ISNULL(SUM(estimated_time),0) estimated_time  FROM art_sub_task_allocation_external WHERE
        sub_task_id IN (SELECT sub_task_id FROM art_sub_task WHERE plan_end_date < GETDATE() AND task_id=""" + task_id + """ AND is_deleted=1) AND is_deleted=1
        ) AS TOTAL"""
    // println(sql)
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(scalar[Double].singleOpt)
      result
    }
  }

  //HC //actual cost non canonical
  def getTaskActualCostNonCanonical(task_id: String) = {
    /*
    var sql = """    SELECT SUM(hours) hours FROM
(SELECT ISNULL(SUM(hours),0) hours FROM art_timesheet WHERE task_id=""" + task_id + """ AND is_deleted=1
UNION ALL
SELECT ISNULL(SUM(hours),0) hours FROM art_timesheet_external WHERE  task_id=""" + task_id + """  AND is_deleted=1
) AS TOTAL
                """
    //println(sql)
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(scalar[Double].singleOpt)
      result
    }*/
    DB.withConnection { implicit connection =>
      SQL("EXEC art.calc_task {tId},{tipo}").on(
        'tId -> task_id.toInt, 'tipo -> 7).executeQuery().as(scalar[Double].singleOpt)
    }
  }

  //VG Non canonical earned value
  def getTaskNonCanonicalEarnVale(task_id: String): Option[Double] = {
    /*
    var sql = """    
              SELECT SUM(suma) FROM
              (SELECT SUM(A.estimated_time * A.completion_percentage /100) suma FROM
              (SELECT b.tId, a.sub_task_id, d.estimated_time, a.completion_percentage
              FROM art_sub_task_allocation d 
              INNER JOIN art_sub_task a
              ON d.sub_task_id=a.sub_task_id
              INNER JOIN art_task b
              ON a.task_id=b.tId
              WHERE b.tId=""" + task_id + """ AND
              a.plan_end_date < GETDATE() AND
              a.completion_percentage > 0 AND
              a.is_deleted=1 AND
              b.is_active=1 AND
              d.is_deleted=1) A
              INNER JOIN 
              (SELECT d.sub_task_id,SUM(d.hours) hours
              FROM art_timesheet d 
              INNER JOIN art_sub_task a
              ON d.sub_task_id=a.sub_task_id
              INNER JOIN art_task b
              ON a.task_id=b.tId
              WHERE b.tId=""" + task_id + """ AND
              a.plan_end_date < GETDATE() AND
              a.is_deleted=1 AND
              b.is_active=1 AND
              d.is_deleted=1
              GROUP BY d.sub_task_id
              UNION ALL
              SELECT d.sub_task_id,SUM(d.hours) hours
              FROM art_timesheet_external d 
              INNER JOIN art_sub_task a
              ON d.sub_task_id=a.sub_task_id
              INNER JOIN art_task b
              ON a.task_id=b.tId
              WHERE b.tId=""" + task_id + """  AND
              a.plan_end_date < GETDATE() AND
              a.is_deleted=1 AND
              b.is_active=1 AND
              d.is_deleted=1
              GROUP BY d.sub_task_id
              ) B
              ON A.sub_task_id=B.sub_task_id
              UNION ALL
              SELECT SUM(A.estimated_time * A.completion_percentage /100) suma FROM
              (SELECT b.tId, a.sub_task_id, d.estimated_time, a.completion_percentage
              FROM art_sub_task_allocation_external d 
              INNER JOIN art_sub_task a
              ON d.sub_task_id=a.sub_task_id
              INNER JOIN art_task b
              ON a.task_id=b.tId
              WHERE b.tId=""" + task_id + """  AND
              a.plan_end_date < GETDATE() AND
              a.completion_percentage > 0 AND
              a.is_deleted=1 AND
              b.is_active=1 AND
              d.is_deleted=1) A
              INNER JOIN 
              (SELECT d.sub_task_id,SUM(d.hours) hours
              FROM art_timesheet d 
              INNER JOIN art_sub_task a
              ON d.sub_task_id=a.sub_task_id
              INNER JOIN art_task b
              ON a.task_id=b.tId
              WHERE b.tId=""" + task_id + """ AND
              a.plan_end_date < GETDATE() AND
              a.is_deleted=1 AND
              b.is_active=1 AND
              d.is_deleted=1
              GROUP BY d.sub_task_id
              UNION ALL
              SELECT d.sub_task_id,SUM(d.hours) hours
              FROM art_timesheet_external d 
              INNER JOIN art_sub_task a
              ON d.sub_task_id=a.sub_task_id
              INNER JOIN art_task b
              ON a.task_id=b.tId
              WHERE b.tId= """ + task_id + """  AND
              a.plan_end_date < GETDATE() AND
              a.is_deleted=1 AND
              b.is_active=1 AND
              d.is_deleted=1
              GROUP BY d.sub_task_id
              ) B
              ON A.sub_task_id=B.sub_task_id
              ) AS TOTAL
   """
    var result: Option[Double] = Option(0)
    DB.withConnection { implicit connection =>
      try {
        result = SQL(sql).as(scalar[Double].singleOpt)
      } catch {
        case e: Exception => return result
      }
      result
    }
    */
    DB.withConnection { implicit connection =>
      SQL("EXEC art.calc_task {tId},{tipo}").on(
        'tId -> task_id.toInt, 'tipo -> 2).executeQuery().as(scalar[Double].singleOpt)
    }
  }

  ///FIR  Minimum date on which a worked hour is registered for the sub tasks of a task
  def getTaskMinDate(task_id: String) = {
    var sql = """    
              SELECT MIN(fecha) FROM
              (
              SELECT MIN(d.task_for_date) fecha
              FROM art_timesheet d
              INNER JOIN art_sub_task a
              ON d.sub_task_id=a.sub_task_id
              INNER JOIN art_task b
              ON a.task_id=b.tId
               WHERE b.tId=""" + task_id + """  AND
              a.is_deleted=1 AND
              b.is_active=1 AND
              d.is_deleted=1
              UNION
              SELECT MIN(d.task_for_date) fecha
              FROM art_timesheet_external d
              INNER JOIN art_sub_task a
              ON d.sub_task_id=a.sub_task_id
              INNER JOIN art_task b
              ON a.task_id=b.tId
               WHERE b.tId=""" + task_id + """  AND
              a.is_deleted=1 AND
              b.is_active=1 AND
              d.is_deleted=1
              ) AS MINIMOS

              """
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(scalar[Date].singleOpt)
      result
    }
  }

  ///FTR Real end date, it corresponds to the latest date on which a sub task had register of hours worked, once it is 100% finished
  def getTaskMaxDate(task_id: String) = {
    var sql = """    
                 
              SELECT MAX(fecha) FROM
              (
              SELECT MAX(d.task_for_date) fecha
              FROM art_timesheet d
              INNER JOIN art_sub_task a
              ON d.sub_task_id=a.sub_task_id
              INNER JOIN art_task b
              ON a.task_id=b.tId
               WHERE b.tId=""" + task_id + """  AND
              a.is_deleted=1 AND
              b.is_active=1 AND
              d.is_deleted=1
              UNION
              SELECT MAX(d.task_for_date) fecha
              FROM art_timesheet_external d
              INNER JOIN art_sub_task a
              ON d.sub_task_id=a.sub_task_id
              INNER JOIN art_task b
              ON a.task_id=b.tId
               WHERE b.tId=""" + task_id + """  AND
              a.is_deleted=1 AND
              b.is_active=1 AND
              d.is_deleted=1
              ) AS MAXIMO

              """
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(scalar[Date].singleOpt)
      result
    }
  }

  /*  //Expected advance percentage AVE%
  def getTaskAVExpectedPercentage(task_id: String) = {
    var sql = ""
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(scalar[Double].singleOpt)
      result
    }
  }

  //Informed advance percentage AVI%
  def getTaskAVInformedPercentage(task_id: String) = {
    var sql = ""
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(scalar[Double].singleOpt)
      result
    }
  }
  //Non canonical SPI
  def getTaskSPI(task_id: String) = {
    var sql = ""
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(scalar[Double].singleOpt)
      result
    }
  }
  //Non canonical CPI
  def getTaskCPI(task_id: String) = {
    var sql = ""
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(scalar[Double].singleOpt)
      result
    }
  }

  //Non canonical EAC
  def getTaskEAC(task_id: String) = {
    var sql = ""
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(scalar[Double].singleOpt)
      result
    }
  }
  //Non canonical ETC
  def getTaskETC(task_id: String) = {

  }*/
}