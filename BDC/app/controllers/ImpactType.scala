package controllers

import art_forms.ARTForms
import models.ImpactTypes
import play.api.mvc.Controller
import services.ImpactTypeService

object ImpactType extends Controller with Secured {
	var username = ""
	var description = ""
	var pageNumber = "1"
	var recordOnPage = "10"
	var search = ""

	def impactTypeList() = IsAuthenticatedAdmin() { _ =>
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
			val impactTypes = ImpactTypeService.findImpactTypeList(pageNumber, recordOnPage)
			var totalCount = impactTypes.size
			var pagination = Application.Pagination(totalCount, pageNumber, recordOnPage, search)
			Ok(views.html.programImpactType.impactTypeList(impactTypes, username, totalCount, pagination))
		}
	}

	def createImpactType() = IsAuthenticatedAdmin() { _ =>
		{ implicit request =>
			val result = request.session.get("username")
			var username = result.get
			Ok(views.html.programImpactType.addImpactType(username, ARTForms.impactTypeForm))
		}
	}

	def editImpactType(id: String) = IsAuthenticatedAdmin() { _ =>
		{ implicit request =>

			val objSM = ImpactTypeService.findImpactTypeById(id)
			if (!objSM.isEmpty) {
				val SM = ImpactTypes(objSM.get.id, objSM.get.impact_type)
				val result = request.session.get("username")
				var username = result.get
				val formEdit = ARTForms.impactTypeForm.fill(SM)
				Ok(views.html.programImpactType.editImpactType(username, formEdit))
			} else {
				Redirect(routes.SubType.subTypeList())
			}
		}
	}

	def saveImpactType() = IsAuthenticatedAdmin() { _ =>
		{ implicit request =>
			val result = request.session.get("username")
			var username = result.get
			ARTForms.impactTypeForm.bindFromRequest.fold(
				hasErrors => {
					BadRequest(views.html.programImpactType.editImpactType(username, hasErrors))
				},
				success => {
					val objCreate = ImpactTypes(success.id, success.impact_type)
					ImpactTypeService.saveImpactType(objCreate);
					Redirect(routes.ImpactType.impactTypeList())
				})
		}
	}

	def updateImpactType() = IsAuthenticatedAdmin() { _ =>
		{ implicit request =>

			val result = request.session.get("username")
			var username = result.get
			ARTForms.impactTypeForm.bindFromRequest.fold(
				hasErrors => {
					BadRequest(views.html.programImpactType.editImpactType(username, hasErrors))
				},
				success => {
					val objUpdate = ImpactTypes(success.id, success.impact_type)
					ImpactTypeService.updateImpactType(objUpdate);
					Redirect(routes.ImpactType.impactTypeList())
				})
		}
	}

	def deleteImpactType(id: String) = IsAuthenticatedAdmin() { _ =>
		{ implicit request =>
			ImpactTypeService.deleteImpactType(id)
			Redirect(routes.ImpactType.impactTypeList())
		}
	}
}