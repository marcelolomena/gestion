package controllers.Frontend

import play.api.mvc._

/**
 * @author marcelo
 */
object Room extends Controller {

  def chat(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val user_id = Integer.parseInt(request.session.get("uId").get)
      val username = request.session.get("username").get
      val profile = request.session.get("user_profile").get
      val userSession = request.session + ("uId" -> user_id.toString()) + ("username" -> username) + ("utype" -> request.session.get("utype").get) + ("user_profile" -> request.session.get("user_profile").get)


      
      Ok(views.html.frontend.room.videochat()).withSession(userSession)

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

}