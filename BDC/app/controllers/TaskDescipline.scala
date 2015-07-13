package controllers

import art_forms.ARTForms
import play.api.mvc.Action
import play.api.mvc.Controller
import services.TaskDesciplineService
import services.UserService
import java.util.Date
import models.TaskDesciplineChild
import play.api.data.Form
import models.TaskDesciplines
import models.Activity
import models.ActivityTypes

object TaskDescipline extends Controller {
  var username = ""
  var description = ""
  var pageNumber = "1"
  var recordOnPage = "10"
  var search = ""

  def taskDesciplineList() = Action { implicit request =>
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
      val taskDesciplines = TaskDesciplineService.findTaskDesciplineList(pageNumber, recordOnPage)
      var totalCount = TaskDesciplineService.taskDesciplineCount()
      var pagination = Application.Pagination(totalCount, pageNumber, recordOnPage, search)
      Ok(views.html.programTaskDescipline.taskDesciplineList(taskDesciplines, username, totalCount, pagination))
    }
  }

  def createTaskDescipline() = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val result = request.session.get("username")
      var username = result.get
      Ok(views.html.programTaskDescipline.addTaskDescipline(username, ARTForms.myTaskDesciplineForm))
    }
  }

  def saveTaskDescipline() = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val result = request.session.get("username")
      var username = result.get
      val myform = ARTForms.myTaskDesciplineForm.bindFromRequest
      myform.fold(
        errors => {
          BadRequest(views.html.programTaskDescipline.addTaskDescipline(username, errors))
        },
        success => {
          val theForm = TaskDesciplineService.validateTaskDesciplineForm(ARTForms.myTaskDesciplineForm.fill(success))
          if (theForm.hasErrors) {
            BadRequest(views.html.programTaskDescipline.addTaskDescipline(username, theForm))
          } else {
            var date = new java.util.Date();
            var taskDicipline = TaskDesciplines(success.id, success.sequencing, success.task_discipline, success.description, UserService.findUserDetailsByUsername(username).get.uid.get, Option(date), 0);
            val last = TaskDesciplineService.saveTaskDescipline(taskDicipline);
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Task_Discipline.id, "Discipline created by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), last.toInt)
            Activity.saveLog(act)
            Redirect(routes.TaskDescipline.taskDesciplineList())
          }
        })
    }
  }

  def editTaskDescipline(id: String) = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val objSM = TaskDesciplineService.findTaskDesciplineById(id)
      if (!objSM.isEmpty) {
        val SM = TaskDesciplineChild(objSM.get.id, objSM.get.sequencing, objSM.get.task_discipline, objSM.get.description)
        val result = request.session.get("username")
        var username = result.get
        val f = ARTForms.myTaskDesciplineForm.fill(SM)
        Ok(views.html.programTaskDescipline.editTaskDescipline(username, f))
      } else {
        Redirect(routes.TaskDescipline.taskDesciplineList())
      }
    }
  }

  def updateTaskDescipline() = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val result = request.session.get("username")
      var username = result.get
      val myForm = ARTForms.myTaskDesciplineForm.bindFromRequest
      myForm.fold(
        errors => {
          BadRequest(views.html.programTaskDescipline.editTaskDescipline(username, errors))
        },
        success => {
          val theForm: Form[TaskDesciplineChild] = TaskDesciplineService.validateEditTaskDesciplineForm(myForm)
          if (theForm.hasErrors) {
            BadRequest(views.html.programTaskDescipline.editTaskDescipline(username, theForm))
          } else {
            var date = new java.util.Date();
            val is_deleted = TaskDesciplineService.findTaskDesciplineById(success.id.get.toString).get.is_deleted
            var taskDicipline = TaskDesciplines(success.id, success.sequencing, success.task_discipline, success.description, UserService.findUserDetailsByUsername(username).get.uid.get, Option(date), is_deleted);
            TaskDesciplineService.updateTaskDescipline(taskDicipline);
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Task_Discipline.id, "Discipline updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), success.id.get)
            Activity.saveLog(act)
            Redirect(routes.TaskDescipline.taskDesciplineList())
          }
        })
    }
  }

  def updateTaskDesciplineStatus(task_descipline_id: String, status: Boolean) = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      var is_deleted = 1
      if (status) {
        is_deleted = 0
      }
      val uid = Integer.parseInt(request.session.get("uId").get.trim())
      TaskDesciplineService.changeTaskDesciplineStatus(task_descipline_id, is_deleted, uid)
      /**
       * Activity log
       */
      val act = Activity(ActivityTypes.Task_Discipline.id, "Discipline deleted by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), task_descipline_id.toInt)
      Activity.saveLog(act)
    }
    Ok("Success")
  }
}