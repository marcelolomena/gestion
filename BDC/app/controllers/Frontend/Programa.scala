package controllers.Frontend

import play.api.mvc.Action
import play.api.mvc.Controller
import services.ProgramaService
import utils.FormattedOutPuts
import org.apache.commons.lang3.StringUtils
import org.json.JSONArray
import org.json.JSONObject
import net.liftweb.json._
import net.liftweb.json.JsonParser._
import models._

/**
 * @author marcelo
 */
object Programa extends Controller {

  def fromProgramName(choice: String, value: String): String = choice match {
    case "dId"                => " '" + value + "' "
    case "status_id"          => " '" + value + "' "
    case "severity_id"        => " '" + value + "' "
    case "configuration_name" => " '%" + value + "%' "
    case "program_name"       => " '%" + value + "%' "
    case "sponsor_name"       => " '%" + value + "%' "
    case "brief_description"  => " '%" + value + "%' "
    case "date_creation"      => " '" + value + "' "
    case "date_end"           => " '" + value + "' "
    case "ir_number"          => value
    case _                    => "error"
  }

  def home = Action {
    implicit request =>
      request.session.get("username").map { user =>

        Ok(views.html.frontend.programa.programa()).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }

  def listado() = Action {
    implicit request =>
      request.session.get("username").map { user =>
        val user_id = Integer.parseInt(request.session.get("uId").get)
        val username = request.session.get("username").get
        val profile = request.session.get("user_profile").get
        val rows = request.getQueryString("rows").getOrElse("20").toString()
        val page = request.getQueryString("page").getOrElse("1").toInt
        val filters = request.getQueryString("filters").getOrElse("").toString()

        var panel: Seq[models.Programa] = null
        var records: Int = 0

        var node = new JSONObject()
        var tieneJson = true
        var qrystr = ""

        if (!StringUtils.isEmpty(filters)) {

          val jObject: play.api.libs.json.JsValue = play.api.libs.json.Json.parse(filters)

          if (!jObject.\\("rules").isEmpty) {

            val jList = jObject.\\("rules")
            var jElement = ""
            for (j <- jList) {
              jElement = j.toString()
              if (jElement.equals("[]")) {
                tieneJson = false
              } else {

                implicit val formats = DefaultFormats
                val json = net.liftweb.json.JsonParser.parse(filters)
                val elements = (json \\ "rules").children
                for (acct <- elements) {
                  val m = acct.extract[DBFilter]
                  if (m.field.equals("owner_name")) {
                    qrystr += "task_owner_id IN (SELECT uid from art_user where first_name like '%" + m.data + "%' OR last_name like '%" + m.data + "%')" + " AND "
                  } else if (m.field.equals("sponsor_name")) {
                    qrystr += "user_sponsor_id IN (SELECT uid from art_user where first_name like '%" + m.data + "%' OR last_name like '%" + m.data + "%')" + " AND "
                  } else if (m.field.equals("severity_description")) {
                    if (m.data.toInt != 0)
                      qrystr += "severity_id" + FormattedOutPuts.fromPredicate(m.op) + fromProgramName("severity_id", m.data) + " AND "
                  } else if (m.field.equals("status_name")) {
                    if (m.data.toInt != 0)
                      qrystr += "status_id" + FormattedOutPuts.fromPredicate(m.op) + fromProgramName("status_id", m.data) + " AND "
                  } else if (m.field.equals("department")) {
                    if (m.data.toInt != 0)
                      qrystr += "dId" + FormattedOutPuts.fromPredicate(m.op) + fromProgramName("dId", m.data) + " AND "
                  } else {
                    qrystr += m.field + FormattedOutPuts.fromPredicate(m.op) + fromProgramName(m.field, m.data) + " AND "
                  }
                }

              }
            }

            if (tieneJson) {
              records = ProgramaService.cantidad(user_id, qrystr)
              panel = ProgramaService.listado(user_id, page, qrystr)

            } else {
              records = ProgramaService.cantidad(user_id, "")
              panel = ProgramaService.listado(user_id, page, "")

            }
          }
        } else {
          records = ProgramaService.cantidad(user_id, "")
          panel = ProgramaService.listado(user_id, page, "")

        }

        var registro = new JSONArray()
        for (p <- panel) {
          var campo = new JSONObject()
          campo.put("program_id", p.program_id)
          campo.put("division", p.division)
          campo.put("program_type", p.program_type)
          campo.put("sub_type", p.sub_type)
          campo.put("workflow_status", p.workflow_status)
          campo.put("program_name", p.program_name)
          campo.put("release_date", p.release_date.getOrElse("").toString())
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