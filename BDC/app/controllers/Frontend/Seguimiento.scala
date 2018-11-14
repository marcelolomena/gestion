package controllers.Frontend

import play.api.mvc.Action
import play.api.mvc.Controller
import services._
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
import play.Play

import controllers.Frontend.Dashboard.{Ok, Redirect}
import models.ListDocuments.{ListTypes, PMOList, ProgramList}
import org.apache.poi.xssf.usermodel._

/**
 * @author Ricardo Reyes
 */
object Seguimiento extends Controller {

  def home = Action {
    implicit request =>
      request.session.get("username").map { user =>

        Ok(views.html.frontend.seguimiento.listSeguimiento()).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }

  def programas(pmoi: String, lider: String, art: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var panel: Seq[ProgramList] = null
      var records: Int = 0
      val rows = request.getQueryString("rows").get.toString()
      val page = request.getQueryString("page").get.toString()
      val filters = request.getQueryString("filters").getOrElse("").toString()
      var node = new JSONObject()
      var pmo = pmoi;
      System.out.println("lider:"+lider+" , pmo:"+pmo)
      //deja en variable uno de los dos lider o pmo
      if (lider != '0' && pmo.equals("0")) { //Tiene lider
        System.out.println("entro")
        //pmo = lider
        if (!StringUtils.isEmpty(art) && lider != '0') {
          records = SeguimientoService.programCountDocsLider(lider, art)
          panel = SeguimientoService.documentsProgramsLider(lider, art, rows, page)
        } else if (lider != '0') {
          records = SeguimientoService.programCountDocsLider(lider, art)
          panel = SeguimientoService.documentsProgramsLider(lider, art, rows, page)
        } else {
          records = SeguimientoService.programCountDocsLider(lider, art)
          panel = SeguimientoService.documentsProgramsLider(lider, "0", rows, page)
        }
      } else { //Tiene PMO
        if (!StringUtils.isEmpty(art) && pmo != '0') {
          records = SeguimientoService.programCountDocs(pmo, art)
          panel = SeguimientoService.documentsProgramsPMO(pmo, art, rows, page)
        } else if (pmo != '0') {
          records = SeguimientoService.programCountDocs(pmo, art)
          panel = SeguimientoService.documentsProgramsPMO(pmo, art, rows, page)
        } else {
          records = SeguimientoService.programCountDocs(pmo, art)
          panel = SeguimientoService.documentsProgramsPMO(pmo, "0", rows, page)
        }
      }
      //program_id, program_code, program_name, responsable, workflow_status
      var registro = new JSONArray()
      for (p <- panel) {
        var campo = new JSONObject()
        campo.put("program_id", p.program_id)
        campo.put("program_code", p.program_code)
        campo.put("program_name", p.program_name)
        campo.put("responsable", p.responsable)
        campo.put("workflow_status", p.workflow_status)
        campo.put("responsable", p.responsable)
        registro.put(campo)
      }
      var pagedisplay = Math.ceil(records.toInt / Integer.parseInt(rows.toString()).toFloat).toInt

      node.put("page", Integer.parseInt(page))
      node.put("total", pagedisplay)
      node.put("records", records)
      node.put("rows", registro)

      Ok(node.toString()).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)

    }.getOrElse {
      Redirect(routes.Login.loginUser()).withNewSession
    }
  }
  
  def reportDocument() = Action { implicit request =>
    request.session.get("username").map { user =>
      var panel: Seq[ReportDocument] = null
      var records: Int = 0
      val rows = request.getQueryString("rows").get.toString()
      val page = request.getQueryString("page").get.toString()
      val filters = request.getQueryString("filters").getOrElse("").toString()
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
                
               if (m.field.equals("estado")) {
                    if (m.data.toInt != 0) {
                      qrystr += "work_flow_status" + fromPredicate(m.op) + filtroNombrePrograma("estado", m.data) + " AND "
                    }
               } else if (m.field.equals("pfecini")) {
                    qrystr += "plan_start_date" + fromPredicate(m.op) + filtroNombrePrograma("pfecini", m.data) + " AND "
               } else if (m.field.equals("pfecter")) {
                 qrystr += "plan_end_date" + fromPredicate(m.op) + filtroNombrePrograma("pfecter", m.data) + " AND "
               } else if (m.field.equals("rfecini")) {
                 qrystr += "real_start_date" + fromPredicate(m.op) + filtroNombrePrograma("rfecini", m.data) + " AND "
               } else if (m.field.equals("rfecter")) {
                 qrystr += "real_end_date" + fromPredicate(m.op) + filtroNombrePrograma("rfecter", m.data) + " AND "
               } else {
                    qrystr += m.field + fromPredicate(m.op) + filtroNombrePrograma(m.field, m.data) + " AND "
               }
              }

            }
          }

        }

        if (tieneJson) {
          
          records = SeguimientoService.programCount(qrystr)
          panel = SeguimientoService.reportProgram(rows, page, qrystr)
        } else {
          records = SeguimientoService.programCount("")
          panel = SeguimientoService.reportProgram(rows, page, "")
        }

      } else {
        records = SeguimientoService.programCount("")
        panel = SeguimientoService.reportProgram(rows, page, "")

      }

      var registro = new JSONArray()
      for (p <- panel) {
        var campo = new JSONObject()
        campo.put("id", p.id)
        campo.put("nivel", p.nivel)
        campo.put("estado", p.estado)
        campo.put("codigo", p.codigo)
        campo.put("programa", p.programa)
        campo.put("responsable", p.responsable)
        campo.put("pfecini", p.pfecini.getOrElse(""))
        campo.put("pfecter", p.pfecter.getOrElse(""))
        campo.put("rfecini", p.rfecini.getOrElse(""))
        campo.put("rfecter", p.rfecter.getOrElse(""))
        campo.put("hplan", p.hplan.getOrElse(""))
        campo.put("hreal", p.hreal.getOrElse(""))
        registro.put(campo)
      }
      var pagedisplay = Math.ceil(records.toInt / Integer.parseInt(rows.toString()).toFloat).toInt

      node.put("page", Integer.parseInt(page))
      node.put("total", pagedisplay)
      node.put("records", records)
      node.put("rows", registro)

      Ok(node.toString()).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)

    }.getOrElse {
      Redirect(routes.Login.loginUser()).withNewSession
    }
  }

  def fromPredicate(choice: String): String = choice match {
    case "eq" => " = "
    case "gt" => " > "
    case "lt" => " < "
    case "ge" => " >= "
    case "le" => " =< "
    case "cn" => " like "
    case _    => "error"
  }

  def filtroNombrePrograma(choice: String, value: String): String = choice match {
    case "nivel"       => " '%" + value + "%' "
    case "estado"      => value
    case "programa"    => " '%" + value + "%' "
    case "responsable" => " '%" + value + "%' "
    case "pfecini"     => " '" + value + "' "
    case "pfecter"     => " '" + value + "' "
    case "rfecini"     => " '" + value + "' "
    case "rfecter"     => " '" + value + "' "
    case "hplan"       => value
    case "hreal"       => value
    case _             => "error"
  }

  def documentListByType(parent_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var panel: Seq[ListTypes] = null
      var records: Int = 0
      val rows = request.getQueryString("rows").get.toString()
      val page = request.getQueryString("page").get.toString()
      val filters = request.getQueryString("filters").getOrElse("").toString()
      var node = new JSONObject()
      var tieneJson = true
      var qrystr = ""

      records = SeguimientoService.programCount("")
      panel = SeguimientoService.documentsTypes(parent_id, rows, page)



      var registro = new JSONArray()
      for (p <- panel) {
        var campo = new JSONObject()
        campo.put("id", p.id+"_"+p.programa)
        campo.put("programa", p.programa)
        campo.put("nombre", p.nombre)
        campo.put("cantidad", p.cantidad)
        campo.put("description", p.description)
        registro.put(campo)
      }
      var pagedisplay = Math.ceil(records.toInt / Integer.parseInt(rows.toString()).toFloat).toInt

      node.put("page", Integer.parseInt(page))
      node.put("total", pagedisplay)
      node.put("records", records)
      node.put("rows", registro)

      Ok(node.toString()).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)

    }.getOrElse {
      Redirect(routes.Login.loginUser()).withNewSession
    }
  }

  def documentList(tipo: String, parent_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var panel: Seq[ListDocuments] = null
      var records: Int = 0
      val rows = request.getQueryString("rows").get.toString()
      val page = request.getQueryString("page").get.toString()
      val filters = request.getQueryString("filters").getOrElse("").toString()
      var node = new JSONObject()
      var tieneJson = true
      var qrystr = ""

      records = SeguimientoService.programCount("")
      panel = SeguimientoService.documentsListByType(tipo, parent_id, rows, page)



      var registro = new JSONArray()
      for (p <- panel) {
        var campo = new JSONObject()
        campo.put("id", p.id)
        campo.put("file_name", p.file_name)
        campo.put("title", p.title)
        campo.put("fecha", p.fecha)
        campo.put("version", p.version)
        campo.put("tipo", p.tipo)
        campo.put("parent_type", p.parent_type)
        campo.put("encargado", p.encargado)
        campo.put("extension", p.extension)
        campo.put("version_notes", p.version_notes)
        registro.put(campo)
      }
      var pagedisplay = Math.ceil(records.toInt / Integer.parseInt(rows.toString()).toFloat).toInt

      node.put("page", Integer.parseInt(page))
      node.put("total", pagedisplay)
      node.put("records", records)
      node.put("rows", registro)

      Ok(node.toString()).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)

    }.getOrElse {
      Redirect(routes.Login.loginUser()).withNewSession
    }
  }

  def documentListByProgram( parent_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var panel: Seq[ListDocuments] = null
      var records: Int = 0
      val rows = request.getQueryString("rows").get.toString()
      val page = request.getQueryString("page").get.toString()
      var node = new JSONObject()

      records = SeguimientoService.programCountDocsProgram(parent_id)
      panel = SeguimientoService.documentsList(parent_id, rows, page)

      var registro = new JSONArray()
      for (p <- panel) {
        var campo = new JSONObject()
        campo.put("id", p.id)
        campo.put("file_name", p.file_name)
        campo.put("title", p.title)
        campo.put("fecha", p.fecha)
        campo.put("version", p.version)
        campo.put("tipo", p.tipo)
        campo.put("parent_type", p.parent_type)
        campo.put("encargado", p.encargado)
        campo.put("extension", p.extension)
        campo.put("version_notes", p.version_notes)
        campo.put("document_type", p.document_type)
        registro.put(campo)
      }
      var pagedisplay = Math.ceil(records.toInt / Integer.parseInt(rows.toString()).toFloat).toInt

      node.put("page", Integer.parseInt(page))
      node.put("total", pagedisplay)
      node.put("records", records)
      node.put("rows", registro)

      Ok(node.toString()).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)

    }.getOrElse {
      Redirect(routes.Login.loginUser()).withNewSession
    }
  }

  def documentPMOs(rol: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var panel: Seq[PMOList] = null
      var node = new JSONObject()

      panel = SeguimientoService.documentsPMOs(rol)

      var registro = new JSONArray()
      for (p <- panel) {
        var campo = new JSONObject()
        campo.put("id", p.id)
        campo.put("nombre", p.nombre)
        campo.put("apellido", p.apellido)
        registro.put(campo)
      }

      node.put("rows", registro)

      Ok(node.toString()).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)

    }.getOrElse {
      Redirect(routes.Login.loginUser()).withNewSession
    }
  }

  def reportExcelDocs(program_id: String)  = Action { implicit request =>
    SeguimientoService.createExcelDocs(program_id)
    request.session.get("username").map { user =>
      val file = new File("reporte.xlsx")
      val time = new Date()
      Ok.sendFile(content = file, fileName = _ => "report_" + time.getTime + ".xlsx")

    }.getOrElse {
      Redirect(routes.Login.loginUser()).withNewSession
    }
  }

  def downDoc(file: String): Action[AnyContent] = Action {
    var docFile = new File(Play.application().configuration().getString("bdc.documents.location") + "/alldocuments/"+file)
    if(docFile != null && docFile.exists()){
      Ok.sendFile(docFile)
    }else{
      Ok("File not found on the server. Its either deleted or removed from the server,")
    }
  }

  def reportExcelAllDocs  = Action { implicit request =>
    SeguimientoService.updateProgramsInDocs
    SeguimientoService.reporteAllDocsExcel
    request.session.get("username").map { user =>
      val file = new File("reporteAllDocs.xlsx")
      val time = new Date()
      Ok.sendFile(content = file, fileName = _ => "report_" + time.getTime + ".xlsx")

    }.getOrElse {
      Redirect(routes.Login.loginUser()).withNewSession
    }
  }

  def executeHoras(): Action[AnyContent] = Action {
    System.out.println("executeHoras")
    //DashboardService.generaReporteHorasFabrica()
    //DashboardService.reportHorasFabrica()

    var docFile = new File(Play.application().configuration().getString("bdc.documents.location") + "/alldocuments/reportehorasfabrica.xlsx")
    if(docFile != null && docFile.exists()){
      Ok.sendFile(docFile)
    }else{
      Ok("File not found on the server. Its either deleted or removed from the server,")
    }
  }

}