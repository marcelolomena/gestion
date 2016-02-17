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
        val filters = request.getQueryString("filters").getOrElse("").toString()
        var records: Int = 0
        val uId = request.session.get("uId").get.toString()
        var node = new JSONObject()
        var plan_start_date,plan_end_date = ""
        
        if (!StringUtils.isEmpty(filters)) {

          val jObject: play.api.libs.json.JsValue = play.api.libs.json.Json.parse(filters)

          if (!jObject.\\("rules").isEmpty) {

            val jList = jObject.\\("rules")
            var jElement = ""
            for (j <- jList) {
              jElement = j.toString()
              if (!jElement.equals("[]")) {

                implicit val formats = DefaultFormats
                val json = net.liftweb.json.JsonParser.parse(filters)
                val elements = (json \\ "rules").children
                for (acct <- elements) {
                  val m = acct.extract[DBFilter]

                  if (m.field.equals("plan_start_date")) {
                      plan_start_date=m.data
                  }else if (m.field.equals("plan_end_date")) {
                      plan_end_date=m.data
                  }
                  
                }
              }
            }  
          }
        }
        
        val subtask = PersonalService.listadoAsignacionDependiente(uId, plan_start_date, plan_end_date, rows, page)
        records = ProgramaService.cantidadSubalternos(uId)

        var registro = new JSONArray()
        for (p <- subtask) {
          var campo = new JSONObject()
          campo.put("uid", p.uid)
          campo.put("nombre", p.nombre)
          campo.put("asignado", p.asignado.getOrElse("").toString())
          campo.put("plan_start_date", p.plan_start_date.getOrElse("").toString())
          campo.put("plan_end_date", p.plan_end_date.getOrElse("").toString())
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
  
  
  
  def listadoSubTareasDeUsuario(uid: String) = Action {
    implicit request =>
      request.session.get("username").map { user =>
        val rows = request.getQueryString("rows").get.toInt
        val page = request.getQueryString("page").get.toInt
        val filters = request.getQueryString("filters").getOrElse("").toString()
        var sidx = request.getQueryString("sidx").get.toString()
        val sord = request.getQueryString("sord").get.toString()
        var records: Int = 0

        var node = new JSONObject()

        if (sidx.trim().size == 0) {
          sidx = "recurso"
        }
        val pageIndex = page
        val pageSize = rows
        val startRow = (pageIndex * pageSize) + 1;

        //println(rows)
        //println(startRow)
        val subtask = PersonalService.listadoSubTareas(uid, sidx, sord, rows, startRow)

        var registro = new JSONArray()
        for (p <- subtask) {
          var campo = new JSONObject()
          records = p.cantidad
          campo.put("program_id", p.program_id)
          campo.put("programa", p.programa)
          campo.put("recurso", p.recurso)
          campo.put("proyecto", p.proyecto)
          campo.put("pId", p.pId)
          campo.put("tarea", p.tarea)
          campo.put("tId", p.tId)
          campo.put("subtarea", p.subtarea)
          campo.put("sub_task_id", p.sub_task_id)
          campo.put("planeadas", p.planeadas)
          campo.put("trabajadas", p.trabajadas)
          campo.put("porcentaje", p.porcentaje)
          campo.put("plan_start_date", p.plan_start_date.getOrElse("").toString())
          campo.put("plan_end_date", p.plan_end_date.getOrElse("").toString())
          campo.put("estado", p.estado.getOrElse("").toString())
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