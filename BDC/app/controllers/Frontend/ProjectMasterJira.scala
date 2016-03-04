package controllers.Frontend

import java.util.Date
import scala.collection.mutable.ListBuffer
import org.apache.commons.lang3.StringUtils
import org.json.JSONObject
import net.liftweb.json._
import net.liftweb.json.JsonParser._
import anorm.NotAssigned
import art_forms.ARTForms
import models.Activity
import models.ActivityTypes
import models.Baseline
import models.Project
import models.ProjectMasters
import models.UserSetting
import play.api.mvc.Action
import play.api.mvc.Controller
import services.ProgramService
import services.ProjectService
import services.TimesheetService
import services.TaskService
import services.UserService
import services.DocumentService
import services.GenericService
import services.GenericProjectService
import services.SubTaskServices
import models.Tasks
import services.WorkflowStatusService
import services.ProjectWorkflowStatusService
import play.libs.Json
import sun.swing.StringUIClientPropertyKey
import models.Program_Master
import services.SAPServices
import org.json.JSONArray
import services.BudgetTypeService
import models.Expenditure
import models.Investment
import models._
import models.ProjectExpenditure
import models.ProjectInvestment
import models.ProjectSAP
import services.ProgramMemberService
import java.text.SimpleDateFormat
import scala.math.BigDecimal.RoundingMode
import services.EarnValueService
import services.GenericProjectTypeService
import services.SpiCpiCalculationsService

object ProjectMasterJira extends Controller {

  var programMap = new java.util.LinkedHashMap[String, String]()
  var pmMap = new java.util.LinkedHashMap[String, String]()

  /**
   * Get  project details by project id...
   */
  def projectDetails(projectId: String) = Action { implicit request =>
    val project = ProjectService.findProjectDetails(Integer.parseInt(projectId))
    var tareas = new JSONArray()
    var respuesta = new JSONArray()
    if (!project.isEmpty) {
      respuesta.put( play.api.libs.json.Json.toJson(project))
      val tasks = TaskService.findTaskListByProjectIdAsign(project.get.pId.get.toString)
      respuesta.put(play.api.libs.json.Json.toJson(tasks))
      Ok(respuesta.toString())
    }else{
      Ok("No existe Proyecto")
    }
  }

  /**
   * add new project for a program...
   * program - Program Id
   */
  def addNewProject(program: String) = Action { implicit request =>
      val pIndex = Integer.parseInt(program)
      //val projectmanagers = UserService.findAllUsers
      var pTypes = new java.util.LinkedHashMap[String, String]()
      var workFlow = new java.util.LinkedHashMap[String, String]()
      val work_flows = ProjectWorkflowStatusService.findAllProjectWorkflowList
      for (w <- work_flows) {
        workFlow.put(w.id.get.toString(), w.project_workflow_status)
      }
      val project_types = services.GenericProjectService.findActiveProjectTypeDetailsByType()
      for (p <- project_types) {
        if (!GenericProjectTypeService.findActiveGenericProjectTypeById(p.project_type.toString()).isEmpty) {
          pTypes.put(p.id.get.toString(), GenericProjectTypeService.findActiveGenericProjectTypeById(p.project_type.toString()).get.generic_project_type)
        }
      }

      pmMap = new java.util.LinkedHashMap[String, String]()
      val progrma_members = ProgramMemberService.findProgramMemberForProgram(program)
      for (pm <- progrma_members) {
        pmMap.put(pm.uid.get.toString(), pm.first_name + " " + pm.last_name)
      }

      Ok(views.html.frontend.project.addProjectJira(pIndex, ARTForms.projectForm, pmMap, pTypes, workFlow))
    
  }

  /**
   * Save program details...
   * id -  Program ID
   */
  def saveProjectDetails(program_id: String) = Action { implicit request =>
    var workFlow = new java.util.LinkedHashMap[String, String]()
    val work_flows = ProjectWorkflowStatusService.findAllProjectWorkflowList
    for (w <- work_flows) {
      workFlow.put(w.id.get.toString(), w.project_workflow_status)
    }
    var pTypes = new java.util.LinkedHashMap[String, String]()
    val project_types = GenericProjectService.findActiveProjectTypeDetailsByType()
    for (p <- project_types) {
      if (!GenericProjectTypeService.findActiveGenericProjectTypeById(p.project_type.toString()).isEmpty) {
        pTypes.put(p.id.get.toString(), GenericProjectTypeService.findActiveGenericProjectTypeById(p.project_type.toString()).get.generic_project_type)
      }
    }
    pmMap = new java.util.LinkedHashMap[String, String]()
    val progrma_members = ProgramMemberService.findProgramMemberForProgram(program_id)
    for (pm <- progrma_members) {
      pmMap.put(pm.uid.get.toString(), pm.first_name + " " + pm.last_name)
    }
    val oldfrom = ARTForms.projectForm.bindFromRequest
    oldfrom.fold(
      errors => {
        val the_Form = ProjectService.validateForm(oldfrom, program_id.toInt, "")
        BadRequest(views.html.frontend.project.addProjectJira(Integer.parseInt(errors.data.get("program").get), the_Form, pmMap, pTypes, workFlow))
      },
      ProjectMaster => {
        val the_Form = ProjectService.validateForm(ARTForms.projectForm.fill(ProjectMaster), ProjectMaster.program, "")
        if (the_Form.hasErrors) {
          BadRequest(views.html.frontend.project.addProjectJira(Integer.parseInt(the_Form.data.get("program").get), the_Form, pmMap, pTypes, workFlow))
        } else {
          val program = ProjectMaster.program.toString
          val project_manager = ProjectMaster.project_manager
          val project_mode = ProjectMaster.project_mode
          val start_date = ProjectMaster.start_date
          val end_date = ProjectMaster.final_release_date
          val projectVlaues = Project(None, ProjectMaster.project_id, ProjectMaster.program, ProjectMaster.project_mode, ProjectMaster.project_name, ProjectMaster.description, ProjectMaster.project_manager, ProjectMaster.start_date, ProjectMaster.final_release_date, ProjectMaster.completion_percentage, ProjectMaster.ppm_number, ProjectMaster.work_flow_status, false, ProjectMaster.planned_hours)
          val pId = ProjectService.insertProject(projectVlaues)

          /**
           * Insert generic task for new project...
           */
          var tasksDependents = new java.util.HashMap[Integer, Long]()
          var genericTasks: List[models.GenericTasks] = null
          genericTasks = GenericService.findGenericProjectTypeTasks(project_mode.toString())

          //genericTasks = GenericService.findGenericProjectTypeTasks(genericDetail.get.id.get.toString)
          var isBaselined = false
          //println("hi sss    " + genericTasks.length)
          for (g <- genericTasks) {
            val predefined_id = g.predefined_task_id.toString()
            val service_id = GenericService.findPredefinedTasksDetails(predefined_id).get.catalogue_service
            val taskDetails = Tasks(None, pId.toInt, g.task_title, g.task_code,
              start_date, end_date, g.task_description, g.plan_time,
              new Date(), g.task_status, 1, project_manager, g.task_discipline, g.completion_percentage,
              g.remark, g.task_depend, Option(1), g.stage, g.user_role, Option(g.deliverable), g.task_type, 1)

            if (g.task_type == 3) {
              isBaselined = true
            }

            val latest_task = TaskService.insertTask(taskDetails)

            // println(g.tId.get.toString() + " --- " + latest_task)

            tasksDependents.put(g.tId.get, latest_task)

            val subtask = SubTaskMaster(None, latest_task, g.task_title, g.task_description,
              start_date, end_date, new Date(), null, null, new Date(), g.task_status, g.completion_percentage, 0, Option(""), Option(0), Option(service_id))
            SubTaskServices.insertSubTask(subtask)
          }

          if (isBaselined) {
            val project = ProjectService.findProject(pId.toInt)
            val projectInformation = Project(project.get.pId, project.get.project_id, project.get.program, project.get.project_mode, project.get.project_name, project.get.description, project.get.project_manager, project.get.start_date, project.get.final_release_date, project.get.completion_percentage, project.get.ppm_number, project.get.work_flow_status, isBaselined, Option(project.get.planned_hours.getOrElse(0)))
            val result = ProjectService.updateProject(projectInformation)
          }

          var itr = tasksDependents.keySet().iterator();
          var old_id = 0
          var new_id = 0
          var newStr = ""

          while (itr.hasNext()) {
            var key = itr.next();
            old_id = key
            new_id = tasksDependents.get(key).toInt
            var oldObj = GenericService.findGenericTasksDetails(old_id.toString)
            oldObj match {
              case None =>
              case Some(obj: models.GenericTasks) =>
                if (!obj.task_depend.isEmpty && StringUtils.isNotBlank(obj.task_depend.get)) {
                  newStr = ""
                  var strTaskDepends = obj.task_depend.get.trim().split(",")
                  if (strTaskDepends.length > 0) {
                    for (t <- strTaskDepends) {
                      if (!t.trim().isEmpty() && !StringUtils.equals(t.trim(), "null") && !StringUtils.equals(t.trim(), "undefined")) {
                        if (StringUtils.isEmpty(newStr)) {
                          if (tasksDependents.get(Integer.parseInt(t.trim())) != 0) {
                            newStr = tasksDependents.get(Integer.parseInt(t.trim())).toString()
                          }

                        } else {
                          var newIndex = StringUtils.trim(t)
                          if (tasksDependents.get(Integer.parseInt(newIndex)) != 0) {
                            newStr = newStr + "," + tasksDependents.get(Integer.parseInt(newIndex)).toString
                          }

                        }
                      }
                    }
                  }

                  /**
                   * Update new dependencies...
                   */
                  val newTaskDetails = TaskService.findTaskDetailsByTaskId(new_id)
                  newTaskDetails match {
                    case None =>
                    case Some(task: models.Tasks) => {
                      val taskDetails = Tasks(task.tId, task.pId, task.task_title, task.task_code,
                        task.plan_start_date, task.plan_end_date, task.task_description, task.plan_time,
                        task.creation_date, task.task_status, task.status, task.owner, task.task_discipline,
                        task.completion_percentage, task.remark, Option(newStr), task.dependencies_type, task.stage,
                        task.user_role, task.deliverable, task.task_type, 1)

                      TaskService.updateTask(taskDetails)
                      old_id = 0
                      new_id = 0

                      newStr = newStr.replace("(", "")
                      newStr = newStr.replace(")", "")
                      if (!StringUtils.isEmpty(newStr)) {
                        val sub_task = SubTaskServices.findSubTasksByTask(task.tId.get.toString())
                        for (s <- sub_task) {

                          var subtasks_depend = SubTaskServices.findSubTasksforDependentTasks(newStr)
                          subtasks_depend = subtasks_depend.toString().replace("(", "")
                          subtasks_depend = subtasks_depend.toString().replace(")", "")

                          if (!StringUtils.isEmpty(subtasks_depend.toString())) {
                            SubTaskServices.updateSubTaskDependecy(s.sub_task_id.get.toString(), subtasks_depend.toString())
                          }

                        }
                      }

                    }

                  }
                }
            }
          }

          /**
           * Activity log
           */
          val act = Activity(ActivityTypes.Project.id, "New project created by Jira" , new Date(), 1202, pId.toInt)
          Activity.saveLog(act)

          /**
           * assign project management
           */
          var isExist = UserService.checkUserSettingbyuIdandpId(project_manager, pId.toInt)

          if (isExist) {
            val projectmapping = UserSetting(project_manager, pId, 1)
            UserService.saveUserSetting(projectmapping)
          }

          /**
           * add admin in listing
           */
          isExist = false;
          isExist = UserService.checkUserSettingbyuIdandpId(1, pId.toInt)
          if (isExist) {
            val projectmapping = UserSetting(1, pId, 1)
            UserService.saveUserSetting(projectmapping)
          }
          Ok(pId.toString())
          //Redirect(routes.Program.programDetails(program))
        }
      })
  }

  /**
   * Edit project details...
   * id : Project id
   */
  def editProject(id: String) = Action { implicit request =>

      val project = ProjectService.findProjectDetails(Integer.parseInt(id))
      val projectData = ProjectMasters(project.get.project_id, project.get.program, project.get.project_mode, project.get.project_name, project.get.description, project.get.project_manager, project.get.start_date, project.get.final_release_date, project.get.completion_percentage, project.get.ppm_number, project.get.work_flow_status, project.get.baseline, Option(project.get.planned_hours.getOrElse(0)))
      val projectmanagers = UserService.findAllUsers
      var workFlow = new java.util.HashMap[String, String]()
      val work_flows = ProjectWorkflowStatusService.findAllProjectWorkflowList
      for (w <- work_flows) {
        workFlow.put(w.id.get.toString(), w.project_workflow_status)
      }
      pmMap = new java.util.LinkedHashMap[String, String]()
      val progrma_members = ProgramMemberService.findProgramMemberForProgram(project.get.program.toString)
      for (pm <- progrma_members) {
        pmMap.put(pm.uid.get.toString(), pm.first_name + " " + pm.last_name)
      }
      Ok(views.html.frontend.project.editProjectJira(ARTForms.projectForm.fill(projectData), Integer.parseInt(id), pmMap, workFlow))

    
  }

  /**
   * Update project details...
   * id -  Project id
   */
  def updateProject(id: String) = Action { implicit request =>

    var workFlow = new java.util.HashMap[String, String]()
    val work_flows = ProjectWorkflowStatusService.findAllProjectWorkflowList
    for (w <- work_flows) {
      workFlow.put(w.id.get.toString(), w.project_workflow_status)
    }
    val project = ProjectService.findProjectDetails(Integer.parseInt(id))
    val oldForm = ARTForms.projectForm.bindFromRequest

    pmMap = new java.util.LinkedHashMap[String, String]()
    val progrma_members = ProgramMemberService.findProgramMemberForProgram(project.get.program.toString)
    for (pm <- progrma_members) {
      pmMap.put(pm.uid.get.toString(), pm.first_name + " " + pm.last_name)
    }
    oldForm.fold(
      errors => {
        val theForm = ProjectService.validateForm(errors, project.get.program, id)
        BadRequest("Error Form")
      },
      ProjectMaster => {
        val theForm = ProjectService.validateForm(ARTForms.projectForm.fill(ProjectMaster), ProjectMaster.program, id)
        println(theForm.errors)
        if (theForm.hasErrors) {
          BadRequest("Error Form 2")
        } else {
          val project_manager = ProjectMaster.project_manager

          ProjectService.projectBasline(project, ProjectMaster.final_release_date, ProjectMaster.start_date, "1202", id)
          val projectVlaues = Project(project.get.pId, project.get.project_id, project.get.program, project.get.project_mode, ProjectMaster.project_name, ProjectMaster.description, ProjectMaster.project_manager, ProjectMaster.start_date, ProjectMaster.final_release_date, ProjectMaster.completion_percentage, ProjectMaster.ppm_number, ProjectMaster.work_flow_status, project.get.baseline, Option(project.get.planned_hours.getOrElse(0)))
          ProjectService.updateProject(projectVlaues)

          /**
           * Activity log
           */
          val act = Activity(ActivityTypes.Project.id, "Project updated by Jira ", new Date(), 1202, Integer.parseInt(id))
          Activity.saveLog(act)

          /**
           * assign project management
           */
          val pId = Integer.parseInt(id)
          var isExist = UserService.checkUserSettingbyuIdandpId(project_manager, pId)

          if (isExist) {
            val projectmapping = UserSetting(project_manager, pId, 1)
            UserService.saveUserSetting(projectmapping)
          }

          Ok("Proyecto modificado")
        }

      })
  }

  /**
   * Update baseline details...
   * if project planned dates changed, then baseline needs to update
   */
  def updateBaseLine() = Action { implicit request =>

    request.session.get("username").map { user =>

      val uId = Integer.parseInt(request.session.get("uId").get)
      val utype = Integer.parseInt(request.session.get("utype").get)
      //val project = ProjectService.findProjectDetails(Integer.parseInt(projectId))
      var projectId = request.body.asFormUrlEncoded.get("project_id")(0).toString().trim()
      var baselineEnabled = request.body.asFormUrlEncoded.get("baseline")(0).toBoolean

      if (projectId == null) {
        Ok("failure");
      }
      var project = ProjectService.findProjectDetails(Integer.parseInt(projectId))
      if (project == null) {
        Ok("failure")
      }

      val projectInformation = Project(project.get.pId, project.get.project_id, project.get.program, project.get.project_mode, project.get.project_name, project.get.description, project.get.project_manager, project.get.start_date, project.get.final_release_date, project.get.completion_percentage, project.get.ppm_number, project.get.work_flow_status, baselineEnabled, Option(project.get.planned_hours.getOrElse(0)))
      val result = ProjectService.updateProject(projectInformation)
      Ok("success")
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }

  }

  /**
   * Delete project by Id
   * Precondition - If there is no tasks under same project then only we can delete the project.
   * id -  Project id
   */
  def deleteProject(id: String) = Action { implicit request =>

      val project = ProjectService.findProjectDetails(Integer.parseInt(id))
      var node = new JSONObject()
      var do_delete: Boolean = true

      project match {
        case None =>
        case Some(p: Project) =>
          val task_list = TaskService.findAllTaskIdListByProjectId(p.pId.get.toString) //findProjectTaskCount(p.pId.get.toString)
          val timesheetList = TimesheetService.getAllTimesheetIds()
          for (task <- task_list) {
                if (true) {
                  do_delete = false
                }
          }
          if (do_delete) {
            ProjectService.softDeleteProject(id)
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Project.id, "Project deleted by Jira ", new Date(), 1202, Integer.parseInt(id))
            Activity.saveLog(act)
            node.put("status", "Success")

          } else {
            node.put("status", "Fail")
            node.put("message", "Existen tareas asociadas a este proyecto, favor elimine estas tareas antes de eliminar el proyecto.")
          }
      }
      Ok(node.toString())
  }

  /**
   * Get project list for program..
   * program_id - program id
   */
  def getProjectListForProgram(program_id: String) = Action { implicit request =>
    var finalString = ""
    val uId = request.session.get("uId").get
    if (StringUtils.isNotBlank(program_id)) {
      val projects = UserService.findUserProjectsForUserProgram(uId, program_id)
      var pr_name = ""
      finalString = "<option value=''>--Select Project--</option>"
      for (p <- projects) {
        if (p.project_name.length() > 40) {
          pr_name = p.project_name.substring(0, 40) + ".."
        } else {
          pr_name = p.project_name
        }

        finalString = finalString + " <option value='" + p.pId + "'>" + pr_name + "</option>"
      }
    }
    Ok(finalString)
  }

  /**
   * Get project list for program
   * program_id -  Program id for a project.
   */
  def getRoadmapProjectListForProgram(program_id: String) = Action { implicit request =>
    var finalString = ""
    val uId = request.session.get("uId").get
    if (StringUtils.isNotBlank(program_id)) {
      val projects = ProjectService.findProjectListForProgram(program_id)
      var pr_name = ""
      finalString = "<option value=''>--Select Project--</option>"
      for (p <- projects) {
        if (p.project_name.length() > 35) {
          pr_name = p.project_name.substring(0, 35) + ".."
        } else {
          pr_name = p.project_name
        }

        finalString = finalString + " <option value='" + p.pId + "'>" + pr_name + "</option>"
      }
    } else {
      val projects = ProjectService.findProjectListOrderByPrograms()
      var pr_name = ""
      finalString = "<option value=''>--Select Project--</option>"
      for (p <- projects) {
        if (p.project_name.length() > 35) {
          pr_name = p.project_name.substring(0, 35) + ".."
        } else {
          pr_name = p.project_name
        }

        finalString = finalString + " <option value='" + p.pId + "'>" + pr_name + "</option>"
      }
    }
    Ok(finalString)
  }

  /**
   * Calculate Earn value for project...
   * id -  Project Id
   *
   */
  /*  def calculateProjectEarnValueAction(id: String) = Action { implicit request =>
    var node = new JSONObject()
    node = EarnValueService.calculateProjectEarnValue(id)
    Ok(node.toString())

  }*/

  def calculateEarnValue(id: String) = Action { implicit request =>
    var node = new JSONObject()
        var calculos = SpiCpiCalculationsService.findIndicators(id,1)
    for (s <- calculos) {
			
      node.put("EV", s.ev)
      node.put("PV", s.pv)
      node.put("AC", s.ac)
      node.put("CPI", s.cpi)
      node.put("SPI", s.spi)
      node.put("ETC", s.etc)
      node.put("EAC", s.eac)
      node.put("PAI", s.pai)
      node.put("PAE", s.pae)
      node.put("HP", s.hp)
      node.put("HA", s.ha)
    }
    /*
    val ev = TaskService.getTaskNonCanonicalEarnVale(id).getOrElse(0.0).toDouble
    node.put("EV", ev);
    val pv = TaskService.getTaskPlannedValue(id).getOrElse(0.0).toDouble
    node.put("PV", pv);
    val ac = TaskService.getTaskActualCostNonCanonical(id).getOrElse(0.0).toDouble
    node.put("AC", ac);

    ///%AVE =( SUM((%AVE  * VA)/100) /VA (Task))*100

    ///%AVI =( SUM((%AVI  * VA)/100) /VA (Task))*100

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

  def calculateProjectEarnValueAction(id: String) = Action { implicit request =>
    var node = new JSONObject()
    var calculos = SpiCpiCalculationsService.findIndicators(id,1)
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
    val ev = ProjectService.getProjectExpectedEarnValue(id).getOrElse(0.0).toDouble
    node.put("EV", ev)
    val pv = ProjectService.getProjectPlannedValue(id).getOrElse(0.0).toDouble
    node.put("PV", pv)
    val ac = ProjectService.getProjectActualCost(id).getOrElse(0.0).toDouble
    node.put("AC", ac);
    ///%AVE =( SUM((%AVE  * VA)/100) /VA (Task))*100

    ///%AVI =( SUM((%AVI  * VA)/100) /VA (Task))*100

    val va = ProjectService.getProjectValueAssigned(id).getOrElse(0.0).toDouble

    var avePer = ((va * va) / 100 / va) * 100

    var aviPer = ((va * va) / 100 / va) * 100

    val sv = pv.-(ev)
    node.put("AVE", sv)

    val cv = ev - ac
    node.put("AVI", cv)

    val actual = ProjectService.getProjectEarnValue(id).getOrElse(0.0).toDouble
    if ((ev > 0) && (actual > 0)) {
      val spi = (ev / actual)
      var spiBg: scala.math.BigDecimal = spi
      spiBg = spiBg.setScale(2, RoundingMode.HALF_UP);
      node.put("SPI", spiBg.toString())
    } else {
      node.put("SPI", 0.0)
    }

    val HCNon = ProjectService.getProjectActualCost(id).getOrElse(0.0).toDouble
    if ((ev > 0) && (HCNon > 0)) {
      val cpi = ev / HCNon
      var cpiBg: scala.math.BigDecimal = cpi
      cpiBg = cpiBg.setScale(2, RoundingMode.HALF_UP);
      node.put("CPI", cpiBg.toString())
    } else {
      node.put("CPI", 0.0)
    }
    if ((ev > 0) && (HCNon > 0)) {
      val av = ProjectService.getProjectValueAssigned(id).getOrElse(0.0).toDouble
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
    */
    Ok(node.toString())
  }
  def newProjectSAP(project_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      if (StringUtils.isNotEmpty(project_id)) {
        val project = ProjectService.findProject(Integer.parseInt(project_id))
        project match {
          case None =>
            Redirect(routes.Login.loginUser())
          case Some(p: Project) =>

            val sap_list = SAPServices.findActiveSAPMasterForProject(p.program.toString, project_id)
            var saps = new java.util.HashMap[String, String]()

            for (s <- sap_list) {
              saps.put(s.id.toString, s.sap_number.toString)
            }

            var planned_hour: Double = 0
            if (!p.planned_hours.isEmpty) {
              planned_hour = p.planned_hours.get
            }

            Ok(views.html.frontend.project.newProjectSAP(project_id, ARTForms.project_sap_form, saps, planned_hour)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)

        }
      } else {
        Redirect(routes.Login.loginUser())
      }
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def saveProjectSAP(project_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      if (StringUtils.isNotEmpty(project_id)) {
        val project = ProjectService.findProject(Integer.parseInt(project_id))
        project match {
          case None =>
            Redirect(routes.Login.loginUser())
          case Some(p: Project) =>
            var planned_hour: Double = 0

            val sap_list = SAPServices.findActiveSAPMasterForProject(p.program.toString, project_id)
            var saps = new java.util.HashMap[String, String]()

            for (s <- sap_list) {
              saps.put(s.id.toString, s.sap_number.toString)
            }

            var oldForm = ARTForms.project_sap_form.bindFromRequest
            var investment_hardware: Option[Long] = None
            if (!oldForm.data.get("project_investment.investment_hardware").get.isEmpty) {
              val investment_hardwareStr = oldForm.data.get("project_investment.investment_hardware").get.replaceAll("\\.+", "")
              investment_hardware = Option(investment_hardwareStr.toLong)
            }
            var investment_software: Option[Long] = None
            if (!oldForm.data.get("project_investment.investment_software").get.isEmpty) {
              val investment_softwareStr = oldForm.data.get("project_investment.investment_software").get.replaceAll("\\.+", "")
              investment_software = Option(investment_softwareStr.toLong)
            }
            var investment_telecommunication: Option[Long] = None
            if (!oldForm.data.get("project_investment.investment_telecommunication").get.isEmpty) {
              val investment_telecommunicationStr = oldForm.data.get("project_investment.investment_telecommunication").get.replaceAll("\\.+", "")
              investment_telecommunication = Option(investment_telecommunicationStr.toLong)
            }

            var investment_development: Option[Long] = None
            if (!oldForm.data.get("project_investment.investment_development").get.isEmpty) {
              val investment_developmentStr = oldForm.data.get("project_investment.investment_development").get.replaceAll("\\.+", "")
              investment_development = Option(investment_developmentStr.toLong)
            }

            var investment_other: Option[Long] = None
            if (!oldForm.data.get("project_investment.investment_other").get.isEmpty) {
              val investment_otherStr = oldForm.data.get("project_investment.investment_other").get.replaceAll("\\.+", "")
              investment_other = Option(investment_otherStr.toLong)
            }

            var investment_qa: Option[Long] = None
            if (!oldForm.data.get("project_investment.investment_qa").get.isEmpty) {
              val investment_qaStr = oldForm.data.get("project_investment.investment_qa").get.replaceAll("\\.+", "")
              investment_qa = Option(investment_qaStr.toLong)
            }

            var investment_improvements: Option[Long] = None
            if (!oldForm.data.get("project_investment.investment_improvements").get.isEmpty) {
              val investment_improvementsStr = oldForm.data.get("project_investment.investment_improvements").get.replaceAll("\\.+", "")
              investment_improvements = Option(investment_improvementsStr.toLong)
            }

            var investment_recurring_first: Option[Long] = None
            if (!oldForm.data.get("project_investment.investment_recurring_first").get.isEmpty) {
              val investment_recurring_firstStr = oldForm.data.get("project_investment.investment_recurring_first").get.replaceAll("\\.+", "")
              investment_recurring_first = Option(investment_recurring_firstStr.toLong)
            }

            val project_investment = ProjectInvestment(investment_hardware, investment_software, investment_telecommunication,
              investment_development, investment_other, investment_qa,
              investment_improvements, investment_recurring_first)

            var expenditure_hardware: Option[Long] = None
            if (!oldForm.data.get("project_expenditure.expenditure_hardware").get.isEmpty) {
              val expenditure_hardwareStr = oldForm.data.get("project_expenditure.expenditure_hardware").get.replaceAll("\\.+", "")
              expenditure_hardware = Option(expenditure_hardwareStr.toLong)
            }
            var expenditure_software: Option[Long] = None
            if (!oldForm.data.get("project_expenditure.expenditure_software").get.isEmpty) {
              val expenditure_softwareStr = oldForm.data.get("project_expenditure.expenditure_software").get.replaceAll("\\.+", "")
              expenditure_software = Option(expenditure_softwareStr.toLong)
            }
            var expenditure_telecommunication: Option[Long] = None
            if (!oldForm.data.get("project_expenditure.expenditure_telecommunication").get.isEmpty) {
              val expenditure_telecommunicationStr = oldForm.data.get("project_expenditure.expenditure_telecommunication").get.replaceAll("\\.+", "")
              expenditure_telecommunication = Option(expenditure_telecommunicationStr.toLong)
            }

            var expenditure_development: Option[Long] = None
            if (!oldForm.data.get("project_expenditure.expenditure_development").get.isEmpty) {
              val expenditure_developmentStr = oldForm.data.get("project_expenditure.expenditure_development").get.replaceAll("\\.+", "")
              expenditure_development = Option(expenditure_developmentStr.toLong)
            }

            var expenditure_other: Option[Long] = None
            if (!oldForm.data.get("project_expenditure.expenditure_other").get.isEmpty) {
              val expenditure_otherStr = oldForm.data.get("project_expenditure.expenditure_other").get.replaceAll("\\.+", "")
              expenditure_other = Option(expenditure_otherStr.toLong)
            }

            var expenditure_qa: Option[Long] = None
            if (!oldForm.data.get("project_expenditure.expenditure_qa").get.isEmpty) {
              val expenditure_qaStr = oldForm.data.get("project_expenditure.expenditure_qa").get.replaceAll("\\.+", "")
              expenditure_qa = Option(expenditure_qaStr.toLong)
            }

            var expenditure_improvements: Option[Long] = None
            if (!oldForm.data.get("project_expenditure.expenditure_improvements").get.isEmpty) {
              val expenditure_improvementsStr = oldForm.data.get("project_expenditure.expenditure_improvements").get.replaceAll("\\.+", "")
              expenditure_improvements = Option(expenditure_improvementsStr.toLong)
            }

            var expenditure_recurring_first: Option[Long] = None
            if (!oldForm.data.get("project_expenditure.expenditure_recurring_first").get.isEmpty) {
              val expenditure_recurring_firstStr = oldForm.data.get("project_expenditure.expenditure_recurring_first").get.replaceAll("\\.+", "")
              expenditure_recurring_first = Option(expenditure_recurring_firstStr.toLong)
            }

            val project_expenditure = ProjectExpenditure(expenditure_hardware, expenditure_software, expenditure_telecommunication,
              expenditure_development, expenditure_other, expenditure_qa,
              expenditure_improvements, expenditure_recurring_first)

            var sap_id: Int = 0
            if (!oldForm.data.get("sap_id").get.isEmpty) {
              sap_id = oldForm.data.get("sap_id").get.toInt
            }

            val projest_sap = ProjectSAP(project_id.toInt, sap_id, project_investment, project_expenditure, 1, None, None, None)

            oldForm = oldForm.fill(projest_sap)
            oldForm.fold(
              errors => {
                var newForm = errors

                /*if (!errors.data.get("planned_hours").isEmpty) {
                  planned_hour = errors.data.get("planned_hours").get.toDouble
                }*/
                BadRequest(views.html.frontend.project.newProjectSAP(project_id, newForm, saps, planned_hour)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
              },
              sap_data => {
                /*if (!sap_data.planned_hours.isEmpty) {
                  planned_hour = sap_data.planned_hours.get
                }*/
                val theForm = SAPServices.validateProjectSAPForm(ARTForms.project_sap_form.fill(sap_data), "")
                if (theForm.hasErrors) {
                  BadRequest(views.html.frontend.project.newProjectSAP(project_id, theForm, saps, planned_hour)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
                } else {
                  val last_index = SAPServices.insertProjectSAP(sap_data)

                  /**
                   * Activity log
                   */
                  val act = Activity(ActivityTypes.Project_Sap.id, "Project SAP added by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), last_index.toInt)
                  Activity.saveLog(act)

                  Redirect(routes.ProjectMaster.newProjectSAP(project_id))
                }

              })

          //Ok(views.html.frontend.project.newProjectSAP(project_id, ARTForms.project_sap_form, saps)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get,"user_profile"-> request.session.get("user_profile").get)

        }
      } else {
        Redirect(routes.Login.loginUser())
      }
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def editProjectSAP(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      if (StringUtils.isNotEmpty(id)) {
        val sapMaster = SAPServices.findProjectSAPMasterDetails(id)
        val sap_Invest = SAPServices.findProjectSAPInvestment(id)
        val sap_expend = SAPServices.findProjectSAPExpenditure(id)

        val expend = ProjectExpenditure(sap_expend.get.hardware, sap_expend.get.software, sap_expend.get.telecommunication,
          sap_expend.get.development, sap_expend.get.other, sap_expend.get.qa, sap_expend.get.improvements, sap_expend.get.recurring_first)

        val invest = ProjectInvestment(sap_Invest.get.hardware, sap_Invest.get.software, sap_Invest.get.telecommunication,
          sap_Invest.get.development, sap_Invest.get.other, sap_Invest.get.qa, sap_Invest.get.improvements, sap_Invest.get.recurring_first)

        val objSAP = ProjectSAP(sapMaster.get.project_id, sapMaster.get.sap_id, invest, expend, sapMaster.get.is_active, sapMaster.get.creation_date, sapMaster.get.last_update, sapMaster.get.planned_hours)
        val project_id = sapMaster.get.project_id
        val project = ProjectService.findProject(project_id)
        var planned_hour: Double = 0
        if (!project.get.planned_hours.isEmpty) {
          planned_hour = project.get.planned_hours.get
        }

        Ok(views.html.frontend.project.editProjectSAP(ARTForms.project_sap_form.fill(objSAP), id, planned_hour)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      } else {
        Redirect(routes.Login.loginUser())
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def updateProjectSAP(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var planned_hour: Double = 0

      val sapMaster = SAPServices.findProjectSAPMasterDetails(id)
      if (!sapMaster.isEmpty) {
        var bts = new java.util.LinkedHashMap[String, String]()
        val bType = BudgetTypeService.findActiveBudgetTypes
        for (b <- bType) {
          bts.put(b.id.get.toString(), b.budget_type)
        }

        var oldForm = ARTForms.project_sap_form.bindFromRequest
        var investment_hardware: Option[Long] = None
        if (!oldForm.data.get("project_investment.investment_hardware").get.isEmpty) {
          val investment_hardwareStr = oldForm.data.get("project_investment.investment_hardware").get.replaceAll("\\.+", "")
          investment_hardware = Option(investment_hardwareStr.toLong)
        }
        var investment_software: Option[Long] = None
        if (!oldForm.data.get("project_investment.investment_software").get.isEmpty) {
          val investment_softwareStr = oldForm.data.get("project_investment.investment_software").get.replaceAll("\\.+", "")
          investment_software = Option(investment_softwareStr.toLong)
        }
        var investment_telecommunication: Option[Long] = None
        if (!oldForm.data.get("project_investment.investment_telecommunication").get.isEmpty) {
          val investment_telecommunicationStr = oldForm.data.get("project_investment.investment_telecommunication").get.replaceAll("\\.+", "")
          investment_telecommunication = Option(investment_telecommunicationStr.toLong)
        }

        var investment_development: Option[Long] = None
        if (!oldForm.data.get("project_investment.investment_development").get.isEmpty) {
          val investment_developmentStr = oldForm.data.get("project_investment.investment_development").get.replaceAll("\\.+", "")
          investment_development = Option(investment_developmentStr.toLong)
        }

        var investment_other: Option[Long] = None
        if (!oldForm.data.get("project_investment.investment_other").get.isEmpty) {
          val investment_otherStr = oldForm.data.get("project_investment.investment_other").get.replaceAll("\\.+", "")
          investment_other = Option(investment_otherStr.toLong)
        }

        var investment_qa: Option[Long] = None
        if (!oldForm.data.get("project_investment.investment_qa").get.isEmpty) {
          val investment_qaStr = oldForm.data.get("project_investment.investment_qa").get.replaceAll("\\.+", "")
          investment_qa = Option(investment_qaStr.toLong)
        }

        var investment_improvements: Option[Long] = None
        if (!oldForm.data.get("project_investment.investment_improvements").get.isEmpty) {
          val investment_improvementsStr = oldForm.data.get("project_investment.investment_improvements").get.replaceAll("\\.+", "")
          investment_improvements = Option(investment_improvementsStr.toLong)
        }

        var investment_recurring_first: Option[Long] = None
        if (!oldForm.data.get("project_investment.investment_recurring_first").get.isEmpty) {
          val investment_recurring_firstStr = oldForm.data.get("project_investment.investment_recurring_first").get.replaceAll("\\.+", "")
          investment_recurring_first = Option(investment_recurring_firstStr.toLong)
        }

        val project_investment = ProjectInvestment(investment_hardware, investment_software, investment_telecommunication,
          investment_development, investment_other, investment_qa,
          investment_improvements, investment_recurring_first)

        var expenditure_hardware: Option[Long] = None
        if (!oldForm.data.get("project_expenditure.expenditure_hardware").get.isEmpty) {
          val expenditure_hardwareStr = oldForm.data.get("project_expenditure.expenditure_hardware").get.replaceAll("\\.+", "")
          expenditure_hardware = Option(expenditure_hardwareStr.toLong)
        }
        var expenditure_software: Option[Long] = None
        if (!oldForm.data.get("project_expenditure.expenditure_software").get.isEmpty) {
          val expenditure_softwareStr = oldForm.data.get("project_expenditure.expenditure_software").get.replaceAll("\\.+", "")
          expenditure_software = Option(expenditure_softwareStr.toLong)
        }
        var expenditure_telecommunication: Option[Long] = None
        if (!oldForm.data.get("project_expenditure.expenditure_telecommunication").get.isEmpty) {
          val expenditure_telecommunicationStr = oldForm.data.get("project_expenditure.expenditure_telecommunication").get.replaceAll("\\.+", "")
          expenditure_telecommunication = Option(expenditure_telecommunicationStr.toLong)
        }

        var expenditure_development: Option[Long] = None
        if (!oldForm.data.get("project_expenditure.expenditure_development").get.isEmpty) {
          val expenditure_developmentStr = oldForm.data.get("project_expenditure.expenditure_development").get.replaceAll("\\.+", "")
          expenditure_development = Option(expenditure_developmentStr.toLong)
        }

        var expenditure_other: Option[Long] = None
        if (!oldForm.data.get("project_expenditure.expenditure_other").get.isEmpty) {
          val expenditure_otherStr = oldForm.data.get("project_expenditure.expenditure_other").get.replaceAll("\\.+", "")
          expenditure_other = Option(expenditure_otherStr.toLong)
        }

        var expenditure_qa: Option[Long] = None
        if (!oldForm.data.get("project_expenditure.expenditure_qa").get.isEmpty) {
          val expenditure_qaStr = oldForm.data.get("project_expenditure.expenditure_qa").get.replaceAll("\\.+", "")
          expenditure_qa = Option(expenditure_qaStr.toLong)
        }

        var expenditure_improvements: Option[Long] = None
        if (!oldForm.data.get("project_expenditure.expenditure_improvements").get.isEmpty) {
          val expenditure_improvementsStr = oldForm.data.get("project_expenditure.expenditure_improvements").get.replaceAll("\\.+", "")
          expenditure_improvements = Option(expenditure_improvementsStr.toLong)
        }

        var expenditure_recurring_first: Option[Long] = None
        if (!oldForm.data.get("project_expenditure.expenditure_recurring_first").get.isEmpty) {
          val expenditure_recurring_firstStr = oldForm.data.get("project_expenditure.expenditure_recurring_first").get.replaceAll("\\.+", "")
          expenditure_recurring_first = Option(expenditure_recurring_firstStr.toLong)
        }

        val project_expenditure = ProjectExpenditure(expenditure_hardware, expenditure_software, expenditure_telecommunication,
          expenditure_development, expenditure_other, expenditure_qa,
          expenditure_improvements, expenditure_recurring_first)

        var sap_id: Int = 0
        if (!oldForm.data.get("sap_id").get.isEmpty) {
          sap_id = oldForm.data.get("sap_id").get.toInt
        }

        val projest_sap = ProjectSAP(sapMaster.get.project_id, sap_id, project_investment, project_expenditure, 1, None, None, None)
        oldForm = oldForm.fill(projest_sap)
        oldForm.fold(
          errors => {
            var newForm = errors
            newForm = SAPServices.validateProjectSAPForm(oldForm, id)
            /*if (!errors.data.get("planned_hours").isEmpty) {
              planned_hour = errors.data.get("planned_hours").get.toDouble
            }*/
            BadRequest(views.html.frontend.project.editProjectSAP(errors, id, planned_hour)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
          },
          sap_member => {

            val theForm = SAPServices.validateProjectSAPForm(ARTForms.project_sap_form.fill(sap_member), id)

            /*if (!theForm.data.get("planned_hours").isEmpty) {
              planned_hour = theForm.data.get("planned_hours").get.toDouble
            }*/

            if (theForm.hasErrors) {
              BadRequest(views.html.frontend.project.editProjectSAP(theForm, id, planned_hour)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
            } else {
              val last_index = SAPServices.updateProjectSAP(sap_member, id)
              /**
               * Activity log
               */
              val act = Activity(ActivityTypes.Project_Sap.id, "Project SAP Updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), id.toInt)
              Activity.saveLog(act)
              Redirect(routes.ProjectMaster.projectDetails(sapMaster.get.project_id.toString()))
            }

          })
      } else {
        Redirect(routes.Login.loginUser())
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def updateProjectSAPStatus(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var node = new JSONObject()
      val sapMaster = SAPServices.findProjectSAPMasterDetails(id)
      if (!sapMaster.isEmpty) {
        if (sapMaster.get.is_active == 0) {
          SAPServices.changeProjectSAPStatus(1, id)
          /**
           * Activity log
           */
          val act = Activity(ActivityTypes.Project_Sap.id, "Project SAP Status Updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), id.toInt)
          Activity.saveLog(act)
        } else {
          SAPServices.changeProjectSAPStatus(0, id)
          /**
           * Activity log
           */
          val act = Activity(ActivityTypes.Project_Sap.id, "Project SAP Status Updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), id.toInt)
          Activity.saveLog(act)
        }
        node.put("status", "Success")
        node.put("message", "You have deleted this SAP number successfully !")
      } else {
        node.put("status", "Fail")
        node.put("message", "This SAP number is used in Project, you can not delete this SAP number.")
      }
      Ok(node.toString())
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def projectSapDetails(id: String, project_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      if (StringUtils.isNotBlank(id)) {
        val sap_data = SAPServices.findSAPInvestmentDetails(id)
        var i_investment_hardware: Double = 0
        var i_investment_software: Double = 0
        var i_investment_telecommunication: Double = 0
        var i_investment_development: Double = 0
        var i_investment_other: Double = 0
        var i_investment_qa: Double = 0
        var i_investment_improvements: Double = 0
        var i_investment_recurring_first: Double = 0

        var e_investment_hardware: Double = 0
        var e_investment_software: Double = 0
        var e_investment_telecommunication: Double = 0
        var e_investment_development: Double = 0
        var e_investment_other: Double = 0
        var e_investment_qa: Double = 0
        var e_investment_improvements: Double = 0
        var e_investment_recurring_first: Double = 0

        var total_investment_hardware: Double = 0
        var total_investment_software: Double = 0
        var total_investment_telecommunication: Double = 0
        var total_investment_development: Double = 0
        var total_investment_other: Double = 0
        var total_investment_qa: Double = 0
        var total_investment_improvements: Double = 0
        var total_investment_recurring_first: Double = 0

        var total_expend_hardware: Double = 0
        var total_expend_software: Double = 0
        var total_expend_telecommunication: Double = 0
        var total_expend_development: Double = 0
        var total_expend_other: Double = 0
        var total_expend_qa: Double = 0
        var total_expend_improvements: Double = 0
        var total_expend_recurring_first: Double = 0
        var i_node = new JSONObject()
        var e_node = new JSONObject()
        var jsonArr = new JSONArray()

        val total_sap_invest = SAPServices.findSAPInvestmentDetails(id)
        if (!total_sap_invest.isEmpty) {

          if (!total_sap_invest.get.hardware.isEmpty)
            total_investment_hardware += total_sap_invest.get.hardware.get

          if (!total_sap_invest.get.software.isEmpty)
            total_investment_software += total_sap_invest.get.software.get

          if (!total_sap_invest.get.telecommunication.isEmpty)
            total_investment_telecommunication += total_sap_invest.get.telecommunication.get

          if (!total_sap_invest.get.development.isEmpty)
            total_investment_development += total_sap_invest.get.development.get

          if (!total_sap_invest.get.other.isEmpty)
            total_investment_other += total_sap_invest.get.other.get

          if (!total_sap_invest.get.qa.isEmpty)
            total_investment_qa += total_sap_invest.get.qa.get

          if (!total_sap_invest.get.improvements.isEmpty)
            total_investment_improvements += total_sap_invest.get.improvements.get

          if (!total_sap_invest.get.recurring_first.isEmpty)
            total_investment_recurring_first += total_sap_invest.get.recurring_first.get

        }

        val total_sap_expand = SAPServices.findSAPExpenditureDetails(id)
        if (!total_sap_expand.isEmpty) {

          if (!total_sap_expand.get.hardware.isEmpty)
            total_expend_hardware += total_sap_expand.get.hardware.get

          if (!total_sap_expand.get.software.isEmpty)
            total_expend_software += total_sap_expand.get.software.get

          if (!total_sap_expand.get.telecommunication.isEmpty)
            total_expend_telecommunication += total_sap_expand.get.telecommunication.get

          if (!total_sap_expand.get.development.isEmpty)
            total_expend_development += total_sap_expand.get.development.get

          if (!total_sap_expand.get.other.isEmpty)
            total_expend_other += total_sap_expand.get.other.get

          if (!total_sap_expand.get.qa.isEmpty)
            total_expend_qa += total_sap_expand.get.qa.get

          if (!total_sap_expand.get.improvements.isEmpty)
            total_expend_improvements += total_sap_expand.get.improvements.get

          if (!total_sap_expand.get.recurring_first.isEmpty)
            total_expend_recurring_first += total_sap_expand.get.recurring_first.get

        }

        val project_saps_invests = SAPServices.findProjectSAPInvestmentDetails(id)
        for (p <- project_saps_invests) {
          if (!p.hardware.isEmpty)
            i_investment_hardware += p.hardware.get

          if (!p.software.isEmpty)
            i_investment_software += p.software.get

          if (!p.telecommunication.isEmpty)
            i_investment_telecommunication += p.telecommunication.get

          if (!p.development.isEmpty)
            i_investment_development += p.development.get

          if (!p.other.isEmpty)
            i_investment_other += p.other.get

          if (!p.qa.isEmpty)
            i_investment_qa += p.qa.get

          if (!p.improvements.isEmpty)
            i_investment_improvements += p.improvements.get

          if (!p.recurring_first.isEmpty)
            i_investment_recurring_first += p.recurring_first.get

        }

        val project_saps_expends = SAPServices.findProjectSAPExpenditureDetails(id)
        for (p <- project_saps_expends) {
          if (!p.hardware.isEmpty)
            e_investment_hardware += p.hardware.get

          if (!p.software.isEmpty)
            e_investment_software += p.software.get

          if (!p.telecommunication.isEmpty)
            e_investment_telecommunication += p.telecommunication.get

          if (!p.development.isEmpty)
            e_investment_development += p.development.get

          if (!p.other.isEmpty)
            e_investment_other += p.other.get

          if (!p.qa.isEmpty)
            e_investment_qa += p.qa.get

          if (!p.improvements.isEmpty)
            e_investment_improvements += p.improvements.get

          if (!p.recurring_first.isEmpty)
            e_investment_recurring_first += p.recurring_first.get

        }

        total_investment_hardware = total_investment_hardware - i_investment_hardware
        total_investment_software = total_investment_software - i_investment_software
        total_investment_telecommunication = total_investment_telecommunication - i_investment_telecommunication
        total_investment_development = total_investment_development - i_investment_development
        total_investment_other = total_investment_other - i_investment_other
        total_investment_qa = total_investment_qa - i_investment_qa
        total_investment_improvements = total_investment_improvements - i_investment_improvements
        total_investment_recurring_first = total_investment_recurring_first - i_investment_recurring_first

        total_expend_hardware = total_expend_hardware - e_investment_hardware
        total_expend_software = total_expend_software - e_investment_software
        total_expend_telecommunication = total_expend_telecommunication - e_investment_telecommunication
        total_expend_development = total_expend_development - e_investment_development
        total_expend_other = total_expend_other - e_investment_other
        total_expend_qa = total_expend_qa - e_investment_qa
        total_expend_improvements = total_expend_improvements - e_investment_improvements
        total_expend_recurring_first = total_expend_recurring_first - e_investment_recurring_first

        i_node.put("hardware", total_investment_hardware)
        i_node.put("software", total_investment_software)
        i_node.put("telecommunication", total_investment_telecommunication)
        i_node.put("development", total_investment_development)
        i_node.put("other", total_investment_other)
        i_node.put("qa", total_investment_qa)
        i_node.put("improvements", total_investment_improvements)
        i_node.put("recurring_first", total_investment_recurring_first)

        e_node.put("hardware", total_expend_hardware)
        e_node.put("software", total_expend_software)
        e_node.put("telecommunication", total_expend_telecommunication)
        e_node.put("development", total_expend_development)
        e_node.put("other", total_expend_other)
        e_node.put("qa", total_expend_qa)
        e_node.put("improvements", total_expend_improvements)
        e_node.put("recurring_first", total_expend_recurring_first)

        jsonArr.put(i_node)
        jsonArr.put(e_node)

        Ok(jsonArr.toString())

      } else {
        Ok("fail")
      }
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }

  }

  def updateProjectStatus(project_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var FormattedDATE = new SimpleDateFormat("yyyy-MM-dd");
      var today = FormattedDATE.format(new Date().getTime()).toString()
      val projectStatus=ProjectService.findAllProjectStatus(project_id)
      Ok(views.html.frontend.project.updateProjectStatus(ARTForms.projectStatusForm, project_id, projectStatus)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def updateStatus(project_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var FormattedDATE = new SimpleDateFormat("yyyy-MM-dd");
      var today = FormattedDATE.format(new Date().getTime()).toString()
      val projectStatus=ProjectService.findAllProjectStatus(project_id)
      ARTForms.projectStatusForm.bindFromRequest.fold(
        errors => {
          println(errors.errors);
          BadRequest(views.html.frontend.project.updateProjectStatus(errors, project_id, projectStatus)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
        },
        project_status => {
          val lastIndex = ProjectService.insertProjectStatus(project_status)
          Redirect(routes.ProjectMaster.updateProjectStatus(project_id))
        })
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def getProjectSpiGraph(project_id: String) = Action { implicit request =>
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

      var spicpiCal = services.EarnValueService.getEarnValue(project_id, "Project");
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
            subtask_id_map.put(formattedDate.parse(s.fecha.toString()).getTime(), project_id.toInt);
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

  def updateProjectEndDates(project_id: String, end_date: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var result = "fail"
      var node = new JSONObject()
      if (!StringUtils.isEmpty(project_id) && !StringUtils.isEmpty(end_date)) {
        val tasks = TaskService.findTaskListByProjectId(project_id)
        var FormattedDATE = new SimpleDateFormat("yyyy-MM-dd");
        var FormattedDATE2 = new SimpleDateFormat("dd-MM-yyyy");
        var endDate = FormattedDATE2.parse(end_date)
        var isValidTask = true
        var isValidSubTask = true

        for (t <- tasks) {
          if (t.plan_start_date.after(endDate)) {
            isValidTask = false
          } else {
            val sub_tasks = SubTaskServices.findSubTasksByTask(t.tId.get.toString())
            for (s <- sub_tasks) {
              if (s.plan_start_date.after(endDate)) {
                isValidSubTask = false
              }
            }
          }
        }

        if (isValidTask && isValidSubTask) {
          for (t <- tasks) {
            if (t.plan_start_date.before(endDate) && t.plan_end_date.after(endDate)) {
              TaskService.updateTaskPlannedEndDate(t.tId.get.toString(), FormattedDATE.format(endDate))

              val sub_tasks = SubTaskServices.findSubTasksByTask(t.tId.get.toString())
              for (s <- sub_tasks) {
                if (s.plan_start_date.before(endDate) && s.plan_end_date.after(endDate)) {
                  SubTaskServices.updateSubTaskPlannedDate(s.sub_task_id.get.toString(), FormattedDATE.format(endDate))
                }
              }

            }
          }
          
            node.put("status", "success")

        } else {
          if (isValidSubTask) {
            node.put("status", "fail")
            node.put("Message", "Date is not valid at Sub Task Level.")
          } else {
            node.put("status", "fail")
            node.put("Message", "Date is not valid at Task Level.")
          }
        }

   

      }
      Ok(node.toString())
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def updateProjectStartDates(project_id: String, start_date: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var result = "fail"
      var node = new JSONObject()
      if (!StringUtils.isEmpty(project_id) && !StringUtils.isEmpty(start_date)) {
        val tasks = TaskService.findTaskListByProjectId(project_id)
        var FormattedDATE = new SimpleDateFormat("yyyy-MM-dd");
        var FormattedDATE2 = new SimpleDateFormat("dd-MM-yyyy");
        var endDate = FormattedDATE2.parse(start_date)
        var isValidTask = true
        var isValidSubTask = true

        for (t <- tasks) {
          if (t.plan_end_date.before(endDate)) {
            isValidTask = false
          } else {
            val sub_tasks = SubTaskServices.findSubTasksByTask(t.tId.get.toString())
            for (s <- sub_tasks) {
              if (s.plan_end_date.before(endDate)) {
                isValidSubTask = false
              }
            }
          }
        }

        if (isValidTask && isValidSubTask) {
          
          for (t <- tasks) {
            if (t.plan_start_date.before(endDate) && t.plan_end_date.after(endDate)) {
              TaskService.updateTaskPlannedStartDate(t.tId.get.toString(), FormattedDATE.format(endDate))
              val sub_tasks = SubTaskServices.findSubTasksByTask(t.tId.get.toString())
              for (s <- sub_tasks) {
                if (s.plan_start_date.before(endDate) && s.plan_end_date.after(endDate)) {
                  SubTaskServices.updateSubTaskPlannedStartDate(s.sub_task_id.get.toString(), FormattedDATE.format(endDate))
                }
              }

            }
          }
          
            node.put("status", "success")

        } else {
          if (isValidSubTask) {
            node.put("status", "fail")
            node.put("Message", "Date is not valid at Sub Task Level.")
          } else {
            node.put("status", "fail")
            node.put("Message", "Date is not valid at Task Level.")
          }
        }

   

      }
      Ok(node.toString())
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }
  
}