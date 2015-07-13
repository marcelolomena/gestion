package controllers

import art_forms.ARTForms
import models._
import play.api.mvc.Action
import play.api.mvc.Controller
import services._
import play.i18n._
import java.util.Date

object Deliverable extends Controller {
  var username = ""
  var description = ""
  var pageNumber = "1"
  var recordOnPage = "10"
  var search = ""
  val langObj = new Lang(Lang.forCode("es-ES"))

  def deliverableList() = Action { implicit request =>
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
      val stages = DeliverableService.findAllDeliverableList(pageNumber, recordOnPage)
      var totalCount = DeliverableService.deliverableCount
      var pagination = Application.Pagination(totalCount, pageNumber, recordOnPage, search)
      Ok(views.html.deliverable.deliverableList(stages, username, totalCount, pagination))
    }
  }

  def createDeliverable() = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val result = request.session.get("username")
      var username = result.get
      Ok(views.html.deliverable.addDeliverable(username, ARTForms.deliverableForm))
    }
  }

  def saveDeliverable() = Action { implicit request =>
    val result = request.session.get("username")
    var username = result.get
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      ARTForms.deliverableForm.bindFromRequest.fold(
        errors => {
          BadRequest(views.html.deliverable.addDeliverable(username, errors))
        },
        success => {
          val objCreate = Deliverables(success.id, success.deliverable, success.description, success.updated_by, success.updation_date, success.creation_date, success.is_deleted)
          val deliverable = success.deliverable.trim()
          val obj = DeliverableService.findDeliverableByName(deliverable)
          if (!obj.isEmpty && deliverable.equalsIgnoreCase(obj.get.deliverable.trim())) {
            BadRequest(views.html.deliverable.addDeliverable(username, ARTForms.deliverableForm.withError("deliverable", Messages.get(langObj, "deliverable.alreadyexist")).fill(success)))
          } else {
            val uId = request.session.get("uId").get
            val SM = Deliverables(None, success.deliverable, success.description, success.updated_by, success.updation_date, success.creation_date, success.is_deleted)
            val last = DeliverableService.saveDeliverable(objCreate, uId)
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Deliverable.id, "Deliverable created by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), last.toInt)
            Activity.saveLog(act)
            Redirect(routes.Deliverable.deliverableList())
          }
        })
    }
  }

  def editDeliverable(id: String) = Action { implicit request =>
    val result = request.session.get("username")
    var username = result.get
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val objSM = DeliverableService.findDeliverableById(id)
      if (!objSM.isEmpty) {
        val SM = Deliverables(objSM.get.id, objSM.get.deliverable, objSM.get.description, objSM.get.updated_by, objSM.get.updation_date, objSM.get.creation_date, objSM.get.is_deleted)
        val f = ARTForms.deliverableForm.fill(SM)
        Ok(views.html.deliverable.editDeliverable(username, f))
      } else {
        Redirect(routes.Deliverable.deliverableList())
      }
    }
  }

  def updateDeliverable() = Action { implicit request =>
    val result = request.session.get("username")
    var username = result.get
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val myForm = ARTForms.deliverableForm.bindFromRequest
      myForm.fold(
        errors => {
          BadRequest(views.html.deliverable.editDeliverable(username, errors))
        },
        success => {
          val theForm = services.DeliverableService.validateDeliverableForm(myForm.fill(success))
          if (theForm.hasErrors) {
            BadRequest(views.html.deliverable.editDeliverable(username, theForm))
          } else {
            val uid = Integer.parseInt(request.session.get("uId").get)
            val objUpdate = Deliverables(success.id, success.deliverable, success.description, Option(uid), success.updation_date, success.creation_date, success.is_deleted)
            DeliverableService.updateDeliverable(objUpdate)
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Deliverable.id, "Deliverable updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), success.id.get)
            Activity.saveLog(act)
            Redirect(routes.Deliverable.deliverableList())
          }
        })
    }
  }

  def updateDeliverableStatus(id: String, status: Boolean) = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      var is_deleted = 1
      if (status) {
        is_deleted = 0
      }
      val uid = Integer.parseInt(request.session.get("uId").get.trim())
      DeliverableService.changeDeliverableStatus(id, is_deleted, uid)
      /**
       * Activity log
       */
      val act = Activity(ActivityTypes.Deliverable.id, "Deliverable deleted by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), id.toInt)
      Activity.saveLog(act)
      Ok("Success")
    }
  }
}