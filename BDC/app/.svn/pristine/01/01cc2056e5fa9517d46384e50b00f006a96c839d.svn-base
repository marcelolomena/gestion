package controllers

import art_forms.ARTForms
import play.api.mvc.Controller
import services.UserRoleService
import models.UserRoleMaster
import models.UserRoleMaster
import play.api.data.Form
import models.UserRoleMaster
import services.UserService
import models.UserRoleChild
import models.Activity
import models.ActivityTypes
import java.util.Date

object UserRole extends Controller with Secured {
  var username = ""
  var description = ""
  var pageNumber = "1"
  var recordOnPage = "10"
  var search = ""

  def userRoleList() = IsAuthenticatedAdmin() { _ =>
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
      val userRoles = UserRoleService.findUserRoleList(pageNumber, recordOnPage)
      var totalCount = UserRoleService.findAllUserRolesCount
      var pagination = Application.Pagination(totalCount, pageNumber, recordOnPage, search)
      Ok(views.html.userRole.userRoleDetails(userRoles, username, totalCount, pagination))
    }
  }

  def addUserRole() = IsAuthenticatedAdmin() { _ =>
    { implicit request =>
      val result = request.session.get("username")
      var username = result.get
      Ok(views.html.userRole.addUserRole(username, ARTForms.userRoleForm))
    }
  }

  def saveUserRole() = IsAuthenticatedAdmin() { _ =>
    { implicit request =>
      val result = request.session.get("username")
      var username = result.get
      ARTForms.userRoleForm.bindFromRequest.fold(
        hasErrors => {
          BadRequest(views.html.userRole.addUserRole(username, hasErrors))
        },
        success => {
          val theForm: Form[UserRoleChild] = UserRoleService.validateUserRoleForm(ARTForms.userRoleForm.fill(success))
          if (theForm.hasErrors) {
            BadRequest(views.html.userRole.addUserRole(username, theForm))
          } else {
            var date = new java.util.Date();
            var userRole = UserRoleMaster(success.rId, success.role, success.description, UserService.findUserDetailsByUsername(username).get.uid.get, Option(date), false)
            val last = UserRoleService.saveUserRole(userRole)
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.User_Role.id, "User Role created by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), last.toInt)
            Activity.saveLog(act)
            Redirect(routes.UserRole.userRoleList())
          }
        })
    }
  }

  def editUserRole(id: String) = IsAuthenticatedAdmin() { _ =>
    { implicit request =>
      val objSM = UserRoleService.findUserRoleById(id)
      if (!objSM.isEmpty) {
        var date = new java.util.Date();
        val SM = UserRoleChild(objSM.get.rId, objSM.get.role, objSM.get.description)
        val result = request.session.get("username")
        var username = result.get
        val editForm = ARTForms.userRoleForm.fill(SM)
        Ok(views.html.userRole.editUserRole(username, editForm))
      } else {
        Redirect(routes.UserRole.userRoleList())
      }
    }
  }

  def updateUserRole() = IsAuthenticatedAdmin() { _ =>
    { implicit request =>
      val result = request.session.get("username")
      var username = result.get
      ARTForms.userRoleForm.bindFromRequest.fold(
        hasErrors => {
          BadRequest(views.html.userRole.editUserRole(username, hasErrors))
        },
        success => {
          val theForm: Form[UserRoleChild] = UserRoleService.validateUserRoleFormForUpdate(ARTForms.userRoleForm.fill(success))
          if (theForm.hasErrors) {
            BadRequest(views.html.userRole.editUserRole(username, theForm))
          } else {
            var date = new java.util.Date();
            val is_deleted = UserRoleService.findUserRoleById(success.rId.get.toString()).get.is_deleted
            val userRole = UserRoleMaster(success.rId, success.role, success.description, UserService.findUserDetailsByUsername(username).get.uid.get, Option(date), is_deleted)
            UserRoleService.updateUserRole(userRole);
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.User_Role.id, "User Role updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), success.rId.get)
            Activity.saveLog(act)
            Redirect(routes.UserRole.userRoleList())
          }
        })
    }
  }

  def updateUserRoleStatus(id: String, status: Boolean) = IsAuthenticatedAdmin() { _ =>
    { implicit request =>
      var is_deleted = 1
      if (status) {
        is_deleted = 0
      }
      val uid = Integer.parseInt(request.session.get("uId").get.trim())
      UserRoleService.changeUserRoleStatus(id, is_deleted, uid)
      /**
       * Activity log
       */
      val act = Activity(ActivityTypes.User_Role.id, "User Role deleted by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), id.toInt)
      Activity.saveLog(act)
      Ok("Success")
    }
  }
}