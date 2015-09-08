package controllers.Frontend

import java.util.List
import scala.math.BigDecimal.double2bigDecimal
import scala.math.BigDecimal.int2bigDecimal
import org.apache.commons.lang3.StringUtils
import org.json.JSONArray
import org.json.JSONObject
import play.api.mvc.Action
import play.api.mvc.Controller
import services.DepartmentService
import services.DivisionService
import services.ProgramService
import services.ProjectService
import services.SubTaskServices
import services.TimesheetService
import services.UserService
import java.util.Calendar
import java.util.Date
import models.Baseline
import play.libs.Json
import org.json.JSONObject
import play.api.libs.json
import play.api.libs.json._
import services.ProgramMemberService
import art_forms.ARTForms
import services.ProgramTypeService
import services.SubTypeService
import models.SearchCriteria
import models.VersionDetails
import services.TaskService
import services.DocumentService
import services.DashboardService
import services.BudgetTypeService
import services.EarnValueService
import scala.math.BigDecimal.RoundingMode
import utils.DateTime
import services.SpiCpiCalculationsService
import models.ProgramDetails
import models.EarnValue
import services.RiskService
import models.Panel;
import models.DBFilter;
import java.io.File
import java.io.FileOutputStream
import org.apache.poi.xssf.usermodel._
//import net.liftweb.json.DefaultFormats
import net.liftweb.json._
import net.liftweb.json.JsonParser._
import models.ATM
object Dashboard extends Controller {

  /**
   * dashboard page
   */
  def dashboard = Action {
    implicit request =>
      request.session.get("username").map { user =>

        var delayLevelValues = new java.util.HashMap[String, String]()
        var projectClassificationValues = new java.util.HashMap[String, String]()
        var modelManagementValues = new java.util.HashMap[String, String]()
        var divisionValues = new java.util.HashMap[String, String]()
        var programSubTypeValues = new java.util.HashMap[String, String]()

        for (d <- models.delayLevelValues.values) {
          delayLevelValues.put(d.id.toString, d.toString())
        }

        for (d <- models.projectClassificationValues.values) {
          projectClassificationValues.put(d.id.toString, d.toString())
        }

        for (d <- ProgramTypeService.findAllProgramType) {
          modelManagementValues.put(d.id.get.toString, d.program_type.toString())
        }

        for (d <- DivisionService.findAllDivision) {
          divisionValues.put(d.dId.get.toString, d.division.toString())
        }

        for (d <- SubTypeService.findAllSubTypeList) {
          programSubTypeValues.put(d.id.get.toString, d.sub_type.toString())
        }

        Ok(views.html.frontend.dashboard.dashboard(delayLevelValues, projectClassificationValues, modelManagementValues, divisionValues, programSubTypeValues, ARTForms.searchDashboard)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }
  def getExcel = Action {
    implicit request =>
      request.session.get("username").map { user =>

        val file = new File("dashboard.xlsx")
        val fileOut = new FileOutputStream(file);
        val wb = new XSSFWorkbook
        val sheet = wb.createSheet("Dashboard")
        var j = 0
        var rNum = 1
        var cNum = 0
        var a = 0

        var rowhead = sheet.createRow(0);
        val style = wb.createCellStyle();
        val font = wb.createFont();
        font.setFontName(org.apache.poi.hssf.usermodel.HSSFFont.FONT_ARIAL);
        font.setFontHeightInPoints(10);
        font.setBold(true);
        style.setFont(font);
        rowhead.createCell(0).setCellValue("Division")
        rowhead.createCell(1).setCellValue("Programa")
        rowhead.createCell(2).setCellValue("Responsable")
        rowhead.createCell(3).setCellValue("Fecha Inicio")
        rowhead.createCell(4).setCellValue("Fecha Comprometida")
        rowhead.createCell(5).setCellValue("% Avance")
        rowhead.createCell(6).setCellValue("% Plan")
        rowhead.createCell(7).setCellValue("SPI")
        rowhead.createCell(8).setCellValue("CPI")
        rowhead.createCell(9).setCellValue("Inversion")
        rowhead.createCell(10).setCellValue("Gasto")

        for (j <- 0 to 10)
          rowhead.getCell(j).setCellStyle(style);

        //val panel = DashboardService.reportPanel
        val panel = DashboardService.reporteProgramaFiltrado("0", "0", "")

        for (s <- panel) {
          var row = sheet.createRow(rNum)

          val cel0 = row.createCell(cNum)
          cel0.setCellValue(s.division)

          val cel1 = row.createCell(cNum + 1)
          cel1.setCellValue(s.programa)

          val cel2 = row.createCell(cNum + 2)
          cel2.setCellValue(s.responsable)

          val cel3 = row.createCell(cNum + 3)
          cel3.setCellValue(s.fecini.get)

          val cel4 = row.createCell(cNum + 4)
          cel4.setCellValue(s.feccom.get)

          val cel5 = row.createCell(cNum + 5)
          cel5.setCellValue(s.pai)

          val cel6 = row.createCell(cNum + 6)
          cel6.setCellValue(s.pae)

          val cel7 = row.createCell(cNum + 7)
          cel7.setCellValue(s.spi)

          val cel8 = row.createCell(cNum + 8)
          cel8.setCellValue(s.cpi)

          val cel9 = row.createCell(cNum + 9)
          cel9.setCellValue(s.inversion)

          val cel10 = row.createCell(cNum + 10)
          cel10.setCellValue(s.gasto)

          rNum = rNum + 1
          cNum = 0

        }

        for (a <- 0 to 10) {
          sheet.autoSizeColumn((a.toInt));
        }

        wb.write(fileOut);
        fileOut.close();
        Ok.sendFile(content = file, fileName = _ => "dashboard.xlsx")
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }

  /**
   * Chart project details...
   * id : Project id
   */
  def chartProject(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>

      val chart = SpiCpiCalculationsService.graficoPorProyecto(id)
      Ok(play.api.libs.json.Json.toJson(chart)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def getProgramExcel(pid: String) = Action {
    implicit request =>
      request.session.get("username").map { user =>

        val file = new File("programa.xlsx")
        val fileOut = new FileOutputStream(file);
        val wb = new XSSFWorkbook
        val sheet = wb.createSheet("PROGRAMA")
        var j = 0
        var rNum = 1
        var cNum = 0
        var a = 0

        var rowhead = sheet.createRow(0);
        val style = wb.createCellStyle();
        val font = wb.createFont();
        font.setFontName(org.apache.poi.hssf.usermodel.HSSFFont.FONT_ARIAL);
        font.setFontHeightInPoints(10);
        font.setBold(true);
        style.setFont(font);
        rowhead.createCell(0).setCellValue("Id")
        rowhead.createCell(1).setCellValue("Nivel")
        rowhead.createCell(2).setCellValue("Codigo")
        rowhead.createCell(3).setCellValue("Nombre")
        rowhead.createCell(4).setCellValue("Responsable")
        rowhead.createCell(5).setCellValue("Fecha Inico Plan")
        rowhead.createCell(6).setCellValue("Fecha Termino Plan")
        rowhead.createCell(7).setCellValue("Fecha Inicio Real")
        rowhead.createCell(8).setCellValue("Fecha Termino Real")
        rowhead.createCell(9).setCellValue("% Avance Informado")
        rowhead.createCell(10).setCellValue("% Avance Esperado")

        for (j <- 0 to 10)
          rowhead.getCell(j).setCellStyle(style);

        val panel = DashboardService.getProgramExcel(pid)

        for (s <- panel) {
          var row = sheet.createRow(rNum)

          val cel0 = row.createCell(cNum)
          cel0.setCellValue(s.id)

          val cel1 = row.createCell(cNum + 1)
          cel1.setCellValue(s.nivel)

          val cel2 = row.createCell(cNum + 2)
          cel2.setCellValue(s.codigo)

          val cel3 = row.createCell(cNum + 3)
          cel3.setCellValue(s.programa)

          val cel4 = row.createCell(cNum + 4)
          cel4.setCellValue(s.responsable)

          val cel5 = row.createCell(cNum + 5)
          cel5.setCellValue(s.pfecini.getOrElse("").toString())

          val cel6 = row.createCell(cNum + 6)
          cel6.setCellValue(s.pfecter.getOrElse("").toString())

          val cel7 = row.createCell(cNum + 7)
          cel7.setCellValue(s.rfecini.getOrElse("").toString())

          val cel8 = row.createCell(cNum + 8)
          cel8.setCellValue(s.rfecter.getOrElse("").toString())

          val cel9 = row.createCell(cNum + 9)
          cel9.setCellValue(s.pai)

          val cel10 = row.createCell(cNum + 10)
          cel10.setCellValue(s.pae)

          rNum = rNum + 1
          cNum = 0

        }

        for (a <- 0 to 10) {
          sheet.autoSizeColumn((a.toInt));
        }

        wb.write(fileOut);
        fileOut.close();
        Ok.sendFile(content = file, fileName = _ => "programa.xlsx")
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }

  def getPanel = Action {
    implicit request =>
      request.session.get("username").map { user =>

        Ok(views.html.frontend.dashboard.panel()).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }
  def getATM = Action {
    implicit request =>
      request.session.get("username").map { user =>

        Ok(views.html.frontend.dashboard.atmReport()).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }

  def burbujas = Action { implicit request =>
    request.session.get("username").map { user =>

      val bubble = DashboardService.reportBubble

      var node = new JSONObject()

      node.put("showInLegend", false)
      node.put("name", "Indicadores de Programa")
      var puntos = new JSONArray()
      for (p <- bubble) {
        var punto = new JSONObject()
        punto.put("x", p.x)
        punto.put("y", p.y)
        punto.put("z", p.z)
        punto.put("programa", p.programa)

        puntos.put(punto)
      }

      node.put("data", puntos)

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

  def fromName(choice: String, value: String): String = choice match {
    case "division"    => " '%" + value + "%' "
    case "programa"    => " '%" + value + "%' "
    case "responsable" => " '%" + value + "%' "
    case "fecini"      => " CONVERT(VARCHAR(10),'" + value + "', 103)"
    case "feccom"      => " CONVERT(VARCHAR(10),'" + value + "', 103)"
    case "pai"         => value
    case "pae"         => value
    case "spi"         => value
    case "cpi"         => value
    case "inversion"   => value
    case "gasto"       => value
    case _             => "error"
  }

  def fromNameProgram(choice: String, value: String): String = choice match {
    case "nivel"       => " '%" + value + "%' "
    case "programa"    => " '%" + value + "%' "
    case "responsable" => " '%" + value + "%' "
    case "pfecini"     => " CONVERT(VARCHAR(10),'" + value + "', 103)"
    case "pfecter"     => " CONVERT(VARCHAR(10),'" + value + "', 103)"
    case "rfecini"     => " CONVERT(VARCHAR(10),'" + value + "', 103)"
    case "rfecter"     => " CONVERT(VARCHAR(10),'" + value + "', 103)"
    case "pai"         => value
    case "pae"         => value
    case _             => "error"
  }

  def panel = Action { implicit request =>
    request.session.get("username").map { user =>
      val rows = request.getQueryString("rows").get.toString()
      val page = request.getQueryString("page").get.toString()
      val filters = request.getQueryString("filters").getOrElse("").toString()

      var panel: Seq[Panel] = null
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
                qrystr += m.field + fromPredicate(m.op) + fromName(m.field, m.data) + " AND "
              }

            }
          }

          if (tieneJson) {

            records = DashboardService.cantidadProgramaFiltrado(qrystr)
            panel = DashboardService.reporteProgramaFiltrado(rows, page, qrystr)

          } else {
            records = DashboardService.cantidadProgramaFiltrado("")
            panel = DashboardService.reporteProgramaFiltrado(rows, page, "")

          }
        }
      } else {
        records = DashboardService.cantidadProgramaFiltrado("")
        panel = DashboardService.reporteProgramaFiltrado(rows, page, "")

      }

      var registro = new JSONArray()
      for (p <- panel) {
        var campo = new JSONObject()
        campo.put("division", p.division)
        campo.put("programa", p.programa)
        campo.put("responsable", p.responsable)
        campo.put("fecini", p.fecini.get)
        campo.put("feccom", p.feccom.get)
        campo.put("pai", p.pai)
        campo.put("pae", p.pae)
        campo.put("spi", p.spi)
        campo.put("cpi", p.cpi)
        campo.put("inversion", p.inversion)
        campo.put("gasto", p.gasto)
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

  def reportProgram() = Action { implicit request =>
    request.session.get("username").map { user =>
      var panel: Seq[ATM] = null
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
                qrystr += m.field + fromPredicate(m.op) + fromNameProgram(m.field, m.data) + " AND "
              }

            }
          }

        }

        if (tieneJson) {
          //println(qrystr)
          records = DashboardService.programCount(qrystr)
          panel = DashboardService.reportProgram(rows, page, qrystr)
        } else {
          records = DashboardService.programCount("")
          panel = DashboardService.reportProgram(rows, page, "")
        }

      } else {
        records = DashboardService.programCount("")
        panel = DashboardService.reportProgram(rows, page, "")

      }

      var registro = new JSONArray()
      for (p <- panel) {
        var campo = new JSONObject()
        campo.put("id", p.id)
        campo.put("nivel", p.nivel)
        campo.put("codigo", p.codigo)
        campo.put("programa", p.programa)
        campo.put("responsable", p.responsable)
        campo.put("pfecini", p.pfecini.getOrElse(""))
        campo.put("pfecter", p.pfecter.getOrElse(""))
        campo.put("rfecini", p.rfecini.getOrElse(""))
        campo.put("rfecter", p.rfecter.getOrElse(""))
        campo.put("pai", p.pai)
        campo.put("pae", p.pae)
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

  def reportProyect(pid: String) = Action { implicit request =>
    request.session.get("username").map { user =>

      val rows = request.getQueryString("rows").get.toString()
      val page = request.getQueryString("page").get.toString()
      var node = new JSONObject()
      val records = DashboardService.projectCount(pid)
      val panel = DashboardService.reportProject(pid, rows, page)

      var registro = new JSONArray()
      for (p <- panel) {
        var campo = new JSONObject()
        campo.put("id", p.id)
        campo.put("nivel", p.nivel)
        campo.put("codigo", p.codigo)
        campo.put("programa", p.programa)
        campo.put("responsable", p.responsable)
        campo.put("pfecini", p.pfecini.getOrElse(""))
        campo.put("pfecter", p.pfecter.getOrElse(""))
        campo.put("rfecini", p.rfecini.getOrElse(""))
        campo.put("rfecter", p.rfecter.getOrElse(""))
        campo.put("pai", p.pai)
        campo.put("pae", p.pae)
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

  def reportSubTarea(pid: String) = Action { implicit request =>
    request.session.get("username").map { user =>

      val rows = request.getQueryString("rows").get.toString()
      val page = request.getQueryString("page").get.toString()
      var node = new JSONObject()
      val records = DashboardService.subtaskCount(pid)
      val panel = DashboardService.reportSubTask(pid, rows, page)

      var registro = new JSONArray()
      for (p <- panel) {
        var campo = new JSONObject()
        campo.put("id", p.id)
        campo.put("nivel", p.nivel)
        campo.put("codigo", p.codigo)
        campo.put("programa", p.programa)
        campo.put("responsable", p.responsable)
        campo.put("pfecini", p.pfecini.getOrElse(""))
        campo.put("pfecter", p.pfecter.getOrElse(""))
        campo.put("rfecini", p.rfecini.getOrElse(""))
        campo.put("rfecter", p.rfecter.getOrElse(""))
        campo.put("pai", p.pai)
        campo.put("pae", p.pae)
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

  /**
   * latest update dummy page
   */
  def latestUpdate = Action { implicit request =>
    Ok(views.html.frontend.dashboard.latestUpdate())
  }

  /**
   * Bar chart for division
   */
  def barChartDivision() = Action { implicit request =>
    request.session.get("username").map { user =>
      val uId = request.session.get("uId").get
      var projects: Seq[models.Project] = null
      var jsonArr = new JSONArray()
      val divisions = DivisionService.findAllDivisions

      for (d <- divisions) {
        var node = new JSONObject()
        node.put("division", d.division)

        val programs = ProgramService.findAllProgramsForDivision(d.dId.get.toString())
        for (pr <- programs) {
          var budget_staff: BigDecimal = 0
          var budget_contract: BigDecimal = 0
          var budget_hw: BigDecimal = 0
          var budget_sw: BigDecimal = 0
          var budget_spent: BigDecimal = 0
          projects = ProjectService.findProjectListForProgram(pr.program_id.toString)
          for (p <- projects) {

            // budget_staff += p.budget_approved_staff
            budget_contract += 0 //p.budget_approved_contractor
            budget_hw += 0 //p.budget_approved_hardware
            budget_sw += 0 //p.budget_approved_software
            budget_spent += SubTaskServices.calculateActaulBudgetSpent(p.project_id)
          }
          //  node.put("staff", budget_staff)
          node.put("contractor", budget_contract)
          node.put("sw", budget_sw)
          node.put("hw", budget_hw)
          node.put("spent", budget_spent)
        }
        jsonArr.put(node)
      }

      Ok(jsonArr.toString())
    }.getOrElse {

      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * Bar chart per division per program
   */
  def barChart(mode: String, id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val uId = request.session.get("uId").get
      var projects: Seq[models.Project] = null
      var jsonArr = new JSONArray()
      var budgetSpent: Double = 0
      var programs: Seq[ProgramDetails] = null
      if (StringUtils.equals(mode, "NA") && StringUtils.equals(id, "NA")) {
        projects = UserService.findUserProjectsForUser(Integer.parseInt(uId))

      } else {
        if (StringUtils.equals(mode, "program")) {
          projects = UserService.findUserProjectsForProgram(id)

        }
        if (StringUtils.equals(mode, "division")) {
          programs = ProgramService.findAllProgramsForDivision(id)
          for (p <- programs) {
            projects = ProjectService.findProjectListForProgram(p.program_id.toString)
            for (pr <- projects) {
              var node = new JSONObject()
              budgetSpent = SubTaskServices.calculateActaulBudgetSpent(pr.project_id)
              var pName = ""
              if (pr.project_name.length() > 100) {
                pName = pr.project_name.substring(0, 100) + "..."
              } else {
                pName = pr.project_name
              }
              node.put("project", pName)
              //node.put("staff", pr.budget_approved_staff)
              node.put("contractor", 0) //pr.budget_approved_contractor
              node.put("sw", 0) //pr.budget_approved_software
              node.put("hw", 0) //pr.budget_approved_hardware
              node.put("spent", budgetSpent)
              jsonArr.put(node)
            }
          }
        }

        budgetSpent = 0
        if (!StringUtils.equals(mode, "division")) {

          for (p <- projects) {
            var node = new JSONObject()
            budgetSpent = SubTaskServices.calculateActaulBudgetSpent(p.project_id)
            var pName = ""
            if (p.project_name.length() > 100) {
              pName = p.project_name.substring(0, 100) + "..."
            } else {
              pName = p.project_name
            }
            node.put("project", pName)
            // node.put("staff", p.budget_approved_staff)
            node.put("contractor", 0) // p.budget_approved_contractor
            node.put("sw", 0) //p.budget_approved_software
            node.put("hw", 0) //p.budget_approved_hardware
            node.put("spent", budgetSpent)
            jsonArr.put(node)
          }
        }
      }
      Ok(jsonArr.toString())

    }.getOrElse {

      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * Finance tab on Dashboard page
   */
  def tabFinance = Action { implicit request =>
    val uId = request.session.get("uId").get
    val programs = ProgramService.findAllUserPrograms(uId)
    val divisons = DivisionService.findAllDivisions
    Ok(views.html.frontend.dashboard.dashboardFinance(programs, divisons, uId))
  }

  /**
   * dummy employee page
   */
  def tabEmployee = Action { implicit request =>
    val departments = DepartmentService.findAllDepartmentS
    val employeeList = UserService.findAllOfficeUsers
    Ok(views.html.frontend.dashboard.dashboardEmployee(departments, employeeList))
  }

  def tabOther = Action { implicit request =>
    val format = new java.text.SimpleDateFormat("yyyy-MM-dd")
    val todaydate = format.format(new java.util.Date())
    val today = Calendar.getInstance()
    today.setTime(new java.util.Date())
    today.add(Calendar.DATE, -1)
    today.add(Calendar.MONTH, -1)
    val dateNew = today.getTime()
    val previousDate = format.format(dateNew)
    val todayDate = format.format(new Date())
    //println(previousDate + " " + todayDate);

    Ok(views.html.frontend.dashboard.dashboardOther(previousDate, todayDate))
  }

  def tabReport = Action { implicit request =>
    val divisions = DivisionService.findAllDivision()
    Ok(views.html.frontend.dashboard.dashboardReport(divisions))
  }

  def tabReportExport = Action { implicit request =>
    val divisions = DivisionService.findAllDivision()
    Ok(views.html.frontend.dashboard.dashboardReportExport(divisions))
  }

  def tabPIGraph = Action { implicit request =>
    val uId = request.session.get("uId").get
    val programs = ProgramService.findActiveProgramsIds()
    var on_track = 0
    var delay_10_per = 0
    var delay_20_per = 0
    var delay_40_per = 0

    var on_track_prog_id = ""
    var delay_10_prog_id = ""
    var delay_20_prog_id = ""
    var delay_40_prog_id = ""

    var on_track_cpi = 0
    var delay_10_per_cpi = 0
    var delay_20_per_cpi = 0
    var delay_40_per_cpi = 0

    var on_track_prog_id_cpi = ""
    var delay_10_prog_id_cpi = ""
    var delay_20_prog_id_cpi = ""
    var delay_40_prog_id_cpi = ""

    var evForProgram: Option[EarnValue] = null
    var cpi: scala.math.BigDecimal = 0
    var spi: scala.math.BigDecimal = 0

    for (program <- programs) {
      evForProgram = EarnValueService.getSPIForAllActiveProgram(program.toString())
      if (!evForProgram.isEmpty) {
        evForProgram.get.scheduled_perforamce_index.getOrElse(0.0).bigDecimal.setScale(2, RoundingMode.HALF_UP);

        if (spi.>(1)) {
          on_track = on_track + 1
          on_track_prog_id += program.toString() + ","
        }
        if (spi.>(0.85) && spi.<=(1)) {
          delay_10_per = delay_10_per + 1
          delay_10_prog_id += program.toString() + ","
        }
        if (spi.>(0.40) && spi.<=(0.85)) {
          delay_20_per = delay_20_per + 1
          delay_20_prog_id += program.toString() + ","
        }
        if (spi.>=(0.0) && spi.<=(0.40)) {
          delay_40_per = delay_40_per + 1
          delay_40_prog_id += program.toString() + ","
        }

        evForProgram.get.cost_performance_index.getOrElse(0.0).bigDecimal.setScale(2, RoundingMode.HALF_UP);

        if (cpi.>(1)) {
          on_track_cpi = on_track_cpi + 1
          on_track_prog_id_cpi += program.toString() + ","
        }
        if (cpi.>(0.85) && cpi.<=(1)) {
          delay_10_per_cpi = delay_10_per_cpi + 1
          delay_10_prog_id_cpi += program.toString() + ","
        }
        if (cpi.>(0.40) && cpi.<=(0.85)) {
          delay_20_per_cpi = delay_20_per_cpi + 1
          delay_20_prog_id_cpi += program.toString() + ","
        }
        if (cpi.>=(0.0) && cpi.<=(0.40)) {
          delay_40_per_cpi = delay_40_per_cpi + 1
          delay_40_prog_id_cpi += program.toString() + ","
        }
      }

    }
    var nodeSPI = new JSONObject()
    nodeSPI.put("on_track", on_track)
    nodeSPI.put("delay_10_per", delay_10_per)
    nodeSPI.put("delay_20_per", delay_20_per)
    nodeSPI.put("delay_40_per", delay_40_per)

    nodeSPI.put("on_track_prog_id", on_track_prog_id)
    nodeSPI.put("delay_10_prog_id", delay_10_prog_id)
    nodeSPI.put("delay_20_prog_id", delay_20_prog_id)
    nodeSPI.put("delay_40_prog_id", delay_40_prog_id)

    var nodeCPI = new JSONObject()
    nodeCPI.put("on_track_cpi", on_track_cpi)
    nodeCPI.put("delay_10_per_cpi", delay_10_per_cpi)
    nodeCPI.put("delay_20_per_cpi", delay_20_per_cpi)
    nodeCPI.put("delay_40_per_cpi", delay_40_per_cpi)

    nodeCPI.put("on_track_prog_id_cpi", on_track_prog_id_cpi)
    nodeCPI.put("delay_10_prog_id_cpi", delay_10_prog_id_cpi)
    nodeCPI.put("delay_20_per_cpi", delay_20_per_cpi)
    nodeCPI.put("delay_40_prog_id_cpi", delay_40_prog_id_cpi)

    var node = new JSONObject()
    node.put("json_for_spi", nodeSPI)
    node.put("json_for_cpi", nodeCPI)

    //Ok(views.html.frontend.dashboard.dashboardSPI(nodeSPI.toString(), nodeCPI.toString()))//deprecated
    Ok("OK") //deprecated
  }

  def showProgramListForPie(program_id_list: String) = Action { implicit request =>
    var program_id = ""
    if (program_id_list.endsWith(",")) {
      program_id = program_id_list.substring(0, program_id_list.length() - 1);
    }
    val programs = ProgramService.findActiveProgramsListForIds(program_id)
    Ok(views.html.frontend.dashboard.dashboardProgramList(programs))

  }

  def tabProjectReport(id: String) = Action { implicit request =>
    val projects = ProjectService.findProjectListForProgram(id)
    Ok(views.html.frontend.dashboard.dashboardProjectReport(projects))
  }

  def dashboardSearch() = Action { implicit request =>
    var delayLevelValues = new java.util.HashMap[String, String]()
    for (d <- models.delayLevelValues.values) {
      delayLevelValues.put(d.id.toString, d.toString())
    }

    var projectClassificationValues = new java.util.HashMap[String, String]()
    for (d <- models.projectClassificationValues.values) {
      projectClassificationValues.put(d.id.toString, d.toString())
    }
    var modelManagementValues = new java.util.HashMap[String, String]()
    for (d <- ProgramTypeService.findAllProgramType) {
      modelManagementValues.put(d.id.get.toString, d.program_type.toString())
    }

    var divisionValues = new java.util.HashMap[String, String]()
    for (d <- DivisionService.findAllDivision) {
      divisionValues.put(d.dId.get.toString, d.division.toString())
    }

    var programSubTypeValues = new java.util.HashMap[String, String]()
    for (d <- SubTypeService.findAllSubTypeList) {
      programSubTypeValues.put(d.id.get.toString, d.sub_type.toString())
    }

    var budgetTypeValues = new java.util.LinkedHashMap[String, String]()
    val budgetTypes = BudgetTypeService.findActiveBudgetTypes()
    for (b <- budgetTypes) {
      budgetTypeValues.put(b.id.get.toString(), b.budget_type.toString())
    }

    val prgramMembers = ProgramMemberService.findProgramManagers("6")
    var userIds = ""
    for (p <- prgramMembers) {
      if (StringUtils.isEmpty(userIds)) {
        userIds = p.member_id.toString()
      } else {
        userIds += ", " + p.member_id.toString()
      }
    }
    var gerenciaMap = new java.util.LinkedHashMap[String, String]()
    for (d <- services.GenrenciaService.findAllGenrencias()) {
      gerenciaMap.put(d.dId.get.toString, d.genrencia.toString())
    }

    var departmentMap = new java.util.LinkedHashMap[String, String]()
    for (d <- DepartmentService.findAllDepartmentS()) {
      departmentMap.put(d.dId.get.toString, d.department.toString())
    }
    var programManagerValues = new java.util.HashMap[String, String]()
    if (!StringUtils.isEmpty(userIds)) {
      val users = UserService.findProgramManagersDetails(userIds)
      if (users.size > 0) {
        for (u <- users) {
          programManagerValues.put(u.uid.get.toString(), u.first_name.substring(0, 1) + " " + u.last_name)
        }
      }
    }

    var sortValues = new java.util.HashMap[String, String]()
    sortValues.put("1", "Alphabetically");
    sortValues.put("2", "Release Date");
    Ok(views.html.frontend.dashboard.dashboardForm(delayLevelValues, projectClassificationValues, modelManagementValues, divisionValues, programSubTypeValues, budgetTypeValues, programManagerValues, sortValues, gerenciaMap, departmentMap, ARTForms.searchDashboard)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
  }

  def searchResult() = Action { implicit request =>
    request.session.get("username").map { user =>

      ARTForms.searchDashboard.bindFromRequest.fold(
        errors => {
          var delayLevelValues = new java.util.HashMap[String, String]()
          for (d <- models.delayLevelValues.values) {
            delayLevelValues.put(d.id.toString, d.toString())
          }

          var projectClassificationValues = new java.util.HashMap[String, String]()
          for (d <- models.projectClassificationValues.values) {
            projectClassificationValues.put(d.id.toString, d.toString())
          }
          var modelManagementValues = new java.util.HashMap[String, String]()
          for (d <- ProgramTypeService.findAllProgramType) {
            modelManagementValues.put(d.id.get.toString, d.program_type.toString())
          }

          var divisionValues = new java.util.HashMap[String, String]()
          for (d <- DivisionService.findAllDivision) {
            divisionValues.put(d.dId.get.toString, d.division.toString())
          }

          var programSubTypeValues = new java.util.HashMap[String, String]()
          for (d <- SubTypeService.findAllSubTypeList) {
            programSubTypeValues.put(d.id.get.toString, d.sub_type.toString())
          }

          var budgetTypeValues = new java.util.LinkedHashMap[String, String]()
          val budgetTypes = BudgetTypeService.findActiveBudgetTypes()
          for (b <- budgetTypes) {
            budgetTypeValues.put(b.id.get.toString(), b.budget_type.toString())
          }

          val prgramMembers = ProgramMemberService.findProgramManagers("6")
          var userIds = ""
          for (p <- prgramMembers) {
            if (StringUtils.isEmpty(userIds)) {
              userIds = p.member_id.toString()
            } else {
              userIds += ", " + p.member_id.toString()
            }
          }

          var programManagerValues = new java.util.HashMap[String, String]()
          if (!StringUtils.isEmpty(userIds)) {
            val users = UserService.findProgramManagersDetails(userIds)
            if (users.size > 0) {
              for (u <- users) {
                programManagerValues.put(u.uid.get.toString(), u.first_name.substring(0, 1) + " " + u.last_name)
              }
            }
          }

          var gerenciaMap = new java.util.LinkedHashMap[String, String]()
          for (d <- services.GenrenciaService.findAllGenrencias()) {
            gerenciaMap.put(d.dId.get.toString, d.genrencia.toString())
          }

          var departmentMap = new java.util.LinkedHashMap[String, String]()
          for (d <- DepartmentService.findAllDepartmentS()) {
            departmentMap.put(d.dId.get.toString, d.department.toString())
          }

          var sortValues = new java.util.HashMap[String, String]()
          sortValues.put("1", "Alphabetically");
          sortValues.put("2", "Release Date");

          BadRequest(views.html.frontend.dashboard.dashboardForm(delayLevelValues, projectClassificationValues, modelManagementValues, divisionValues, programSubTypeValues, budgetTypeValues, programManagerValues, sortValues, gerenciaMap, departmentMap, ARTForms.searchDashboard)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
        },
        searchForm => {

          var delay_level = ""
          var project_classification = ""
          var program_type = ""
          var program_sub_type = ""
          var division = ""
          var program_role = ""
          var item_budget = ""
          var sort_type = ""
          var department = ""
          var gerencia = ""

          if (!searchForm.delay_level.isEmpty) {
            delay_level = searchForm.delay_level.get.trim()
          }

          if (!searchForm.program_type.isEmpty) {
            program_type = searchForm.program_type.get.trim()
          }
          if (!searchForm.program_sub_type.isEmpty) {
            program_sub_type = searchForm.program_sub_type.get.trim()
          }
          if (!searchForm.division.isEmpty) {
            division = searchForm.division.get.trim()
          }
          if (!searchForm.project_classification.isEmpty) {
            project_classification = searchForm.project_classification.get.trim()
          }
          if (!searchForm.program_role.isEmpty) {
            program_role = searchForm.program_role.get.trim()
          }
          if (!searchForm.item_budget.isEmpty) {
            item_budget = searchForm.item_budget.get.trim()
          }

          if (!searchForm.sort_type.isEmpty) {
            sort_type = searchForm.sort_type.get.trim()
          }

          if (!searchForm.department.isEmpty) {
            department = searchForm.department.get.trim()
          }

          if (!searchForm.gerencia.isEmpty) {
            gerencia = searchForm.gerencia.get.trim()
          }

          if (StringUtils.isEmpty(delay_level) && StringUtils.isEmpty(program_type) &&
            StringUtils.isEmpty(program_sub_type) && StringUtils.isEmpty(division) &&
            StringUtils.isEmpty(project_classification) && StringUtils.isEmpty(program_role) &&
            StringUtils.isEmpty(item_budget) && StringUtils.isEmpty(sort_type) &&
            StringUtils.isEmpty(department) && StringUtils.isEmpty(gerencia)) {
            val divisions = DivisionService.findAllDivision()
            Ok(views.html.frontend.dashboard.dashboardReport(divisions))
          } else {
            val programs = ProgramService.searchDashboardReportForm(delay_level, project_classification, program_type, program_sub_type, division, program_role, item_budget, sort_type, gerencia, department)
            Ok(views.html.frontend.dashboard.dashboardSearchReport(programs))
          }

        })
    }.getOrElse {
      Redirect(routes.Login.loginUser());
    }
  }

  /**
   * employee front end listing page..
   */
  def employeeList(departmnent: String) = Action { implicit request =>
    var employeeList: Seq[models.Office] = null
    if (StringUtils.isNotBlank(departmnent) && !StringUtils.equals(departmnent, "NA")) {
      employeeList = UserService.findUserDetailsByDepartment(departmnent)
    } else {
      employeeList = UserService.findAllOfficeUsers
    }
    Ok(views.html.frontend.dashboard.employeeList(employeeList))
  }

  /**
   * pie chart for tasks
   */
  def pieChartTimesheet() = Action { implicit request =>
    var jsonArr = new JSONArray()
    var node = new JSONObject()
    var pHours: BigDecimal = 0
    var npHours: BigDecimal = 0
    var npLeave: BigDecimal = 0
    var npTraining: BigDecimal = 0
    var npMeetings: BigDecimal = 0
    var npNonBill: BigDecimal = 0
    var npBAU: BigDecimal = 0

    val projects = TimesheetService getTimesheetPerProjects

    for (p <- projects) {
      if (StringUtils.equals(p.toString, "-1")) {
        val npList = TimesheetService.getUserTimesheetsForProject(p.toString())
        for (tm <- npList) {

          var typeN = tm.sub_task_id
          typeN match {
            case 1 =>
              npLeave += tm.hours
            case 2 =>
              npTraining += tm.hours
            case 3 =>
              npMeetings += tm.hours
            case 4 =>
              npNonBill += tm.hours
            case 5 =>
              npBAU += tm.hours
          }
          npHours += tm.hours

        }
      } else {
        val pList = TimesheetService.getUserTimesheetsForProject(p.toString())
        for (tm <- pList) {
          pHours += tm.hours
        }
      }
    }

    node.put("project", pHours)
    node.put("nonProject", npHours)
    node.put("npLeave", npLeave)
    node.put("npTraining", npTraining)
    node.put("npMeetings", npMeetings)
    node.put("npNonBill", npNonBill)
    node.put("npBAU", npBAU)
    jsonArr.put(node)

    Ok(jsonArr.toString())
  }

  /**
   * Timesheet bar chart
   */
  def barChartTimesheet() = Action { implicit request =>
    val users = TimesheetService.getTimesheetUsers
    var jsonArr = new JSONArray()
    for (u <- users) {
      var node = new JSONObject()
      var pHours: BigDecimal = 0
      var npHours: BigDecimal = 0
      val user = UserService.findUserDetailsById(u.toLong)

      val timesheet = TimesheetService.getTimesheetForUser(u.toString)
      for (t <- timesheet) {

        if (t != -1) {
          val times = TimesheetService.getUserTimesheetsForProjectAndUser(u, t)
          for (tm <- times) {
            npHours += tm.hours
          }
        }

      }
      node.put("user", (user.get.first_name + " " + user.get.last_name))
      node.put("project", pHours)
      node.put("nonProject", npHours)
      jsonArr.put(node)

    }
    Ok(jsonArr.toString())
  }

  /**
   * Bar chart for Timesheet per project
   */
  def barChartTimesheetPerProjects(from: String, to: String) = Action { implicit request =>
    var projects2: List[String] = null

    val projects = TimesheetService.getTimesheetProjects(from, to)
    var jsonArr = new JSONArray()
    for (p <- projects) {

      if (p != -1) {
        var node = new JSONObject()
        var pHours: BigDecimal = 0
        var npHours: BigDecimal = 0

        val project = ProjectService.findProject(p)
        val times = TimesheetService.getUserTimesheetsPerProject(p.toString, from, to)
        for (t <- times) {
          pHours += t.hours
        }
        node.put("project", project.get.project_name)
        node.put("hours", pHours)
        jsonArr.put(node)

      }
    }
    Ok(jsonArr.toString())
  }

  def dashboardRiskReport() = Action { implicit request =>
    val divisions = DivisionService.findAllDivision()
    Ok(views.html.frontend.dashboard.riskReport(divisions, "PROGRAM"))
  }

  def riskReportForPrograms() = Action { implicit request =>
    request.session.get("username").map { user =>
      val divisions = DivisionService.findAllDivision()
      Ok(views.html.frontend.dashboard.riskReportForPrograms(divisions));
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def riskReportForProjects() = Action { implicit request =>
    request.session.get("username").map { user =>
      val divisions = DivisionService.findAllDivision()
      Ok(views.html.frontend.dashboard.riskReportForProjects(divisions));
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def riskReportForTasks() = Action { implicit request =>
    request.session.get("username").map { user =>
      val divisions = DivisionService.findAllDivision()
      Ok(views.html.frontend.dashboard.riskReportForTasks(divisions));
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def riskReportForSubtasks() = Action { implicit request =>
    request.session.get("username").map { user =>
      val divisions = DivisionService.findAllDivision()
      Ok(views.html.frontend.dashboard.riskReportForSubtasks(divisions));
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def dashboardIssueReport() = Action { implicit request =>
    val divisions = DivisionService.findAllDivision()

    for (d <- divisions) {

      val programs = ProgramService.findAllProgramMasterDetailsForDivision(d.dId.get.toString())
      for (p <- programs) {

        /**
         * Project Risks...
         */
        val projects = ProjectService.findProjectListForProgram(p.program_id.get.toString())
        for (p <- projects) {

          /**
           * Task Risks..
           */

          val tasks = TaskService.findTaskListByProjectId(p.pId.get.toString())
          for (t <- tasks) {
            val task_issues = RiskService.findIssueList(t.tId.get.toString(), 0)
            if (task_issues.size > 0) {
              for (r <- task_issues) {
                println("task_issues --------" + r.title)
              }
            }

            /**
             * Sub Task Risks..
             */

            val sub_taks = SubTaskServices.findSubTasksByTask(t.tId.get.toString())
            for (s <- sub_taks) {
              val sub_task_issues = RiskService.findIssueList(s.sub_task_id.get.toString(), 1)

              if (sub_task_issues.size > 0) {
                for (r <- sub_task_issues) {
                  println("sub_task_issues --------" + r.title)
                }
              }
            }

          }

        }

      }
    }
    Ok(views.html.frontend.dashboard.issueReport(divisions))
  }

  def issueReportForTasks() = Action { implicit request =>
    request.session.get("username").map { user =>
      val divisions = DivisionService.findAllDivision()
      Ok(views.html.frontend.dashboard.issueReportForTasks(divisions));
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def issueReportForSubtasks() = Action { implicit request =>
    request.session.get("username").map { user =>
      val divisions = DivisionService.findAllDivision()
      Ok(views.html.frontend.dashboard.issueReportForSubtasks(divisions));
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

}