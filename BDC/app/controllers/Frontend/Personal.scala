package controllers.Frontend

import play.api.mvc.Action
import play.api.mvc.Controller
import utils.FormattedOutPuts
import org.apache.commons.lang3.StringUtils
import org.json.JSONArray
import org.json.JSONObject
import net.liftweb.json._
import net.liftweb.json.JsonParser._
import models._
import play.api.mvc.AnyContent

/**
 * @author marcelo
 */
object Personal extends Controller {
  
    def home = Action {
    implicit request =>
      request.session.get("username").map { user =>

        Ok(views.html.frontend.personal.personal()).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }
}