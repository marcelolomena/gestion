package controllers

import model._
import play.api.Logger
import play.api.mvc.Action
import play.api.libs.json._
import service.PersonnelService
import model.PersonnelValidators._

/**
 *
 */
object PersonnelController extends CoreController {

  def newUserInternal = Action { implicit request =>
    newUserForm.bindFromRequest.fold(
      formWithErrors => {
        Logger.error(s"failure new user:${formWithErrors.errors.mkString}")
        BadRequest(views.html.signup(formWithErrors))
      },
      implicit user => {
        val response = PersonnelService insertNewUser user
        response.statusCode match {
          case StatusCode.OK =>
            Logger.info("success new user")
            user.id = Option(response.data)
            Redirect("/").withSession("user" -> Json.stringify(Json.toJson(user)))
        }
      }
    )
  }
  def newUserExternal = Action(parse.json) { implicit request =>
    resultDispatch[UserBase, Long](PersonnelService.insertNewUser)
  }

  def getUserInternal = Action { implicit request =>
    existingUserForm.bindFromRequest.fold(
      formWithErrors => {
        BadRequest(views.html.index(formWithErrors))
      },
      user => {
        val response = PersonnelService returnExistingUser user
        response.statusCode match {
          case StatusCode.OK =>
            implicit val user = response.data
            Redirect("/").withSession("user" -> Json.stringify(Json.toJson(user)))
          case _ =>
            Logger.info("failure get user")
            BadRequest(
              views.html.index(existingUserForm.withError("email","User doesn't exist!"))
            )
        }
      }
    )
  }

  def logoutUserInternal = Action { implicit request =>
      Ok(views.html.index(existingUserForm)).withNewSession
  }

  def getUserExternal = Action(parse.json) { implicit request =>
    resultDispatch[ExistingUser, UserBase](PersonnelService.returnExistingUser)
  }

  val signInView = Ok(views.html.index(existingUserForm))
  def signIn = Action {
    signInView
  }

  def signUp = Action {
    Ok(views.html.signup(newUserForm))
  }

  def userSettings(success: Boolean) = Action { implicit request =>
      request.session.get("user").map { user =>
        val parsedUser = Json.parse(user).as[UserBase]
        Ok(views.html.usersettings(editUserForm,parsedUser, success))
      }.getOrElse{
        Logger.info("no user cookie")
        PersonnelController.signInView
      }
  }

  def editUserInternal = Action { implicit request =>
    request.session.get("user").map { user =>
      implicit val parsedUser = Json.parse(user).as[UserBase]
      editUserForm.bindFromRequest.fold(
        formWithErrors => {
          BadRequest(views.html.usersettings(formWithErrors, parsedUser, false))
        },
        editUser => {
          val response = PersonnelService editUser editUser
          Redirect(routes.PersonnelController.userSettings(true))
            .withSession("user" -> Json.stringify(Json.toJson(response.data.get)))
        })
    }.getOrElse {
      Logger.info("no user cookie")
      BadRequest(views.html.login(existingUserForm))
    }
  }
}