package controllers

import art_forms.ARTForms
import models.ProjectWorkflowMaster
import play.api.mvc.Action
import play.api.mvc.Controller
import services.ProjectWorkflowStatusService
import models.ProjectWorkflow
import services.UserService
import play.api.data.Form
import java.util.Date
import models.Activity
import models.ActivityTypes

object ProjectWorkflowStatus extends Controller {
  var username = ""
  var description = ""
  var pageNumber = "1"
  var recordOnPage = "10"
  var search = ""

  def projectWorkflowList() = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val username = request.session.get("username").get
      val pagNo = request.getQueryString("page")
      val pageRecord = request.getQueryString("record")
      val searchKey = request.getQueryString("search")
      if (pagNo != None) {
        pageNumber = pagNo.get.toString()
      }
      if (pageRecord != None) {
        recordOnPage = pageRecord.get.toString()
      }
      if (searchKey != None) {
        search = searchKey.get.toString()
      }
      val projectWorkflows = ProjectWorkflowStatusService.findProjectWorkflowList(pageNumber, recordOnPage)
      var totalCount = ProjectWorkflowStatusService.projectWorkflowStatusCount
      var pagination = Application.Pagination(totalCount, pageNumber, recordOnPage, search)
      Ok(views.html.projectWorkFlowStatus.projectWorkflowList(projectWorkflows, username, totalCount, pagination))
    }
  }

  def addProjectWorkFlowStatus() = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val result = request.session.get("username")
      var username = result.get
      Ok(views.html.projectWorkFlowStatus.addProjectWorkflowStatus(username, ARTForms.projectWorkflowForm))
    }
  }

  def saveProjectWorkFlowStatus() = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val result = request.session.get("username")
      var username = result.get
      ARTForms.projectWorkflowForm.bindFromRequest.fold(
        hasErrors => {
          BadRequest(views.html.projectWorkFlowStatus.addProjectWorkflowStatus(username, hasErrors))
        },
        success => {
          val theForm: Form[ProjectWorkflow] = ProjectWorkflowStatusService.validateStatusForm(ARTForms.projectWorkflowForm.fill(success))
          if (theForm.hasErrors) {
            BadRequest(views.html.projectWorkFlowStatus.addProjectWorkflowStatus(username, theForm))
          } else {
            var date = new java.util.Date();
            var projectWorkflow = ProjectWorkflowMaster(success.id, success.project_workflow_status, success.description, UserService.findUserDetailsByUsername(username).get.uid.get, Option(date), false)
            val last = ProjectWorkflowStatusService.saveProjectWorkFlowStatus(projectWorkflow);
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Project_Workflow_Status.id, "Status created by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), last.toInt)
            Activity.saveLog(act)
            Redirect(routes.ProjectWorkflowStatus.projectWorkflowList())
          }
        })
    }
  }

  def editProjectWorkflowStatus(id: String) = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {

      val result = request.session.get("username")
      var username = result.get
      val objSM = ProjectWorkflowStatusService.findProjectWorkflowStatusDetailById(id)
      
      if (!objSM.isEmpty) {

        val SM = ProjectWorkflow(objSM.get.id, objSM.get.project_workflow_status, objSM.get.description)
        val result = request.session.get("username")
        var username = result.get
        val formEdit = ARTForms.projectWorkflowForm.fill(SM)
        Ok(views.html.projectWorkFlowStatus.editProjectWorkflowStatus(username, formEdit))
      } else {
        Redirect(routes.ProjectWorkflowStatus.projectWorkflowList())
      }
    }
  }

  def updateProjectWorkflowStatus() = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val result = request.session.get("username")
      var username = result.get
      ARTForms.projectWorkflowForm.bindFromRequest.fold(
        hasErrors => {
          BadRequest(views.html.projectWorkFlowStatus.editProjectWorkflowStatus(username, hasErrors))
        }, success => {
          val theForm: Form[ProjectWorkflow] = ProjectWorkflowStatusService.validateStatusFormForEdit(ARTForms.projectWorkflowForm.fill(success))
          if (theForm.hasErrors) {
            BadRequest(views.html.projectWorkFlowStatus.editProjectWorkflowStatus(username, theForm))
          } else {
            var date = new java.util.Date();
            val is_deleted = ProjectWorkflowStatusService.findProjectWorkflowStatusDetailById(success.id.get.toString).get.is_deleted
            var projectWorkflow = ProjectWorkflowMaster(success.id, success.project_workflow_status, success.description, UserService.findUserDetailsByUsername(username).get.uid.get, Option(date), is_deleted)
            ProjectWorkflowStatusService.updateProjectWorkFlowStatus(projectWorkflow);
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Project_Workflow_Status.id, "Status updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), success.id.get)
            Activity.saveLog(act)
            Redirect(routes.ProjectWorkflowStatus.projectWorkflowList())
          }
        })
    }
  }

  def updatesProjectWorkflowStatus(id: String, status: Boolean) = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      /*     var status = ProjectWorkflowStatusService.findProjectWorkflowStatusById(id)
      var isDel = false
      if (status.get.is_deleted) {
        isDel = false
      } else {
        isDel = true
      }
      val objUpdate = ProjectWorkflowMaster(status.get.id, status.get.project_workflow_status, status.get.description, Integer.parseInt(request.session.get("uId").get),Option(new Date()), isDel)
      ProjectWorkflowStatusService.updateProjectWorkFlowStatus(objUpdate)*/
      var is_deleted = 1
      if (status) {
        is_deleted = 0
      }
      val uid = Integer.parseInt(request.session.get("uId").get.trim())
      ProjectWorkflowStatusService.changeProjectWorkflowStatus(id, is_deleted, uid)
      /**
       * Activity log
       */
      val act = Activity(ActivityTypes.Project_Workflow_Status.id, "Status deleted by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), id.toInt)
      Activity.saveLog(act)
      Ok("Success")
    }
  }

}