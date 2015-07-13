package controllers

import art_forms.ARTForms
import models._
import play.api.mvc.Action
import play.api.mvc.Controller
import services.BudgetTypeService
import play.i18n._
import java.util.Date

object BudgetType extends Controller {
  var username = ""
  var description = ""
  var pageNumber = "1"
  var recordOnPage = "10"
  var search = ""
  val langObj = new Lang(Lang.forCode("es-ES"))

  def budgetTypeList() = Action { implicit request =>
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
      val btypes = BudgetTypeService.findAllBudgetType(pageNumber, recordOnPage)
      var totalCount = BudgetTypeService.budgetTypeCount
      var pagination = Application.Pagination(totalCount, pageNumber, recordOnPage, search)
      Ok(views.html.budgetType.budgetTypeList(btypes, username, totalCount, pagination))
    }
  }

  def createBudgetType() = Action { implicit request =>
    val result = request.session.get("username")
    var username = result.get
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      Ok(views.html.budgetType.addBudgetType(username, ARTForms.budgetTypeForm))
    }
  }

  def saveBudgetType() = Action { implicit request =>
    val result = request.session.get("username")
    var username = result.get
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val myForm = ARTForms.budgetTypeForm.bindFromRequest
      myForm.fold(
        errors => {
          BadRequest(views.html.budgetType.addBudgetType(username, errors))
        },
        success => {
          val the_Form = BudgetTypeService.validateBudgetTypeForm(myForm)
          if (the_Form.hasErrors) {
            BadRequest(views.html.budgetType.addBudgetType(username, the_Form))
          } else {
            val uid = request.session.get("uId").get
            val objCreate = BudgetTypes(success.id, success.sequencing, success.budget_type, success.description, Option(Integer.parseInt(uid)), success.updation_date, success.creation_date, success.is_deleted)
            val budget_type_id = BudgetTypeService.saveBudgetType(objCreate)
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Budget_Type.id, "Budget Type created by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), budget_type_id.toInt)
            Activity.saveLog(act)
            Redirect(routes.BudgetType.budgetTypeList())
          }
        })
    }
  }

  def editBudgetType(id: String) = Action { implicit request =>
    val result = request.session.get("username")
    var username = result.get
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val objSM = BudgetTypeService.findBudgetTypeById(id)
      if (!objSM.isEmpty) {
        val obj = BudgetTypes(objSM.get.id, objSM.get.sequencing, objSM.get.budget_type, objSM.get.description, objSM.get.updated_by, objSM.get.updation_date, objSM.get.creation_date, objSM.get.is_deleted)
        Ok(views.html.budgetType.editBudgetType(username, ARTForms.budgetTypeForm.fill(obj)))
      } else {
        Redirect(routes.BudgetType.budgetTypeList())
      }
    }
  }

  def updateBudgetType() = Action { implicit request =>
    val result = request.session.get("username")
    val uid = Integer.parseInt(request.session.get("uId").get.toString())
    var username = result.get
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val myForm = ARTForms.budgetTypeForm.bindFromRequest
      myForm.fold(
        errors => {
          BadRequest(views.html.budgetType.editBudgetType(username, errors))
        },
        success => {
          val the_Form = BudgetTypeService.validateEditBudgetTypeForm(myForm)
          if (the_Form.hasErrors) {
            BadRequest(views.html.budgetType.editBudgetType(username, the_Form))
          } else {
            val objUpdate = BudgetTypes(success.id, success.sequencing, success.budget_type, success.description, Option(uid), success.updation_date, success.creation_date, success.is_deleted)
            BudgetTypeService.updateBudgetType(objUpdate)
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Budget_Type.id, "Budget Type updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), success.id.get)
            Activity.saveLog(act)
            Redirect(routes.BudgetType.budgetTypeList())
          }
        })
    }
  }

  def updateBudgetTypeStatus(id: String, status: Boolean) = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      var is_deleted = 1
      if (status) {
        is_deleted = 0
      }
      val uid = Integer.parseInt(request.session.get("uId").get.trim())
      BudgetTypeService.changeBudgetTypeStatus(id, is_deleted, uid)
      /**
       * Activity log
       */
      val act = Activity(ActivityTypes.Budget_Type.id, "Budget Type deleted by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), id.toInt)
      Activity.saveLog(act)
      Ok("Success")
    }
  }

}