package controllers.Frontend

import java.lang.Boolean
import java.util.Date
import org.apache.commons.lang3.StringUtils
import org.json.JSONArray
import org.json.JSONObject
import anorm.NotAssigned
import art_forms.ARTForms
import models.Activity
import models.ActivityTypes
import models.Baseline
import models.SubTaskAllocation
import models.SubTaskMaster
import models.UserSetting
import play.api.mvc.Action
import play.api.mvc.Controller
import services.DepartmentService
import services.ProjectService
import services.SubTaskServices
import services.TaskService
import services.UserService
import services.DocumentService
import scala.collection.mutable.HashMap
import java.text.SimpleDateFormat
import models.SubTasks
import services.ProgramService
import services.ServiceCatalogueService
import services.UserRoleService
import services.ProgramMemberService
import models.ProgramMembersExternal
import services.ProgramMemberExternalService
import models.SubTaskAllocationExternal
import services.RiskService
import services.TaskDesciplineService
import services.UserProfileServices

object SubTask extends Controller {

  var username = ""
  var mode = ""
  var project_id = ""
  var title = ""
  var milestone_code = ""
  var country = "chile"
  var state = "chile"
  var city = "chile"
  var description = ""
  var plan_time = -1
  var milestone_status = -1
  var owner = -1

  /**
   * Create new sub task under a Task
   * id - Task id
   */
  def newSubTask(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val user_id = request.session.get("uId").get
      val utype = Integer.parseInt(request.session.get("utype").get.toString())
      username = request.session.get("username").get.toString()

      val milestone = TaskService.findTaskDetailsByTaskId(Integer.parseInt(id))
      val projectDetails = ProjectService.findProject(milestone.get.pId)
      val programDetails = ProgramService.findProgramMasterDetailsById(projectDetails.get.program.toString)

      var catalougeMap = new java.util.HashMap[String, String]()
      var catalaogues = ServiceCatalogueService.getServiceCatalogue
      for (c <- catalaogues) {
        catalougeMap.put(c.id.get.toString, c.service_name);
      }

      var disciplineMap = new java.util.LinkedHashMap[String, String]();
      for (d <- TaskDesciplineService.findAllTaskDesciplineList) {
        disciplineMap.put(d.id.get.toString, d.task_discipline.toString())
      }
      Ok(views.html.frontend.subTask.addSubTask(milestone, projectDetails, programDetails, ARTForms.subTaskForm, catalougeMap, disciplineMap)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * Save sub task details under a task
   * id -  Task id
   */
  def saveSubTask(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val user_id = request.session.get("uId").get
      val utype = Integer.parseInt(request.session.get("utype").get.toString())
      var catalougeMap = new java.util.HashMap[String, String]()
      var catalaogues = ServiceCatalogueService.getServiceCatalogue
      for (c <- catalaogues) {
        catalougeMap.put(c.id.get.toString, c.service_name);
      }
      var disciplineMap = new java.util.LinkedHashMap[String, String]();
      for (d <- TaskDesciplineService.findAllTaskDesciplineList) {
        disciplineMap.put(d.id.get.toString, d.task_discipline.toString())
      }
      username = request.session.get("username").get.toString()

      ARTForms.subTaskForm.bindFromRequest.fold(
        hasErrors => {
          val _id = Integer.parseInt(hasErrors.data.get("task_id").get.toString())
          val milestone = TaskService.findTaskDetailsByTaskId(_id)
          val projectDetails = ProjectService.findProject(milestone.get.pId)
          val programDetails = ProgramService.findProgramMasterDetailsById(projectDetails.get.program.toString)
          BadRequest(views.html.frontend.subTask.addSubTask(milestone, projectDetails, programDetails, hasErrors, catalougeMap, disciplineMap)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
        },
        success => {
          val id = Integer.parseInt(success.task_id.toString())
          val milestone = TaskService.findTaskDetailsByTaskId(id)
          val projectDetails = ProjectService.findProject(milestone.get.pId)

          val theForm = SubTaskServices.validateForm(ARTForms.subTaskForm.fill(success), milestone, "")
          if (theForm.hasErrors) {
            val programDetails = ProgramService.findProgramMasterDetailsById(projectDetails.get.program.toString)
            var comp_per_task: Double = 0
            if (!milestone.get.completion_percentage.isEmpty) {
              comp_per_task = milestone.get.completion_percentage.get.toDouble
            }
            BadRequest(views.html.frontend.subTask.addSubTask(milestone, projectDetails, programDetails, theForm, catalougeMap, disciplineMap))

          } else {
            val lastId = SubTaskServices.insertSubTask(success);

            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.SubTask.id, "New sub task created by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), lastId.toInt)
            Activity.saveLog(act)

            TaskService.updateTaskStatus(lastId.toString)
            val id = success.task_id
            Redirect(routes.Task.projectTaskDetails(id.toString() + "?#" + lastId))
          }
        })
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * View to edit sub task details
   * id - sub task id
   */
  def editSubTask(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val user_id = request.session.get("uId").get
      val utype = Integer.parseInt(request.session.get("utype").get.toString())
      username = request.session.get("username").get.toString()
      val subTask = SubTaskServices.findSubTaskDetailsBySubtaskId(id)
      val milestone = TaskService.findTaskDetailsByTaskId(subTask.get.task_id)
      val projectDetails = ProjectService.findProject(milestone.get.pId)
      val programDetails = ProgramService.findProgramMasterDetailsById(projectDetails.get.program.toString)
      val obj = SubTaskMaster(None, subTask.get.task_id, subTask.get.task, subTask.get.task_Details, subTask.get.plan_start_date, subTask.get.plan_end_date, subTask.get.actual_start_date, subTask.get.actual_end_date, subTask.get.actual_end_date_final, subTask.get.added_date, subTask.get.status, subTask.get.completion_percentage, subTask.get.task_complete, subTask.get.sub_task_depend, subTask.get.dependencies_type, Option(subTask.get.catalogue_id))
      var catalougeMap = new java.util.HashMap[String, String]()
      var catalaogues = ServiceCatalogueService.getServiceCatalogue
      for (c <- catalaogues) {
        catalougeMap.put(c.id.get.toString, c.service_name);
      }
      val baselineCount = Baseline.getBaselineCount(subTask.get.sub_task_id.get, "subtask")
      var baselineAvailable: Boolean = false;
      if (baselineCount > 0) {
        baselineAvailable = true;
      }
      var disciplineMap = new java.util.LinkedHashMap[String, String]();
      for (d <- TaskDesciplineService.findAllTaskDesciplineList) {
        disciplineMap.put(d.id.get.toString, d.task_discipline.toString())
      }
      ARTForms.subTaskForm.fill(obj);
      Ok(views.html.frontend.subTask.editSubTask(id, milestone, projectDetails, programDetails, ARTForms.subTaskForm.fill(obj), baselineAvailable, projectDetails.get.baseline, catalougeMap, disciplineMap)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }

  }

    /*
    * Save Advance Rate
    */
    def saveAdvanceRate(sub_task_id: String, advance_rate: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val employeeid = request.session.get("uId").get
      println("sub_task_id:" + sub_task_id)
      println("advance_rate:" + advance_rate)
      //Ok("OK")
      
      SubTaskServices.updateSubTaskAdvanceRate(sub_task_id,advance_rate)
      
      
      val employee = UserService.findUserDetails(Integer.parseInt(employeeid.toString()))
      val employeeOffice = UserService.findUserOfficeDetails(Integer.parseInt(employeeid.toString()))
      val programs = UserService.findProgramListForUser(employeeid.toString())
      val pUserProjectList = null // UserService.findProjectsByUser(Integer.parseInt(employee.get.uid.get.toString()))
      val alerts = RiskService.findUserAlertsIds(employeeid.toString())
      val availability = UserProfileServices.findAvailability(Integer.parseInt(employeeid.toString()))
      val program_task=ProgramService.programas_sin_avance_en_tareas(employeeid.toString())
      // EarnValueService.calculateSubTaskEarnValue()

      Ok(views.html.frontend.user.employee(employee, employeeOffice, pUserProjectList, ARTForms.imgCropForm, programs, alerts, availability, program_task)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      
      
      

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }
      
      
  /**
   * Update sub task details
   * id - SUb task id
   */
  def updateSubTask(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val user_id = request.session.get("uId").get
      val utype = Integer.parseInt(request.session.get("utype").get.toString())
      username = request.session.get("username").get.toString()
      val subTask = SubTaskServices.findSubTaskDetailsBySubtaskId(id)

      val milestone = TaskService.findTaskDetailsByTaskId(subTask.get.task_id)
      val projectDetails = ProjectService.findProject(milestone.get.pId)

      //val obj = SubTaskMaster(None, subTask.get.task_id, subTask.get.task, subTask.get.task_Details, subTask.get.plan_start_date, subTask.get.plan_end_date, subTask.get.actual_start_date, subTask.get.actual_end_date, subTask.get.added_date, subTask.get.status, subTask.get.completion_percentage, subTask.get.task_complete, subTask.get.sub_task_depend, subTask.get.dependencies_type, subTask.get.catalogue_id)

      val baselineCount = Baseline.getBaselineCount(subTask.get.sub_task_id.get, "subtask")
      var baselineAvailable: Boolean = false;
      if (baselineCount > 0) {
        baselineAvailable = true;
      }
      var catalougeMap = new java.util.HashMap[String, String]()
      var catalaogues = ServiceCatalogueService.getServiceCatalogue
      for (c <- catalaogues) {
        catalougeMap.put(c.id.get.toString, c.service_name);
      }

      var disciplineMap = new java.util.LinkedHashMap[String, String]();
      for (d <- TaskDesciplineService.findAllTaskDesciplineList) {
        disciplineMap.put(d.id.get.toString, d.task_discipline.toString())
      }
      ARTForms.subTaskForm.bindFromRequest.fold(
        hasErrors => {
          //  val task_id = hasErrors.data.get("sub_task_id").get.toString()

          val subTask = SubTaskServices.findSubTaskDetailsBySubtaskId(id)

          val milestone = TaskService.findTaskDetailsByTaskId(subTask.get.task_id)
          val projectDetails = ProjectService.findProject(milestone.get.pId)
          val programDetails = ProgramService.findProgramMasterDetailsById(projectDetails.get.program.toString)

          BadRequest(views.html.frontend.subTask.editSubTask(hasErrors.data.get("sub_task_id").get.toString(), milestone, projectDetails, programDetails, hasErrors, baselineAvailable, projectDetails.get.baseline, catalougeMap, disciplineMap))
        },
        success => {

          val theForm = SubTaskServices.validateForm(ARTForms.subTaskForm.fill(success), milestone, id)
          if (theForm.hasErrors) {
            val subTask = SubTaskServices.findSubTaskDetailsBySubtaskId(id)
            //   val subTask = SubTaskServices.findSubTaskDetailsBySubtaskId(task_id)
            val milestone = TaskService.findTaskDetailsByTaskId(subTask.get.task_id)
            val projectDetails = ProjectService.findProject(milestone.get.pId)
            val programDetails = ProgramService.findProgramMasterDetailsById(projectDetails.get.program.toString)
            BadRequest(views.html.frontend.subTask.editSubTask(theForm.data.get("sub_task_id").get.toString(), milestone, projectDetails, programDetails, theForm, baselineAvailable, projectDetails.get.baseline, catalougeMap, disciplineMap))
          } else {
            val subtask = SubTaskServices.findSubTasksBySubTaskId(success.sub_task_id.get.toString())
            var dates_changed: Boolean = false;
            var changeState = new JSONArray();
            val format = new java.text.SimpleDateFormat("dd-MM-yyyy")
            //println("form start date changed " + format.format(success.plan_start_date.getTime()))
            //println("db start date changed " + format.format(milestone.get.plan_start_date.getTime()))

            if (!format.format(success.plan_start_date.getTime()).equals(format.format(subtask.get.plan_start_date.getTime()))) {
              //println("start date changed ")
              dates_changed = true;
              var changeStateObject = new JSONObject();
              changeStateObject.put("fieldName", "Planned Start Date");
              changeStateObject.put("org_value", format.format(subtask.get.plan_start_date));
              changeStateObject.put("new_value", format.format(success.plan_start_date));
              changeState.put(changeStateObject);
            }
            if (!format.format(success.plan_end_date.getTime()).equals(format.format(subtask.get.plan_end_date.getTime()))) {
              //println("end date changed")
              dates_changed = true;
              var changeStateObject = new JSONObject();
              changeStateObject.put("fieldName", "Palnned End Date");
              changeStateObject.put("org_value", format.format(subtask.get.plan_end_date));
              changeStateObject.put("new_value", format.format(success.plan_end_date));
              changeState.put(changeStateObject);
            }

            if (dates_changed) {
              val baseline = Baseline(None, changeState.toString(), Integer.parseInt(request.session.get("uId").get.toString()), new Date(), "subtask", success.sub_task_id.get.toInt);
              //println("baseline changed")
              Baseline.insert(baseline);
            }
            var completion_percentage = 0.0;
            if (!success.completion_percentage.isEmpty) {
              completion_percentage = success.completion_percentage.get;
            }

            var actual_end_date: Date = null;
            var actual_end_date_final: Date = null;
            if (completion_percentage >= 100) {
              actual_end_date = new Date();
              actual_end_date_final = new Date();
            }

            //           if(completion_percentage == 1000.00){
            //              SubTaskServices.updateSubTaskActualDate(id)
            //            }

            if (success.task_complete == 1) {
              val completion_percentage = 100.00
              val sub_task_detail = SubTaskMaster(Option(success.sub_task_id.get), success.task_id, success.title, success.description,
                success.plan_start_date, success.plan_end_date, success.actual_start_date, Option(actual_end_date), Option(actual_end_date_final), success.added_date, success.status, Option(completion_percentage), success.task_complete, success.sub_task_depend, success.dependencies_type, success.catalogue_id)
              SubTaskServices.updateSubTask(sub_task_detail)
            } else {

              val sub_task_detail = SubTaskMaster(Option(success.sub_task_id.get), success.task_id, success.title, success.description,
                success.plan_start_date, success.plan_end_date, success.actual_start_date, Option(actual_end_date), Option(actual_end_date_final), success.added_date, success.status, Option(completion_percentage), success.task_complete, success.sub_task_depend, success.dependencies_type, success.catalogue_id)
              SubTaskServices.updateSubTask(sub_task_detail)

            }

            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.SubTask.id, "Sub task updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), Integer.parseInt(id))
            Activity.saveLog(act)

            //println(subtask.get.task_id.get.toString());
            TaskService.updateTaskStatus(subtask.get.sub_task_id.get.toString())
            Redirect(routes.Task.projectTaskDetails(subTask.get.task_id.toString() + "?#" + subTask.get.sub_task_id)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
          }

        })

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def updateActualEndDateFinal(id: String, date_string: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var node = new JSONObject()
      if (!StringUtils.isEmpty(id) && !StringUtils.isEmpty(date_string)) {
        val df = new java.text.SimpleDateFormat("dd-MM-yyyy")

        val sub_task = SubTaskServices.findSubTaskDetailsBySubtaskId(id)
        if (!sub_task.isEmpty) {
          SubTaskServices.udpateActualEndDate(id, date_string.trim())
          node.put("status", "Success")
        } else {
          node.put("status", "Fail");
          node.put("message", "Please enter valid date.");
        }
      } else {
        node.put("status", "Fail");
        node.put("message", "Please enter valid date.");
      }

      Ok(node.toString())
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * Assign sub task to user
   * id - sub task id
   */
  def assignSubTask(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>

      val user_id = request.session.get("uId").get
      val utype = Integer.parseInt(request.session.get("utype").get.toString())
      username = request.session.get("username").get.toString()
      val sub_task = SubTaskServices.findSubTasksBySubTaskId(id)
      val task = TaskService.findTaskDetailsByTaskId(sub_task.get.task_id.toInt)
      val d1 = sub_task.get.plan_start_date.getTime()
      val d2 = sub_task.get.plan_end_date.getTime()
      var d3 = (d2 - d1) / (1000 * 60 * 60 * 24)
      if (d3 >= 0) {
        d3 = ((d3 + 1) * 12)
      }

      val project = ProjectService.findProject(task.get.pId)
      val users = UserService.findAllUsers
      val taskusers = UserService.findAllUsersForSubTask(id)
      val departments = DepartmentService.findAllDepartmentS
      var roles = UserRoleService.findAllUserRoles
      var userList = ProgramMemberService.findAllProgramMembers(project.get.program.toString);
      for (u <- userList) {

      }
      Ok(views.html.frontend.subTask.assignSubTask(sub_task, task, project, userList, roles, d3))
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }

  }

  /**
   * Save sub task allocation for a user
   *
   */
  def saveSubTaskAllocation() = Action { implicit request =>
    var node = new JSONObject()
    request.session.get("username").map { user =>
      mode = request.body.asFormUrlEncoded.get("mode")(0).trim()
      if (StringUtils.equals(mode, "add")) {
        val task_id = Integer.parseInt(request.body.asFormUrlEncoded.get("task_id")(0).trim())
        val project_id = Integer.parseInt(request.body.asFormUrlEncoded.get("project_id")(0).trim())
        val estimated_time = request.body.asFormUrlEncoded.get("estimated_time")(0).trim().toDouble
        val sub_task_id = request.body.asFormUrlEncoded.get("sub_task_id")(0).trim()
        node.put("lastestId", sub_task_id)
        val user_Id = request.body.asFormUrlEncoded.get("user")(0).trim()
        val allocations = SubTaskServices.getAllocationObjIfUserAlreadyAssignedSubtask(sub_task_id, user_Id)

        var last: Long = 0
        var total_estimated_time = 0.0
        if (!allocations.isEmpty) {
          for (allocation <- allocations) {
            total_estimated_time += allocation.estimated_time
          }
          val allocation_id = allocations.apply(0).id
          total_estimated_time += estimated_time
          SubTaskServices.updateSubTaskAllocationByIdAndEstimationTime(allocation_id.get, total_estimated_time)
          node.put("status", "Success")
        } else {
          val subTaskDetails = SubTaskAllocation(None, sub_task_id.toInt, task_id, project_id, user_Id.toInt, estimated_time, 0)
          last = SubTaskServices.saveSubTaskAllocation(subTaskDetails)
          node.put("status", "Success")
        }

        /**
         * Activity log
         */
        val act = Activity(ActivityTypes.Allocation.id, "Sub task allocated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), last.toInt)
        Activity.saveLog(act)

        /**
         * This will update project to User...
         */
        val pId = Integer.parseInt(ProjectService.findProject(project_id).get.pId.get.toString())
        var isExist = UserService.checkUserSettingbyuIdandpId(user_Id.toInt, pId)
        if (isExist) {
          val projectmapping = UserSetting(user_Id.toInt, pId, 1)
          UserService.saveUserSetting(projectmapping)

        }
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
    Ok(node.toString())
  }

  /**
   * Save sub task allocation for a user
   *
   */
  def saveSubTaskAllocationExternal() = Action { implicit request =>
    request.session.get("username").map { user =>
      mode = request.body.asFormUrlEncoded.get("mode")(0).trim()
      if (StringUtils.equals(mode, "add")) {
        val sub_task_id = Integer.parseInt(request.body.asFormUrlEncoded.get("sub_task_id")(0).trim())
        val task_id = Integer.parseInt(request.body.asFormUrlEncoded.get("task_id")(0).trim())
        val project_id = Integer.parseInt(request.body.asFormUrlEncoded.get("project_id")(0).trim())
        val user_Id = Integer.parseInt(request.body.asFormUrlEncoded.get("user")(0).trim())
        val estimated_time = request.body.asFormUrlEncoded.get("estimated_time")(0).trim().toDouble

        val allocations = SubTaskServices.checkExternalUserAlreadyAssignedSubtask(sub_task_id.toString(), user_Id.toString())

        var last: Long = 0
        var total_estimated_time = 0.0
        if (!allocations.isEmpty) {
          for (allocation <- allocations) {
            total_estimated_time += allocation.estimated_time
          }
          val allocation_id = allocations.apply(0).id
          total_estimated_time += estimated_time

          //println(total_estimated_time + "----")
          SubTaskServices.updateExternalSubTaskAllocationByIdAndEstimationTime(allocation_id.get, total_estimated_time)
        } else {
          val subTaskDetails = SubTaskAllocationExternal(None, sub_task_id, task_id, project_id, user_Id, estimated_time, 0, 0)
          val last = SubTaskServices.saveSubTaskAllocationExternal(subTaskDetails)
        }

        /**
         * Activity log
         */
        val act = Activity(ActivityTypes.Allocation.id, "Sub task external allocated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), last.toInt)
        Activity.saveLog(act)

        /**
         * This will update project to User...
         */
        //        val pId = Integer.parseInt(ProjectService.findProject(project_id).get.pId.toString())
        //        var isExist = UserService.checkUserSettingbyuIdandpId(user_Id, pId)
        //        if (isExist) {
        //          val projectmapping = UserSetting(user_Id, pId, 1)
        //          //UserService.saveUserSetting(projectmapping)
        //
        //        }
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
    Ok("Success")
  }

  /**
   * Manage sub task dependency for a task
   * task_id : Task id
   * selected_sub_task - list of selected sub tasks
   */
  def getSubTasksForTask(task_id: String, selected_sub_task: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val subtasks = SubTaskServices.findDependentSubTasksForTask(task_id, selected_sub_task)
      val taskDetails = TaskService.findTaskDetailsByTaskId(Integer.parseInt(task_id))
      val project_id = taskDetails.get.pId
      val project = ProjectService.findProject(project_id)
      val program = project.get.program

      var projectMap = new HashMap[String, String]()
      var taskMap = new HashMap[String, String]()
      var subTaskMap = new HashMap[String, String]()

      val projects = ProjectService.findProjectListForProgram(program.toString)
      for (p <- projects) {
        projectMap.put(p.pId.get.toString, p.project_name)
        val tasks = TaskService.findTaskListByProjectId(p.pId.get.toString)
        for (t <- tasks) {
          taskMap.put(t.tId.get.toString, t.task_title)
          val sub_tasks = SubTaskServices.findSubTasksByTask(t.tId.get.toString)
          for (s <- sub_tasks) {
            subTaskMap.put(s.sub_task_id.get.toString, s.task)
          }
        }
      }

      Ok(views.html.frontend.subTask.manageSubTasks(selected_sub_task, task_id, subtasks, projectMap, taskMap, subTaskMap))
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def getEditSubTasksForTask(currentSub: String, task_id: String, sub_tasks: String) = Action { implicit request =>
    request.session.get("username").map { user =>

      val taskDetails = TaskService.findTaskDetailsByTaskId(Integer.parseInt(task_id))
      val project_id = taskDetails.get.pId
      val project = ProjectService.findProject(project_id)
      val program = project.get.program

      var projectMap = new HashMap[String, String]()
      var taskMap = new HashMap[String, String]()
      var subTaskMap = new HashMap[String, String]()

      val projects = ProjectService.findProjectListForProgram(program.toString)
      for (p <- projects) {
        projectMap.put(p.pId.get.toString, p.project_name)
        val tasks = TaskService.findTaskListByProjectId(p.pId.get.toString)
        for (t <- tasks) {
          taskMap.put(t.tId.get.toString, t.task_title)
          val sub_tasks = SubTaskServices.findSubTasksByTask(t.tId.get.toString)
          for (s <- sub_tasks) {
            subTaskMap.put(s.sub_task_id.get.toString, s.task)
          }
        }
      }

      val newtasks = SubTaskServices.findDependentEditSubTasksForTask(currentSub, task_id, sub_tasks)

      Ok(views.html.frontend.subTask.manageSubTasks(currentSub, task_id, newtasks, projectMap, taskMap, subTaskMap))
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * Get dependent sub task list for a sub task
   */
  def getDependentSubTaskList(sub_tasks: String) = Action { implicit request =>
    var finalString = ""
    if (!StringUtils.isEmpty(sub_tasks)) {
      val subtaskList = sub_tasks.split(",")

      for (t <- subtaskList) {
        if (!StringUtils.isEmpty(t.trim())) {
          val task = SubTaskServices.findSubTasksBySubTaskId(t)
          if (!task.isEmpty) {
            finalString += "<li>" + task.get.title + "</li>"
          }
        }
      }
    }
    Ok(finalString)

  }

  /**
   * Get sub task dependent dates for sub tasks
   * sub_tasks -  sub tasks with "," seperated
   */
  def setDependentSubTaskDate(sub_tasks: String) = Action { implicit request =>
    var node = new JSONObject()
    if (!StringUtils.isEmpty(sub_tasks)) {
      node = SubTaskServices.getSubTaskDependencyDates(sub_tasks)
    }
    Ok(node.toString())
  }

  /**
   * Get allocation list of users for sub task
   * id -  Sub task id
   *
   */
  def allocationList(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>

      val allocationList = SubTaskServices.findSubTasksAllocationBySubTask(id)
      val allocationListExternal = SubTaskServices.findSubTasksAllocationExternalBySubTask(id);
      Ok(views.html.frontend.subTask.allocationList(allocationList, allocationListExternal))
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * Update allocation hours
   * Currently not in use
   */
  def updateHours(id: String, hours: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val allocation = SubTaskServices.findSubTasksAllocationById(id)
      val allocationDetails = SubTaskAllocation(allocation.get.id, allocation.get.task_id, allocation.get.task_id, allocation.get.pId, allocation.get.user_id, Integer.parseInt(hours), allocation.get.status)
      SubTaskServices.updateSubTaskAllocation(allocationDetails)
      Ok("Success")
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * Delete sub task allocation
   * id -  sub task id
   * Precondition - If there is not sub task entry in the timesheet then we can delete sub task
   */
  def deleteAllocation(id: String) = Action { implicit request =>
    var response = new JSONObject()
    val allocation = SubTaskServices.findSubTasksAllocationById(id);
    if (!allocation.isEmpty) {
      SubTaskServices.DeleteAllocation(id)
      /**
       * Activity log
       */
      val act = Activity(ActivityTypes.Allocation.id, "Sub task Allocation deleted by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), Integer.parseInt(id))
      Activity.saveLog(act)
      response.put("status", "Success")

    } else {
      response.put("status", "Fail")
      response.put("message", "Records not available.")
    }
    Ok(response.toString())
  }

  def deleteExternalAllocation(id: String) = Action { implicit request =>
    var response = new JSONObject()
    val allocation = SubTaskServices.findSubTasksAllocationExternalById(id);
    if (!allocation.isEmpty) {
      SubTaskServices.deleteExternalAllocation(id)
      /**
       * Activity log
       */
      val act = Activity(ActivityTypes.Allocation.id, "Sub task external  Allocationdeleted by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), Integer.parseInt(id))
      Activity.saveLog(act)
      response.put("status", "Success")

    } else {
      response.put("status", "Fail")
      response.put("message", "Records not available.")
    }
    Ok(response.toString())
  }

  /**
   * Gantt chart for sub task under a Task
   */
  def subTaskGanttChart = Action { implicit request =>
    val taskId = request.getQueryString("id").get
    var jsonArr = SubTaskServices.getSubTaskGanttChart(taskId)
    Ok(jsonArr.toString())
  }

  /**
   * Critical path gantt chart under a Task
   */
  def subTaskCriticalPathGanttChart = Action { implicit request =>
    val taskId = request.getQueryString("id")
    var jsonArr = SubTaskServices.getCriticalPathSubTasks(taskId.get)
    Ok(jsonArr.toString())
  }

  def validateSubTaskDate(task: String, sub_task: String, current_sub_task: String, selected_sub_tasks: String) = Action { implicit request =>
    var response = new JSONObject()
    if (StringUtils.isNotEmpty(task) && StringUtils.isNotEmpty(sub_task)) {
      if (!StringUtils.equals(current_sub_task, sub_task)) {
        val subtaskList = selected_sub_tasks.split(",")
        var isValid = true
        for (t <- subtaskList) {

          if (!StringUtils.isEmpty(t.trim())) {
            if (StringUtils.equals(t.trim(), sub_task)) {
              isValid = false
            }
          }
        }
        if (isValid) {
          //println(current_sub_task +" "+task+ " "+sub_task)
          val currentSubTaskDetails = SubTaskServices.findSubTaskDetailsBySubtaskId(current_sub_task)
          val taskDetails = TaskService.findTaskDetailsByTaskId(Integer.parseInt(task))
          val subTaskDetails = SubTaskServices.findSubTaskDetailsBySubtaskId(sub_task)
          val s_date = subTaskDetails.get.plan_start_date.getTime()
          val ts_date = taskDetails.get.plan_start_date.getTime()
          val ts_e_date = taskDetails.get.plan_end_date.getTime()
          /*if (taskDetails.get.plan_start_date.getTime() <= s_date && taskDetails.get.plan_end_date.getTime() >= s_date) {
            response.put("status", "Success")

          } else {
            response.put("status", "Fail")
            response.put("message", "This sub task not in valid date range, you can not select this sub task for dependency.")
          }*/
          response.put("status", "Success")
        } else {
          response.put("status", "Fail")
          response.put("message", "This sub task is already in selected list")
        }

      } else {
        response.put("status", "Fail")
        response.put("message", "Please select another sub task.")
      }

    }
    Ok(response.toString())
  }

  def getDependencySubtaskListByTask(taskId: String) = Action { implicit request =>
    var finalString = ""
    val uId = request.session.get("uId").get
    var subtasks: Seq[SubTasks] = null;
    if (StringUtils.isNotBlank(taskId)) {
      subtasks = SubTaskServices.findSubTasksByTask(taskId);
    } else {
      subtasks = SubTaskServices.findAllSubTasks
    }
    var pr_name = ""
    //finalString = "<option value='' class='blank'>--- Choose Sub Task ---</option>"
    for (subtask <- subtasks) {
      if (subtask.task.length() > 50) {
        pr_name = subtask.task.substring(0, 50) + ".."
      } else {
        pr_name = subtask.task
      }
      finalString = finalString + "<span id='multiselect_" + subtask.sub_task_id.get + "' class='multiselect'><label><input type='checkbox' value='" + subtask.sub_task_id + "' name='task_depend[]'>" + pr_name + "</label></span>"
      //finalString = finalString + " <option value='" + subtask.sub_task_id + "'>" + pr_name + "</option>"
    }

    //println(finalString+"-------")
    Ok(finalString)
  }

  def updateSubTaskStatus(sub_task_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var FormattedDATE = new SimpleDateFormat("yyyy-MM-dd");
      var today = FormattedDATE.format(new Date().getTime()).toString()
      val subTaskStatus=SubTaskServices.findAllSubTaskStatus(sub_task_id)
      var task_id = ""
      val sub_task = SubTaskServices.findSubTaskDetailsBySubtaskId(sub_task_id)
      if (!sub_task.isEmpty) {
        task_id = sub_task.get.task_id.toString
      }
      Ok(views.html.frontend.subTask.updateSubTaskStatus(ARTForms.subTaskStatusForm, sub_task_id, task_id, subTaskStatus)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def updateStatus(sub_task_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var FormattedDATE = new SimpleDateFormat("yyyy-MM-dd");
      var today = FormattedDATE.format(new Date().getTime()).toString()
      val subTaskStatus=SubTaskServices.findAllSubTaskStatus(sub_task_id)
      var task_id = ""
      val sub_task = SubTaskServices.findSubTaskDetailsBySubtaskId(sub_task_id)
      if (!sub_task.isEmpty) {
        task_id = sub_task.get.task_id.toString
      }
      ARTForms.subTaskStatusForm.bindFromRequest.fold(
        errors => {
          println(errors.errors);
          BadRequest(views.html.frontend.subTask.updateSubTaskStatus(errors, sub_task_id, task_id, subTaskStatus)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
        },
        sub_task_status => {
          val status = sub_task_status.status

          val lastIndex = SubTaskServices.insertSubTaskStatus(sub_task_status)

          sub_task match {
            case None =>
            case Some(s: SubTasks) =>
              val sId = Integer.parseInt(sub_task_id)
              val sub_task_detail = SubTaskMaster(Option(sId), s.task_id, s.task, s.task_Details,
                s.plan_start_date, s.plan_end_date, s.actual_start_date, null, null, s.added_date, status, s.completion_percentage, s.task_complete, s.sub_task_depend, s.dependencies_type, Option(s.catalogue_id))
              SubTaskServices.updateSubTask(sub_task_detail)
              TaskService.updateTaskStatus(sub_task_id)
          }

          Redirect(routes.SubTask.updateSubTaskStatus(sub_task_id))
        })
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * Delete sub task
   * id -  sub task id
   * Precondition - If there is not sub task entry in the timesheet then we can delete sub task
   */
  def deleteSubtask(id: String) = Action { implicit request =>

    val sub_task = SubTaskServices.findSubTaskDetailsBySubtaskId(id)
    if (!sub_task.isEmpty) {
      val task_id = sub_task.get.task_id.toString()
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
              isValid = false
              if (!s.sub_task_depend.isEmpty) {
                var curr_sub_task_id = s.sub_task_id.get.toString()
                var new_sub_task_depend = ""
                var tasks_depend_aarray = s.sub_task_depend.get.split(",")
                for (td <- tasks_depend_aarray) {
                  var c_ts = StringUtils.trim(td)
                  if (StringUtils.equals(c_ts, id)) {
                    isValid = true
                  } else {
                    if (StringUtils.isEmpty(new_sub_task_depend)) {
                      new_sub_task_depend = c_ts
                    } else {
                      new_sub_task_depend = new_sub_task_depend + "," + c_ts
                    }
                  }
                }

                if (isValid) {
                  SubTaskServices.updateSubTaskDependecy(curr_sub_task_id, new_sub_task_depend)
                }

              }
            }
          }
        }
      }
    }

    SubTaskServices.deleteSubtask(id)

    SubTaskServices.DeleteAllocation(id)
    /**
     * Activity log
     */
    val act = Activity(ActivityTypes.SubTask.id, "Sub task deleted by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), Integer.parseInt(id))
    Activity.saveLog(act)

    Ok("Success")
  }

  def subTaskDetails(subtask_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val documents = DocumentService.findAllDocuments(subtask_id, "SUBTASK", "", "", "")
      var isSubtaskAllocated: Boolean = false;
      val subTaskDetail = SubTaskServices.findSubTaskDetailsBySubtaskId(subtask_id)

      val subtaskAlloc = SubTaskServices.findSubTasksAllocationBySubTask(subtask_id)
      if (subtaskAlloc.isEmpty) {
        isSubtaskAllocated = true
      }
      val baselineCount = Baseline.getBaselineCount(subtask_id.toInt, "subtask")
      var baselineAvailable: Boolean = false;
      if (baselineCount > 0) {
        baselineAvailable = true;
      }

      Ok(views.html.frontend.subTask.subTaskDetails(documents, subTaskDetail, baselineAvailable)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);
    }.getOrElse {
      Redirect(routes.Login.loginUser());
    }
  }
  
  def subTaskDetailsFromTimesheet(subtask_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val documents = DocumentService.findAllDocuments(subtask_id, "SUBTASK", "", "", "")
      var isSubtaskAllocated: Boolean = false;
      val subTaskDetail = SubTaskServices.findSubTaskDetailsBySubtaskId(subtask_id)

      val subtaskAlloc = SubTaskServices.findSubTasksAllocationBySubTask(subtask_id)
      if (subtaskAlloc.isEmpty) {
        isSubtaskAllocated = true
      }
      val baselineCount = Baseline.getBaselineCount(subtask_id.toInt, "subtask")
      var baselineAvailable: Boolean = false;
      if (baselineCount > 0) {
        baselineAvailable = true;
      }

      Ok(views.html.frontend.subTask.subTaskDetailsFromTimesheet(documents, subTaskDetail, baselineAvailable)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get);
    }.getOrElse {
      Redirect(routes.Login.loginUser());
    }
  }  

  def getProgramMembersFromRole(role_id: String, project_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var stateString = " <option value=''>" + "Please select the member" + "</option>";
      if (StringUtils.isNotEmpty(role_id) && !role_id.equals("0")) {
        val project = ProjectService.findProjectDetails(Integer.parseInt(project_id))
        var userList = ProgramMemberService.findProgramMembersForRole(project.get.program.toString, role_id);
        if (!userList.isEmpty) {
          for (u <- userList) {
            stateString += " <option value='" + u.uid.get + "'>" + u.first_name + " " + u.last_name + "</option>"
          }
        }
      }
      Ok(stateString);
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def getProgramMembersExternalFromRole(role_id: String, project_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var stateString = "";
      if (role_id.equals("46")) {
        stateString = " <option value=''>" + "Please select external contractor" + "</option>";
      } else if (role_id.equals("47")) {
        stateString = " <option value=''>" + "Please select the software factory" + "</option>";
      } else {
        stateString = " <option value=''>" + "Please select the member" + "</option>";
      }
      if (StringUtils.isNotEmpty(role_id) && !role_id.equals("0")) {
        val project = ProjectService.findProjectDetails(Integer.parseInt(project_id))
        var externalContarctor = ProgramMemberExternalService.findProgramMembersExternalForRole(project.get.program.toString, role_id);
        if (!externalContarctor.isEmpty) {
          for (e <- externalContarctor) {
            if (role_id.equals("46")) {
              var rs = "NA"
              if (!e.resource_name.isEmpty) {
                rs = e.resource_name.get
              }

              stateString += " <option value='" + e.id.get + "'>" + e.provider_name + " - " + rs + "</option>"
            } else {
              var rc = 0
              if (!e.number_of_resources.isEmpty) {
                rc = e.number_of_resources.get
              }
              stateString += " <option value='" + e.id.get + "'>" + e.provider_name + " - " + rc + "</option>"
            }

          }
        }
      }
      Ok(stateString);
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def getServiceCatalog(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var stateString = " <option value=''>" + "Seleccione Catálogo de Servicios" + "</option>";
      if (StringUtils.isNotEmpty(id.trim)) {
        val services = ServiceCatalogueService.findServiceCatalogueByDescipline(id)
        if (!services.isEmpty) {
          for (sc <- services) {
            stateString += " <option value='" + sc.id.get.toString() + "'>" + sc.service_name + "</option>"
          }
        }
      }
      Ok(stateString);
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def getServiceCatalogDiscipline(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var response = new JSONObject()
      if (StringUtils.isNotEmpty(id.trim)) {
        val services = ServiceCatalogueService.findServiceCatalogueById(id.trim)
        if (!services.isEmpty) {
          response.put("success", services.get.discipline.toString())
        } else {
          response.put("fail", "no discipline")
        }
      }
      Ok(response.toString());

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def getSubtaskSpiGraph(subtask_id: String) = Action { implicit request =>
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

      var spicpiCal = services.EarnValueService.getEarnValue(subtask_id, "SubTask");
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

            subtask_id_map.put(formattedDate.parse(s.fecha.toString()).getTime(), subtask_id.toInt);
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

  def updateTaskDates(sub_task_id: String, end_date: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var node = new JSONObject()
      var result = "fail"
      if (!StringUtils.isEmpty(sub_task_id) && !StringUtils.isEmpty(end_date)) {
        var FormattedDATE = new SimpleDateFormat("dd-MM-yyyy")
        var endDate = FormattedDATE.parse(end_date)
        var FormattedDATE2 = new SimpleDateFormat("yyyy-MM-dd");
        var isValidProgram = true
        var isValidProject = true
        var isValidTask = true

        val subtask = SubTaskServices.findSubTasksBySubTaskId(sub_task_id)
        if (!subtask.isEmpty) {
          val task = TaskService.findTaskDetailsByTaskId(subtask.get.task_id.toInt)
          if (!task.isEmpty) {

            val project = ProjectService.findProject(task.get.pId)
            if (!project.isEmpty) {
              println(project.get.final_release_date + "--------" + FormattedDATE2.format(endDate))
              if (project.get.final_release_date.before(endDate)) {
                node.put("status", "fail")
                node.put("message", "Sub Task end date is greater than Project end date, please update Project end date.")
              } else {
                node.put("status", "success")
                //update task end date..
                TaskService.updateTaskPlannedEndDate(subtask.get.task_id.toString(), FormattedDATE2.format(endDate))
              }
              /*              val program = ProgramService.findProgramDateDetailsById(project.get.program.toString())
              if (!program.isEmpty) {
                if(program.get.release_date.after(endDate)){
                  isValidProgram=false
                }
              }*/
            }
          }
        }

      }
      Ok(node.toString)
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }

  }

  def updateTaskStartDates(sub_task_id: String, start_date: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var node = new JSONObject()
      var result = "fail"
      if (!StringUtils.isEmpty(sub_task_id) && !StringUtils.isEmpty(start_date)) {
        var FormattedDATE = new SimpleDateFormat("dd-MM-yyyy")
        var endDate = FormattedDATE.parse(start_date)
        var FormattedDATE2 = new SimpleDateFormat("yyyy-MM-dd");
        var isValidProgram = true
        var isValidProject = true
        var isValidTask = true

        val subtask = SubTaskServices.findSubTasksBySubTaskId(sub_task_id)
        if (!subtask.isEmpty) {
          val task = TaskService.findTaskDetailsByTaskId(subtask.get.task_id.toInt)
          if (!task.isEmpty) {

            val project = ProjectService.findProject(task.get.pId)
            if (!project.isEmpty) {
              println(project.get.start_date + "--------" + FormattedDATE2.format(endDate))
              if (project.get.start_date.after(endDate)) {
                node.put("status", "fail")
                node.put("message", "Sub Task start date is greater than Project start date, please update Project start date.")
              } else {
                node.put("status", "success")
                //update task end date..
                TaskService.updateTaskPlannedStartDate(subtask.get.task_id.toString(), FormattedDATE2.format(endDate))
              }
              /*              val program = ProgramService.findProgramDateDetailsById(project.get.program.toString())
              if (!program.isEmpty) {
                if(program.get.release_date.after(endDate)){
                  isValidProgram=false
                }
              }*/
            }
          }
        }

      }
      Ok(node.toString)
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }
}