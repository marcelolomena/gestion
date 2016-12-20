package services;

import java.text.DecimalFormat
import java.text.SimpleDateFormat
import java.util.Date
import scala.Option.option2Iterable
import scala.math.BigDecimal.double2bigDecimal
import scala.math.BigDecimal.int2bigDecimal
import org.apache.commons.lang3.StringUtils
import org.json.JSONArray
import org.json.JSONObject
import anorm.NotAssigned
import anorm.Pk
import anorm.SQL
import anorm.SqlParser.scalar
import anorm.sqlToSimple
//import anorm.toParameterValue
import models.Baseline
import models.Project
import models.ProjectMasters
import models.ProjectStatus
import models.SubTasks
import models.Tasks
import models.Timesheet
import play.api.Play.current
import play.api.data.Form
import play.api.db.DB
import play.libs.Json
import models.SubTaskAllocation
import models.CustomColumns
import play.i18n._
import models.ProgramMaster
import org.apache.commons.lang3.time.DateUtils
import java.util.Calendar
import models.SubTaskAllocationExternal
import scala.math.BigDecimal.RoundingMode

object ProjectService extends CustomColumns {

  val langObj = new Lang(Lang.forCode("es-ES"))

  /**
   * get all project
   */
  def findAllProject(pagNo: String, recordOnPage: String, search: String): Seq[Project] = {
    val rec = Integer.parseInt(pagNo.toInt.toString) * Integer.parseInt(recordOnPage.toInt.toString);
    val start = rec - Integer.parseInt(recordOnPage.toInt.toString);
    val end = Integer.parseInt(recordOnPage.toInt.toString);
    //  val sqlSting = "select * from art_project_master where pId like '%" + search + "%' OR project_name like '%" + search + "%' order by pId desc limit " + start + "," + end
    val sqlSting = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY id) AS Row, * FROM art_project_master AS tbl where pId like '%" + search + "%' OR project_name like '%" + search + "%')as ss WHERE   (Row >=" + (start + 1) + " AND Row <= " + (start + end) + ") order by pId desc"
    DB.withConnection { implicit connection =>
      SQL(sqlSting).as(Project.project *)
    }
  }

  def findTotalCount(search: String): Long = {
    val sqlSting = "select count(*) from art_project_master where pId like '" + search + "%' OR project_name like '" + search + "%' order by pId desc "
    DB.withConnection { implicit connection =>
      val count: Long = SQL(sqlSting).as(scalar[Long].single)
      count;
    }
  }
  /**
   * method to get total project list count
   */
  def findCount(): Long = {
    DB.withConnection { implicit connection =>
      val count: Long = SQL("select count(*) from art_project_master").as(scalar[Long].single)
      count;
    }
  }

  /**
   * method to get the project details by id
   */
  def findProjectDetails(pId: Integer) = {

    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_project_master where pId = {pId} ").on(
          'pId -> pId).as(Project.project.singleOpt)
      result
    }

  }
 

  def findProject(pId: Integer) = {
    var sqlString = "select * from art_project_master where pId = '" + pId + "'"
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(Project.project.singleOpt)
      result
    }

  }

  /**
   * find all project details
   */
  def findProjectList: Seq[Project] = {
    DB.withConnection { implicit connection =>
      SQL("select * from art_project_master order by pId desc").as(Project.project *)
    }
  }

  /**
   * find all project details
   */
  def findProjectListOrderByPrograms(): Seq[Project] = {
    DB.withConnection { implicit connection =>
      SQL("select * from art_project_master order by program ").as(Project.project *)
    }
  }

  def findProjectByTeamId(team_id: Int): Seq[Project] = {
    val sqlSting = "SELECT * FROM art_project_master WHERE pId IN (select pId  from art_task where mId IN (select milestone_id from art_milestone_team_mapping where team_id =" + team_id + ") )"
    DB.withConnection { implicit connection =>
      SQL(sqlSting).as(Project.project *)
    }
  }

  def searchProjects(search: String): Seq[Project] = {
    val sqlSting = "SELECT * FROM art_project_master WHERE project_name like '%" + search + "%'"
    DB.withConnection { implicit connection =>
      SQL(sqlSting).as(Project.project *)
    }
  }

  def findProjectListForProgram(program_id: String): Seq[Project] = {
    val sqlSting = "SELECT * FROM art_project_master WHERE program ='" + program_id + "' AND is_active=1 order by start_date"
    DB.withConnection { implicit connection =>
      SQL(sqlSting).as(Project.project *)
    }
  }

  def findProjectIdListForProgramId(program_id: String): Seq[Long] = {
    val sqlSting = "SELECT pId FROM art_project_master WHERE program ='" + program_id + "' AND is_active = 1 "
    DB.withConnection { implicit connection =>
      SQL(sqlSting).as(scalar[Long] *)
    }
  }

  def insertProject(project: Project): Long = {
    DB.withConnection { implicit connection =>
      val lastSave = SQL(
        """
          insert into art_project_master(project_id, program, project_mode, project_name, description, project_manager, start_date, final_release_date,
          completion_percentage, ppm_number, work_flow_status, baseline,is_active,planned_hours) values (
          {project_id}, {program}, {project_mode},{project_name}, {description}, {project_manager}, {start_date}, {final_release_date},
          {completion_percentage},  {ppm_number},
          {work_flow_status},{baseline},{is_active},{planned_hours})
          """).on(
          'project_id -> project.project_id,
          'program -> project.program,
          'project_mode -> project.project_mode,
          'project_name -> project.project_name,
          'description -> project.description,
          'project_manager -> project.project_manager,
          'start_date -> project.start_date,
          'final_release_date -> project.final_release_date,
          'completion_percentage -> project.completion_percentage,
          'ppm_number -> project.ppm_number,
          'work_flow_status -> project.work_flow_status,
          'baseline -> project.baseline,
          'is_active -> 1,
          'planned_hours -> project.planned_hours).executeInsert(scalar[Long].singleOpt)

      lastSave.last
    }
  }

  def updateProject(project: Project): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_project_master
          set
          description = {description},
          project_manager={project_manager},
          project_name = {project_name},
          start_date = {start_date},
          final_release_date = {final_release_date},
          completion_percentage={completion_percentage},
          ppm_number={ppm_number},
          work_flow_status = {work_flow_status},
          baseline ={baseline},
          planned_hours={planned_hours}
          where pId = {pId}
          """).on(
          'pId -> project.pId,
          'project_name -> project.project_name,
          'description -> project.description,
          'project_manager -> project.project_manager,
          'start_date -> project.start_date,
          'final_release_date -> project.final_release_date,
          'completion_percentage -> project.completion_percentage,
          'ppm_number -> project.ppm_number,
          'work_flow_status -> project.work_flow_status,
          'baseline -> project.baseline,
          'planned_hours -> project.planned_hours).executeUpdate()
    }
  }

  def deleteProject(id: String) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "Delete from art_project_master where pId='" + id + "'").on(
          'pId -> id).executeUpdate()
    }
  }

  /**
   * Validation is removed.
   */
  def validateForm(form: Form[ProjectMasters], programid: Integer, oldId: String) = {
    var newform: play.api.data.Form[models.ProjectMasters] = null
    val prog_dates = ProgramService.findProgramDateDetailsById(programid.toString())

    if (prog_dates.get.initiation_planned_date != null && !form("start_date").value.get.isEmpty && !form("final_release_date").value.get.isEmpty) {
      val start_date = prog_dates.get.initiation_planned_date
      val end_date = prog_dates.get.closure_date.get
      val form_start_date = form("start_date").value.get
      val simpleDateFormat = new SimpleDateFormat("dd-MM-yyyy");
      val tempDate = simpleDateFormat.parse(form_start_date)
      if (start_date.getTime > tempDate.getTime()) {
        newform = form.withError("start_date", Messages.get(langObj, "newProjectDeatils.startdate.validation"))
      } else if (end_date.getTime < tempDate.getTime()) {
        newform = form.withError("start_date", Messages.get(langObj, "newProjectDeatils.startdate.enddatevalidation"))
      }
    }
    if (prog_dates.get.closure_date != null && !form("final_release_date").value.get.isEmpty) {
      val close_date = prog_dates.get.closure_date.get.getTime()
      val start_date = prog_dates.get.initiation_planned_date.getTime()
      val form_close_date = form("final_release_date").value.get
      val simpleDateFormat = new SimpleDateFormat("dd-MM-yyyy");
      val tempDate = simpleDateFormat.parse(form_close_date).getTime();
      if (tempDate > close_date) {
        newform = form.withError("final_release_date", Messages.get(langObj, "newProjectDeatils.enddate.validation"))
      } else if (tempDate < start_date) {
        newform = form.withError("final_release_date", Messages.get(langObj, "newProjectDeatils.enddate.startdatevalidation"))
      }
    }

    if (!StringUtils.isEmpty(oldId) && !form("final_release_date").value.get.isEmpty) {
      var taskEndDate = TaskService.findMaxTaskEndDate(oldId);
      var taskStartDate = TaskService.findMinTaskEndDate(oldId);

      val form_close_date = form("final_release_date").value.get
      val simpleDateFormat = new SimpleDateFormat("dd-MM-yyyy");
      var plan_end_date = simpleDateFormat.parse(form.data.get("final_release_date").get)
      var plan_start_date = simpleDateFormat.parse(form.data.get("start_date").get)

      if (plan_start_date.after(plan_end_date)) {
        newform = form.withError("start_date", Messages.get(langObj, "newProjectDeatils.startdate.validation"))
      }

      if (taskEndDate != null) {
        if (!taskEndDate.isEmpty) {
          val taskEndDt = Calendar.getInstance();
          taskEndDt.setTime(taskEndDate.get);
          val projectEndDate = Calendar.getInstance;
          projectEndDate.setTime(plan_end_date);
          if (projectEndDate.before(taskEndDt)) {
            newform = form.withError("final_release_date", "Project end date can not be before task end date.");
          }
        }
      }

      if (taskStartDate != null) {
        if (!taskStartDate.isEmpty) {
          val taskStartDt = Calendar.getInstance();
          taskStartDt.setTime(taskStartDate.get);
          val projectStartDate = Calendar.getInstance;
          projectStartDate.setTime(plan_start_date);
          if (taskStartDt.before(projectStartDate)) {
            newform = form.withError("start_date", "Project start date can not be after task start date.");
          }
        }

      }
    }

    if (!form("start_date").value.get.isEmpty && prog_dates.get.closure_date != null && !form("final_release_date").value.get.isEmpty) {
      val form_close_date = form("final_release_date").value.get
      val form_start_date = form("start_date").value.get
      val simpleDateFormat = new SimpleDateFormat("dd-MM-yyyy");
      val tempDate = simpleDateFormat.parse(form_start_date).getTime()
      val tempDate1 = simpleDateFormat.parse(form_close_date).getTime();
      if (tempDate > tempDate1) {
        newform = form.withError("final_release_date", Messages.get(langObj, "newProjectDeatils.enddate.startdatemorevalidation"))
      }
    }

    if (!form("project_name").value.isEmpty && !StringUtils.isEmpty(form("project_name").value.get)) {
      val projectName = form("project_name").value.get.trim

      val programId = form("program").value.get.trim

      val projects = findProjectListForProgram(programId)
      for (p <- projects) {
        if (StringUtils.equalsIgnoreCase(projectName.trim(), p.project_name)) {
          if (!StringUtils.equals(p.pId.get.toString(), oldId)) {
            newform = form.withError("project_name", "Same project name is not allowed under the same program.")
          }
        }
      }
      //      val existData = findProjectNameForProgram(projectName, programId)
      //      if (!existData.isEmpty) {
      //        println(existData + "-------------")
      //        if (!StringUtils.equals(existData.get.pId.toString(), oldId)) {
      //          newform = form.withError("project_name", "Same project name is not allowed under the same program.")
      //        }
      //
      //      }
    }
    //   val budget_approved_staff = BigDecimal(form("budget_approved_staff").value.get)
    //val budget_approved_contractor = BigDecimal(form("budget_approved_contractor").value.get)
    //val budget_approved_hardware = BigDecimal(form("budget_approved_hardware").value.get)
    //val budget_approved_software = BigDecimal(form("budget_approved_software").value.get)
    //val total_sap = BigDecimal(form("total_sap").value.get)
    //val grand_total = budget_approved_contractor + budget_approved_hardware + budget_approved_software
    /*if ((grand_total - total_sap) > -1 && ((grand_total - total_sap) != 0.0)) {
			form
				.withError("total_sap", "Sum of all allocated budget less than or equals to total sap")

		} else*/
    if (newform != null) {
      newform
    } else {
      form
    }

  }

  def findProjectNameForProgram(projectName: String, programId: String) = {
    val sqlSting = "SELECT * FROM art_project_master WHERE project_name='" + projectName + "' AND program='" + programId + "' AND is_active = 1"
    DB.withConnection { implicit connection =>
      SQL(sqlSting).as(Project.project.singleOpt)
    }
  }

  def findAllocatedHoursForProject(project: String): BigDecimal = {
    val sqlSting = "SELECT * FROM art_task WHERE is_active=1 AND pId='" + project + "'"
    DB.withConnection { implicit connection =>
      val result = SQL(sqlSting).as(Tasks.tasks *)
      var hours: BigDecimal = 0
      for (r <- result) {
        hours += r.plan_time
      }
      hours
    }
  }

  def findSpentHoursForProject(project: String): BigDecimal = {
    var hours: BigDecimal = 0

    var sqlSting = "SELECT * FROM art_sub_task_allocation WHERE is_deleted=1 AND sub_task_id IN ( select sub_task_id from art_sub_task t where is_deleted=1 and t.task_id IN ( select tId from art_task where pId = " + project + " AND is_active = 1 ))"
    // println(sqlSting)
    DB.withConnection { implicit connection =>
      val result = SQL(sqlSting).as(SubTaskAllocation.taskAllocation *)

      for (r <- result) {
        hours += r.estimated_time
      }
      hours
    }

    sqlSting = "SELECT * FROM art_sub_task_allocation_external WHERE is_deleted=1 AND sub_task_id IN ( select sub_task_id from art_sub_task t where is_deleted=1 and t.task_id IN ( select tId from art_task where pId = " + project + " AND is_active = 1 ))"
    DB.withConnection { implicit connection =>
      val result = SQL(sqlSting).as(SubTaskAllocationExternal.taskAllocationExternal *)

      for (r <- result) {
        hours += r.estimated_time
      }
      hours
    }
  }
  def findBookedHoursForProject(project: String): BigDecimal = {
    val sqlSting = "SELECT * FROM art_timesheet WHERE pId='" + project + "'"
    DB.withConnection { implicit connection =>
      val result = SQL(sqlSting).as(Timesheet.timesheetLists *)
      var hours: BigDecimal = 0
      for (t <- result) {
        hours = hours + t.hours
      }
      hours

    }
  }

  def getCompletionPercentage(id: String): Double = {
    var projectCompletionPercet: Double = 0.0;
    val tasks = TaskService.findTaskListByProjectId(id)
    for (task <- tasks) {
      val taskDetail = TaskService.findTaskDetailsByTaskId(task.tId.get)
      if (!taskDetail.get.completion_percentage.isEmpty)
        projectCompletionPercet = projectCompletionPercet + taskDetail.get.completion_percentage.get;
    }
    projectCompletionPercet / tasks.size;
  }

  def getProjectGanttChart(program_id: String, uId: String): JSONArray = {
    var jsonArr = new JSONArray()
    var id = 1
    var tasksData = ""
    var df = new DecimalFormat("00");
    val milestone = UserService.findProjectListForUserAndProgram(Integer.parseInt(uId), program_id)
    for (m <- milestone) {
      var node = new JSONObject()
      var innerNode = new JSONObject()
      var jsonArr2 = new JSONArray()
      node.put("name", m.project_name)
      node.put("desc", "")
      var dateDiff = (m.final_release_date.getTime - m.start_date.getTime) / (1000 * 60 * 60 * 24) + 1

      val formatter = new SimpleDateFormat("yyyy-MM-dd")
      val plan_start_date = formatter.parse(m.start_date.toString())
      val plan_end_date = formatter.parse(m.final_release_date.toString())
      val cal = DateUtils.toCalendar(plan_start_date).getTimeInMillis() - (1000 * 60 * 60 * 24)

      val cal2 = DateUtils.toCalendar(plan_end_date).getTimeInMillis() - (1000 * 60 * 60 * 24)
      innerNode.put("from", "/Date(" + (cal) + ")/")
      innerNode.put("to", "/Date(" + (cal2) + ")/")
      var divVal = ""
      var divPer = ""

      //val c_per = calculateCompletionPercentageForProject(m.pId.get.toString())
      val c_per = SpiCpiCalculationsService.findIndicators(m.pId.get.toString(), 1)
      for (s <- c_per) {
        if (dateDiff == 1) {
          divPer = "<div class='left gantt-progress-percentage'></div>"
        } else {
          //divPer = "<div class='left gantt-progress-percentage'>" + df.format(c_per) + "%</div>"
          divPer = "<div class='left gantt-progress-percentage'>" + s.pai + "%</div>"
        }
        //if (c_per < 90) {
        if (s.pai < 90) {
          divVal = divPer + "<div style='width:" + c_per + "%!important;' class='gantt-progress'></div>"
        } else {
          divVal = divPer + "<div style='width:100%!important;' class='gantt-progress gantt-progress-new'></div>"
        }
      }

      innerNode.put("label", (m.pId.get + "_" + divVal))
      innerNode.put("customClass", ("task_status_0"))
      jsonArr2.put(innerNode)
      node.put("values", jsonArr2)

      id = id + 1
      jsonArr.put(node)
    }
    jsonArr
  }

  def projectBasline(project: Option[Project], final_release_date: Date, start_date: Date, user_id: String, program_id: String) = {
    var dates_changed: Boolean = false;
    var changeState = new JSONArray();
    //println(final_release_date + " - " + project.get.final_release_date)
    if (!final_release_date.equals(project.get.final_release_date)) {
      dates_changed = true;
      var changeStateObject = new JSONObject();
      changeStateObject.put("fieldName", "final_release_date");
      changeStateObject.put("org_value", new SimpleDateFormat("dd-MM-yyyy").format(project.get.final_release_date));
      changeStateObject.put("new_value", new SimpleDateFormat("dd-MM-yyyy").format(final_release_date));
      changeState.put(changeStateObject);
    }
    if (!start_date.equals(project.get.start_date)) {
      dates_changed = true;
      var changeStateObject = new JSONObject();
      changeStateObject.put("fieldName", "start_date");
      changeStateObject.put("org_value", new SimpleDateFormat("dd-MM-yyyy").format(project.get.start_date));

      changeStateObject.put("new_value", new SimpleDateFormat("dd-MM-yyyy").format(start_date));
      changeState.put(changeStateObject);
    }

    if (dates_changed) {
      val baseline = Baseline(None, changeState.toString(), Integer.parseInt(user_id), new Date(), "project", Integer.parseInt(program_id));
      //println(baseline + "-0-------")
      Baseline.insert(baseline);
    }
  }

  def insertProjectStatus(pm: ProjectStatus): Long = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        """
          insert into  art_project_status (
             project_id, status_for_date, reason_for_change, status 
          ) 
          values(
            {project_id}, {status_for_date},{reason_for_change},{status}
          )
          """).on(
          'project_id -> pm.project_id,
          'status_for_date -> new Date(),
          'reason_for_change -> pm.reason_for_change,
          'status -> pm.status).executeInsert(scalar[Long].singleOpt)

      result.last

    }

  }

  def findProjectStartDateBaslineChange(project_id: String) = {
    var i = 0
    var changeSet = ""
    var currentObject = ""

    var baseline = Baseline.getBaseline(Integer.parseInt(project_id), "project")
    for (b <- baseline) {

      var jsonNode = Json.parse(b.change_set);
      var itr = jsonNode.iterator()

      while (itr.hasNext()) {
        var jsonObj = itr.next();

        var field = jsonObj.findValue("fieldName").toString()
        field = field.replaceAll("^\"|\"$", "");

        if (StringUtils.equals(field, "start_date")) {
          currentObject = ""
          var new_field = jsonObj.findValue("org_value").toString().replaceAll("^\"|\"$", "")

          if (i == 0) {
            changeSet = "<tr><td class='text-strike-through' style='text-decoration:line-through;vertical-align: top' id='" + project_id + "'>" + new_field + "</td></tr>";

          } else {
            changeSet = changeSet + "<tr><td class='text-strike-through' style='text-decoration:line-through;vertical-align: top' id='" + project_id + "'>" + new_field + "</td></tr>";
          }
          i = i + 1;
        }
      }
    }
    val format = new java.text.SimpleDateFormat("dd-MM-yyyy")
    changeSet = changeSet + "<tr><td class='width_full' style='vertical-align: top' id='" + project_id + "'>" + format.format(ProjectService.findProjectDetails(Integer.parseInt(project_id)).get.start_date) + "</td></tr>";

    changeSet = "<table>" + changeSet + "</table>"
    changeSet
  }

  def findProjectReleaseDateBaslineChange(project_id: String) = {
    var i = 0
    var changeSet = ""
    var currentObject = ""

    var baseline = Baseline.getBaseline(Integer.parseInt(project_id), "project")
    for (b <- baseline) {

      var jsonNode = Json.parse(b.change_set);
      var itr = jsonNode.iterator()

      while (itr.hasNext()) {
        var jsonObj = itr.next();

        var field = jsonObj.findValue("fieldName").toString()
        field = field.replaceAll("^\"|\"$", "");

        if (StringUtils.equals(field, "final_release_date")) {
          currentObject = ""
          var new_field = jsonObj.findValue("org_value").toString().replaceAll("^\"|\"$", "")

          if (i == 0) {
            changeSet = "<tr><td class='text-strike-through' style='text-decoration:line-through;vertical-align: top' id='" + project_id + "'>" + new_field + "</td></tr>";

          } else {
            changeSet = changeSet + "<tr><td class='text-strike-through' style='text-decoration:line-through;vertical-align: top' id='" + project_id + "'>" + new_field + "</td></tr>";
          }
          i = i + 1;
        }
      }
    }
    val format = new java.text.SimpleDateFormat("dd-MM-yyyy")
    changeSet = changeSet + "<tr><td class='width_full' style='vertical-align: top' id='" + project_id + "'>" + format.format(ProjectService.findProjectDetails(Integer.parseInt(project_id)).get.final_release_date) + "</td></tr>";

    changeSet = "<table>" + changeSet + "</table>"
    changeSet
  }

  def findProjectStatus(project_id: String) = {
    var sqlString = ""
    sqlString = "SELECT TOP 1* from  art_project_status where project_id=" + project_id + " order by status_for_date DESC"
    //sqlString = "SELECT * from  art_project_status where project_id=" + project_id + " order by status_for_date DESC LIMIT 0,1"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ProjectStatus.pStatus.singleOpt)
    }
  }
  
  def findAllProjectStatus(project_id: String): Seq[ProjectStatus] = {
    var sqlString = ""
    sqlString = "SELECT * from  art_project_status where project_id=" + project_id + " order by status_for_date DESC"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ProjectStatus.pStatus *)
    }
  }
  
  def updateStartEndDate(pId: Option[Int], start_date: Date, final_release_date: Date): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
			update art_project_master
			set
			start_date = {start_date},
			final_release_date = {final_release_date}
			where pId = {pId}
			""").on(
          'pId -> pId,
          'start_date -> start_date,
          'final_release_date -> final_release_date).executeUpdate()
    }
  }

  /**
   * method to delete project from database by Id...
   */
  def delete(pId: Integer) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "Delete from art_project_master where pId = {pId}").on(
          'pId -> pId).executeUpdate()
    }
  }
  def softDeleteProject(id: String) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "update  art_project_master set is_active = 0 where pId='" + id + "'").on(
          'pId -> id).executeUpdate()
    }
  }

  def getPlannedHoursForProject(project_id: String): Double = {
    var sqlString = ""
    var valueP: Double = 0
    sqlString = "select * from art_project_master where is_active = 1 AND pId=" + project_id
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(Project.project.singleOpt)
      if (!result.isEmpty) {
        if (!result.get.planned_hours.isEmpty) {
          valueP = result.get.planned_hours.get
        }
      }
    }
    valueP
  }

  def findProgramDetailForProject(project_id: String) = {
    val sqlString = "Select * from art_program where program_id= ( Select DISTINCT(program) from art_project_master where pId=" + project_id + ")"
    //println(sqlString)
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(ProgramMaster.pMaster.singleOpt)
      result
    }
  }

  def getRiskProjectDetails(program_id: Integer) = {
    val sqlString = "select * from art_project_master where is_active=1 AND  program =" + program_id + "AND project_name='Risk Management'"
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(Project.project.singleOpt)
      result
    }
  }

  def findMaxProjectEndDate(program_id: String): Option[Date] = {
    var result: Option[Date] = null
    var sql = "select MAX(final_release_date) from  art_project_master  where program = " + program_id + " AND is_active=1"
    try {
      DB.withConnection { implicit connection =>
        result = SQL(sql).as(scalar[Date].singleOpt)
      }
    } catch {
      case e: Exception =>
    }
    result
  }

  def findMinProjectStartDate(program_id: String): Option[Date] = {
    var result: Option[Date] = null
    var sql = "select MIN(start_date) from  art_project_master  where program = " + program_id + " AND is_active=1"
    try {
      DB.withConnection { implicit connection =>
        result = SQL(sql).as(scalar[Date].singleOpt)
      }
    } catch {
      case e: Exception =>
    }
    result
  }

  def calculateCompletionPercentageForProject(project_id: String): scala.math.BigDecimal = {
    val tasks = TaskService.findTaskListByProjectId(project_id)
    val project = findProjectDetails(project_id.toInt)
    var completion_percentage_forProject: scala.math.BigDecimal = 0
    if (!project.isEmpty) {
      var plan_time_for_project: scala.math.BigDecimal = 0.0
      var actual_hours_completed_for_project: scala.math.BigDecimal = 0.0
      var actual_completion_date: Date = null
      var isValid = true

      for (c <- tasks) {
        val subtasks = TaskService.findSubTaskListByTaskId(c.tId.get.toString())
        var compl_per_task: scala.math.BigDecimal = 0
        var actual_hours_completed_for_task: scala.math.BigDecimal = 0
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
        } else {
          if (actual_completion_date != null) {
            if (actual_completion_date.getTime < c.plan_end_date.getTime) {
              actual_completion_date = c.plan_end_date
            }
          } else {
            actual_completion_date = c.plan_end_date
          }
        }
        actual_hours_completed_for_project += actual_hours_completed_for_task
      }
      if (!isValid) {
        actual_completion_date = null
      }
      //println(actual_completion_date)

      plan_time_for_project = project.get.planned_hours.getOrElse(0).toString().toDouble

      if (plan_time_for_project.!=(0)) {
        completion_percentage_forProject = ((actual_hours_completed_for_project / plan_time_for_project) * 100).setScale(2, RoundingMode.HALF_UP);
      }
    }
    completion_percentage_forProject
  }

  def findProjectforSubTask(sub_task_id: String) = {

    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_project_master where pId = (select pId from art_task where tId = (select task_id from art_sub_task where sub_task_id='" + sub_task_id + "'))").on(
          'sub_task_id -> sub_task_id).as(Project.project.singleOpt)
      result
    }

  }

  def getProjectNonCanonicalEarnVale(project_id: String) = {
    var sql = """    
              SELECT SUM(hours) hours FROM
              (SELECT ISNULL(SUM(hours),0) hours  FROM art_timesheet WHERE task_id  IN (SELECT tId FROM art_task WHERE pId=""" + project_id + """) AND is_deleted=1
              UNION ALL
              SELECT ISNULL(SUM(hours),0) hours  FROM art_timesheet_external WHERE task_id  IN (SELECT tId FROM art_task WHERE pId=""" + project_id + """) AND is_deleted=1
              ) AS TOTAL
              """
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(scalar[Double].singleOpt)
      result
    }
  }

  //VP
  def getProjectPlannedValue(project_id: String) = {
    var sql = """ SELECT planned_hours from art_project_master  where pId=""" + project_id + """  AND is_active= 1 """
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(scalar[Double].singleOpt)
      result
    }
  }
  ///VA
  def getProjectValueAssigned(project_id: String) = {
    var sql = """    
                  SELECT SUM(estimated_time) estimated_time FROM
                  (SELECT ISNULL(SUM(estimated_time),0) 
                  estimated_time FROM art_sub_task_allocation WHERE task_id IN 
                  (SELECT tId FROM art_task WHERE pId=""" + project_id + """) AND is_deleted=1
                  UNION ALL
                  SELECT ISNULL(SUM(estimated_time),0)
                  estimated_time FROM art_sub_task_allocation_external WHERE task_id IN 
                  (SELECT tId FROM art_task WHERE pId=""" + project_id + """)
                   AND is_deleted=1
                  ) AS TOTAL"""
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(scalar[Double].singleOpt)
      result
    }
  }

  //VG Expected earned value
  def getProjectExpectedEarnValue(project_id: String) = {
    var sql = """   SELECT SUM(estimated_time) estimated_time FROM
                    (SELECT ISNULL(SUM(estimated_time),0) estimated_time FROM art_sub_task_allocation WHERE 
                    sub_task_id IN (SELECT sub_task_id FROM art_sub_task WHERE plan_end_date < GETDATE() AND task_id IN (SELECT tId FROM art_task WHERE pId=""" + project_id + """ AND is_deleted=1) AND is_deleted=1)  AND is_deleted=1
                    UNION ALL
                    SELECT ISNULL(SUM(estimated_time),0) estimated_time FROM art_sub_task_allocation_external WHERE
                    sub_task_id IN (SELECT sub_task_id FROM art_sub_task WHERE plan_end_date < GETDATE() AND task_id IN (SELECT tId FROM art_task WHERE pId=""" + project_id + """ AND is_deleted=1) AND is_deleted=1) AND is_deleted=1) AS TOTAL """
    // println(sql)
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(scalar[Double].singleOpt)
      result
    }
  }

  //HC //actual cost non canonical
  def getProjectActualCost(project_id: String) = {
    var sql = """ SELECT SUM(hours) hours FROM (
              SELECT ISNULL(SUM(hours),0) hours 
              FROM art_timesheet d 
              INNER JOIN art_sub_task a
              ON d.sub_task_id=a.sub_task_id
              INNER JOIN art_task b
              on a.task_id=b.tId
              INNER JOIN art_project_master c
              ON b.pId=c.pId
              WHERE c.pId=""" + project_id + """ AND
              a.is_deleted=1 AND
              b.is_active=1 AND
              c.is_active=1 AND
              d.is_deleted=1
              UNION ALL
              SELECT ISNULL(SUM(hours),0) hours 
              FROM art_timesheet_external d 
              INNER JOIN art_sub_task a
              ON d.sub_task_id=a.sub_task_id
              INNER JOIN art_task b
              ON a.task_id=b.tId
              INNER JOIN art_project_master c
              ON b.pId=c.pId
              WHERE c.pId=""" + project_id + """ AND
              a.is_deleted=1 AND
              b.is_active=1 AND
              c.is_active=1 AND
              d.is_deleted=1
              ) AS TOTAL
              """
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(scalar[Double].singleOpt)
      result
    }
  }

  //VG Non canonical earned value
  def getProjectEarnValue(project_id: String): Option[Double] = {
    var sql = """    
            SELECT SUM(suma) FROM
                  (
                  SELECT SUM(A.estimated_time) suma FROM
                  (SELECT b.tId, a.sub_task_id, d.estimated_time, a.completion_percentage
                  FROM art_sub_task_allocation d 
                  INNER JOIN art_sub_task a
                  ON d.sub_task_id=a.sub_task_id
                  INNER JOIN art_task b
                  ON a.task_id=b.tId
                  INNER JOIN art_project_master c
                  ON b.pId=c.pId
                  WHERE c.pId=""" + project_id + """  AND
                  a.plan_end_date < GETDATE() AND
                  a.is_deleted=1 AND
                  b.is_active=1 AND
                  c.is_active=1 AND
                  d.is_deleted=1) A
                  INNER JOIN 
                  (SELECT d.sub_task_id,SUM(d.hours) hours
                  FROM art_timesheet d 
                  INNER JOIN art_sub_task a
                  ON d.sub_task_id=a.sub_task_id
                  INNER JOIN art_task b
                  ON a.task_id=b.tId
                  INNER JOIN art_project_master c
                  ON b.pId=c.pId
                  WHERE c.pId=""" + project_id + """  AND
                  a.plan_end_date < GETDATE() AND
                  a.is_deleted=1 AND
                  b.is_active=1 AND
                  c.is_active=1 AND
                  d.is_deleted=1
                  GROUP BY d.sub_task_id
                  UNION ALL
                  SELECT d.sub_task_id,SUM(d.hours) hours
                  FROM art_timesheet_external d 
                  INNER JOIN art_sub_task a
                  ON d.sub_task_id=a.sub_task_id
                  INNER JOIN art_task b
                  ON a.task_id=b.tId
                  INNER JOIN art_project_master c
                  ON b.pId=c.pId
                  WHERE c.pId=""" + project_id + """  AND
                  a.plan_end_date < GETDATE() AND
                  a.is_deleted=1 AND
                  b.is_active=1 AND
                  c.is_active=1 AND
                  d.is_deleted=1
                  GROUP BY d.sub_task_id
                  ) B
                  ON A.sub_task_id=B.sub_task_id
                  UNION ALL
                  SELECT SUM(A.estimated_time) suma FROM
                  (SELECT b.tId, a.sub_task_id, d.estimated_time, a.completion_percentage
                  FROM art_sub_task_allocation_external d 
                  INNER JOIN art_sub_task a
                  ON d.sub_task_id=a.sub_task_id
                  INNER JOIN art_task b
                  ON a.task_id=b.tId
                  INNER JOIN art_project_master c
                  ON b.pId=c.pId
                  WHERE c.pId=""" + project_id + """  AND
                  a.plan_end_date < GETDATE() AND
                  a.is_deleted=1 AND
                  b.is_active=1 AND
                  c.is_active=1 AND
                  d.is_deleted=1) A
                  INNER JOIN 
                  (SELECT d.sub_task_id,SUM(d.hours) hours
                  FROM art_timesheet d 
                  INNER JOIN art_sub_task a
                  ON d.sub_task_id=a.sub_task_id
                  INNER JOIN art_task b
                  ON a.task_id=b.tId
                  INNER JOIN art_project_master c
                  ON b.pId=c.pId
                  WHERE c.pId=""" + project_id + """  AND
                  a.plan_end_date < GETDATE() AND
                  a.is_deleted=1 AND
                  b.is_active=1 AND
                  c.is_active=1 AND
                  d.is_deleted=1
                  GROUP BY d.sub_task_id
                  UNION ALL
                  SELECT d.sub_task_id,SUM(d.hours) hours
                  FROM art_timesheet_external d 
                  INNER JOIN art_sub_task a
                  ON d.sub_task_id=a.sub_task_id
                  INNER JOIN art_task b
                  ON a.task_id=b.tId
                  INNER JOIN art_project_master c
                  ON b.pId=c.pId
                  WHERE c.pId=""" + project_id + """  AND
                  a.plan_end_date < GETDATE() AND
                  a.is_deleted=1 AND
                  b.is_active=1 AND
                  c.is_active=1 AND
                  d.is_deleted=1
                  GROUP BY d.sub_task_id
                  ) B
                  ON A.sub_task_id=B.sub_task_id
                  ) AS TOTAL

   """
    //println(sql)
    var result: Option[Double] = Option(0)
    DB.withConnection { implicit connection =>
      try {
        result = SQL(sql).as(scalar[Double].singleOpt)
      } catch {
        case e: Exception => return result
      }
      result
    }
  }

  ///FIP planned start date

  ////FTP planned end date

  ///FIR  Minimum date on which a worked hour is registered for the sub tasks of a task

  def getProjectMinDate(project_id: String) = {
    var sql = """    
              SELECT MIN(fecha) FROM
              (SELECT MIN(d.task_for_date) fecha
              FROM art_timesheet d
              INNER JOIN art_sub_task a
              ON d.sub_task_id=a.sub_task_id
              INNER JOIN art_task b
              ON a.task_id=b.tId
              INNER JOIN art_project_master c
              ON b.pId=c.pId WHERE  c.pId=""" + project_id + """   AND
              a.is_deleted=1 AND
              b.is_active=1 AND
              c.is_active=1 AND
              d.is_deleted=1
              UNION SELECT MIN(d.task_for_date) fecha
              FROM art_timesheet_external d
              INNER JOIN art_sub_task a
              ON d.sub_task_id=a.sub_task_id
              INNER JOIN art_task b
              ON a.task_id=b.tId
              INNER JOIN art_project_master c
              ON b.pId=c.pId  WHERE  c.pId=""" + project_id + """   AND
              a.is_deleted=1 AND
              b.is_active=1 AND
              c.is_active=1 AND
              d.is_deleted=1
              ) AS MINIMOS

              """
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(scalar[Date].singleOpt)
      result
    }
  }

  ///FTR Real end date, it corresponds to the latest date on which a sub task had register of hours worked, once it is 100% finished
  def getProjectMaxDate(project_id: String) = {
    var sql = """    
                  SELECT MAX(fecha) FROM
                  (SELECT MAX(d.task_for_date) fecha
                  FROM art_timesheet d
                  INNER JOIN art_sub_task a
                  ON d.sub_task_id=a.sub_task_id
                  INNER JOIN art_task b
                  ON a.task_id=b.tId
                  INNER JOIN art_project_master c
                  ON b.pId=c.pId
                  WHERE  c.pId=""" + project_id + """   AND
                  a.is_deleted=1 AND
                  b.is_active=1 AND
                  c.is_active=1 AND
                  d.is_deleted=1
                  UNION
                  SELECT MAX(d.task_for_date) fecha
                  FROM art_timesheet_external d
                  INNER JOIN art_sub_task a
                  ON d.sub_task_id=a.sub_task_id
                  INNER JOIN art_task b
                  ON a.task_id=b.tId
                  INNER JOIN art_project_master c
                  ON b.pId=c.pId
                  WHERE  c.pId=""" + project_id + """ AND
                  a.is_deleted=1 AND
                  b.is_active=1 AND
                  c.is_active=1 AND
                  d.is_deleted=1
                  ) AS MAXIMO
              """
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(scalar[Date].singleOpt)
      result
    }
  }
  def permisosProyecto(idProyecto: String, user_id: String) = {
    DB.withConnection { implicit connection =>
      SQL("EXEC art.permisos 2,{idProyecto},{user_id}").on(
        'idProyecto -> idProyecto.toInt, 'user_id -> user_id.toInt).executeQuery().as(scalar[Int].single)
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
