package controllers.Frontend

import play.api.mvc.Action
import play.api.mvc.Controller

/**
 * @author marcelo
 */
object Incident extends Controller {
  def list = Action {
    implicit request =>
      request.session.get("username").map { user =>

        Ok(views.html.frontend.incident.listIncident()).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }
}