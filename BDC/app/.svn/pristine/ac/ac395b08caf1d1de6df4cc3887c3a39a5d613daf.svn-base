package controllers

import art_forms.ARTForms
import models._
import play.api.mvc.Action
import play.api.mvc.Controller
import services._
import play.i18n._
import java.util.Date

object Stage extends Controller {
  var username = ""
  var description = ""
  var pageNumber = "1"
  var recordOnPage = "10"
  var search = ""
  val langObj = new Lang(Lang.forCode("es-ES"))

  def stageList() = Action { implicit request =>
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
      val stages = StageService.findAllStageList(pageNumber, recordOnPage)
      var totalCount = StageService.stageCount()
      var pagination = Application.Pagination(totalCount, pageNumber, recordOnPage, search)
      Ok(views.html.stage.stageList(stages, username, totalCount, pagination))
    }
  }

  def createStage() = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val result = request.session.get("username")
      var username = result.get
      Ok(views.html.stage.addStage(username, ARTForms.stageForm))
    }
  }

  def saveStage() = Action { implicit request =>
    val result = request.session.get("username")
    var username = result.get
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val myform = ARTForms.stageForm.bindFromRequest
      myform.fold(
        errors => {
          println(myform.hasErrors);
          BadRequest(views.html.stage.addStage(username, myform))
        },
        success => {
          val the_Form = StageService.validateStageForm(myform)
          if (the_Form.hasErrors) {
            BadRequest(views.html.stage.addStage(username, the_Form))
          } else {
            val objCreate = Stages(success.id, success.sequencing, success.stage, success.description, success.updated_by, success.updation_date, success.creation_date, success.is_deleted)
            val uId = request.session.get("uId").get
            val last = StageService.saveStage(objCreate, uId)
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Stage.id, "Stage created by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), last.toInt)
            Activity.saveLog(act)
            Redirect(routes.Stage.stageList())
          }
        })
    }
  }

  def editStage(id: String) = Action { implicit request =>
    val result = request.session.get("username")
    var username = result.get
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val objSM = StageService.findStageById(id)
      if (!objSM.isEmpty) {
        val obj = Stages(objSM.get.id, objSM.get.sequencing, objSM.get.stage, objSM.get.description, objSM.get.updated_by, objSM.get.updation_date, objSM.get.creation_date, objSM.get.is_deleted)
        Ok(views.html.stage.editStage(username, ARTForms.stageForm.fill(obj)))
      } else {
        Redirect(routes.Stage.stageList())
      }
    }
  }

  def updateStage() = Action { implicit request =>
    val result = request.session.get("username")
    var username = result.get
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val myForm = ARTForms.stageForm.bindFromRequest
      myForm.fold(
        errors => {
          BadRequest(views.html.stage.editStage(username, errors))
        },
        success => {
          val the_Form = StageService.validateEditStageForm(myForm)
          if (the_Form.hasErrors) {
            BadRequest(views.html.stage.editStage(username, the_Form))
          } else {
            val uid = Integer.parseInt(request.session.get("uId").get.toString())
            val objUpdate = Stages(success.id, success.sequencing, success.stage, success.description, Option(uid), success.updation_date, success.creation_date, success.is_deleted)
            StageService.updateStage(objUpdate)
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Stage.id, "Stage updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), success.id.get)
            Activity.saveLog(act)
            Redirect(routes.Stage.stageList())
          }
        })
    }
  }

  def updateStageStatus(id: String, status: Boolean) = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      var is_deleted = 1
      if (status) {
        is_deleted = 0
      }
      val uid = Integer.parseInt(request.session.get("uId").get.trim())
      StageService.changeStageStatus(id, is_deleted, uid)
      /**
       * Activity log
       */
      val act = Activity(ActivityTypes.Stage.id, "Stage deleted by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), id.toInt)
      Activity.saveLog(act)
      Ok("Success")
    }
  }

}