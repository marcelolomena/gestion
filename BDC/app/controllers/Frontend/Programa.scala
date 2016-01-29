package controllers.Frontend

import play.api.mvc.Action
import play.api.mvc.Controller
import services.ProgramaService
import services.DivisionService
import services.SubTypeService
import services.ProgramTypeService
import services.ImpactTypeService
import utils.FormattedOutPuts
import org.apache.commons.lang3.StringUtils
import org.json.JSONArray
import org.json.JSONObject
import net.liftweb.json._
import net.liftweb.json.JsonParser._
import models._
import play.api.mvc.AnyContent
import java.util.Date

/**
 * @author marcelo
 */
object Programa extends Controller {

  def fromProgramName(choice: String, value: String): String = choice match {
    case "devison"          => value
    case "program_type"     => value
    case "program_sub_type" => value
    case "work_flow_status" => value
    case "impact_type"      => value
    case "pai"              => value
    case "pae"              => value
    case "spi"              => value
    case "cpi"              => value
    case "release_date"     => " '" + value + "' "
    case _                  => "error"
  }

  def home = Action {
    implicit request =>
      request.session.get("username").map { user =>
        val user_id = Integer.parseInt(request.session.get("uId").get)

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
        val rows = request.getQueryString("rows").getOrElse("20").toInt
        val page = request.getQueryString("page").getOrElse("1").toInt
        val filters = request.getQueryString("filters").getOrElse("").toString()
        val sidx = request.getQueryString("sidx").get.toString()
        val sord = request.getQueryString("sord").get.toString()

        var panel: Seq[models.Programa] = null
        var records: Int = 0
        var node = new JSONObject()
        var tieneJson = true
        var qrystr = ""
        var qrystr_c = ""
        var order = ""

        //println("sidx:" + sidx)
        //println("sort:" + sord)

        if (sidx.trim().size == 0) {
          order = "X.program_id asc"
        } else {
          order = "X." + sidx + " " + sord
        }
        //println("order: " + order)

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
                    if (m.data.toInt != 0) {
                      qrystr += "X.dId" + FormattedOutPuts.fromPredicate(m.op) + fromProgramName("devison", m.data) + " AND "
                      qrystr_c += "dId" + FormattedOutPuts.fromPredicate(m.op) + fromProgramName("devison", m.data) + " AND "
                    }
                  } else if (m.field.equals("program_type")) {
                    if (m.data.toInt != 0) {
                      qrystr += "X.program_type_id" + FormattedOutPuts.fromPredicate(m.op) + fromProgramName("program_type", m.data) + " AND "
                      qrystr_c += "t1.id" + FormattedOutPuts.fromPredicate(m.op) + fromProgramName("devison", m.data) + " AND "
                    }
                  } else if (m.field.equals("sub_type")) {
                    if (m.data.toInt != 0) {
                      qrystr += "X.program_sub_type" + FormattedOutPuts.fromPredicate(m.op) + fromProgramName("program_sub_type", m.data) + " AND "
                    }
                  } else if (m.field.equals("workflow_status")) {
                    if (m.data.toInt != 0) {
                      qrystr += "X.work_flow_status" + FormattedOutPuts.fromPredicate(m.op) + fromProgramName("work_flow_status", m.data) + " AND "
                    }
                  } else if (m.field.equals("impact_type")) {
                    if (m.data.toInt != 0) {
                      qrystr += "X.impact_type_id" + FormattedOutPuts.fromPredicate(m.op) + fromProgramName("impact_type", m.data) + " AND "
                    }
                  } else if (m.field.equals("release_date")) {
                    qrystr += "X.release_date" + FormattedOutPuts.fromPredicate(m.op) + fromProgramName("release_date", m.data) + " AND "
                  } else {
                    qrystr += m.field + FormattedOutPuts.fromPredicate(m.op) + fromProgramName(m.field, m.data) + " AND "
                  }
                }

              }
            }

            //println(">>>>>>>>>>>>>>>>>>>>>  [" + qrystr + "]")
            //println(">>>>>>>>>>>>>>>>>>>>>  [" + qrystr_c + "]")
            if (tieneJson) {
              records = ProgramaService.cantidad(user_id, qrystr_c)
              panel = ProgramaService.listado(user_id, rows, page, order, qrystr)

            } else {
              records = ProgramaService.cantidad(user_id, "")
              panel = ProgramaService.listado(user_id, rows, page, order, "")

            }
          }
        } else {
          records = ProgramaService.cantidad(user_id, "")
          panel = ProgramaService.listado(user_id, rows, page, order, "")

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
          campo.put("program_description", p.program_description)
          campo.put("program_code", p.program_code)
          campo.put("initiation_planned_date", p.initiation_planned_date.getOrElse("").toString())
          campo.put("closure_date", p.release_date.getOrElse("").toString())
          campo.put("release_date", p.release_date.getOrElse("").toString())
          campo.put("planned_hours", p.planned_hours)
          campo.put("pai", p.pai)
          campo.put("pae", p.pai)
          campo.put("spi", p.spi)
          campo.put("cpi", p.cpi)
          campo.put("impact_type", p.impact_type)
          campo.put("sap_number", p.sap_number.getOrElse("").toString())
          campo.put("sap_code", p.sap_code.getOrElse("").toString())
          campo.put("demand_manager_name", p.demand_manager_name.toString())
          campo.put("program_manager_name", p.program_manager_name.toString())

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

  def listadoUsr(uid: String) = Action {
    implicit request =>
      request.session.get("username").map { user =>
        val user_id = Integer.parseInt(uid)
        val username = request.session.get("username").get
        val profile = request.session.get("user_profile").get
        val rows = request.getQueryString("rows").getOrElse("20").toInt
        val page = request.getQueryString("page").getOrElse("1").toInt
        val filters = request.getQueryString("filters").getOrElse("").toString()
        val sidx = request.getQueryString("sidx").get.toString()
        val sord = request.getQueryString("sord").get.toString()

        var panel: Seq[models.Programa] = null
        var records: Int = 0
        var node = new JSONObject()
        var tieneJson = true
        var qrystr = ""
        var qrystr_c = ""
        var order = ""

        //println("sidx:" + sidx)
        //println("sort:" + sord)

        if (sidx.trim().size == 0) {
          order = "X.program_id asc"
        } else {
          order = "X." + sidx + " " + sord
        }
        //println("order: " + order)

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
                    if (m.data.toInt != 0) {
                      qrystr += "X.dId" + FormattedOutPuts.fromPredicate(m.op) + fromProgramName("devison", m.data) + " AND "
                      qrystr_c += "dId" + FormattedOutPuts.fromPredicate(m.op) + fromProgramName("devison", m.data) + " AND "
                    }
                  } else if (m.field.equals("program_type")) {
                    if (m.data.toInt != 0) {
                      qrystr += "X.program_type_id" + FormattedOutPuts.fromPredicate(m.op) + fromProgramName("program_type", m.data) + " AND "
                      qrystr_c += "t1.id" + FormattedOutPuts.fromPredicate(m.op) + fromProgramName("devison", m.data) + " AND "
                    }
                  } else if (m.field.equals("sub_type")) {
                    if (m.data.toInt != 0) {
                      qrystr += "X.program_sub_type" + FormattedOutPuts.fromPredicate(m.op) + fromProgramName("program_sub_type", m.data) + " AND "
                    }
                  } else if (m.field.equals("workflow_status")) {
                    if (m.data.toInt != 0) {
                      qrystr += "X.work_flow_status" + FormattedOutPuts.fromPredicate(m.op) + fromProgramName("work_flow_status", m.data) + " AND "
                    }
                  } else if (m.field.equals("impact_type")) {
                    if (m.data.toInt != 0) {
                      qrystr += "X.impact_type_id" + FormattedOutPuts.fromPredicate(m.op) + fromProgramName("impact_type", m.data) + " AND "
                    }
                  } else if (m.field.equals("release_date")) {
                    qrystr += "X.release_date" + FormattedOutPuts.fromPredicate(m.op) + fromProgramName("release_date", m.data) + " AND "
                  } else {
                    qrystr += m.field + FormattedOutPuts.fromPredicate(m.op) + fromProgramName(m.field, m.data) + " AND "
                  }
                }

              }
            }

            //println(">>>>>>>>>>>>>>>>>>>>>  [" + qrystr + "]")
            //println(">>>>>>>>>>>>>>>>>>>>>  [" + qrystr_c + "]")
            if (tieneJson) {
              records = ProgramaService.cantidad(user_id, qrystr_c)
              panel = ProgramaService.listado(user_id, rows, page, order, qrystr)

            } else {
              records = ProgramaService.cantidad(user_id, "")
              panel = ProgramaService.listado(user_id, rows, page, order, "")

            }
          }
        } else {
          records = ProgramaService.cantidad(user_id, "")
          panel = ProgramaService.listado(user_id, rows, page, order, "")

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
          campo.put("program_description", p.program_description)
          campo.put("program_code", p.program_code)
          campo.put("initiation_planned_date", p.initiation_planned_date.getOrElse("").toString())
          campo.put("closure_date", p.release_date.getOrElse("").toString())
          campo.put("release_date", p.release_date.getOrElse("").toString())
          campo.put("planned_hours", p.planned_hours)
          campo.put("pai", p.pai)
          campo.put("pae", p.pai)
          campo.put("spi", p.spi)
          campo.put("cpi", p.cpi)
          campo.put("impact_type", p.impact_type)
          campo.put("sap_number", p.sap_number.getOrElse("").toString())

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

  def listadoRecursos(pid: String) = Action {
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
        val subtask = ProgramaService.listadoRecursos(pid, sidx, sord, rows, startRow)

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

  def listadoAsignacion = Action {
    implicit request =>
      request.session.get("username").map { user =>
        val rows = request.getQueryString("rows").get.toString()
        val page = request.getQueryString("page").get.toString()
        var records: Int = 0
        val uId = request.session.get("uId").get.toString()
        var node = new JSONObject()

        val subtask = ProgramaService.listadoAsignacionDependiente(uId, "", "", rows, page)
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

  def cantidadSubalternos = Action {
    implicit request =>
      request.session.get("username").map { user =>
        val uid = request.session.get("uId").get
        val count = ProgramaService.cantidadSubalternos(uid)
        Ok(count.toString()).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)

      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }

  def listadoPersonal = Action {
    implicit request =>
      request.session.get("username").map { user =>

        val term = request.getQueryString("term").getOrElse("").toString()
        var users = ProgramaService.listPersonal(term)

        Ok(play.api.libs.json.Json.toJson(users)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }

  def grabaPrograma = Action {
    implicit request =>
      request.session.get("username").map { user =>
        //var incident: Option[ErrorIncident] = null
        val body: AnyContent = request.body
        val jsonBody: Option[play.api.libs.json.JsValue] = body.asJson
        //var last_program: Int = 0
        var status: Option[ErrorSQL] = null
        jsonBody.map { jsValue =>

          val program_id = (jsValue \ "id")
          val program_name = (jsValue \ "program_name")
          val program_description = (jsValue \ "program_description")
          val planned_hours = (jsValue \ "planned_hours")

          val sap_code = (jsValue \ "sap_code") //numero ppm
          //val demand_manager = (jsValue \ "demand_manager")
          val demand_manager_name = (jsValue \ "demand_manager_name")
          //val program_manager = (jsValue \ "program_manager")
          val program_manager_name = (jsValue \ "program_manager_name")
          val program_type = (jsValue \ "program_type")

          val sub_type = (jsValue \ "sub_type")
          val workflow_status = (jsValue \ "workflow_status")
          val impact_type = (jsValue \ "impact_type")
          val initiation_planned_date = (jsValue \ "initiation_planned_date")

          val release_date = (jsValue \ "release_date")
          val closure_date = (jsValue \ "closure_date")

          val oper = (jsValue \ "oper")

          //println("program_id : " + program_id)
          //println("program_name : " + program_name)
          //println("program_description : " + program_description)
          //println("planned_hours : " + planned_hours)          
          println("oper : " + oper)

          if (oper.toString().replace("\"", "").equals("edit")) {
            status = ProgramaService.actualizar(
              program_id.toString().replace("\"", ""),
              program_name.toString().replace("\"", ""),
              program_description.toString().replace("\"", ""),
              planned_hours.toString().replace("\"", ""),
              sap_code.toString().replace("\"", ""),
              demand_manager_name.toString().replace("\"", ""),
              program_manager_name.toString().replace("\"", ""),
              program_type.toString().replace("\"", ""),
              sub_type.toString().replace("\"", ""),
              workflow_status.toString().replace("\"", ""),
              impact_type.toString().replace("\"", ""),
              initiation_planned_date.toString().replace("\"", ""),
              release_date.toString().replace("\"", ""),
              closure_date.toString().replace("\"", ""))
            if (status.get.id > 0) {
              val act = Activity(ActivityTypes.Program.id, "Program updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), status.get.id)
              Activity.saveLog(act)
            }
          } else if (oper.toString().replace("\"", "").equals("del")) {
            status = ProgramaService.borrar(
              program_id.toString().replace("\"", ""))

            if (status.get.id > 0) {
              val act = Activity(ActivityTypes.Program.id, "Program deleted by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), status.get.id)
              Activity.saveLog(act)
            }
          } else if (oper.toString().replace("\"", "").equals("add")) {
            status = ProgramaService.grabar(
              program_name.toString().replace("\"", ""),
              program_description.toString().replace("\"", ""),
              planned_hours.toString().replace("\"", ""),
              sap_code.toString().replace("\"", ""),
              demand_manager_name.toString().replace("\"", ""),
              program_manager_name.toString().replace("\"", ""),
              program_type.toString().replace("\"", ""),
              sub_type.toString().replace("\"", ""),
              workflow_status.toString().replace("\"", ""),
              impact_type.toString().replace("\"", ""),
              initiation_planned_date.toString().replace("\"", ""),
              release_date.toString().replace("\"", ""),
              closure_date.toString().replace("\"", ""))

            if (status.get.id > 0) {
              val act = Activity(ActivityTypes.Program.id, "New program created by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), status.get.id)
              Activity.saveLog(act)
            }
          }

        }

        Ok(play.api.libs.json.Json.toJson(status)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
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

  def listaImpacto = Action { implicit request =>

    val modelManagementValues = ImpactTypeService.findAllImpactTypeList

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