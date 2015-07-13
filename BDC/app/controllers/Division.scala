package controllers

import org.apache.commons.lang3.StringUtils
import art_forms.ARTForms
import models.Divisions
import play.api.mvc.Controller
import services.DivisionService
import services.ProjectService
import services.UserService
import services.GenrenciaService
import services.DepartmentService
import play.i18n._
import models.Activity
import models.ActivityTypes
import java.util.Date
object Division extends Controller with Secured {
  var username = ""
  var project_id = ""
  var title = ""
  var country = ""
  var state = ""
  var city = ""
  var description = ""
  var milestone_id = 0
  var milestone_code = ""
  var milestone_status = 0
  var tagTitle = ""
  var tagDescription = ""
  var tag = 0
  var pageNumber = "1"
  var recordOnPage = "10"
  var search = ""
  var mode = ""
  var team_id = ""
  var department = ""
  var team = -1
  var uId = -1
  var roleId = -1
  val langObj = new Lang(Lang.forCode("es-ES"))
  def divisionList() = IsAuthenticatedAdmin() { _ =>
    { implicit request =>

      val result = request.session.get("username")
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

      username = result.get

      val departments = DivisionService.findAllDivisionList(pageNumber, recordOnPage)
      var totalCount = DivisionService.divisionCount
      var pagination = Application.Pagination(totalCount, pageNumber, recordOnPage, search)
      Ok(views.html.division.divisionList(departments, username, totalCount, pagination))
    }
  }

  /**
   * create new milestone..
   */
  def createDivision = IsAuthenticatedAdmin() { _ =>
    { implicit request =>
      val users = getDropDawnMap
      val result = request.session.get("username")
      var username = result.get
      Ok(views.html.division.addDivision(username, users, ARTForms.divisionForm))
    }
  }

  def saveDivision = IsAuthenticatedAdmin() { _ =>
    { implicit request =>
      ARTForms.divisionForm.bindFromRequest.fold(
        hasErrors => {
          val result = request.session.get("username")
          var username = result.get
          val users = getDropDawnMap
          BadRequest(views.html.division.addDivision(username, users, hasErrors))
        },
        success => {
          var division = ""
          division = success.division.trim()
          val obj = DivisionService.findDivisionByName(division)
          println(obj.size)
          if (obj.size > 0) {
            val result = request.session.get("username")
            var username = result.get
            val users = getDropDawnMap
            BadRequest(views.html.division.addDivision(username, users, ARTForms.divisionForm.withError("division", Messages.get(langObj, "divison.divisionexist")).fill(success)))
          } else {
            val uId = Integer.parseInt(request.session.get("uId").get)
            val obj = Divisions(success.dId, success.division, success.user_id, Option(uId), success.updation_date, 0)
            val last = DivisionService.saveDivision(obj)
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Division.id, "New Division created by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), last.toInt)
            Activity.saveLog(act)
            Redirect(routes.Division.divisionList())
          }
        })
    }
  }

  /**
   * edit panel of milestone
   */
  def editDivision(dId: String) = IsAuthenticatedAdmin() { _ =>
    { implicit request =>
      if (StringUtils.isNotBlank(dId)) {
        val division = DivisionService.findDivisionById(Integer.parseInt(dId))
        division match {
          case None =>
            Redirect(routes.Division.divisionList())
          case Some(dep: Divisions) =>
            val gerenciaList = GenrenciaService.findAllGenrenciaListByDivision(dId)
            val obj = Divisions(dep.dId, dep.division, dep.user_id, dep.updated_by, dep.updation_date, dep.is_deleted)
            val result = request.session.get("username")
            username = result.get
            val users = getDropDawnMap
            Ok(views.html.division.divisionUpdate(username, users, ARTForms.divisionForm.fill(obj), gerenciaList))
        }
      } else {
        Redirect(routes.Division.divisionList())
      }
    }
  }

  def updateDivision() = IsAuthenticatedAdmin() { _ =>
    { implicit request =>
      val myForm = ARTForms.divisionForm.bindFromRequest
      val result = request.session.get("username")
      val username = result.get
      val users = getDropDawnMap
      myForm.fold(
        hasErrors => {
          val gerenciaList = GenrenciaService.findAllGenrenciaListByDivision(hasErrors.data.get("id").get)
          BadRequest(views.html.division.divisionUpdate(username, users, hasErrors, gerenciaList))
        },
        success => {
          val theForm = DivisionService.validateDivisionForm(myForm.fill(success))
          if (theForm.hasErrors) {
            val gerenciaList = GenrenciaService.findAllGenrenciaListByDivision(success.dId.get.toString())
            BadRequest(views.html.division.divisionUpdate(username, users, theForm, gerenciaList))
          } else {
            val uId = Integer.parseInt(request.session.get("uId").get)
            val obj = Divisions(success.dId, success.division, success.user_id, Option(uId), success.updation_date, success.is_deleted)
            val last = DivisionService.updateDivision(obj)
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Division.id, "Division Updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), success.dId.get)
            Activity.saveLog(act)
            Redirect(routes.Division.divisionList())
          }
        })
    }
  }

  /**
   * delete milestone details..
   */
  def divisionUpdateStatus(dId: String, status: Boolean) = IsAuthenticatedAdmin() { _ =>
    { implicit request =>
      if (StringUtils.isNotBlank(dId)) {

        val division_id = Integer.parseInt(dId)
        //  var division = DivisionService.findDivisionById(Id);
        //DivisionService.DeleteDivision(Id)
        /*   var isDel = 0
        if (division.get.is_deleted == 0) {
          isDel = 1
        } else {
          isDel = 0
        }*/
        // println(isDel)
        //  val objUpdate = Divisions(division.get.dId, division.get.division, Integer.parseInt(request.session.get("uId").get), isDel)
        var is_deleted = 1
        if (status) {
          is_deleted = 0
        }
        val uid = Integer.parseInt(request.session.get("uId").get.trim())
        DivisionService.changeStatusDivisionStatus(division_id, is_deleted, uid)
        /**
         * Activity log
         */
        val act = Activity(ActivityTypes.Division.id, "Division status updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), division_id)
        Activity.saveLog(act)
      }
      Ok("Success")
    }
  }
  private def getDropDawnMap: java.util.HashMap[String, String] = {
    val users = UserService.findAllUsers
    var usersMap = new java.util.HashMap[String, String]()
    for (user <- users) {
      usersMap.put(user.uid.get.toString(), user.first_name + " " + user.last_name)
    }
    usersMap
  }
}