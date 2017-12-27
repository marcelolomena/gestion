package controllers

import art_forms.ARTForms
import models._
import play.api.mvc.Action
import play.api.mvc.Controller
import services._
import play.i18n._
import models.GenericProjectTypes

object GenericProjectType extends Controller {
  var username = ""
  var description = ""
  var pageNumber = "1"
  var recordOnPage = "10"
  var search = ""
  val langObj = new Lang(Lang.forCode("es-ES"))

  def genericProjectTypeList() = Action { implicit request =>
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
      val genericPtypes = GenericProjectTypeService.findAllGenericProjectType(pageNumber, recordOnPage)
      var totalCount = GenericProjectTypeService.genericProjectTypeCount()
      var pagination = Application.Pagination(totalCount, pageNumber, recordOnPage, search)
      Ok(views.html.genericProjectType.genericProjectTypeList(genericPtypes, username, totalCount, pagination))
    }
  }

  def createGenericProjectType() = Action { implicit request =>
    val result = request.session.get("username")
    var username = result.get
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      Ok(views.html.genericProjectType.addGenericProjectType(username, ARTForms.genericprojectTypeForm))
    }
  }

  def searchProjectType() = Action { implicit request =>
    request.session.get("username").map { user =>


      val alert_states = new java.util.LinkedHashMap[String, String]()
      val status = RiskService.findAllAlertStatus()
      for (d <- status) {
        alert_states.put(d.id.get.toString, d.description)
      }

      val alert_category = new java.util.LinkedHashMap[String, String]()
      val category = RiskService.findAllAlertCategory()
      for (d <- category) {
        alert_category.put(d.id.get.toString, d.description)
      }


      Ok(views.html.frontend.risks.alertForm(
        ARTForms.alertsSearchForm,
        alert_states,
        alert_category)).withSession("username" -> request.session.get("username").get,
        "utype" -> request.session.get("utype").get,
        "uId" -> request.session.get("uId").get,
        "user_profile" -> request.session.get("user_profile").get)

    }.getOrElse {
      Redirect(routes.GenericProjectType.genericProjectTypeList())
    }
  }

  def saveGenericProjectType() = Action { implicit request =>
    val result = request.session.get("username")
    var username = result.get
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      ARTForms.genericprojectTypeForm.bindFromRequest.fold(
        errors => {
          BadRequest(views.html.genericProjectType.addGenericProjectType(username, errors))
        },
        success => {
          val obj = GenericProjectTypeService.findGenericProjectTypeByName(success.generic_project_type)
          if (!obj.isEmpty) {
            BadRequest(views.html.genericProjectType.addGenericProjectType(username, ARTForms.genericprojectTypeForm.withError("generic_project_type", Messages.get(langObj, "genericprojecttype.alreadyexist")).fill(success)))
          } else {
            val objCreate = GenericProjectTypes(success.id, success.generic_project_type, success.description, success.updated_by, success.updation_date, success.creation_date, success.is_deleted)
            GenericProjectTypeService.saveGenericProjectType(objCreate)
            Redirect(routes.GenericProjectType.genericProjectTypeList())
          }
        })
    }
  }

  def editGenericProjectType(id: String) = Action { implicit request =>
    val result = request.session.get("username")
    var username = result.get
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val objSM = GenericProjectTypeService.findGenericProjectTypeById(id)
      if (!objSM.isEmpty) {
        val obj = GenericProjectTypes(objSM.get.id, objSM.get.generic_project_type, objSM.get.description, objSM.get.updated_by, objSM.get.updation_date, objSM.get.creation_date, objSM.get.is_deleted)
        Ok(views.html.genericProjectType.editGenericProjectType(username, ARTForms.genericprojectTypeForm.fill(obj)))
      } else {
        Redirect(routes.GenericProjectType.genericProjectTypeList())
      }
    }
  }

  def updateGenericProjectType() = Action { implicit request =>
    val result = request.session.get("username")
    var username = result.get
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      ARTForms.genericprojectTypeForm.bindFromRequest.fold(
        errors => {
          BadRequest(views.html.genericProjectType.editGenericProjectType(username, errors))
        },
        success => {
          val uid = Integer.parseInt(request.session.get("uId").get.toString())
          val objUpdate = GenericProjectTypes(success.id, success.generic_project_type, success.description, Option(uid), success.updation_date, success.creation_date, success.is_deleted)
          GenericProjectTypeService.updateGenericProjectType(objUpdate)
          Redirect(routes.GenericProjectType.genericProjectTypeList())
        })
    }
  }

  def deleteGenericProjectType(id: String) = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      GenericProjectTypeService.deleteGenericProjectType(id)
      Ok("Success")
    }
  }

}