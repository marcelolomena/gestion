package controllers.Frontend

import model._
import model.UserBase
import play.api.Logger
import play.api.libs.json._
import play.api.mvc._
import service.PersonnelService
import jsmessages.api.JsMessages
import play.api.Play.current


/**
 * Controller that opens up the main socket, as well as the index page
 * to clients. Extends base Controller.
 */
object ApplicationController extends Controller {
  /**
   * Resource messages. Necessary for @jsMessages
   */
  val messages = JsMessages.default

  /**
   * Action for pre-loading resources as a JavaScript object
   * as opposed to being locked in to the Scala templates
   * @return 200 with JS Objects
   */
  def jsMessages = Action { implicit request =>
    Ok(messages(Some("window.Messages")))
  }

  /**
   * Load index. Will be sign in view if not logged in.
   * Will be dashboard otherwise.
   * @return See above.
   */
  def kanban = Action { implicit request =>
    request.session.get("username").map { user =>
      Logger.debug("USUARIO : " + user)
      val response = PersonnelService.bypass(user)
      response.statusCode match {
        case StatusCode.OK =>
          implicit val user = response.data
          //Redirect("/").withSession("user" -> Json.stringify(Json.toJson(user)))
          //implicit val parsedUser = Json.parse(user).as[UserBase]
          Ok(views.html.dashboard()).withSession("user" -> Json.stringify(Json.toJson(user)))
        case _ =>
          Logger.info("failure get user")
          Redirect(routes.Login.loginUser())
      }
    }.getOrElse {
      Logger.info("no user cookie")
      //PersonnelController.signInView
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * Core call for connecting to a socket.
   * @param userId userId of person connecting
   * @param boardId boardId of active board. If None, we connect them as a floating user
   * @return
   */
  def socket(userId: Long, boardId: Option[Long]) = WebSocket.acceptWithActor[String, String] { request => out =>
    KanbanSocketController.props(out, PersonnelService.returnUserBaseById(userId), boardId)
  }
}