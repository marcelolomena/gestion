package controllers.Frontend

import play.api.mvc.Action
import play.api.mvc.Controller
import services.IncidentService
import services.ProgramMemberService
import org.apache.commons.lang3.StringUtils
import org.json.JSONArray
import org.json.JSONObject
import net.liftweb.json._
import net.liftweb.json.JsonParser._
import models.Activity
import models.ActivityTypes
import models.DBFilter
import models.ErrorIncident
import utils.FormattedOutPuts
import play.api.mvc.AnyContent
import java.util.Date

/**
 * @author marcelo
 */
object Incident extends Controller {

  def fromIncidentName(choice: String, value: String): String = choice match {
    case "brief_description" => " '%" + value + "%' "
    case "date_creation"     => " '" + value + "' "
    case "date_end"          => " '" + value + "' "
    case "ir_number"         => value
    case _                   => "error"
  }

  def home = Action {
    implicit request =>
      request.session.get("username").map { user =>

        Ok(views.html.frontend.incident.listIncident()).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }

  def delete(oper: String, id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val cod = IncidentService.delete(id)

      Ok(play.api.libs.json.Json.toJson(cod)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
    }.getOrElse {
      Redirect(routes.Login.loginUser()).withNewSession
    }
  }

  def save = Action {
    implicit request =>
      request.session.get("username").map { user =>

        val body: AnyContent = request.body
        val jsonBody: Option[play.api.libs.json.JsValue] = body.asJson
        var incident: Option[ErrorIncident] = null

        jsonBody.map { jsValue =>

          //val incident_id = (jsValue \ "incident_id")
          val configuration_id = (jsValue \ "configuration_id")
          val program_id = (jsValue \ "program_id")
          val date_creation = (jsValue \ "date_creation")
          val ir_number = (jsValue \ "ir_number")
          val user_sponsor_id = (jsValue \ "user_sponsor_id")
          val brief_description = (jsValue \ "brief_description")
          val extended_description = (jsValue \ "extended_description")
          val severity_id = (jsValue \ "severity_id")
          val date_end = (jsValue \ "date_end")
          val task_owner_id = (jsValue \ "task_owner_id")
          val user_creation_id = request.session.get("uId").get

          /*
          println("configuration_id : " + configuration_id)
          println("program_id : " + program_id)
          println("date_creation : " + date_creation)
          println("ir_number : " + ir_number)
          println("user_sponsor_id : " + user_sponsor_id)
          println("brief_description : " + brief_description)
          println("extended_description : " + extended_description)
          println("severity_id : " + severity_id)
          println("date_end : " + date_end)
          println("task_owner_id : " + task_owner_id)
          println("user_creation_id : " + user_creation_id)
          */

          incident = IncidentService.save(
            configuration_id.toString().replace("\"", ""),
            program_id.toString().replace("\"", ""),
            date_creation.toString().replace("\"", ""),
            ir_number.toString().replace("\"", ""),
            user_sponsor_id.toString().replace("\"", ""),
            brief_description.toString().replace("\"", ""),
            extended_description.toString().replace("\"", ""),
            severity_id.toString().replace("\"", ""),
            date_end.toString().replace("\"", ""),
            task_owner_id.toString().replace("\"", ""),
            user_creation_id.toString().replace("\"", ""))

          println("ErrorIncident : " + play.api.libs.json.Json.toJson(incident))
        }

        /**
         * Activity log
         */

        val act = Activity(ActivityTypes.Project.id, "New incident created by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), incident.get.task_id)
        Activity.saveLog(act)

        Ok(play.api.libs.json.Json.toJson(incident)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }

  def listStatus(id: String) = Action {
    implicit request =>
      request.session.get("username").map { user =>

        val user_creation_id = request.session.get("uId").get

        val log = IncidentService.selectStatus(user_creation_id, id)

        Ok(play.api.libs.json.Json.toJson(log)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }

  def update = Action {
    implicit request =>
      request.session.get("username").map { user =>

        val body: AnyContent = request.body
        val jsonBody: Option[play.api.libs.json.JsValue] = body.asJson
        var incident: Option[ErrorIncident] = null
        //println(jsonBody)
        jsonBody.map { jsValue =>

          val incident_id = (jsValue \ "id")
          val configuration_id = (jsValue \ "configuration_id")
          val program_id = (jsValue \ "program_id")
          val date_creation = (jsValue \ "date_creation")
          val ir_number = (jsValue \ "ir_number")
          val user_sponsor_id = (jsValue \ "user_sponsor_id")
          val brief_description = (jsValue \ "brief_description")
          val extended_description = (jsValue \ "extended_description")
          val severity_id = (jsValue \ "severity_id")
          val date_end = (jsValue \ "date_end")
          val task_owner_id = (jsValue \ "task_owner_id")
          val user_creation_id = request.session.get("uId").get
          val status_id = (jsValue \ "status_id")
          val note = (jsValue \ "note")

          println("incident_id : " + incident_id)
          println("configuration_id : " + configuration_id)
          println("program_id : " + program_id)
          println("date_creation : " + date_creation)
          println("ir_number : " + ir_number)
          println("user_sponsor_id : " + user_sponsor_id)
          println("brief_description : " + brief_description)
          println("extended_description : " + extended_description)
          println("severity_id : " + severity_id)
          println("date_end : " + date_end)
          println("task_owner_id : " + task_owner_id)
          println("user_creation_id : " + user_creation_id)
          println("status_id : " + status_id)
          println("note : " + note)

          incident = IncidentService.update(
            incident_id.toString().replace("\"", ""),
            status_id.toString().replace("\"", ""),
            user_creation_id.toString().replace("\"", ""),
            note.toString().replace("\"", ""))

          /*
          incident = IncidentService.save(
            configuration_id.toString().replace("\"", ""),
            program_id.toString().replace("\"", ""),
            date_creation.toString().replace("\"", ""),
            ir_number.toString().replace("\"", ""),
            user_sponsor_id.toString().replace("\"", ""),
            brief_description.toString().replace("\"", ""),
            extended_description.toString().replace("\"", ""),
            severity_id.toString().replace("\"", ""),
            date_end.toString().replace("\"", ""),
            task_owner_id.toString().replace("\"", ""),
            user_creation_id.toString().replace("\"", ""))

          println("ErrorIncident : " + play.api.libs.json.Json.toJson(incident))
         
          */
        }

        /**
         * Activity log
         */

        val act = Activity(ActivityTypes.Project.id, "Update incident created by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), incident.get.task_id)
        Activity.saveLog(act)

        Ok(play.api.libs.json.Json.toJson(incident)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }

  def list = Action {
    implicit request =>
      request.session.get("username").map { user =>

        val rows = request.getQueryString("rows").getOrElse("20").toString()
        val page = request.getQueryString("page").getOrElse("1").toString()
        val filters = request.getQueryString("filters").getOrElse("").toString()

        var panel: Seq[models.Incident] = null
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
                  qrystr += m.field + FormattedOutPuts.fromPredicate(m.op) + fromIncidentName(m.field, m.data) + " AND "
                }

              }
            }

            if (tieneJson) {

              records = IncidentService.count(qrystr)
              panel = IncidentService.list(rows, page, qrystr)

            } else {
              records = IncidentService.count("")
              panel = IncidentService.list(rows, page, "")

            }
          }
        } else {
          records = IncidentService.count("")
          panel = IncidentService.list(rows, page, "")

        }

        var registro = new JSONArray()
        for (p <- panel) {
          var campo = new JSONObject()
          campo.put("incident_id", p.incident_id)
          campo.put("configuration_id", p.configuration_id)
          campo.put("program_id", p.program_id)
          campo.put("date_creation", p.date_creation)
          campo.put("ir_number", p.ir_number)
          campo.put("user_sponsor_id", p.user_sponsor_id)
          campo.put("brief_description", p.brief_description)
          campo.put("extended_description", p.extended_description)
          campo.put("severity_id", p.severity_id)
          campo.put("date_end", p.date_end)
          campo.put("date_end", p.date_end)
          campo.put("task_owner_id", p.task_owner_id)
          campo.put("user_creation_id", p.user_creation_id)
          campo.put("task_id", p.task_id)
          campo.put("task_title", p.task_title)
          campo.put("configuration_name", p.configuration_name)
          campo.put("program_name", p.program_name)
          campo.put("sponsor_name", p.sponsor_name)
          campo.put("owner_name", p.owner_name)

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

  def configurationList = Action { implicit request =>

    val incidents = IncidentService.selectTypeIncident
    var s = "<select><option value='0'>Seleccione un valor</option>"
    for (i <- incidents) {
      s += "<option value='" + i.configuration_id + "'>" + i.configuration_name + "</option>"
    }
    s += "</select>"

    Ok(s)

  }

  def statusList = Action { implicit request =>

    val incidents = IncidentService.selectStatusIncident
    var s = "<select><option value='0'>Seleccione un valor</option>"
    for (i <- incidents) {
      s += "<option value='" + i.status_id + "'>" + i.status_name + "</option>"
    }
    s += "</select>"

    Ok(s)

  }

  def severityList = Action { implicit request =>

    val incidents = IncidentService.selectSeverity
    var s = "<select><option value='0'>Seleccione un valor</option>"
    for (i <- incidents) {
      s += "<option value='" + i.severity_id + "'>" + i.severity_description + "</option>"
    }
    s += "</select>"

    Ok(s)

  }

  def validateCodIR(id: String) = Action { implicit request =>

    var yesno = IncidentService.validateCodIR(id)
    Ok(yesno.toString())
  }

  def programDefaultList = Action { implicit request =>
    var s = "<select><option value='0'>Seleccione un valor</option></select>"

    Ok(s)

  }

  def programList(id: String) = Action { implicit request =>

    val programs = IncidentService.selectProgramForType(id)
    var s = "<select><option value='0'>Seleccione un valor</option>"
    for (i <- programs) {
      s += "<option value='" + i.program_id.get + "'>" + i.program_name + "</option>"
    }
    s += "</select>"
    //println(s)
    Ok(s)

  }

  def businessMemberList(id: String) = Action { implicit request =>

    val programs = ProgramMemberService.findBusinessMemberForIncident(id)
    var s = "<select><option value='0'>Seleccione un valor</option>"

    for (i <- programs) {
      s += "<option value='" + i.uid.get + "'>" + i.first_name + " " + i.last_name + "</option>"
    }

    s += "</select>"
    //println(s)
    Ok(s)

  }

  def noBusinessMemberList(id: String) = Action { implicit request =>

    val programs = ProgramMemberService.findNoBusinessMemberForIncident(id)
    var s = "<select><option value='0'>Seleccione un valor</option>"

    for (i <- programs) {
      s += "<option value='" + i.uid.get + "'>" + i.first_name + " " + i.last_name + "</option>"
    }

    s += "</select>"
    //println(s)
    Ok(s)

  }

  def getConfigurationProgramType(id: String) = Action { implicit request =>
    var tipo: Int = IncidentService.selectTypeFromId(id)
    // tipo = IncidentService.selectTypeFromId(id)

    Ok(tipo.toString())

  }

  def getSeverityDays(id: String) = Action { implicit request =>
    var days: Int = IncidentService.selectSeverityDays(id)
    // tipo = IncidentService.selectTypeFromId(id)

    Ok(days.toString())

  }
}