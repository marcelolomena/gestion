package controllers.Frontend

import model.BoardValidators.GridValidator
import models.ResultHealth
import play.api.mvc.Action
import services.HealthService

object HealthReport extends CoreController {

  def gridReport(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>

      val userSession = request.session +
        ("uId" -> request.session.get("uId").get) +
        ("username" -> request.session.get("username").get) +
        ("utype" -> request.session.get("utype").get) +
        ("user_profile" -> request.session.get("user_profile").get)

      Ok(views.html.frontend.seguimiento.healthGrid()).withSession(userSession)
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def getReportSlow() = Action(parse.json) { implicit request =>
    gridDispatch[GridValidator,Seq[ResultHealth]](HealthService.listSlow)
  }
}
