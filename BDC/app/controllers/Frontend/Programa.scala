package controllers.Frontend

import play.api.mvc.Action
import play.api.mvc.Controller
import services.ProgramaService
import services.DivisionService
import services.SubTypeService
import services.ProgramTypeService
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
    case "devison"                => value
    case "program_type"           => value
    case "program_sub_type"       => value
    case "work_flow_status"       => value
    case "pai"                    => value
    case "pae"                    => value
    case "spi"                    => value
    case "cpi"                    => value
    case "release_date"           => " '" + value + "' "    
    case _                        => "error"
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
        var qrystr_c = ""

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
                  if (m.field.equals("division")) {
                    if (m.data.toInt != 0){
                      qrystr += "X.dId" + FormattedOutPuts.fromPredicate(m.op) + fromProgramName("devison", m.data) + " AND "
                      qrystr_c += "dId" + FormattedOutPuts.fromPredicate(m.op) + fromProgramName("devison", m.data) + " AND "
                    }
                  } else if (m.field.equals("program_type")) {
                    if (m.data.toInt != 0){
                      qrystr += "X.program_type_id" + FormattedOutPuts.fromPredicate(m.op) + fromProgramName("program_type", m.data) + " AND "
                      qrystr_c += "t1.id" + FormattedOutPuts.fromPredicate(m.op) + fromProgramName("devison", m.data) + " AND "
                    }
                  } else if (m.field.equals("sub_type")) {
                    if (m.data.toInt != 0){
                      qrystr += "X.program_sub_type" + FormattedOutPuts.fromPredicate(m.op) + fromProgramName("program_sub_type", m.data) + " AND "
                    }
                  } else if (m.field.equals("workflow_status")) {
                    if (m.data.toInt != 0){
                      qrystr += "X.work_flow_status" + FormattedOutPuts.fromPredicate(m.op) + fromProgramName("work_flow_status", m.data) + " AND "
                    }
                  } else if (m.field.equals("release_date")) {
                      qrystr += "X.release_date" + FormattedOutPuts.fromPredicate(m.op) + fromProgramName("release_date", m.data) + " AND "
                  } 
                  else {
                    qrystr += m.field + FormattedOutPuts.fromPredicate(m.op) + fromProgramName(m.field, m.data) + " AND "
                  }
                }

              }
            }

            println(">>>>>>>>>>>>>>>>>>>>>  [" + qrystr + "]")
            println(">>>>>>>>>>>>>>>>>>>>>  [" + qrystr_c + "]")
            if (tieneJson) {
              records = ProgramaService.cantidad(user_id, qrystr_c)
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
          campo.put("pai",p.pai)
          campo.put("pae",p.pai)
          campo.put("spi",p.spi)
          campo.put("cpi",p.cpi)
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

  def listaDivisiones = Action { implicit request =>

    val divisionValues = DivisionService.findAllDivision

    Ok(play.api.libs.json.Json.toJson(divisionValues))

  }

  def listaTipo = Action { implicit request =>

    val modelManagementValues = ProgramTypeService.findAllProgramType

    Ok(play.api.libs.json.Json.toJson(modelManagementValues))

  }

  def listaFoco = Action { implicit request =>

    val programSubTypeValues = SubTypeService.findAllSubTypeList

    Ok(play.api.libs.json.Json.toJson(programSubTypeValues))

  }

  def listaEstado = Action { implicit request =>

    val workflowStatusValues = ProgramTypeService.findAllWorkflowStatus

    Ok(play.api.libs.json.Json.toJson(workflowStatusValues))

  }

}