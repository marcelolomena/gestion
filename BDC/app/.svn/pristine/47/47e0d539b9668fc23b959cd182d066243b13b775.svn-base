package controllers.Frontend

import scala.concurrent.Future
import scala.language.postfixOps
import models.Users
import play.api.libs.concurrent.Execution.Implicits.defaultContext
import play.api.libs.json.Json
import play.api.libs.ws.WS
import play.api.mvc.Action
import play.api.mvc.Controller
import services.LoginService
import services.ProgramService
import java.util.Date
import services.EarnValueService

object Application extends Controller {

  def index = Action { implicit request =>
    Redirect(routes.Login.loginUser());
  }

}