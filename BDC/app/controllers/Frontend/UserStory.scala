package controllers.Frontend

import play.api.mvc.Action
import play.api.mvc.Controller
import services.UserStoryService
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
object UserStory extends Controller {
/*
  def fromIncidentName(choice: String, value: String): String = choice match {
    
    case "dId"                => " '" + value + "' "
    case "status_id"          => " '" + value + "' "
    case "severity_id"        => " '" + value + "' "
    case "configuration_name" => " '%" + value + "%' "
    case "program_name"       => " '%" + value + "%' "
    case "sponsor_name"       => " '%" + value + "%' "
    case "brief_description"  => " '%" + value + "%' "
    case "task_title"         => " '%" + value + "%' "
    case "date_creation"      => " '" + value + "' "
    case "date_end"           => " '" + value + "' "
    case "ir_number"          => value
    case "alm_number"         => " '" + value + "' "
    case _                    => "error"
  }
  
  */


  def home = Action {
    implicit request =>
      request.session.get("username").map { user =>

        Ok(views.html.frontend.userStory.listUserStory()).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }
/*
  def delete(oper: String, id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val cod = IncidentService.delete(id)

      val act = Activity(ActivityTypes.Incident.id, "Delete by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), id.toInt)
      Activity.saveLog(act)
      Ok(play.api.libs.json.Json.toJson(cod)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
    }.getOrElse {
      Redirect(routes.Login.loginUser()).withNewSession
    }
  }
*/
  /*
  def saveSubTask = Action {
    implicit request =>
      request.session.get("username").map { user =>
        var incident: Option[ErrorIncident] = null
        val body: AnyContent = request.body
        val jsonBody: Option[play.api.libs.json.JsValue] = body.asJson
        var ret: Int = 0
        jsonBody.map { jsValue =>

          val title = (jsValue \ "title")
          val plan_start_date = (jsValue \ "plan_start_date")
          val plan_end_date = (jsValue \ "plan_end_date")
          val completion_percentage = (jsValue \ "completion_percentage")
          val sub_task_id = (jsValue \ "sub_task_id")
          val oper = (jsValue \ "oper")
          /*
          println("oper : " + oper)
          println("completion_percentage : " + completion_percentage)
          println("sub_task_id : " + sub_task_id)
          println("plan_start_date : " + plan_start_date)
          println("plan_end_date : " + plan_end_date)          
          */
          
          if (oper.toString().replace("\"", "").equals("edit")) {
            incident = IncidentService.updateCompletionPercentage(
              sub_task_id.toString().replace("\"", ""),
              title.toString().replace("\"", ""),
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
          } else if (oper.toString().replace("\"", "").equals("add")) {
            val task_id = (jsValue \ "task_id")
            
            val description = (jsValue \ "description")
            val catalogo = (jsValue \ "catalogo")            
            
            
            incident = IncidentService.saveSubTask(
              task_id.toString().replace("\"", ""),
              title.toString().replace("\"", ""),
              description.toString().replace("\"", ""),
              plan_start_date.toString().replace("\"", ""),
              plan_end_date.toString().replace("\"", ""),
              catalogo.toString().replace("\"", ""))
            
            println(incident.get.error_code)
          }

        }

        Ok(play.api.libs.json.Json.toJson(incident)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }
*/
/*
  def save = Action {
    implicit request =>
      request.session.get("username").map { user =>

        val body: AnyContent = request.body
        val jsonBody: Option[play.api.libs.json.JsValue] = body.asJson
        var incident: Option[ErrorIncident] = null

        jsonBody.map { jsValue =>

          val configuration_id = (jsValue \ "configuration_id")
          val program_id = (jsValue \ "program_id")
          val date_creation = (jsValue \ "date_creation")
          val ir_number = (jsValue \ "ir_number")
          val alm_number = (jsValue \ "alm_number")
          val uname = (jsValue \ "uname")
          val user_sponsor_id = (jsValue \ "user_sponsor_id")
          val brief_description = (jsValue \ "brief_description")
          val extended_description = (jsValue \ "extended_description")
          val severity_id = (jsValue \ "severity_id")
          val date_end = (jsValue \ "date_end")
          val task_owner_id = (jsValue \ "task_owner_id")
          val user_creation_id = request.session.get("uId").get

          incident = IncidentService.save(
            configuration_id.toString().replace("\"", ""),
            program_id.toString().replace("\"", ""),
            date_creation.toString().replace("\"", ""),
            ir_number.toString().replace("\"", ""),
            alm_number.toString().replace("\"", ""),
            uname.toString().replace("\"", ""),
            brief_description.toString().replace("\"", ""),
            extended_description.toString().replace("\"", ""),
            severity_id.toString().replace("\"", ""),
            date_end.toString().replace("\"", ""),
            task_owner_id.toString().replace("\"", ""),
            user_creation_id.toString().replace("\"", ""))

          //println("ErrorIncident : " + play.api.libs.json.Json.toJson(incident))
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
*/
  
  /*
  def listSubTask(id: String) = Action {
    implicit request =>
      request.session.get("username").map { user =>
        var sidx = request.getQueryString("sidx").get.toString()
        val sord = request.getQueryString("sord").get.toString()
        val rows = request.getQueryString("rows").get.toInt
        val page = request.getQueryString("page").get.toInt
        var records: Int = 0

        if (sidx.trim().size == 0) {
          sidx = "recurso"
        }
        val pageIndex = page
        val pageSize = rows
        val startRow = (pageIndex * pageSize) + 1;
        
        var node = new JSONObject()
        val subtask = IncidentService.selectSubtask(id, sidx, sord, rows, startRow)

        var registro = new JSONArray()
        for (p <- subtask) {
          var campo = new JSONObject()
          records = p.cantidad
          campo.put("sub_task_id", p.sub_task_id)
          campo.put("task_id", p.task_id)
          campo.put("task_owner_id", p.task_owner_id)
          campo.put("project_manager_id", p.project_manager_id)
          campo.put("program_manager_id", p.program_manager_id)
          campo.put("title", p.title)
          campo.put("description", p.description)
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

        //node.put("rows", registro)
        
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
*/
  /*
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
          val alm_number = (jsValue \ "alm_number")
          val user_sponsor_id = (jsValue \ "user_sponsor_id")
          val brief_description = (jsValue \ "brief_description")
          val extended_description = (jsValue \ "extended_description")
          val severity_id = (jsValue \ "severity_id")
          val date_end = (jsValue \ "date_end")
          val task_owner_id = (jsValue \ "task_owner_id")
          val user_creation_id = request.session.get("uId").get
          val status_id = (jsValue \ "status_id")
          val note = (jsValue \ "note")
          val uname = (jsValue \ "uname")
          /*
          println("va el dato uname en el controlador")
          println(uname)
          println("va el dato user_sponsor_id en el controlador")
          println(user_sponsor_id)
          * 
          */

          incident = IncidentService.update(
            severity_id.toString().replace("\"", ""),
            date_end.toString().replace("\"", ""),
            incident_id.toString().replace("\"", ""),
            status_id.toString().replace("\"", ""),
            user_creation_id.toString().replace("\"", ""),
            note.toString().replace("\"", ""),
			configuration_id.toString().replace("\"", ""),
			program_id.toString().replace("\"", ""),
			task_owner_id.toString().replace("\"", ""),
			alm_number.toString().replace("\"", ""),
			uname.toString().replace("\"", ""))
			
          //println(incident.last.error_text)
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
*/
  
  def list = Action {
    implicit request =>
      request.session.get("username").map { user =>

        val rows = request.getQueryString("rows").getOrElse("20").toString()
        val page = request.getQueryString("page").getOrElse("1").toString()
        val filters = request.getQueryString("filters").getOrElse("").toString()
        val user_id = Integer.parseInt(request.session.get("uId").get)

        var panel: Seq[models.UserStory] = null
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
                

              }
            }
            //println("qrystr:" + qrystr)
            if (tieneJson) {
              records = UserStoryService.count(qrystr, user_id)
              panel = UserStoryService.list(rows, page, qrystr, user_id)

            } else {
              records = UserStoryService.count("", user_id)
              panel = UserStoryService.list(rows, page, "", user_id)

            }
          }
        } else {
          records = UserStoryService.count("",user_id)
          panel = UserStoryService.list(rows, page, "",user_id)

        }

        var registro = new JSONArray()
        for (p <- panel) {
          var campo = new JSONObject()
          
          campo.put("us_id", p.us_id)
          campo.put("us_code", p.us_code)
          //campo.put("program_id", p.program_id)
          //campo.put("program_name", p.program_name)
          campo.put("rol", p.rol)
          campo.put("funcion", p.funcion)
          campo.put("resultado", p.resultado)
          campo.put("descripcion", p.descripcion)
          campo.put("epica", p.epica)
          campo.put("tema", p.tema)
          campo.put("created_by", p.created_by)
          //campo.put("created_by_name", p.created_by_name)

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