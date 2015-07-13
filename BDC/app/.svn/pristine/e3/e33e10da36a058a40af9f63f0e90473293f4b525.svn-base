package controllers

import play.api.mvc.Controller
import art_forms.ARTForms
import models._
import play.api.mvc.Action
import play.api.mvc.Controller
import services._
import play.i18n._

object UserProfile extends Controller {
  var username = ""
  var description = ""
  var pageNumber = "1"
  var recordOnPage = "10"
  var search = ""
  val langObj = new Lang(Lang.forCode("es-ES"))

  def userProfileList() = Action { implicit request =>
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
      val profiles = UserProfileServices.findAllUserProfileList(pageNumber, recordOnPage)
      var totalCount = UserProfileServices.userProfileCount()
      var pagination = Application.Pagination(totalCount, pageNumber, recordOnPage, search)
      Ok(views.html.userProfile.userProfileList(profiles, username, totalCount, pagination))
    }
  }

  def addUserProfile() = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val result = request.session.get("username")
      var username = result.get
      Ok(views.html.userProfile.addUserProfile(username, ARTForms.userProfileForm))
    }
  }

  def saveUserProfile() = Action { implicit request =>
    val result = request.session.get("username")
    var username = result.get
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {

      ARTForms.userProfileForm.bindFromRequest().fold(
        hasErrors => {
          println(hasErrors.errors);
          BadRequest(views.html.userProfile.addUserProfile(username, hasErrors))
        },
        success => {
          val isCodePresent = UserProfileServices.isUserProfileCode(success.profile_code)
          if (isCodePresent) {
            BadRequest(views.html.userProfile.addUserProfile(username, ARTForms.userProfileForm.withError("profile_code", Messages.get(langObj, "stage.alreadyexist")).fill(success)))
          } else {
            UserProfileServices.saveUserProfile(success)
            Redirect(routes.UserProfile.userProfileList())
          }
        });
    }
  }

  def editUserProfile(id: String) = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val result = request.session.get("username")
      var username = result.get
      val objSM = UserProfileServices.findUserProfileById(id)
      if (!objSM.isEmpty) {
        val obj = UserProfiles(objSM.get.id, objSM.get.profile_code, objSM.get.profile_name, objSM.get.description, objSM.get.updated_by, objSM.get.updation_date, objSM.get.creation_date, objSM.get.is_deleted)
        Ok(views.html.userProfile.editUserProfile(username, ARTForms.userProfileForm.fill(obj)))
      } else {
        Redirect(routes.UserProfile.userProfileList())
      }
    }
  }

  def updateUserProfile() = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val result = request.session.get("username")
      var username = result.get
      ARTForms.userProfileForm.bindFromRequest().fold(
        hasErrors => {
          println(hasErrors.errors);
          BadRequest(views.html.userProfile.editUserProfile(username, hasErrors))
        }, success => {
          val uid = Integer.parseInt(request.session.get("uId").get.toString())
          val objUpdate = UserProfiles(success.id, success.profile_code, success.profile_name, success.description, Option(uid), success.updation_date, success.creation_date, success.is_deleted)
          UserProfileServices.updateUserProfile(objUpdate)
          Redirect(routes.UserProfile.userProfileList())
        })
    }
  }

  def deleteUserProfile(id: String) = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      UserProfileServices.deleteUserProfile(id);
      Ok("Success")
    }
  }
}