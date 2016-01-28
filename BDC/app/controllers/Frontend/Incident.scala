package controllers.Frontend

import play.api.mvc.Action
import play.api.mvc.Controller
import services.IncidentService
import services.ProgramMemberService
import services.SubTaskServices
import org.apache.commons.lang3.StringUtils
import org.json.JSONArray
import org.json.JSONObject
import net.liftweb.json._
import net.liftweb.json.JsonParser._
import models._
import utils.FormattedOutPuts
import play.api.mvc.AnyContent
import java.util.Date
import java.io.File
import java.io.FileOutputStream
import org.apache.poi.xssf.usermodel._

/**
 * @author marcelo
 */
object Incident extends Controller {

  def fromIncidentName(choice: String, value: String): String = choice match {
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
	case "alm_number"          => value
    case _                    => "error"
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

        val act = Activity(ActivityTypes.Incident.id, "Delete by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get),id.toInt)
        Activity.saveLog(act)
      Ok(play.api.libs.json.Json.toJson(cod)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
    }.getOrElse {
      Redirect(routes.Login.loginUser()).withNewSession
    }
  }

  def saveSubTask = Action {
    implicit request =>
      request.session.get("username").map { user =>
        var incident: Option[ErrorIncident] = null
        val body: AnyContent = request.body
        val jsonBody: Option[play.api.libs.json.JsValue] = body.asJson
        var ret: Int = 0
        jsonBody.map { jsValue =>

          val plan_start_date = (jsValue \ "plan_start_date")
          val plan_end_date = (jsValue \ "plan_end_date")
          val completion_percentage = (jsValue \ "completion_percentage")
          val sub_task_id = (jsValue \ "sub_task_id")
          val oper = (jsValue \ "oper")

          /*
          println("completion_percentage : " + completion_percentage)
          println("sub_task_id : " + sub_task_id)
          println("plan_start_date : " + plan_start_date)
          println("plan_end_date : " + plan_end_date)          
          println("oper : " + oper)
          */
          if (oper.toString().replace("\"", "").equals("edit")) {

            //ret = SubTaskServices.updateCompletionPercentage(
            incident = IncidentService.updateCompletionPercentage(
              sub_task_id.toString().replace("\"", ""),
              completion_percentage.toString().replace("\"", ""),
              plan_start_date.toString().replace("\"", ""),
              plan_end_date.toString().replace("\"", ""))

            //println(play.api.libs.json.Json.toJson(incident))
            /*
            if(incident.get.error_code>0)
              throw new Exception(incident.get.error_text)
              BadRequest(incident.get.error_text)
              */

          } else if (oper.toString().replace("\"", "").equals("del")) {
            println(incident)
          }

        }

        Ok(play.api.libs.json.Json.toJson(incident)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }

  def addMember = Action {
    implicit request =>
      request.session.get("username").map { user =>

        val term = request.getQueryString("term").getOrElse("").toString()
        var users: Seq[NameUsr] = null
        users = IncidentService.listUsr(term)

        Ok(play.api.libs.json.Json.toJson(users)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }
  
  def addUser = Action {
    implicit request =>
      request.session.get("username").map { user =>

        val term = request.getQueryString("term").getOrElse("").toString()
        var users = IncidentService.listUsrTwo(term)

        Ok(play.api.libs.json.Json.toJson(users)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }  

  def delMember = Action {
    implicit request =>
      request.session.get("username").map { user =>

        val task_id = request.getQueryString("task_id").getOrElse("").toString()
        val sub_task_id = request.getQueryString("sub_task_id").getOrElse("").toString()
        val uid = request.getQueryString("uid").getOrElse("").toString()

        //println("task_id : " + task_id)
        //println("sub_task_id : " + sub_task_id)
        //println("uid : " + uid)

        val ret = IncidentService.delMember(task_id, sub_task_id, uid)

        Ok(ret.toString()).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }

  def delSubTask = Action {
    implicit request =>
      request.session.get("username").map { user =>

        val sub_task_id = request.getQueryString("sub_task_id").getOrElse("").toString()

        val ret = IncidentService.delSubTask(sub_task_id)

        Ok(ret.toString()).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }

  def saveHours = Action {
    implicit request =>
      request.session.get("username").map { user =>

        val body: AnyContent = request.body
        val jsonBody: Option[play.api.libs.json.JsValue] = body.asJson
        var incident: Option[ErrorIncident] = null

        jsonBody.map { jsValue =>

          val oper = (jsValue \ "oper")
          val nota = (jsValue \ "nota")
          val planeadas = (jsValue \ "planeadas")
          val ingresadas = (jsValue \ "ingresadas")
          val sub_task_id = (jsValue \ "sub_task_id")
          val task_id = (jsValue \ "task_id")
          val uid = (jsValue \ "uid")
          val user_creation_id = request.session.get("uId").get
          val task_for_date = (jsValue \ "task_for_date")

          println("oper : " + oper)
          //println("ingresadas : " + ingresadas)
          //println("sub_task_id : " + sub_task_id)
          //println("task_id : " + task_id)
          //println("uid : " + uid)
          //println("user_creation_id : " + user_creation_id)

          if (oper.toString().replace("\"", "").equals("add")) {
            val name = (jsValue \ "nombre")

            if (ingresadas.toString().replace("\"", "").trim().equals("")) {
              //println("por aqui")
              incident = IncidentService.insertMember(
                name.toString().replace("\"", ""),
                task_for_date.toString().replace("\"", ""),
                nota.toString().replace("\"", ""),
                planeadas.toString().replace("\"", ""),
                "0",
                sub_task_id.toString().replace("\"", ""),
                user_creation_id.toString().replace("\"", ""))
            } else {
              //println("por aca [" + ingresadas.toString().replace("\"", "") + "]")
              incident = IncidentService.insertMember(
                name.toString().replace("\"", ""),
                task_for_date.toString().replace("\"", ""),
                nota.toString().replace("\"", ""),
                planeadas.toString().replace("\"", ""),
                ingresadas.toString().replace("\"", ""),
                sub_task_id.toString().replace("\"", ""),
                user_creation_id.toString().replace("\"", ""))
            }

          } else if (oper.toString().replace("\"", "").equals("edit")) {

            incident = IncidentService.saveHours(
              task_for_date.toString().replace("\"", ""),
              nota.toString().replace("\"", ""),
              planeadas.toString().replace("\"", ""),
              ingresadas.toString().replace("\"", ""),
              sub_task_id.toString().replace("\"", ""),
              task_id.toString().replace("\"", ""),
              uid.toString().replace("\"", ""),
              user_creation_id.toString().replace("\"", ""))

          }
          // println("ErrorIncident : " + play.api.libs.json.Json.toJson(incident))

        }

        /**
         * Activity log
         */

        val act = Activity(ActivityTypes.Project.id, "Booked by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), incident.get.task_id)
        Activity.saveLog(act)

        Ok(play.api.libs.json.Json.toJson("OK")).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
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
		      val alm_number = (jsValue \ "alm_number")
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
			      alm_number.toString().replace("\"", ""),
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

        val act = Activity(ActivityTypes.Incident.id, "New incident created by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), incident.get.task_id)
        Activity.saveLog(act)

        Ok(play.api.libs.json.Json.toJson(incident)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }

  def listStatus(id: String) = Action {
    implicit request =>
      request.session.get("username").map { user =>
        val log = IncidentService.selectStatus(id)

        Ok(play.api.libs.json.Json.toJson(log)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }

  def listWorker(id: String) = Action {
    implicit request =>
      request.session.get("username").map { user =>
        val hours = IncidentService.selectWorkerHours(id)

        Ok(play.api.libs.json.Json.toJson(hours)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }

  def listSubTask(id: String) = Action {
    implicit request =>
      request.session.get("username").map { user =>
        var node = new JSONObject()
        val subtask = IncidentService.selectSubtask(id)

        var registro = new JSONArray()
        for (p <- subtask) {
          var campo = new JSONObject()

          campo.put("sub_task_id", p.sub_task_id)
          campo.put("title", p.title)
          campo.put("plan_start_date", p.plan_start_date.getOrElse("").toString())
          campo.put("plan_end_date", p.plan_end_date.getOrElse("").toString())
          campo.put("real_start_date", p.real_start_date.getOrElse("").toString())
          campo.put("real_end_date", p.real_end_date.getOrElse("").toString())
          campo.put("completion_percentage", p.completion_percentage)
          campo.put("hours", p.hours)
          campo.put("expected_percentage", p.expected_percentage)
          campo.put("fecini", p.fecini)
          registro.put(campo)
        }

        node.put("rows", registro)
        Ok(node.toString()).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)

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

          incident = IncidentService.update(
            severity_id.toString().replace("\"", ""),
            date_end.toString().replace("\"", ""),
            incident_id.toString().replace("\"", ""),
            status_id.toString().replace("\"", ""),
            user_creation_id.toString().replace("\"", ""),
            note.toString().replace("\"", ""))
          println(incident.last.error_text)
        }

        /**
         * Activity log
         */

        val act = Activity(ActivityTypes.Incident.id, "Update incident by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), incident.get.task_id)
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
                  if (m.field.equals("owner_name")) {
                    qrystr += "task_owner_id IN (SELECT uid from art_user where first_name like '%" + m.data + "%' OR last_name like '%" + m.data + "%')" + " AND "
                  } else if (m.field.equals("sponsor_name")) {
                    qrystr += "user_sponsor_id IN (SELECT uid from art_user where first_name like '%" + m.data + "%' OR last_name like '%" + m.data + "%')" + " AND "
                  } else if (m.field.equals("severity_description")) {
                    if (m.data.toInt != 0)
                      qrystr += "severity_id" + FormattedOutPuts.fromPredicate(m.op) + fromIncidentName("severity_id", m.data) + " AND "
                  } else if (m.field.equals("status_name")) {
                    if (m.data.toInt != 0)
                      qrystr += "status_id" + FormattedOutPuts.fromPredicate(m.op) + fromIncidentName("status_id", m.data) + " AND "
                  } else if (m.field.equals("department")) {
                    if (m.data.toInt != 0)
                      qrystr += "dId" + FormattedOutPuts.fromPredicate(m.op) + fromIncidentName("dId", m.data) + " AND "
                  } else {
                    qrystr += m.field + FormattedOutPuts.fromPredicate(m.op) + fromIncidentName(m.field, m.data) + " AND "
                  }
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
          campo.put("date_creation", p.date_creation.getOrElse("").toString())
          campo.put("ir_number", p.ir_number)
		      campo.put("alm_number", p.alm_number.getOrElse("").toString())
          campo.put("user_sponsor_id", p.user_sponsor_id)
          campo.put("brief_description", p.brief_description)
          campo.put("extended_description", p.extended_description)
          campo.put("severity_id", p.severity_id)
          campo.put("date_end", p.date_end.getOrElse("").toString())
          campo.put("task_owner_id", p.task_owner_id)
          campo.put("user_creation_id", p.user_creation_id)
          campo.put("task_id", p.task_id)
          campo.put("task_title", p.task_title)
          campo.put("configuration_name", p.configuration_name)
          campo.put("program_name", p.program_name)
          campo.put("sponsor_name", p.sponsor_name)
          campo.put("owner_name", p.owner_name)
          campo.put("severity_description", p.severity_description)
          campo.put("status_name", p.status_name)
          campo.put("department", p.department)

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

  def departamentList = Action { implicit request =>

    val incidents = IncidentService.selectDepartamentIncident
    var s = "<select><option value='0'>Seleccione un valor</option>"
    for (i <- incidents) {
      s += "<option value='" + i.dId + "'>" + i.department + "</option>"
    }
    s += "</select>"

    Ok(s)

  }

  def severityList = Action { implicit request =>

    val incidents = IncidentService.selectSeverity
    Ok(play.api.libs.json.Json.toJson(incidents))
  }
/*
  def severityConfigurationList(id: String) = Action { implicit request =>

    val incidents = IncidentService.selectSeverityConfiguration(id)
    Ok(play.api.libs.json.Json.toJson(incidents))
  }
 */
  def severityConfigurationList() = Action { implicit request =>
        val id = request.getQueryString("id").get.toString()
    val incidents = IncidentService.selectSeverityConfiguration(id)
    Ok(play.api.libs.json.Json.toJson(incidents))
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
    Ok(s)

  }

  def businessMemberList(id: String) = Action { implicit request =>

    val programs = ProgramMemberService.findBusinessMemberForIncident(id)
    var s = "<select><option value='0'>Seleccione un valor</option>"

    for (i <- programs) {
      s += "<option value='" + i.uid.get + "'>" + i.first_name + " " + i.last_name + "</option>"
    }

    s += "</select>"
    Ok(s)

  }

  def noBusinessMemberList(id: String) = Action { implicit request =>

    val programs = ProgramMemberService.findNoBusinessMemberForIncident(id)
    var s = "<select><option value='0'>Seleccione un valor</option>"

    for (i <- programs) {
      s += "<option value='" + i.uid.get + "'>" + i.first_name + " " + i.last_name + "</option>"
    }

    s += "</select>"

    Ok(s)

  }

  def getConfigurationProgramType(id: String) = Action { implicit request =>
    var tipo: Int = IncidentService.selectTypeFromId(id)
    Ok(tipo.toString())

  }

  def getSeverityDays(id: String, feccre: String) = Action { implicit request =>
    //println("feccre : " + feccre)
    var days: Int = IncidentService.selectSeverityDays(id, feccre)
    Ok(days.toString())

  }

  def excel() = Action {
    implicit request =>
      request.session.get("username").map { user =>
        var panel: Seq[Incident] = null
        val file = new File("incident.xlsx")
        val fileOut = new FileOutputStream(file);
        val wb = new XSSFWorkbook
        val sheet = wb.createSheet("INCIDENCIAS")
        val filters = request.getQueryString("filters").getOrElse("").toString()
        var j = 0
        var rNum = 1
        var cNum = 0
        var a = 0
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
                  /*
                  if (!m.data.trim().equals("")){
                    println(m.field + " - " + m.data.trim())
                    qrystr += m.field + FormattedOutPuts.fromPredicate(m.op) + fromIncidentName(m.field, m.data) + " AND "
                  }
                  * 
                  */
                  println(m.field + " - " + m.data.trim())
                  if (m.field.equals("owner_name")) {
                    qrystr += "task_owner_id IN (SELECT uid from art_user where first_name like '%" + m.data + "%' OR last_name like '%" + m.data + "%')" + " AND "
                  } else if (m.field.equals("sponsor_name")) {
                    qrystr += "user_sponsor_id IN (SELECT uid from art_user where first_name like '%" + m.data + "%' OR last_name like '%" + m.data + "%')" + " AND "
                  } else if (m.field.equals("severity_description")) {
                    if (m.data.toInt != 0)
                      qrystr += "severity_id" + FormattedOutPuts.fromPredicate(m.op) + fromIncidentName("severity_id", m.data) + " AND "
                  } else if (m.field.equals("status_name")) {
                    if (m.data.toInt != 0)
                      qrystr += "status_id" + FormattedOutPuts.fromPredicate(m.op) + fromIncidentName("status_id", m.data) + " AND "
                  } else if (m.field.equals("department")) {
                    if (m.data.toInt != 0)
                      qrystr += "dId" + FormattedOutPuts.fromPredicate(m.op) + fromIncidentName("dId", m.data) + " AND "
                  } else {
                    qrystr += m.field + FormattedOutPuts.fromPredicate(m.op) + fromIncidentName(m.field, m.data) + " AND "
                  }
                }

              }
            }

          }
          println(qrystr)
          if (tieneJson) {
            panel = IncidentService.list("0", "0", qrystr)
          } else {
            panel = IncidentService.list("0", "0", "")
          }

        } else {
          panel = IncidentService.list("0", "0", "")

        }

        var rowhead = sheet.createRow(0)
        val style = wb.createCellStyle()
        val font = wb.createFont()
        font.setFontName(org.apache.poi.hssf.usermodel.HSSFFont.FONT_ARIAL)
        font.setFontHeightInPoints(10)
        font.setBold(true)
        style.setFont(font)
        rowhead.createCell(0).setCellValue("Id")
        rowhead.createCell(1).setCellValue("Incidencia")
        rowhead.createCell(2).setCellValue("Sistema")
        rowhead.createCell(3).setCellValue("Tarea")
        rowhead.createCell(4).setCellValue("Número IR")
        rowhead.createCell(5).setCellValue("Usuario")
        rowhead.createCell(6).setCellValue("Responsable")
        rowhead.createCell(7).setCellValue("Fecha Creación")
        rowhead.createCell(8).setCellValue("Fecha Termino")
        rowhead.createCell(9).setCellValue("Descripción Corta")
        rowhead.createCell(10).setCellValue("Descripción Extensa")
		rowhead.createCell(11).setCellValue("Número ALM")

        for (j <- 0 to 10)
          rowhead.getCell(j).setCellStyle(style);

        for (s <- panel) {
          var row = sheet.createRow(rNum)

          val cel0 = row.createCell(cNum)
          cel0.setCellValue(s.incident_id)

          val cel1 = row.createCell(cNum + 1)
          cel1.setCellValue(s.configuration_name)

          val cel2 = row.createCell(cNum + 2)
          cel2.setCellValue(s.program_name)

          val cel3 = row.createCell(cNum + 3)
          cel3.setCellValue(s.task_title)

          val cel4 = row.createCell(cNum + 4)
          cel4.setCellValue(s.ir_number)

          val cel5 = row.createCell(cNum + 5)
          cel5.setCellValue(s.sponsor_name)

          val cel6 = row.createCell(cNum + 6)
          cel6.setCellValue(s.owner_name)

          val cel7 = row.createCell(cNum + 7)
          cel7.setCellValue(s.date_creation.getOrElse("").toString())

          val cel8 = row.createCell(cNum + 8)
          cel8.setCellValue(s.date_end.getOrElse("").toString())

          val cel9 = row.createCell(cNum + 9)
          cel9.setCellValue(s.brief_description)

          val cel10 = row.createCell(cNum + 10)
          cel10.setCellValue(s.extended_description)
		  
		  val cel11 = row.createCell(cNum + 11)
          cel11.setCellValue(s.alm_number.getOrElse("").toString())

          rNum = rNum + 1
          cNum = 0

        }

        for (a <- 0 to 10) {
          sheet.autoSizeColumn((a.toInt));
        }

        wb.write(fileOut);
        fileOut.close();
        Ok.sendFile(content = file, fileName = _ => "incident.xlsx")
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }

}