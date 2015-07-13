package controllers

import art_forms.ARTForms
import models.Workflows
import play.api.mvc.Controller
import services.WorkflowStatusService

object WorkflowStatus extends Controller with Secured {
	var username = ""
	var description = ""
	var pageNumber = "1"
	var recordOnPage = "10"
	var search = ""

	def workflowList() = IsAuthenticatedAdmin() { _ =>
		{ implicit request =>
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
			val workflows = WorkflowStatusService.findWorkflowList(pageNumber, recordOnPage)
			var totalCount = WorkflowStatusService.findAllWorkflowList.size
			var pagination = Application.Pagination(totalCount, pageNumber, recordOnPage, search)
			Ok(views.html.programWorkFlowStatus.workflowList(workflows, username, totalCount, pagination))
		}

	}

	def addWorkflowStatus() = IsAuthenticatedAdmin() { _ =>
		{ implicit request =>
			val result = request.session.get("username")
			var username = result.get
			Ok(views.html.programWorkFlowStatus.addWorkflowStatus(username, ARTForms.workflowForm))
		}
	}

	def saveWorkFlowStatus() = IsAuthenticatedAdmin() { _ =>
		{ implicit request =>
			val result = request.session.get("username")
			var username = result.get
			ARTForms.workflowForm.bindFromRequest.fold(
				hasErrors => {
					BadRequest(views.html.programWorkFlowStatus.addWorkflowStatus(username, hasErrors))
				},
				success => {
					val objCreate = Workflows(success.id, success.workflow_status)
					WorkflowStatusService.saveWorkFlowStatus(objCreate);
					Redirect(routes.WorkflowStatus.workflowList())
				})
		}
	}

	def editWorkflowStatus(id: String) = IsAuthenticatedAdmin() { _ =>
		{ implicit request =>
			val objSM = WorkflowStatusService.findWorkflowStatusById(id)
			if (!objSM.isEmpty) {
				val SM = Workflows(objSM.get.id, objSM.get.workflow_status)
				val result = request.session.get("username")
				var username = result.get
				val formEdit = ARTForms.workflowForm.fill(SM)
				Ok(views.html.programWorkFlowStatus.editWorkFlowStatus(username, formEdit))
			} else {
				Redirect(routes.WorkflowStatus.workflowList())
			}
		}
	}

	def updateWorkflowStatus() = IsAuthenticatedAdmin() { _ =>
		{ implicit request =>
			val result = request.session.get("username")
			var username = result.get
			ARTForms.workflowForm.bindFromRequest.fold(
				hasErrors => {
					BadRequest(views.html.programWorkFlowStatus.editWorkFlowStatus(username, hasErrors))
				},
				success => {
					val objUpdate = Workflows(success.id, success.workflow_status)
					WorkflowStatusService.updateWorkFlowStatus(objUpdate);
					Redirect(routes.WorkflowStatus.workflowList())
				})
		}
	}

	def deleteWorkflowStatus(id: String) = IsAuthenticatedAdmin() { _ =>
		{ implicit request =>
			WorkflowStatusService.deleteWorkflowStatus(id)
			Redirect(routes.WorkflowStatus.workflowList())
		}
	}
}