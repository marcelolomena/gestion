package controllers.Frontend

import java.lang.Boolean
import java.util.Date
import scala.collection.mutable.ListBuffer
import scala.math.BigDecimal.int2bigDecimal
import org.apache.commons.lang3.StringUtils
import org.json.JSONObject
import anorm.NotAssigned
import art_forms.ARTForms
import models.Activity
import models.ActivityTypes
import models.Baseline
import models.TaskMaster
import models.SubTaskMaster
import models.Tasks
import play.api.mvc.Action
import play.api.mvc.Controller
import services.ProjectService
import services.SubTaskServices
import services.TaskService
import services.UserService
import services.ProgramService
import services.TimesheetService
import services.DocumentService
import models.TaskDetails
import services.TaskDesciplineService
import services.UserRoleService
import services.StageService
import services.DeliverableService
import services.GenericProjectTypeService
import java.text.SimpleDateFormat
import scala.math.BigDecimal.RoundingMode
import services.ServiceCatalogueService
import services.ProgramMemberService
import java.text.DecimalFormat
import services.EarnValueService
import services.SpiCpiCalculationsService
import play.libs.Json

object Task extends Controller {

  var username = ""
  var mode = ""
  var project_id = ""
  var title = ""
  var milestone_code = ""
  var country = "chile"
  var state = "chile"
  var city = "chile"
  var description = ""
  var plan_time: BigDecimal = 0
  var milestone_status = -1
  var owner = -1
  var userMap = new java.util.LinkedHashMap[String, String]()

  /**
   * Get task details...
   * task_id -  Get task detail page
   */
  def projectTaskDetails(task_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val uId = Integer.parseInt(request.session.get("uId").get)
      val utype = Integer.parseInt(request.session.get("utype").get)
      val taskDetail = TaskService.findTaskDetailsByTaskId(Integer.parseInt(task_id))
      val project = ProjectService.findProject(taskDetail.get.pId)
      val documents = DocumentService.findAllDocuments(task_id, "TASK", "", "", "");
      val total_time = taskDetail.get.plan_time
      val subtasks = TaskService.findSubTaskListByTaskId(task_id)

      var compl_per_task: scala.math.BigDecimal = 0
      var actual_hours_completed_for_task: scala.math.BigDecimal = 0
      var actual_completion_date: Date = null
      
      val baseline = Baseline.getBaseline(Integer.parseInt(task_id), "task")
      var changeSet = "";
      if (baseline.length > 0) {
        changeSet = "[";
        var i = 0;
        for (b <- baseline) {

          var jsonNode = Json.parse(b.change_set);
          var itr = jsonNode.iterator()
          while (itr.hasNext()) {
            var jsonObj = itr.next();
            if (i == 0) {
              changeSet = "[" + jsonObj.toString() + ",";
            } else {
              changeSet = changeSet + jsonObj.toString() + ",";
            }
            i = i + 1;
          }
        }

        changeSet = changeSet.substring(0, changeSet.length() - 1) + "]";
      }


      var isValid = true

      var df = new DecimalFormat("00");
      if (total_time.!=(0)) {
        val completion_percentage_forTask: scala.math.BigDecimal = TaskService.completionPercentageForTask(task_id);
        //println(completion_percentage_forTask)
        Ok(views.html.frontend.task.projectTaskDetails(completion_percentage_forTask.toString(), taskDetail, project, documents, actual_completion_date,changeSet)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      } else {
        Ok(views.html.frontend.task.projectTaskDetails(total_time.toString(), taskDetail, project, documents, actual_completion_date,changeSet)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * View to display updated task list
   * project_id -  PProject Id
   */
  def updatedTaskList(project_id: String) = Action { implicit request =>
    if (StringUtils.isNotEmpty(project_id.toString())) {
      val milestone = TaskService.findTaskListByProjectId(project_id)
      var list = new ListBuffer[String]()
      val project = ProjectService.findProject(Integer.parseInt(project_id))
      for (c <- milestone) {
        list += Baseline.getBaselineCount(c.tId.get, "Task").toString();
      }
      var countList = list.toList;
      Ok(views.html.frontend.task.updatedTaskList(milestone, countList, project.get.baseline))
    } else {
      Ok("")
    }
  }

  /**
   * Create new task under a project
   * id - Project id
   */
  def newTask(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val project = ProjectService.findProjectDetails(Integer.parseInt(id))
      val user_id = request.session.get("uId").get
      val utype = Integer.parseInt(request.session.get("utype").get.toString())
      var pTypes = new java.util.LinkedHashMap[String, String]()
      username = request.session.get("username").get.toString()

      val project_types = services.GenericProjectService.findActiveProjectTypeDetailsByType()
      for (p <- project_types) {
        if (!GenericProjectTypeService.findActiveGenericProjectTypeById(p.project_type.toString()).isEmpty) {
          pTypes.put(p.id.get.toString(), GenericProjectTypeService.findActiveGenericProjectTypeById(p.project_type.toString()).get.generic_project_type)
        }
      }

      val users = ProgramMemberService.findAllProgramMembers(project.get.program.toString);
      var userMap = new java.util.LinkedHashMap[String, String]()
      userMap = new java.util.LinkedHashMap[String, String]()
      for (u <- users) {
        userMap.put(u.uid.get.toString(), u.first_name + " " + u.last_name)
      }
      var discipline = new java.util.LinkedHashMap[String, String]()
      val disciplines = TaskDesciplineService.findAllTaskDesciplineList()
      for (d <- disciplines) {
        discipline.put(d.id.get.toString, d.task_discipline)
      }

      var stageMap = new java.util.LinkedHashMap[String, String]()
      val stageList = StageService.findAllStages()
      for (st <- stageList) {
        if (!StringUtils.equals(st.id.toString, id))
          stageMap.put(st.id.get.toString(), st.stage.toString())
      }

      var deliverableMap = new java.util.LinkedHashMap[String, String]()
      val deliverableList = DeliverableService.findAllDeliverables()
      for (del <- deliverableList) {
        if (!StringUtils.equals(del.id.toString, id))
          deliverableMap.put(del.id.get.toString(), del.deliverable.toString())
      }
      var userRoleMap = new java.util.LinkedHashMap[String, String]()
      val user_roles = UserRoleService.findAllUserRoles
      for (u <- user_roles) {
        userRoleMap.put(u.rId.get.toString, u.role)
      }
      var catalougeMap = new java.util.LinkedHashMap[String, String]()
      var catalaogues = ServiceCatalogueService.getServiceCatalogue
      for (c <- catalaogues) {
        catalougeMap.put(c.id.get.toString, c.service_name);
      }

      Ok(views.html.frontend.task.newTask(ARTForms.taskForm, project, username, users, discipline, userMap, stageMap, userRoleMap, deliverableMap, pTypes)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }

  }

  def saveTaskDetails(id: String) = Action { implicit request =>
    var response = new JSONObject()
    val project = ProjectService.findProjectDetails(Integer.parseInt(id))
    val user_id = request.session.get("uId").get
    val utype = Integer.parseInt(request.session.get("utype").get.toString())
    username = request.session.get("username").get.toString()

    var pTypes = new java.util.LinkedHashMap[String, String]()

    val project_types = services.GenericProjectService.findActiveProjectTypeDetailsByType()
    for (p <- project_types) {
      if (!GenericProjectTypeService.findActiveGenericProjectTypeById(p.project_type.toString()).isEmpty) {
        pTypes.put(p.id.get.toString(), GenericProjectTypeService.findActiveGenericProjectTypeById(p.project_type.toString()).get.generic_project_type)
      }
    }
    val users = ProgramMemberService.findAllProgramMembers(project.get.program.toString);
    var userMap = new java.util.LinkedHashMap[String, String]()
    for (u <- users) {
      userMap.put(u.uid.get.toString(), u.first_name + " " + u.last_name)
    }
    var descipline = new java.util.LinkedHashMap[String, String]()
    val disciplines = TaskDesciplineService.findAllTaskDesciplineList()
    for (d <- disciplines) {
      descipline.put(d.id.get.toString, d.task_discipline)
    }
    var userRoleMap = new java.util.HashMap[String, String]()
    val user_roles = UserRoleService.findAllUserRoles
    for (u <- user_roles) {
      userRoleMap.put(u.rId.get.toString, u.role)
    }
    var stageMap = new java.util.LinkedHashMap[String, String]()
    val stageList = StageService.findAllStages()

    for (st <- stageList) {

      if (!StringUtils.equals(st.id.toString, id))
        stageMap.put(st.id.get.toString(), st.stage.toString())

    }
    var deliverableMap = new java.util.HashMap[String, String]()
    val deliverableList = DeliverableService.findAllDeliverables()
    for (del <- deliverableList) {
      if (!StringUtils.equals(del.id.toString, id))
        deliverableMap.put(del.id.get.toString(), del.deliverable.toString())

    }

    var catalougeMap = new java.util.HashMap[String, String]()
    var catalaogues = ServiceCatalogueService.getServiceCatalogue
    for (c <- catalaogues) {
      catalougeMap.put(c.id.get.toString, c.service_name);
    }
    val oldForm = ARTForms.taskForm.bindFromRequest
    oldForm.fold(
      errors => {
        val project = ProjectService.findProject(Integer.parseInt(errors.data.get("pId").get))
        var selected_task = ""
        var newform = oldForm
        newform = TaskService.validateForm(oldForm, "")
        if (!errors.data.get("task_depend").isEmpty) {
          selected_task = errors.data.get("task_depend").get
        }

        BadRequest(views.html.frontend.task.newTask(newform, project, username, users, descipline, userMap, stageMap, userRoleMap, deliverableMap, pTypes))
      },
      success => {
        val theForm = TaskService.validateForm(ARTForms.taskForm.fill(success), "")
        if (theForm.hasErrors) {
          val project = ProjectService.findProject(Integer.parseInt(theForm.data.get("pId").get))
          var selected_task = ""
          if (!theForm.data.get("task_depend").isEmpty) {
            selected_task = theForm.data.get("task_depend").get
          }
          BadRequest(views.html.frontend.task.newTask(theForm, project, username, users, descipline, userMap, stageMap, userRoleMap, deliverableMap, pTypes))
        } else {
          
          val milestoneDetails = Tasks(None, success.project, success.task_title, success.task_details.task_code,
            success.plan_start_date, success.plan_end_date, success.task_description, success.plan_time,
            new Date(), success.task_status, user_id.toInt, success.owner, Option(success.task_discipline), success.completion_percentage,
            success.remark, success.task_depend, success.dependencies_type, Option(success.task_details.stage), Option(success.task_details.user_role), success.task_details.deliverable, success.task_details.task_type, 1)

          val latest_task = TaskService.insertTask(milestoneDetails)

          if(success.project_mode==42){
            println("sin plantilla:" + success.project_mode)
            val subtask = SubTaskMaster(None, latest_task, success.task_title, success.task_description,
              success.plan_start_date, success.plan_end_date, success.plan_start_date, null, null, new Date(), success.task_status, success.completion_percentage, 0, Option(""), Option(0), Option(0))
            SubTaskServices.insertSubTask(subtask)
          }else{
            
            var formattedDate: SimpleDateFormat = new SimpleDateFormat("yyyy-MM-dd")

            println("con plantilla:" + success.project_mode)
            println("pert:" + success.pert)
            println("plan_start_date:" + formattedDate.format(success.plan_start_date))
            println("latest_task:" + latest_task)
            println("task_title:" + success.task_title)
            println("task_description:" + success.task_description)
            
            if(success.pert==0){ //con plantilla pero sin pert

              SubTaskServices.insertSubTaskFromTemplate(formattedDate.format(success.plan_start_date),
                  formattedDate.format(success.plan_end_date),latest_task.toString(),success.project_mode.toString())

            }else if(success.pert==1){//pert dias corridos
              val errorCode=SubTaskServices.insertSubTaskFromTemplatePert(false,formattedDate.format(success.plan_start_date),
                  success.project_mode.toString(),
                  "",
                  latest_task.toString(),
                  ""
                  )
                  println("errorCode:" + errorCode)
            }else if(success.pert==2){ //pert dias habiles
              val errorCode=SubTaskServices.insertSubTaskFromTemplatePert(true,formattedDate.format(success.plan_start_date),
                  success.project_mode.toString(),
                  "",
                  latest_task.toString(),
                  ""
                  )
                  println("errorCode:" + errorCode)              
            }
          }

          /**
           * Activity log
           */
          val act = Activity(ActivityTypes.Task.id, "New task created by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), latest_task.toInt)
          Activity.saveLog(act)

          Redirect(routes.ProjectMaster.projectDetails(id))
        }
      })
  }

  /**
   * Vew task for edit
   * id - task id
   */
  def editTaskDetails(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val task = TaskService.findTaskDetailsByTaskId(Integer.parseInt(id))

      task match {
        case None =>
          Redirect(routes.Login.loginUser())
        case Some(ml: Tasks) =>
          val user_id = request.session.get("uId").get
          val utype = Integer.parseInt(request.session.get("utype").get.toString())
          username = request.session.get("username").get.toString()
          val project = ProjectService.findProject(task.get.pId)
          val users = ProgramMemberService.findAllProgramMembers(project.get.program.toString);
          val baselineCount = Baseline.getBaselineCount(ml.tId.get, "Task")
          var baselineAvailable: Boolean = false;
          if (baselineCount > 0) {
            baselineAvailable = true;
          }
          var userMap = new java.util.LinkedHashMap[String, String]()

          for (u <- users) {
            userMap.put(u.uid.get.toString(), u.first_name + " " + u.last_name)
          }
          var descipline = new java.util.LinkedHashMap[String, String]()
          val disciplines = TaskDesciplineService.findAllTaskDesciplineList()
          for (d <- disciplines) {
            descipline.put(d.id.get.toString, d.task_discipline)
          }
          var selected_task = ""
          if (!task.get.task_depend.isEmpty) {
            selected_task = task.get.task_depend.get
          }

          var userRoleMap = new java.util.HashMap[String, String]()
          val user_roles = UserRoleService.findAllUserRoles
          for (u <- user_roles) {
            userRoleMap.put(u.rId.get.toString, u.role)
          }
          var stageMap = new java.util.LinkedHashMap[String, String]()
          val stageList = StageService.findAllStages()
          for (st <- stageList) {
            if (!StringUtils.equals(st.id.toString, id))
              stageMap.put(st.id.get.toString(), st.stage.toString())

          }
          var deliverableMap = new java.util.LinkedHashMap[String, String]()
          val deliverableList = DeliverableService.findAllDeliverables()
          for (del <- deliverableList) {
            if (!StringUtils.equals(del.id.toString, id))
              deliverableMap.put(del.id.get.toString(), del.deliverable.toString())

          }
          val isValidDependency = TaskService.checkValidDependency(task.get.tId.get.toString())

          val task_detail = TaskDetails(task.get.task_type, task.get.task_code, task.get.stage.getOrElse(0), task.get.user_role.getOrElse(0), task.get.deliverable)
          val taskData = TaskMaster(Some(id.toInt), task.get.pId, 0, 0, task.get.task_title,
            task.get.plan_start_date, task.get.plan_end_date, task.get.task_description,
            task.get.plan_time, task.get.task_status, task.get.status, task.get.owner, task.get.task_discipline.getOrElse(0), task.get.completion_percentage, task.get.remark, task.get.task_depend, task.get.dependencies_type, task_detail)

          var dt1 = SubTaskServices.findMaxSubtaskEndDate(task.get.tId.get.toString());
          var maxSubtaskEndDate: Date = null;
          if (dt1 != null) {
            if (!dt1.isEmpty) {
              maxSubtaskEndDate = dt1.get;
            }
          }

          Ok(views.html.frontend.task.editTask(ARTForms.taskForm.fill(taskData), task, project, username, users, descipline, userMap, id, baselineAvailable, stageMap, isValidDependency, userRoleMap, deliverableMap, maxSubtaskEndDate))

      }
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }

  }

  /**
   * Update task details...
   * id -  Task id
   */
  def updateTask(id: String) = Action { implicit request =>

    val user_id = request.session.get("uId").get
    val utype = Integer.parseInt(request.session.get("utype").get.toString())
    username = request.session.get("username").get.toString()
    val task = TaskService.findTaskDetailsByTaskId(Integer.parseInt(id))
    val project = ProjectService.findProject(task.get.pId)

    val users = ProgramMemberService.findAllProgramMembers(project.get.program.toString);
    val baselineCount = Baseline.getBaselineCount(task.get.tId.get, "Task")
    var baselineAvailable: Boolean = false;
    if (baselineCount > 0) {
      baselineAvailable = true;
    }
    var userMap = new java.util.LinkedHashMap[String, String]()
    for (u <- users) {
      userMap.put(u.uid.get.toString(), u.first_name + " " + u.last_name)
    }
    var descipline = new java.util.LinkedHashMap[String, String]()
    val disciplines = TaskDesciplineService.findAllTaskDesciplineList()
    for (d <- disciplines) {
      descipline.put(d.id.get.toString, d.task_discipline)
    }
    var stageMap = new java.util.LinkedHashMap[String, String]()
    var tasks_depends = ""
    if (!task.get.task_depend.isEmpty) {
      tasks_depends = task.get.task_depend.get
    }
    var userRoleMap = new java.util.HashMap[String, String]()
    val user_roles = UserRoleService.findAllUserRoles
    for (u <- user_roles) {
      userRoleMap.put(u.rId.get.toString, u.role)
    }
    val stageList = StageService.findAllStages()
    for (st <- stageList) {
      if (!StringUtils.equals(st.id.toString, id))
        stageMap.put(st.id.get.toString(), st.stage.toString())

    }
    var deliverableMap = new java.util.HashMap[String, String]()
    val deliverableList = DeliverableService.findAllDeliverables()
    for (del <- deliverableList) {
      if (!StringUtils.equals(del.id.toString, id))
        deliverableMap.put(del.id.get.toString(), del.deliverable.toString())

    }

    var dt1 = SubTaskServices.findMaxSubtaskEndDate(task.get.tId.get.toString());
    var maxSubtaskEndDate: Date = null;
    if (dt1 != null) {
      if (!dt1.isEmpty) {
        maxSubtaskEndDate = dt1.get;
      }
    }

    val isValidDependency = TaskService.checkValidDependency(task.get.tId.get.toString())
    ARTForms.taskForm.bindFromRequest.fold(
      errors => {
        println("Errors - " + errors.errors);
        BadRequest(views.html.frontend.task.editTask(errors, task, project, username, users, descipline, userMap, id, baselineAvailable, stageMap, isValidDependency, userRoleMap, deliverableMap, maxSubtaskEndDate))
      },
      success => {
        val theForm = TaskService.validateForm(ARTForms.taskForm.fill(success), id)
        if (theForm.hasErrors) {
          val project = ProjectService.findProject(Integer.parseInt(theForm.data.get("pId").get))
          println("Errors - " + theForm.errors);
          BadRequest(views.html.frontend.task.editTask(theForm, task, project, username, users, descipline, userMap, id, baselineAvailable, stageMap, isValidDependency, userRoleMap, deliverableMap, maxSubtaskEndDate))
        } else {

          val task = TaskService.findTaskDetailsByTaskId(Integer.parseInt(id))
          val planned_end_date = task.get.plan_end_date
          val new_planned_end_date = success.plan_end_date

          val taskDetails = Tasks(task.get.tId, success.project, success.task_title, success.task_details.task_code,
            success.plan_start_date, success.plan_end_date, success.task_description, success.plan_time,
            task.get.creation_date, success.task_status, success.status, success.owner, Option(success.task_discipline),
            success.completion_percentage, success.remark, success.task_depend, success.dependencies_type, Option(success.task_details.stage), Option(success.task_details.user_role), success.task_details.deliverable, success.task_details.task_type, 1)

          TaskService.updateTask(taskDetails)

          /**
           * Change Date of successor task automatically....
           */
          val date_diff = ((new_planned_end_date.getTime - planned_end_date.getTime) / 1000 / 60 / 60 / 24)
          if (date_diff > 1) {

          }
          /**
           * Activity log
           */
          val act = Activity(ActivityTypes.Task.id, "Task updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), Integer.parseInt(id))
          Activity.saveLog(act)

          /**
           * Update Baseline...
           */
          TaskService.taskBasline(task, success.plan_start_date, success.plan_end_date, request.session.get("uId").get.toString())

          Redirect(routes.Task.projectTaskDetails(id))
        }
      })
  }

  /**
   * Get task details view
   */
  def taskDetails = Action { implicit request =>
    request.session.get("username").map { user =>
      val sub_task_id = request.getQueryString("id")
      val taskType = request.getQueryString("type")
      val subTaskDetail = SubTaskServices.findSubTaskDetailsBySubtaskId(sub_task_id.get)
      val milestone = TaskService.findTaskDetailsByTaskId(subTaskDetail.get.task_id)
      val project = ProjectService.findProject(milestone.get.pId)
      val baselineCount = Baseline.getBaselineCount(subTaskDetail.get.sub_task_id.get, "subtask")
      val subtaskAlloc = SubTaskServices.findSubTasksAllocationBySubTask(sub_task_id.get)
      var isSubtaskAllocated: Boolean = false;

      if (subtaskAlloc.isEmpty) {
        isSubtaskAllocated = true
      }
      var baselineAvailable: Boolean = false;
      if (baselineCount > 0) {
        baselineAvailable = true;
      }
      val documents = DocumentService.findAllDocuments(sub_task_id.get.toString(), "SUBTASK", "", "", "")
      val programs = ProgramService.findAllPrograms("", "")
      Ok(views.html.frontend.task.taskDetail(subTaskDetail, isSubtaskAllocated, baselineAvailable, project.get.baseline, programs, documents)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * Get task other details like description, start date, end date etc.
   * task_id - task id
   */
  def otherDetails(task_id: String) = Action { implicit request =>
    if (StringUtils.isNotEmpty(task_id)) {
      var team_title = ""
      val tasks = TaskService.findSubTaskListByTaskId(task_id)
      Ok(views.html.frontend.task.taskOtherDetails(task_id, tasks, team_title))
    } else {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * get task dependency list under Task
   */
  def taskDependency(ids: String) = Action { implicit request =>
    request.session.get("username").map { user =>

      val milestone = TaskService.findTaskDetailsByTaskId(Integer.parseInt(ids))
      var response = new JSONObject()
      if (!milestone.isEmpty) {

        val format = new java.text.SimpleDateFormat("yyyy-MM-dd")
        val startD = format.format(milestone.get.plan_start_date)
        val endD = format.format(milestone.get.plan_end_date)
        response.put("start", startD)
        response.put("end", endD)
      }

      Ok(response.toString())

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * Get task list for dependency selection under a project
   * project_id -  Project id
   * selected_task -  Previously selected task
   */
  def getTaskForProjects(project_id: String, selected_task: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val tasks = TaskService.findDependentTasksForProject(project_id, selected_task)
      Ok(views.html.frontend.task.manageTasks(tasks))
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * Get task list for edit dependency selection under a project
   * predessor_task - previous task selected
   * project_id - project id
   * task - current selected tasks
   */
  def getEditTaskForProjects(predessor_task: String, project_id: String, tasks: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val newtasks = TaskService.findDependentEditTasksForProject(predessor_task, project_id, tasks)

      Ok(views.html.frontend.task.manageTasks(newtasks))
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * Fill dropbox for dependent task list
   */
  def getDependentTaskList(tasks: String) = Action { implicit request =>
    var finalString = ""
    if (!StringUtils.isEmpty(tasks)) {
      val taskList = tasks.split(",")

      for (t <- taskList) {
        if (!StringUtils.isEmpty(t.trim())) {
          val task = TaskService.findTaskDetailsByTaskId(Integer.parseInt(t))
          if (!task.isEmpty) {
            finalString += "<li id='this_" + task.get.tId.get.toString() + "'>" + task.get.task_title + "</li>"
          }
        }
      }
    }
    Ok(finalString)

  }

  /**
   * get min date and max date for task...
   *
   */
  def setDependentTaskDate(tasks: String) = Action { implicit request =>
    var result = new JSONObject()
    if (!StringUtils.isEmpty(tasks)) {
      result = TaskService.getDependecyDate(tasks)
    }
    Ok(result.toString())

  }

  /**
   * Show baseline report for task...
   * id - Task id
   * object_type -  task/Sub Task
   */
  def showBaseline(id: String, object_type: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val baseline = Baseline.getBaseline(Integer.parseInt(id), object_type)
      Ok(views.html.frontend.task.baseline(baseline)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * function to calculate Earned value...
   * id -  Task id
   */
  /* def calculateEarnValue(id: String) = Action { implicit request =>

    var node = new JSONObject()
    node = EarnValueService.calculateTaskEarnValue(id)
    Ok(node.toString())

  }*/

  def calculateEarnValue(id: String) = Action { implicit request =>
    var node = new JSONObject()
    var calculos = SpiCpiCalculationsService.findIndicators(id, 0)
    for (s <- calculos) {

      node.put("EV", s.ev + " hrs")
      node.put("PV", s.pv + " hrs")
      node.put("AC", s.ac + " hrs")
      node.put("CPI", s.cpi)
      node.put("SPI", s.spi)
      node.put("ETC", s.etc + " hrs")
      node.put("EAC", s.eac + " hrs")
      node.put("PAI", s.pai + " %")
      node.put("PAE", s.pae + " %")
      node.put("HP", s.hp + " hrs")
      node.put("HA", s.ha + " hrs")
    }
    /*
    val ev = TaskService.getTaskNonCanonicalEarnVale(id).getOrElse(0.0).toDouble
    node.put("EV", ev)
    val pv = TaskService.getTaskPlannedValue(id).getOrElse(0.0).toDouble
    node.put("PV", pv)
    val ac = TaskService.getTaskActualCostNonCanonical(id).getOrElse(0.0).toDouble
    node.put("AC", ac)
    val cpi = TaskService.getTaskCPI(id).getOrElse(0.0).toDouble
    node.put("CPI", cpi)
    val spi = TaskService.getTaskSPI(id).getOrElse(0.0).toDouble
    node.put("SPI", spi)
    val etc = TaskService.getTaskETC(id).getOrElse(0.0).toDouble
    node.put("ETC", etc)
    val eac = TaskService.getTaskAEC(id).getOrElse(0.0).toDouble
    node.put("EAC", eac)
    node.put("SV", 5)
    node.put("PAE", 10)
    node.put("THP", 15)
    */
    /*
    val va = TaskService.getTaskValueAssigned(id).getOrElse(0.0).toDouble

    var avePer = ((va * va) / 100 / va) * 100

    var aviPer = ((va * va) / 100 / va) * 100

    val sv = pv.-(ev)
    node.put("AVE", sv)

    val cv = ev - ac
    node.put("AVI", cv)

    val actual = TaskService.getTaskEarnValue(id).getOrElse(0.0).toDouble
    if ((ev > 0) && (actual > 0)) {
      val spi = (ev / actual)
      var spiBg: scala.math.BigDecimal = spi
      spiBg = spiBg.setScale(2, RoundingMode.HALF_UP);
      node.put("SPI", spiBg.toString())
    } else {
      node.put("SPI", 0.0)
    }

    val HCNon = TaskService.getTaskActualCostNonCanonical(id).getOrElse(0.0).toDouble
    if ((ev > 0) && (HCNon > 0)) {
      val cpi = ev / HCNon
      var cpiBg: scala.math.BigDecimal = cpi
      cpiBg = cpiBg.setScale(2, RoundingMode.HALF_UP);
      node.put("CPI", cpiBg.toString())
    } else {
      node.put("CPI", 0.0)
    }
    if ((ev > 0) && (HCNon > 0)) {
      val av = TaskService.getTaskValueAssigned(id).getOrElse(0.0).toDouble
      val cpi = ev / HCNon
      val etc = (av - ev) / cpi
      var etcBg: scala.math.BigDecimal = etc
      etcBg = etcBg.setScale(2, RoundingMode.HALF_UP);
      node.put("ETC", etcBg.toString())
      val eac = etc + HCNon
      var eacBg: scala.math.BigDecimal = eac
      eacBg = eacBg.setScale(2, RoundingMode.HALF_UP);
      node.put("EAC", eacBg.toString())
    } else {
      node.put("ETC", 0.0)
      node.put("EAC", 0.0)
    }

    ///  ETC = (Assigned value – Non canonic earned value)/Non canonic CPI
*/
    Ok(node.toString())
  }

  /**
   * Method to display tasks list in gantt chart format on project detail page.
   */
  def taskGanttChart = Action { implicit request =>
    val project_id = request.getQueryString("id").get
    var jsonArr = TaskService.getTaskGanttChart(project_id)
    Ok(jsonArr.toString())
  }

  /**
   * Critical path gantt chart for Task
   */
  def taskCriticalPathGanttChart = Action { implicit request =>
    val project_id = request.getQueryString("id").get
    var jsonArr = TaskService.getTaskCriticalPath(project_id)
    Ok(jsonArr.toString())
  }

  def updateTaskStatus(task_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var FormattedDATE = new SimpleDateFormat("yyyy-MM-dd");
      var today = FormattedDATE.format(new Date().getTime()).toString()
      val taskStatus = TaskService.findAllTaskStatus(task_id)
      Ok(views.html.frontend.task.updateTaskStatus(ARTForms.taskStatusForm, task_id, taskStatus)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def updateStatus(task_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var FormattedDATE = new SimpleDateFormat("yyyy-MM-dd");
      var today = FormattedDATE.format(new Date().getTime()).toString()
      val taskStatus = TaskService.findAllTaskStatus(task_id)
      ARTForms.taskStatusForm.bindFromRequest.fold(
        errors => {
          BadRequest(views.html.frontend.task.updateTaskStatus(errors, task_id, taskStatus)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
        },
        task_status => {
          val lastIndex = TaskService.insertTaskStatus(task_status)
          Redirect(routes.Task.updateTaskStatus(task_id))
        })
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def deleteTask(task_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var node = new JSONObject()
      var do_delete: Boolean = true
      val timesheetList = TimesheetService.getAllTimesheetIds()
      val subtask_list = SubTaskServices.findAllocatedSubTaskIdsByTask(task_id)
      for (subtask <- subtask_list) {
        for (t <- timesheetList) {
          if (t == subtask) {
            do_delete = false
          }
        }
      }
      if (do_delete) {

        val taskDetail = TaskService.findTaskDetailsByTaskId(task_id.toInt)
        if (!taskDetail.isEmpty) {
          val pId = taskDetail.get.pId.toString()

          val tasks = TaskService.findTaskListByProjectId(pId)
          if (tasks.size > 0) {

            for (t <- tasks) {
              var current_tId = t.tId.get.toString()
              if (!t.task_depend.get.isEmpty) {
                var task_depend = t.task_depend.get
                var new_task_depend = ""
                var task_dpeend_aaray = task_depend.split(",")
                var isvalid = false
                //println(generic_id + "---------generic_id" + task_depend+"---"+task_dpeend_aaray.size)
                for (ts <- task_dpeend_aaray) {
                  var c_ts = StringUtils.trim(ts)
                  if (StringUtils.equals(c_ts, task_id.toString())) {
                    isvalid = true
                  } else {
                    if (StringUtils.isEmpty(new_task_depend)) {
                      new_task_depend = c_ts
                    } else {
                      new_task_depend = new_task_depend + "," + c_ts
                    }
                  }

                }
                if (isvalid) {
                  
                  TaskService.updateTaskDependecy(current_tId, new_task_depend)
                }
              }

            }
          }

        }
        TaskService.DeleteTask(Integer.parseInt(task_id))

        /**
         * Activity log
         */
        val act = Activity(ActivityTypes.Task.id, "Task deleted by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), task_id.toInt)
        Activity.saveLog(act)
        node.put("status", "Success")
      } else {
        node.put("status", "Fail")
        node.put("message", "Existen horas imputadas en esta tarea, no se puede eliminar")
      }
      Ok(node.toString())
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def getTaskSpiGraph(task_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val node = new JSONObject()
      val spi_date_map = new java.util.LinkedHashMap[Long, Double];
      val cpi_date_map = new java.util.LinkedHashMap[Long, Double];
      val espi_date_map = new java.util.LinkedHashMap[Long, Double];
      val ecpi_date_map = new java.util.LinkedHashMap[Long, Double];
      val subtask_id_map = new java.util.LinkedHashMap[Long, Int];

      val actual_cost_map = new java.util.LinkedHashMap[Long, Double];
      val earn_value_map = new java.util.LinkedHashMap[Long, Double];
      val planned_value_map = new java.util.LinkedHashMap[Long, Double];

      val e_earn_value_map = new java.util.LinkedHashMap[Long, Double];
      val inc_planned_value_map = new java.util.LinkedHashMap[Long, Double];

      var spicpiCal = services.EarnValueService.getEarnValue(task_id, "Task");
      if (spicpiCal.size != 0) {
        for (s <- spicpiCal) {

          var formattedDate: SimpleDateFormat = new SimpleDateFormat("yyyy-MM-dd")
          if (!s.spi.isEmpty) {

            spi_date_map.put(formattedDate.parse(s.fecha.toString()).getTime(), s.spi.get)
            cpi_date_map.put(formattedDate.parse(s.fecha.toString()).getTime(), s.cpi.get)
            ecpi_date_map.put(formattedDate.parse(s.fecha.toString()).getTime(), s.e_cpi.get)
            espi_date_map.put(formattedDate.parse(s.fecha.toString()).getTime(), s.e_spi.get)
            actual_cost_map.put(formattedDate.parse(s.fecha.toString()).getTime(), s.ac.get)
            e_earn_value_map.put(formattedDate.parse(s.fecha.toString()).getTime(), s.e_ev.get)
            earn_value_map.put(formattedDate.parse(s.fecha.toString()).getTime(), s.ev.get)
            planned_value_map.put(formattedDate.parse(s.fecha.toString()).getTime(), s.pv.get)
            inc_planned_value_map.put(formattedDate.parse(s.fecha.toString()).getTime(), s.pv_inc.get)

            subtask_id_map.put(formattedDate.parse(s.fecha.toString()).getTime(), task_id.toInt);
          }

        }
      } else {

      }

      node.put("spi_date_map", spi_date_map)
      node.put("cpi_date_map", cpi_date_map)
      node.put("ecpi_date_map", ecpi_date_map)
      node.put("espi_date_map", espi_date_map)
      node.put("actual_cost_map", actual_cost_map)
      node.put("earn_value_map", earn_value_map)
      node.put("e_earn_value_map", e_earn_value_map)
      node.put("planned_value_map", planned_value_map)
      node.put("inc_planned_value_map", inc_planned_value_map)
      node.put("subtask_id", subtask_id_map);

      /*     val EV_list = services.EarnValueService.getGraphCalculationForProgram(subtask_id)
      for (ev_obj <- EV_list) {
        var formattedDate: SimpleDateFormat = new SimpleDateFormat("yyyy-MM-dd")
        var date1 = formattedDate.format(ev_obj.recorded_date)
      }*/
      Ok(node.toString())
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def updateSubTaskDates(task_id: String, end_date: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var result = "fail"
      var node = new JSONObject()
      if (!StringUtils.isEmpty(task_id) && !StringUtils.isEmpty(end_date)) {
        val sub_tasks = SubTaskServices.findSubTasksByTask(task_id)
        if (sub_tasks.size > 0) {
          var FormattedDATE = new SimpleDateFormat("yyyy-MM-dd");
          var FormattedDATE2 = new SimpleDateFormat("dd-MM-yyyy");
          var endDate = FormattedDATE2.parse(end_date)
          for (s <- sub_tasks) {
            if (s.plan_end_date.after(endDate)) {
              //println(s.plan_end_date + "----------" + FormattedDATE.format(endDate))
              //println(s.plan_start_date + "----------" + FormattedDATE.format(endDate))
              if (s.plan_start_date.before(endDate)) {
                SubTaskServices.updateSubTaskPlannedDate(s.sub_task_id.get.toString(), FormattedDATE.format(endDate))
                result = "success"
                node.put("status", "success")
              } else {
                node.put("status", "fail")
                node.put("Message", "Sub Task start date should be greater than sub task end date.")

              }

            }
          }

        }

      }
      Ok(node.toString())
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def updateSubTaskStartDates(task_id: String, start_date: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var result = "fail"
      var node = new JSONObject()
      //println(task_id + "=====" + start_date + "====" + (!StringUtils.isEmpty(task_id) && !StringUtils.isEmpty(start_date)))
      if (!StringUtils.isEmpty(task_id) && !StringUtils.isEmpty(start_date)) {
        val sub_tasks = SubTaskServices.findSubTasksByTask(task_id)
        //println(sub_tasks.size)
        if (sub_tasks.size > 0) {
          var FormattedDATE = new SimpleDateFormat("yyyy-MM-dd");
          var FormattedDATE2 = new SimpleDateFormat("dd-MM-yyyy");
          var endDate = FormattedDATE2.parse(start_date)

          for (s <- sub_tasks) {
            var compare_date = FormattedDATE2.parse(FormattedDATE2.format(s.plan_end_date))
            if (compare_date.getTime >= endDate.getTime) {
              if (compare_date.getTime >= endDate.getTime) {
                SubTaskServices.updateSubTaskPlannedStartDate(s.sub_task_id.get.toString(), FormattedDATE.format(endDate))
                result = "success"
                node.put("status", "success")
              } else {
                node.put("status", "fail")
                node.put("Message", "Sub Tarea fecha de inicio prevista debe ser inferior a sub misión prevista fecha de finalización.")

              }

            }
          }

        }

      }
      Ok(node.toString())
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }
}