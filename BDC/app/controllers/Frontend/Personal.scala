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
import java.util.Calendar

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
        val rows = request.getQueryString("rows").get.toInt
        val page = request.getQueryString("page").get.toInt
        val filters = request.getQueryString("filters").getOrElse("").toString()
        var sidx = request.getQueryString("sidx").get.toString()
        val sord = request.getQueryString("sord").get.toString()

        var records: Int = 0
        val uId = request.session.get("uId").get.toString()
        var node = new JSONObject()
        //var plan_start_date, plan_end_date = ""
/*
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
                    plan_start_date = m.data
                  } else if (m.field.equals("plan_end_date")) {
                    plan_end_date = m.data
                  }

                }
              }
            }
          }
        }

        val format = new java.text.SimpleDateFormat("yyyy-MM-dd")
        if (plan_start_date.trim().size == 0) {

          val cal1 = Calendar.getInstance()
          cal1.set(cal1.get(Calendar.YEAR),
            cal1.get(Calendar.MONTH),
            cal1.getActualMinimum(Calendar.DAY_OF_MONTH),
            cal1.getMinimum(Calendar.HOUR_OF_DAY),
            cal1.getMinimum(Calendar.MINUTE),
            cal1.getMinimum(Calendar.SECOND))
          cal1.getTime()
          plan_start_date = format.format(cal1.getTime())
        }

        if (plan_end_date.trim().size == 0) {
          val cal2 = Calendar.getInstance()
          cal2.set(cal2.get(Calendar.YEAR),
            cal2.get(Calendar.MONTH),
            cal2.getActualMaximum(Calendar.DAY_OF_MONTH),
            cal2.getMaximum(Calendar.HOUR_OF_DAY),
            cal2.getMaximum(Calendar.MINUTE),
            cal2.getMaximum(Calendar.SECOND))
          plan_end_date = format.format(cal2.getTime())
        }
*/
        if (sidx.trim().size == 0) {
          sidx = "nombre"
        }
        val pageIndex = page
        val pageSize = rows
        val startRow = (pageIndex * pageSize) + 1;
        val subtask = PersonalService.listadoAsignacionDependiente(uId)

        var registro = new JSONArray()
        for (p <- subtask) {
          var campo = new JSONObject()
          //records = p.cantidad
          campo.put("id", p.id.toString())
          campo.put("parent", p.parent.getOrElse("null").toString())
          if(p.isleaf==0){
            campo.put("expanded",false)
            campo.put("isLeaf", false)
          }else{
            campo.put("expanded",false)
            campo.put("isLeaf", true)
          }  
          campo.put("loaded", true)
          campo.put("level", p.level)
          campo.put("uname", p.uname)
          campo.put("nombre", p.nombre)
          campo.put("area", p.area)
          campo.put("departamento", p.departamento)
          registro.put(campo)
        }

        var pagedisplay = Math.ceil(records.toInt / Integer.parseInt(rows.toString()).toFloat).toInt

        node.put("page", 1)
        node.put("total", 1)
        node.put("records", 1)
        node.put("rows", registro)
/*
        var userdata = new JSONObject()
        userdata.put("daterang", "desde : " + plan_start_date + " hasta : " + plan_end_date)

        node.put("userdata", userdata)
*/
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
        var plan_start_date, plan_end_date = ""
        var records: Int = 0

        var node = new JSONObject()
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
                    plan_start_date = m.data
                  } else if (m.field.equals("plan_end_date")) {
                    plan_end_date = m.data
                  }

                }
              }
            }
          }
        }

        val format = new java.text.SimpleDateFormat("yyyy-MM-dd")
        if (plan_start_date.trim().size == 0) {

          val cal1 = Calendar.getInstance()
          cal1.set(cal1.get(Calendar.YEAR),
            cal1.get(Calendar.MONTH),
            cal1.getActualMinimum(Calendar.DAY_OF_MONTH),
            cal1.getMinimum(Calendar.HOUR_OF_DAY),
            cal1.getMinimum(Calendar.MINUTE),
            cal1.getMinimum(Calendar.SECOND))
          cal1.getTime()
          plan_start_date = format.format(cal1.getTime())
        }

        if (plan_end_date.trim().size == 0) {
          val cal2 = Calendar.getInstance()
          cal2.set(cal2.get(Calendar.YEAR),
            cal2.get(Calendar.MONTH),
            cal2.getActualMaximum(Calendar.DAY_OF_MONTH),
            cal2.getMaximum(Calendar.HOUR_OF_DAY),
            cal2.getMaximum(Calendar.MINUTE),
            cal2.getMaximum(Calendar.SECOND))
          plan_end_date = format.format(cal2.getTime())
        }
        
        if (sidx.trim().size == 0) {
          sidx = "recurso"
        }
        val pageIndex = page
        val pageSize = rows
        val startRow = (pageIndex * pageSize) + 1;
        
        //println("plan_start_date" + plan_start_date)
        //println("plan_end_date" + plan_end_date)

        val subtask = PersonalService.listadoSubTareas(uid, plan_start_date, plan_end_date, sidx, sord, rows, startRow)

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
          campo.put("rfecini", p.rfecini.getOrElse("").toString())
          campo.put("rfecfin", p.rfecfin.getOrElse("").toString())
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
        

        var userdata = new JSONObject()
        userdata.put("daterang", "desde : " + plan_start_date + " hasta : " + plan_end_date)

        node.put("userdata", userdata)
        

        Ok(node.toString()).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)

      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }

}