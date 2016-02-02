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
import services.PersonalService
import services.ProgramaService

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
    
  def listadoAsignacion = Action {
    implicit request =>
      request.session.get("username").map { user =>
        val rows = request.getQueryString("rows").get.toString()
        val page = request.getQueryString("page").get.toString()
        var records: Int = 0
        val uId = request.session.get("uId").get.toString()
        var node = new JSONObject()

        val subtask = PersonalService.listadoAsignacionDependiente(uId, "", "", rows, page)
        records = ProgramaService.cantidadSubalternos(uId)

        var registro = new JSONArray()
        for (p <- subtask) {
          var campo = new JSONObject()
          campo.put("uid", p.uid)
          campo.put("nombre", p.nombre)
          campo.put("asignado", p.asignado.getOrElse("").toString())
          registro.put(campo)
        }

        var pagedisplay = Math.ceil(records.toInt / Integer.parseInt(rows.toString()).toFloat).toInt

        node.put("page", page)
        node.put("total", pagedisplay)
        node.put("records", records)
        node.put("rows", registro)

        Ok(node.toString()).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)

      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }    
}