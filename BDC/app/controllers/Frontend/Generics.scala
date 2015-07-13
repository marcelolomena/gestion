package controllers.Frontend

import java.util.Date
import scala.math.BigDecimal.int2bigDecimal
import scala.util.Random
import org.apache.commons.lang3.StringUtils
import anorm.NotAssigned
import art_forms.ARTForms
import models.GenericTaskDetails
import models.GenericTask
import models.GenericTasks
import models.PredefinedTasks
import models.ProjectType
import play.api.mvc.Action
import play.api.mvc.Controller
import services.DeliverableService
import services.GenericProjectService
import services.GenericProjectTypeService
import services.GenericService
import services.StageService
import services.TaskDesciplineService
import services.UserRoleService
import services.UserService
import org.json.JSONObject
import models.GenericProjectTypes
import models.Activity
import models.ActivityTypes
import services.ServiceCatalogueService
object Generics extends Controller {

  var pmMap = new java.util.HashMap[String, String]()

  def overview() = Action {
    implicit request =>
      request.session.get("username").map { user =>
        val projectTypes = GenericProjectService.findAllProjectTypes();
        val predefinedTasks = GenericProjectService.findAllPredefinedTasks();
        Ok(views.html.frontend.generics.overview(projectTypes, predefinedTasks))
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }

  def historicOverview() = Action {
    implicit request =>
      request.session.get("username").map { user =>
        val projectTypes = GenericProjectService.findAllHistoricProjectTypes();
        Ok(views.html.frontend.generics.historicOverview(projectTypes))
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }

  def projectTypeDetailTempalte(id: String) = Action {
    implicit request =>
      request.session.get("username").map { user =>
        val projectTypes = GenericProjectService.findProjectTypeDetails(id);
        val genericTasks = GenericService.findGenericProjectTypeTasks(id)
        Ok(views.html.frontend.generics.projectTypeDetails(projectTypes, genericTasks, id))
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }

  /**
   * add new project type ...
   *
   */
  def addProjectType() = Action { implicit request =>
    request.session.get("username").map { user =>
      var Ptypes = new java.util.HashMap[String, String]()
      val pList = GenericProjectTypeService.findAllActiveGenericProjectType
      for (p <- pList) {
        if (p.id.get != 8)
          Ptypes.put(p.id.get.toString, p.generic_project_type)
      }
      Ok(views.html.frontend.generics.addNewProjectType(ARTForms.projectctTypeForm, Ptypes))
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * edit new historic project type ...
   *
   */
  def editHistoricProjectType(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val value = GenericProjectService.findProjectTypeDetails(id);
      var Ptypes = new java.util.HashMap[String, String]()
      val pList = GenericProjectTypeService.findAllActiveGenericProjectType
      for (p <- pList) {
        if (p.id.get != 8)
          Ptypes.put(p.id.get.toString, p.generic_project_type)
      }

      val genericProjectType = models.GenericProjectType(Option(id.toInt), Option(""), value.get.description, value.get.project_type, value.get.responsible, value.get.states, value.get.creation_date, value.get.updation_date)
      var etype = GenericProjectTypeService.findGenericProjectTypeById(value.get.project_type.toString).get.generic_project_type
      Ok(views.html.frontend.generics.editHistoricProjectType(ARTForms.projectctEditTypeForm.fill(genericProjectType), Ptypes, id, etype))
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * Update  Historic project type ...
   *
   */
  def updateHistoricProjectType(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var Ptypes = new java.util.HashMap[String, String]()
      val pList = GenericProjectTypeService.findAllActiveGenericProjectType
      for (p <- pList) {
        if (p.id.get != 8)
          Ptypes.put(p.id.get.toString, p.generic_project_type)
      }
      val value = GenericProjectService.findProjectTypeDetails(id);
      var etype = GenericProjectTypeService.findGenericProjectTypeById(value.get.project_type.toString).get.generic_project_type

      ARTForms.projectctEditTypeForm.bindFromRequest().fold(
        hasErrors => {

          BadRequest(views.html.frontend.generics.editHistoricProjectType(hasErrors, Ptypes, id, etype))
        },
        success => {
          val theForm = GenericProjectService.validateForm(ARTForms.projectctEditTypeForm.fill(success))
          if (theForm.hasErrors) {
            BadRequest(views.html.frontend.generics.editHistoricProjectType(theForm, Ptypes, id, etype))
          } else {
            val result = GenericProjectService.updateProjectType(success)

            Redirect(routes.Generics.historicOverview())
          }
        })
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * edit new project type ...
   *
   */
  def editProjectType(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val value = GenericProjectService.findProjectTypeDetails(id);
      var Ptypes = new java.util.HashMap[String, String]()
      val pList = GenericProjectTypeService.findAllActiveGenericProjectType
      for (p <- pList) {
        if (p.id.get != 8)
          Ptypes.put(p.id.get.toString, p.generic_project_type)
      }
      var etype = GenericProjectTypeService.findGenericProjectTypeById(value.get.project_type.toString).get.generic_project_type
      val genericProjectType = models.GenericProjectType(Option(id.toInt), Option(""), value.get.description, value.get.project_type, value.get.responsible, value.get.states, value.get.creation_date, value.get.updation_date)
      Ok(views.html.frontend.generics.editProjectType(ARTForms.projectctEditTypeForm.fill(genericProjectType), Ptypes, id, etype))
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * save new project type  ...
   *
   */
  def saveProjectTypeDetails() = Action { implicit request =>
    var Ptypes = new java.util.HashMap[String, String]()
    val pList = GenericProjectTypeService.findAllActiveGenericProjectType
    for (p <- pList) {
      if (p.id.get != 8)
        Ptypes.put(p.id.get.toString, p.generic_project_type)
    }
    request.session.get("username").map { user =>
      val oldForm = ARTForms.projectctTypeForm.bindFromRequest()
      oldForm.fold(
        hasErrors => {
          println(hasErrors.errors)
          var newForm = oldForm
          val theForm = GenericProjectService.newProjectTypevalidateForm(newForm)
          BadRequest(views.html.frontend.generics.addNewProjectType(theForm, Ptypes))
        },
        success => {
          val theForm = GenericProjectService.newProjectTypevalidateForm(ARTForms.projectctTypeForm.fill(success))
          if (theForm.hasErrors) {
            BadRequest(views.html.frontend.generics.addNewProjectType(theForm, Ptypes))
          } else {
            for (d <- GenericProjectService.projectTypeValue.values) {
              if (d.id != 7) {
                Ptypes.put((d.id + 1).toString, d.toString().replace("_", " "))
              }
            }

            val uid = request.session.get("uId").get
            val objCreate = GenericProjectTypes(None, success.generic_project_type.get, success.description, Option(uid.toInt), Option(new Date()), Option(new Date()), 0)
            val last_save = GenericProjectTypeService.saveGenericProjectType(objCreate)

            val project = models.GenericProjectType(success.id, success.generic_project_type, success.description, last_save.toInt, success.responsible, success.states, Option(new Date()), Option(new Date()))

            val last_saved = GenericProjectService.insertProjectType(project)
            //var project_name = GenericProjectTypeService.findGenericProjectTypeById(success.project_type.toString).get.generic_project_type
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Generic_Project_Type.id, "Generic Project type created by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), last_save.toInt)
            Activity.saveLog(act)
            Redirect(routes.Generics.overview())
          }

          /*  }*/
        })
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * Update  project type ...
   *
   */
  def updateProjectType(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var Ptypes = new java.util.HashMap[String, String]()

      val pList = GenericProjectTypeService.findAllActiveGenericProjectType
      for (p <- pList) {
        if (p.id.get != 8)
          Ptypes.put(p.id.get.toString, p.generic_project_type)
      }
      val value = GenericProjectService.findProjectTypeDetails(id);
      val oldForm = ARTForms.projectctEditTypeForm.bindFromRequest()

      val typeValue = oldForm.data.get("project_type").get

      //println(resultValue.get.generic_project_type+"----------")
      oldForm.fold(
        hasErrors => {
          println(hasErrors.errors)
          var etype = GenericProjectTypeService.findGenericProjectTypeById(value.get.project_type.toString).get.generic_project_type

          BadRequest(views.html.frontend.generics.editProjectType(hasErrors, Ptypes, id, etype))
        },
        success => {
          // println(resultValue.get.is_deleted)
          var etype = GenericProjectTypeService.findGenericProjectTypeById(value.get.project_type.toString).get.generic_project_type
          //result.
          /*      val theForm = GenericProjectService.validateForm(ARTForms.projectctEditTypeForm.fill(success))
          if (theForm.hasErrors) {
            BadRequest(views.html.frontend.generics.editProjectType(theForm, Ptypes, id, etype))
          } else {*/
          val result = GenericProjectService.updateProjectType(success)
          /**
           * Activity log
           */
          val act = Activity(ActivityTypes.Generic_Project_Type.id, "Generic Project type updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), id.toInt)
          Activity.saveLog(act)
          Redirect(routes.Generics.overview())
          /* }*/
        })
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * Delete project type by Id
   * Precondition - If there is no tasks under same project then only we can delete the project.
   *
   */
  def deleteProjectType(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      GenericProjectService.deleteProjectType(id)
      /**
       * Activity log
       */
      val act = Activity(ActivityTypes.Generic_Project_Type.id, "Generic Project type deleted by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), id.toInt)
      Activity.saveLog(act)
      Redirect(routes.Generics.overview())
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def newGenericTask(id: String) = Action {
    implicit request =>
      request.session.get("username").map { user =>
        val projectType = GenericProjectService.findProjectTypeDetails(id)
        projectType match {
          case None =>
            Redirect(routes.Generics.overview())
          case Some(pType: ProjectType) =>

            var descipline = new java.util.LinkedHashMap[String, String]()
            val disciplines = TaskDesciplineService.findAllTaskDesciplineList()
            for (d <- disciplines) {
              descipline.put(d.id.get.toString, d.task_discipline)
            }
            var stagesMap = new java.util.LinkedHashMap[String, String]()
            val stages = StageService.findAllStages()
            for (stage <- stages) {
              stagesMap.put(stage.id.get.toString, stage.stage)
            }

            var deliverablesMap = new java.util.HashMap[String, String]()
            val deliverables = DeliverableService.findAllDeliverables()
            for (deliverable <- deliverables) {
              deliverablesMap.put(deliverable.id.get.toString, deliverable.deliverable)
            }
            var userRolesMap = new java.util.HashMap[String, String]()
            val useRoles = UserRoleService.findAllUserRoles()
            for (urole <- useRoles) {
              userRolesMap.put(urole.rId.get.toString, urole.role)
            }
            Ok(views.html.frontend.generics.newGenericTask(ARTForms.genericTaskForm, id, descipline, stagesMap, userRolesMap, deliverablesMap))
        }

      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }

  def saveTaskDetails(id: String) = Action { implicit request =>
    val users = UserService.findAllUsers

    var descipline = new java.util.LinkedHashMap[String, String]()
    val disciplines = TaskDesciplineService.findAllTaskDesciplineList()
    for (d <- disciplines) {
      descipline.put(d.id.get.toString, d.task_discipline)
    }
    var stagesMap = new java.util.LinkedHashMap[String, String]()
    val stages = StageService.findAllStages()
    for (stage <- stages) {
      stagesMap.put(stage.id.get.toString, stage.stage)
    }

    var deliverablesMap = new java.util.HashMap[String, String]()
    val deliverables = DeliverableService.findAllDeliverables()
    for (deliverable <- deliverables) {
      deliverablesMap.put(deliverable.id.get.toString, deliverable.deliverable)
    }
    var userRolesMap = new java.util.HashMap[String, String]()
    val useRoles = UserRoleService.findAllUserRoles()
    for (urole <- useRoles) {
      userRolesMap.put(urole.rId.get.toString, urole.role)
    }
    ARTForms.genericTaskForm.bindFromRequest.fold(
      errors => {
        println(errors)
        println(errors.data)

        var selected_task = ""
        if (!errors.data.get("task_depend").isEmpty) {
          selected_task = errors.data.get("task_depend").get
        }
        BadRequest(views.html.frontend.generics.newGenericTask(errors, id, descipline, stagesMap, userRolesMap, deliverablesMap))

      },
      success => {
        val taskDetails = GenericTasks(None, success.task_mode, success.task_title, success.task_details.task_code,
          success.plan_start_date, success.plan_end_date, success.task_description, success.plan_time,
          new Date(), success.task_status, 1, success.owner, success.task_discipline, success.completion_percentage,
          success.remark, success.task_depend, success.task_details.stage, success.task_details.user_role, success.task_details.deliverable, success.task_details.task_type, success.task_details.predefined_task_id, 1)

        val predefined_id = success.task_details.predefined_task_id.toString()
        val catalogue_service_id = GenericService.findPredefinedTasksDetails(predefined_id).get.catalogue_service
        val latest_task = GenericService.insertTask(taskDetails, catalogue_service_id)
        /**
         * Activity log Generic_Task_Type
         */
        val act = Activity(ActivityTypes.Generic_Task_Type.id, "Generic task added by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), id.toInt)
        Activity.saveLog(act)
        Redirect(routes.Generics.projectTypeDetailTempalte(id))

      })
  }

  def editGenericTask(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val genericTask = GenericService.findGenericTasksDetails(id)

      var stagesMap = new java.util.LinkedHashMap[String, String]()
      val stages = StageService.findAllStages()
      for (stage <- stages) {
        stagesMap.put(stage.id.get.toString, stage.stage)
      }

      var deliverablesMap = new java.util.HashMap[String, String]()
      val deliverables = DeliverableService.findAllDeliverables()
      for (deliverable <- deliverables) {
        deliverablesMap.put(deliverable.id.get.toString, deliverable.deliverable)
      }

      var descipline = new java.util.LinkedHashMap[String, String]()
      val disciplines = TaskDesciplineService.findAllTaskDesciplineList()
      for (d <- disciplines) {
        descipline.put(d.id.get.toString, d.task_discipline)
      }
      var userRolesMap = new java.util.HashMap[String, String]()
      val useRoles = UserRoleService.findAllUserRoles()
      for (urole <- useRoles) {
        userRolesMap.put(urole.rId.get.toString, urole.role)
      }

      val taskDetails = GenericTaskDetails(genericTask.get.task_type, genericTask.get.task_code, genericTask.get.stage, genericTask.get.user_role, genericTask.get.deliverable, genericTask.get.predefined_task_id, genericTask.get.is_active)
      val genricTaskMaster = GenericTask(Option(genericTask.get.tId.get), genericTask.get.task_mode, genericTask.get.task_title, genericTask.get.plan_start_date,
        genericTask.get.plan_end_date, genericTask.get.task_description, genericTask.get.plan_time, genericTask.get.task_status,
        genericTask.get.status, genericTask.get.owner, genericTask.get.task_discipline, genericTask.get.completion_percentage,
        genericTask.get.remark, genericTask.get.task_depend, taskDetails)

      Ok(views.html.frontend.generics.editGenericTask(ARTForms.genericTaskForm.fill(genricTaskMaster), id, descipline, stagesMap, userRolesMap, deliverablesMap))

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def deleteGenericTaskFromProjectType(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val genericTask = GenericService.findGenericTasksDetails(id)
      genericTask match {
        case None =>
          Redirect(routes.Login.loginUser())
        case Some(g: GenericTasks) =>

          val taskDetails = GenericTasks(genericTask.get.tId, genericTask.get.task_mode, genericTask.get.task_title, genericTask.get.task_code,
            genericTask.get.plan_start_date, genericTask.get.plan_end_date, genericTask.get.task_description, genericTask.get.plan_time,
            new Date(), genericTask.get.task_status, 1, genericTask.get.owner, genericTask.get.task_discipline, genericTask.get.completion_percentage,
            genericTask.get.remark, genericTask.get.task_depend, genericTask.get.stage, genericTask.get.user_role, genericTask.get.deliverable, genericTask.get.task_type, genericTask.get.predefined_task_id, 0)

          var generic_id = genericTask.get.task_mode

          val tasks = GenericService.findGenericProjectTypeTasks(generic_id.toString)
          GenericService.deleteTaskFromProjectTemplate(id);
          for (t <- tasks) {
            var current_tId = t.tId.toString()
            var task_depend = t.task_depend.get
            var new_task_depend = ""
            var task_dpeend_aaray = task_depend.split(",")
            var isvalid = false
            //println(generic_id + "---------generic_id" + task_depend+"---"+task_dpeend_aaray.size)
            for (ts <- task_dpeend_aaray) {
              var c_ts = StringUtils.trim(ts)
              if (StringUtils.equals(c_ts, id.toString())) {
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
              GenericService.updateDependecy(current_tId, new_task_depend)
            }
          }
          // 

          /**
           * Activity log Generic_Task_Type
           */
          val act = Activity(ActivityTypes.Generic_Task_Type.id, "Generic task deleted by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), id.toInt)
          Activity.saveLog(act)
          Ok("Success")
      }
      //val latest_task = GenericService.updateTask(taskDetails)
      //Redirect(routes.Generics.projectTypeDetailTempalte(genericTask.get.task_mode.toString))

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def updateGenericTask(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>

      var stagesMap = new java.util.LinkedHashMap[String, String]()
      val stages = StageService.findAllStages()
      for (stage <- stages) {
        stagesMap.put(stage.id.get.toString, stage.stage)
      }

      var deliverablesMap = new java.util.HashMap[String, String]()
      val deliverables = DeliverableService.findAllDeliverables()
      for (deliverable <- deliverables) {
        deliverablesMap.put(deliverable.id.get.toString, deliverable.deliverable)
      }
      var userRolesMap = new java.util.HashMap[String, String]()
      val useRoles = UserRoleService.findAllUserRoles()
      for (uroles <- useRoles) {
        userRolesMap.put(uroles.rId.get.toString, uroles.role)
      }
      var descipline = new java.util.LinkedHashMap[String, String]()
      val disciplines = TaskDesciplineService.findAllTaskDesciplineList()
      for (d <- disciplines) {
        descipline.put(d.id.get.toString, d.task_discipline)
      }
      ARTForms.genericTaskForm.bindFromRequest.fold(
        errors => {
          var selected_task = ""
          if (!errors.data.get("task_depend").isEmpty) {
            selected_task = errors.data.get("task_depend").get
          }
          BadRequest(views.html.frontend.generics.editGenericTask(errors, id, descipline, stagesMap, userRolesMap, deliverablesMap))

        },
        success => {
          val genericTask = GenericService.findGenericTasksDetails(id)
          val mode = success.task_mode
          val taskDetails = GenericTasks(genericTask.get.tId, success.task_mode, success.task_title, success.task_details.task_code,
            success.plan_start_date, success.plan_end_date, success.task_description, success.plan_time,
            new Date(), success.task_status, 1, success.owner, success.task_discipline, success.completion_percentage,
            success.remark, success.task_depend, success.task_details.stage, success.task_details.user_role, success.task_details.deliverable, success.task_details.task_type, success.task_details.predefined_task_id, success.task_details.is_active)

          val latest_task = GenericService.updateTask(taskDetails)
          /**
           * Activity log Generic_Task_Type
           */
          val act = Activity(ActivityTypes.Generic_Task_Type.id, "Generic task updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), id.toInt)
          Activity.saveLog(act)
          Redirect(routes.Generics.projectTypeDetailTempalte(mode.toString))

        })
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def getGenericTask(task_mode: String, selected_task: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val tasks = GenericService.findDependentTasks(task_mode, selected_task)
      Ok(views.html.frontend.generics.manageTasks(tasks))
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * Fill dropbox for dependent task list
   */
  def getGenericDependentTaskList(tasks: String) = Action { implicit request =>
    var finalString = ""

    if (!StringUtils.isEmpty(tasks)) {
      val taskList = tasks.split(",")

      for (t <- taskList) {

        if (!StringUtils.isEmpty(t.trim())) {
          val task = GenericService.findGenericTasksDetails(t)
          if (!task.isEmpty) {
            finalString += "<li>" + task.get.task_title + "</li>"
          }
        }
      }
    }

    Ok(finalString)

  }

  def addPredefinedTask() = Action {
    implicit request =>
      request.session.get("username").map { user =>

        var descipline = new java.util.LinkedHashMap[String, String]()
        val disciplines = TaskDesciplineService.findAllTaskDesciplineList()
        for (d <- disciplines) {
          descipline.put(d.id.get.toString, d.task_discipline)
        }
        var stagesMap = new java.util.LinkedHashMap[String, String]()
        val stages = StageService.findAllStages()
        for (stage <- stages) {
          stagesMap.put(stage.id.get.toString, stage.stage)
        }

        var deliverablesMap = new java.util.HashMap[String, String]()
        val deliverables = DeliverableService.findAllDeliverables()
        for (deliverable <- deliverables) {
          deliverablesMap.put(deliverable.id.get.toString, deliverable.deliverable)
        }
        var userRolesMap = new java.util.HashMap[String, String]()
        val useRoles = UserRoleService.findAllUserRoles()
        for (uroles <- useRoles) {
          userRolesMap.put(uroles.rId.get.toString, uroles.role)
        }
        val serviceCatalogueMap = new java.util.HashMap[String, String]()
        val serviceCatalogues = ServiceCatalogueService.getServiceCatalogue()
        for (serviceCatalogue <- serviceCatalogues) {
          serviceCatalogueMap.put(serviceCatalogue.id.get.toString, serviceCatalogue.service_name)
        }
        Ok(views.html.frontend.generics.addPredefinedTask(ARTForms.predefinedTaskForm, serviceCatalogueMap, descipline, stagesMap, userRolesMap, deliverablesMap))
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }

  def savePredefinedTask() = Action { implicit request =>
    val users = UserService.findAllUsers

    var descipline = new java.util.LinkedHashMap[String, String]()
    val disciplines = TaskDesciplineService.findAllTaskDesciplineList()
    for (d <- disciplines) {
      descipline.put(d.id.get.toString, d.task_discipline)
    }
    var stagesMap = new java.util.LinkedHashMap[String, String]()
    val stages = StageService.findAllStages()
    for (stage <- stages) {
      stagesMap.put(stage.id.get.toString, stage.stage)
    }

    var deliverablesMap = new java.util.HashMap[String, String]()
    val deliverables = DeliverableService.findAllDeliverables()
    for (deliverable <- deliverables) {
      deliverablesMap.put(deliverable.id.get.toString, deliverable.deliverable)
    }
    var userRolesMap = new java.util.HashMap[String, String]()
    val useRoles = UserRoleService.findAllUserRoles()
    for (uroles <- useRoles) {
      userRolesMap.put(uroles.rId.get.toString, uroles.role)
    }

    ARTForms.predefinedTaskForm.bindFromRequest.fold(
      errors => {
        var serviceCatalogueMap = new java.util.HashMap[String, String]()
        var descipline_id = ""
        var serviceCatalogues: Seq[models.ServiceCatalogueMaster] = null
        if (!errors.data.get("task_discipline").isEmpty) {
          descipline_id = errors.data.get("task_discipline").get;
          if (!descipline_id.isEmpty) {
            serviceCatalogues = ServiceCatalogueService.findActiveServiceCatalogueByDescipline(descipline_id)
          } else {
            serviceCatalogues = ServiceCatalogueService.getServiceCatalogue()
          }
        } else {
          serviceCatalogues = ServiceCatalogueService.getServiceCatalogue()
        }

        for (serviceCatalogue <- serviceCatalogues) {
          serviceCatalogueMap.put(serviceCatalogue.id.get.toString, serviceCatalogue.service_name)
        }
        BadRequest(views.html.frontend.generics.addPredefinedTask(errors, serviceCatalogueMap, descipline, stagesMap, userRolesMap, deliverablesMap))
      },
      success => {
        val theForm = GenericService.newProjectTypevalidateForm(ARTForms.predefinedTaskForm.fill(success))
        if (theForm.hasErrors) {
          var serviceCatalogueMap = new java.util.HashMap[String, String]()
          var descipline_id = ""
          var serviceCatalogues: Seq[models.ServiceCatalogueMaster] = null
          if (!success.task_discipline.isEmpty) {
            descipline_id = success.task_discipline.get.toString();
            if (!descipline_id.isEmpty) {
              serviceCatalogues = ServiceCatalogueService.findActiveServiceCatalogueByDescipline(descipline_id)
            } else {
              serviceCatalogues = ServiceCatalogueService.getServiceCatalogue()
            }
          } else {
            serviceCatalogues = ServiceCatalogueService.getServiceCatalogue()
          }

          for (serviceCatalogue <- serviceCatalogues) {
            serviceCatalogueMap.put(serviceCatalogue.id.get.toString, serviceCatalogue.service_name)
          }
          BadRequest(views.html.frontend.generics.addPredefinedTask(theForm, serviceCatalogueMap, descipline, stagesMap, userRolesMap, deliverablesMap))
        } else {
          val taskDetails = PredefinedTasks(Option(1), success.task_type, success.task_title, success.task_description,
            success.task_discipline, success.remark, success.stage, success.user_role,
            success.deliverable, success.catalogue_service, 1)

          val latest_task = GenericService.insertPredefinedTask(taskDetails)
          /**
           * Activity log
           */
          val act = Activity(ActivityTypes.Predefined_Task_Type.id, "Predefined task added by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), latest_task.toInt)
          Activity.saveLog(act)
          Redirect(routes.Generics.overview())
        }
      })
  }

  def editPredefinedTask(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val genericTask = GenericService.findGenericTasksDetails(id)
      val predefinedTask = GenericService.findPredefinedTasksDetails(id)

      var descipline = new java.util.LinkedHashMap[String, String]()
      val disciplines = TaskDesciplineService.findAllTaskDesciplineList()
      for (d <- disciplines) {
        descipline.put(d.id.get.toString, d.task_discipline)
      }
      var stagesMap = new java.util.LinkedHashMap[String, String]()
      val stages = StageService.findAllStages()
      for (stage <- stages) {
        stagesMap.put(stage.id.get.toString, stage.stage)
      }

      var deliverablesMap = new java.util.HashMap[String, String]()
      val deliverables = DeliverableService.findAllDeliverables()
      for (deliverable <- deliverables) {
        deliverablesMap.put(deliverable.id.get.toString, deliverable.deliverable)
      }
      var userRolesMap = new java.util.HashMap[String, String]()
      val useRoles = UserRoleService.findAllUserRoles()
      for (uroles <- useRoles) {
        userRolesMap.put(uroles.rId.get.toString, uroles.role)
      }
      var serviceCatalogueMap = new java.util.HashMap[String, String]()
      var descipline_id = ""
      var serviceCatalogues: Seq[models.ServiceCatalogueMaster] = null
      if (!predefinedTask.get.task_discipline.isEmpty) {
        descipline_id = predefinedTask.get.task_discipline.get.toString();
        serviceCatalogues = ServiceCatalogueService.findActiveServiceCatalogueByDescipline(descipline_id)
      } else {
        serviceCatalogues = ServiceCatalogueService.getServiceCatalogue()
      }

      for (serviceCatalogue <- serviceCatalogues) {
        serviceCatalogueMap.put(serviceCatalogue.id.get.toString, serviceCatalogue.service_name)
      }
      val predefinedtaskDetails = PredefinedTasks(predefinedTask.get.tId, predefinedTask.get.task_type, predefinedTask.get.task_title,
        predefinedTask.get.task_description, predefinedTask.get.task_discipline, predefinedTask.get.remark,
        predefinedTask.get.stage, predefinedTask.get.user_role, predefinedTask.get.deliverable, predefinedTask.get.catalogue_service, 1)

      Ok(views.html.frontend.generics.editPredefinedTask(ARTForms.predefinedTaskForm.fill(predefinedtaskDetails), serviceCatalogueMap, descipline, stagesMap, userRolesMap, deliverablesMap, id))

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def deletePredefinedTask(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var predefinedTask = GenericService.findPredefinedTasksDetails(id);
      if (!predefinedTask.isEmpty) {
        var genericTasks = GenericService.findGenericTasksByPredefinedTaskId(id);
        if (genericTasks.size > 0) {
          for (genericTask <- genericTasks) {
            GenericService.deleteTaskFromProjectTemplate(genericTask.tId.get.toString);
          }
        }
        val taskDetails = PredefinedTasks(Option(predefinedTask.get.tId.get), predefinedTask.get.task_type, predefinedTask.get.task_title, predefinedTask.get.task_description,
          predefinedTask.get.task_discipline, predefinedTask.get.remark, predefinedTask.get.stage, predefinedTask.get.user_role,
          predefinedTask.get.deliverable, predefinedTask.get.catalogue_service, 0)
        val latest_task = GenericService.updatePredefinedTask(taskDetails)
        /**
         * Activity log
         */
        val act = Activity(ActivityTypes.Predefined_Task_Type.id, "Predefined task deleted by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), id.toInt)
        Activity.saveLog(act)
        Ok("Success")
      } else {
        Ok("Fail")
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def updatePredefinedTask(id: String) = Action { implicit request =>
    val users = UserService.findAllUsers
    var descipline = new java.util.LinkedHashMap[String, String]()
    val disciplines = TaskDesciplineService.findAllTaskDesciplineList()
    for (d <- disciplines) {
      descipline.put(d.id.get.toString, d.task_discipline)
    }
    val predefinedTask = GenericService.findPredefinedTasksDetails(id)

    var stagesMap = new java.util.LinkedHashMap[String, String]()
    val stages = StageService.findAllStages()
    for (stage <- stages) {
      stagesMap.put(stage.id.get.toString, stage.stage)
    }

    var deliverablesMap = new java.util.HashMap[String, String]()
    val deliverables = DeliverableService.findAllDeliverables()
    for (deliverable <- deliverables) {
      deliverablesMap.put(deliverable.id.get.toString, deliverable.deliverable)
    }
    var userRolesMap = new java.util.HashMap[String, String]()
    val useRoles = UserRoleService.findAllUserRoles()
    for (uroles <- useRoles) {
      userRolesMap.put(uroles.rId.get.toString, uroles.role)
    }

    ARTForms.predefinedTaskForm.bindFromRequest.fold(
      errors => {
        var serviceCatalogueMap = new java.util.HashMap[String, String]()
        var descipline_id = ""
        var serviceCatalogues: Seq[models.ServiceCatalogueMaster] = null
        if (!errors.data.get("task_discipline").isEmpty) {
          descipline_id = errors.data.get("task_discipline").get;
          if (!descipline_id.isEmpty()) {
            serviceCatalogues = ServiceCatalogueService.findActiveServiceCatalogueByDescipline(descipline_id)
          } else {
            serviceCatalogues = ServiceCatalogueService.getServiceCatalogue()
          }

        } else {
          serviceCatalogues = ServiceCatalogueService.getServiceCatalogue()
        }

        for (serviceCatalogue <- serviceCatalogues) {
          serviceCatalogueMap.put(serviceCatalogue.id.get.toString, serviceCatalogue.service_name)
        }
        BadRequest(views.html.frontend.generics.editPredefinedTask(errors, serviceCatalogueMap, descipline, stagesMap, userRolesMap, deliverablesMap, id))
      },
      success => {
        val theForm = GenericService.editProjectTypevalidateForm(ARTForms.predefinedTaskForm.fill(success), id.trim())
        if (theForm.hasErrors) {
          var serviceCatalogueMap = new java.util.HashMap[String, String]()
          var descipline_id = ""
          var serviceCatalogues: Seq[models.ServiceCatalogueMaster] = null
          if (!success.task_discipline.isEmpty) {
            descipline_id = success.task_discipline.get.toString();
            if (!descipline_id.isEmpty()) {
              serviceCatalogues = ServiceCatalogueService.findActiveServiceCatalogueByDescipline(descipline_id)
            } else {
              serviceCatalogues = ServiceCatalogueService.getServiceCatalogue()
            }
          } else {
            serviceCatalogues = ServiceCatalogueService.getServiceCatalogue()
          }

          for (serviceCatalogue <- serviceCatalogues) {
            serviceCatalogueMap.put(serviceCatalogue.id.get.toString, serviceCatalogue.service_name)
          }
          BadRequest(views.html.frontend.generics.editPredefinedTask(theForm, serviceCatalogueMap, descipline, stagesMap, userRolesMap, deliverablesMap, id))
        } else {
          val taskDetails = PredefinedTasks(Option(predefinedTask.get.tId.get), success.task_type, success.task_title, success.task_description,
            success.task_discipline, success.remark, success.stage, success.user_role,
            success.deliverable, success.catalogue_service, 1)
          val latest_task = GenericService.updatePredefinedTask(taskDetails)
          /**
           * Activity log
           */
          val act = Activity(ActivityTypes.Predefined_Task_Type.id, "Predefined task updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), id.toInt)
          Activity.saveLog(act)
          Redirect(routes.Generics.overview())
        }
      })
  }

  def getPredefinedTask(task_mode: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val tasks = GenericService.findAllPredefinedTasksDetails(task_mode)
      //      for (t <- tasks) {
      //        if (!t.task_discipline.isEmpty && !TaskDesciplineService.findTaskDesciplineById(t.task_discipline.get.toString).isEmpty) {
      //          println(TaskDesciplineService.findTaskDesciplineById(t.task_discipline.get.toString).get.task_discipline);
      //        }
      //      }
      /**
       *
       */
      val predefined_tasks = GenericService.findGenericProjectTypeTasks(task_mode)

      Ok(views.html.frontend.generics.managePredefinedTasks(tasks, predefined_tasks))

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def editTaskDependency(task_id: String, task_mode: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val task = GenericService.findGenericTasksDetails(task_id.split("_")(1))
      val predefined_tasks = GenericService.findGenericProjectTypeTasks(task_mode)
      val selected_tasks = task.get.task_depend.get
      Ok(views.html.frontend.generics.editDependency(predefined_tasks, selected_tasks, task_id.split("_")(1)))
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def updateTaskDependency(task_id: String, selected_task: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var node = new JSONObject()
      val task = GenericService.findGenericTasksDetails(task_id)
      var isValid = true
      if (!task.isEmpty) {
        val stasks = selected_task.split(",")

        for (ss <- stasks) {
          if (ss.trim() != "") {
            val taskDetails = GenericService.findGenericTasksDetails(ss.trim())
            if (!taskDetails.isEmpty) {
              if (!taskDetails.get.task_depend.isEmpty) {
                val values = taskDetails.get.task_depend.get
                val newvalues = values.split(",")
                for (nn <- newvalues) {
                  if (StringUtils.equals(nn.trim(), task_id)) {
                    isValid = false
                  }
                }
              }

            }
            if (StringUtils.equals(ss.trim(), task_id)) {
              isValid = false
            }
          }
        }

        if (isValid) {
          node.put("status", "Success")
          GenericService.UpdateDependency(task_id, selected_task)
        } else {
          node.put("status", "Fails")
          node.put("message", "Cyclic Dependency not allowed.")
        }

        Ok(node.toString())

      } else {
        node.put("status", "Fails")
        node.put("message", "Something wen wrong.")
        Ok(node.toString())
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def addPredefinedTaskToProject(id: String, task_mode: String, task_depend: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val predefinedTask = GenericService.findPredefinedTasksDetails(id)
      val format = new java.text.SimpleDateFormat("yyyy-MM-dd")
      val todaydate = format.format(new java.util.Date())
      //println(task_depend)
      var new_task_depend = ""
      if (task_depend != "null" && !StringUtils.equals(task_depend, "undefined") && !StringUtils.isEmpty(task_depend.trim())) {
        new_task_depend = task_depend
      }
      val taskDetails = GenericTasks(None, Integer.parseInt(task_mode), predefinedTask.get.task_title, "SYS" + Random.nextInt(9999),
        new Date(), new Date(), predefinedTask.get.task_description, 0,
        new Date(), 0, 1, 1, predefinedTask.get.task_discipline, Option(0),
        predefinedTask.get.remark, Option(new_task_depend), predefinedTask.get.stage, predefinedTask.get.user_role, predefinedTask.get.deliverable, predefinedTask.get.task_type, predefinedTask.get.tId.get, 1)

      val predefined_id = taskDetails.predefined_task_id.toString()
      val service_id = GenericService.findPredefinedTasksDetails(predefined_id).get.catalogue_service
      val latest_task = GenericService.insertTask(taskDetails, service_id)

      Ok("success");

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def deletedPredefinedTask(task_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val tasks = GenericService.findAllPredefinedTasksDetails(task_id)
      val predefined_tasks = GenericService.findGenericProjectTypeTasks(task_id)
      Ok(views.html.frontend.generics.managePredefinedTasks(tasks, predefined_tasks))

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def addGenericTask(task_mode: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val tasks = GenericService.findAllPredefinedTasksDetails(task_mode)
      /*for (t <- tasks) {
        if (!t.task_discipline.isEmpty && !TaskDesciplineService.findTaskDesciplineById(t.task_discipline.get.toString).isEmpty) {
          println(TaskDesciplineService.findTaskDesciplineById(t.task_discipline.get.toString).get.task_discipline);
        }
      }*/
      val predefined_tasks = GenericService.findGenericProjectTypeTasks(task_mode)
      Ok(views.html.frontend.generics.addGenericTask(tasks, predefined_tasks, task_mode))

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

}