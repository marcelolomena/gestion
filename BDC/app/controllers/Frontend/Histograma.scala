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
import services.HistogramaService
import java.util.Calendar
import java.io.File
import java.io.FileOutputStream
import org.apache.poi.xssf.usermodel._

/**
 * @author Cristian
 */
object Histograma extends Controller {

  def home = Action {
    implicit request =>
      request.session.get("username").map { user =>

        Ok(views.html.frontend.histograma.histograma()).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }

  def listadoHistograma = Action {
    implicit request =>
      request.session.get("username").map { user =>
        val rows = request.getQueryString("rows").get.toInt
        val page = request.getQueryString("page").get.toInt
        val filters = request.getQueryString("filters").getOrElse("").toString()
        var sidx = request.getQueryString("sidx").get.toString()
        val sord = request.getQueryString("sord").get.toString()
        val mes = request.getQueryString("mes").get.toString()

        var records: Int = 0
        val uId = request.session.get("uId").get.toString()
        var node = new JSONObject()
        if (sidx.trim().size == 0) {
          sidx = "nombre"
        }
        val pageIndex = page
        val pageSize = rows
        val startRow = (pageIndex * pageSize) + 1;
        val histograma = HistogramaService.listadoHistograma(uId,mes)

        var registro = new JSONArray()
        for (p <- histograma) {
          var campo = new JSONObject()
          //records = p.cantidad
          campo.put("programa", p.programa)
          campo.put("proyecto", p.proyecto)
          campo.put("tarea", p.tarea)
          campo.put("subtarea", p.subtarea)
          val horas = p.horas.split(";")
          var i = 0
          for (hora <- horas){
            i = i+1
            campo.put(i.toString(), hora)
            //println(i.toString()+" - "+hora)
          }
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

  def excel() = Action {
    implicit request =>
      request.session.get("username").map { user =>
        val file = new File("histograma.xlsx")
        val fileOut = new FileOutputStream(file);
        val wb = new XSSFWorkbook
        val sheet = wb.createSheet("Histograma")
        val filters = request.getQueryString("filters").getOrElse("").toString()
        var j = 0
        var rNum = 1
        var cNum = 0
        var a = 0
        var tieneJson = true
        var qrystr = ""
        val mes = request.getQueryString("mes").get.toString()
        val uId = request.session.get("uId").get.toString()
        
        val panel = HistogramaService.listadoHistograma(uId,mes)
        var rowhead = sheet.createRow(0)
        val style = wb.createCellStyle()
        val font = wb.createFont()
        font.setFontName(org.apache.poi.hssf.usermodel.HSSFFont.FONT_ARIAL)
        font.setFontHeightInPoints(10)
        font.setBold(true)
        style.setFont(font)
        rowhead.createCell(0).setCellValue("Programa")
        rowhead.createCell(1).setCellValue("Proyecto")
        rowhead.createCell(2).setCellValue("Tarea")
        rowhead.createCell(3).setCellValue("SubTarea")
        rowhead.createCell(4).setCellValue("01")
        rowhead.createCell(5).setCellValue("02")
        rowhead.createCell(6).setCellValue("03")
        rowhead.createCell(7).setCellValue("04")
        rowhead.createCell(8).setCellValue("05")
        rowhead.createCell(9).setCellValue("06")
        rowhead.createCell(10).setCellValue("07")
        rowhead.createCell(11).setCellValue("08")
        rowhead.createCell(12).setCellValue("09")
        rowhead.createCell(13).setCellValue("10")
        rowhead.createCell(14).setCellValue("11")
        rowhead.createCell(15).setCellValue("12")
        rowhead.createCell(16).setCellValue("13")
        rowhead.createCell(17).setCellValue("14")
        rowhead.createCell(18).setCellValue("15")
        rowhead.createCell(19).setCellValue("16")
        rowhead.createCell(20).setCellValue("17")
        rowhead.createCell(21).setCellValue("18")
        rowhead.createCell(22).setCellValue("19")
        rowhead.createCell(23).setCellValue("20")
        rowhead.createCell(24).setCellValue("21")
        rowhead.createCell(25).setCellValue("22")
        rowhead.createCell(26).setCellValue("23")
        rowhead.createCell(27).setCellValue("24")
        rowhead.createCell(28).setCellValue("25")
        rowhead.createCell(29).setCellValue("26")
        rowhead.createCell(30).setCellValue("27")
        rowhead.createCell(31).setCellValue("28")
        rowhead.createCell(32).setCellValue("29")
        rowhead.createCell(33).setCellValue("30")
        rowhead.createCell(34).setCellValue("31")
        

        for (j <- 0 to 10)
          rowhead.getCell(j).setCellStyle(style);

        for (s <- panel) {
          var row = sheet.createRow(rNum)

          val cel0 = row.createCell(cNum)
          cel0.setCellValue(s.programa)

          val cel1 = row.createCell(cNum + 1)
          cel1.setCellValue(s.proyecto)

          val cel2 = row.createCell(cNum + 2)
          cel2.setCellValue(s.tarea)

          val cel3 = row.createCell(cNum + 3)
          cel3.setCellValue(s.subtarea)

          val horas = s.horas.split(";")
          var i = 3
          for (hora <- horas){
            i = i+1
            val cel4 = row.createCell(cNum + i)
            cel4.setCellValue(hora)
          }

          rNum = rNum + 1
          cNum = 0

        }

        for (a <- 0 to 34) {
          sheet.autoSizeColumn((a.toInt));
        }

        wb.write(fileOut);
        fileOut.close();
        Ok.sendFile(content = file, fileName = _ => "histograma.xlsx")
      }.getOrElse {
        Redirect(routes.Login.loginUser()).withNewSession
      }

  }

}