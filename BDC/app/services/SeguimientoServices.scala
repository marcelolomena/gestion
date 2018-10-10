package services;
import play.api.Play.current
import play.api.db.DB
import anorm.SqlParser._
import models._
import anorm._
import play.Logger
import org.apache.poi.xssf.usermodel._
import java.io.File
import java.io.PrintWriter
import java.io.FileOutputStream
import java.util.Date

import models.ListDocuments.{ListTypes, PMOList, ProgramList}

object SeguimientoService {



  def programCount(Json: String): Int = {

    var sqlString = "EXEC art.cantidad_programa {Json}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('Json -> Json).executeQuery() as (scalar[Int].single)
    }
  }

  def reportProgram(pageSize: String, pageNumber: String, Json: String): Seq[ReportDocument] = {

    var sqlString = "EXEC art.reporte_programa {PageSize},{PageNumber},{Json}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt, 'Json -> Json).executeQuery() as (ReportDocument.rpt *)
    }
  }

  def documentsList(program: String, pageSize: String, pageNumber: String): Seq[ListDocuments] = {

    var sqlString = "EXEC art.documentos_por_programa {Program},{PageSize},{PageNumber}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on( 'Program -> program.toInt,'PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt).executeQuery() as (ListDocuments.rpt *)
    }
  }

  def documentsListByType(tipo: String, program: String, pageSize: String, pageNumber: String): Seq[ListDocuments] = {

    var sqlString = "EXEC art.documentos_por_programa_tipo {Tipo},{Program},{PageSize},{PageNumber}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('Tipo -> tipo.toInt, 'Program -> program.toInt,'PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt).executeQuery() as (ListDocuments.rpt *)
    }
  }

  def documentsTypes(program: String, pageSize: String, pageNumber: String): Seq[ListTypes] = {

    var sqlString = "EXEC art.documentos_por_tipo {Program},{PageSize},{PageNumber}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('Program -> program.toInt,'PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt).executeQuery() as (ListTypes.rpt *)
    }
  }

  def documentsPMOs(rol: String): Seq[PMOList] = {

    var sqlString = "EXEC art.documentos_pmo_list {Rol}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('Rol -> rol.toInt).executeQuery() as (PMOList.rpt *)
    }
  }

  def documentsPrograms(pmo:String, art:String, pageSize: String, pageNumber: String): Seq[ProgramList] = {

    var sqlString = "EXEC art.documentos_lista_programa {Pmo},{Art},{PageSize},{PageNumber}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('Pmo -> pmo.toInt, 'Art -> art.toInt,'PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt).executeQuery() as (ProgramList.rpt *)
    }
  }

  def programCountDocs(pmo:String, art:String): Int = {

    var sqlString = "EXEC art.cantidad_programa_docs {Pmo}, {Art}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('Pmo -> pmo.toInt, 'Art -> art.toInt).executeQuery() as (scalar[Int].single)
    }
  }

  def programCountDocsProgram(program_id:String): Int = {

    var sqlString = "EXEC art.cantidad_docs_program {Program}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('Program -> program_id.toInt).executeQuery() as (scalar[Int].single)
    }
  }


  def createExcelDocs(program_id: String) = {
    DB.withConnection { implicit connection =>
      val sqlstr =
        """
          |	SELECT a.id, b.file_name, a.title, a.updated_at fecha, b.version_no version, d.document_type tipo, a.parent_type, c.first_name+' '+c.last_name AS encargado,
          |	a.extension, b.version_notes, d.document_type
          |	FROM document_master a
          |	JOIN version_details b ON a.id=b.document_id
          |	JOIN art_user c ON b.user_id=c.uid
          |	JOIN art_program_document_type d ON b.document_type=d.id
          |	LEFT JOIN art_program e ON a.parent_id=e.program_id
          |	WHERE a.is_active = 1 and a.parent_id={Program_id} OR parent_id IN (
          |	SELECT pId FROM art_project_master WHERE program={Program_id}
          |	UNION
          |	SELECT tId FROM art_task WHERE pId IN (SELECT pId FROM art_project_master WHERE program={Program_id})
          |	UNION
          |	SELECT sub_task_id FROM art_sub_task WHERE task_id IN (SELECT tId FROM art_task WHERE pId IN (SELECT pId FROM art_project_master WHERE program={Program_id}))
          |	)
          |	ORDER BY a.updated_at DESC
        """.stripMargin

      val data=SQL(sqlstr).on('Program_id -> program_id.toInt).as(ListDocuments.rpt *)

      val file = new File("reporte.xlsx")
      val fileOut = new FileOutputStream(file);
      val wb = new XSSFWorkbook
      val sheet = wb.createSheet("ART")

      val rowHead = sheet.createRow(0)
      val style = wb.createCellStyle()
      val font = wb.createFont()

      var rNum = 1
      var cNum = 0

      font.setFontName(org.apache.poi.hssf.usermodel.HSSFFont.FONT_ARIAL)
      font.setFontHeightInPoints(26)
      font.setBold(true)
      style.setFont(font)
      /*get[Int]("id") ~
        get[String]("title") ~
        get[Option[Date]]("fecha") ~
        get[Int]("version") ~
        get[String]("tipo") ~
        get[String]("parent_type") ~
        get[String]("extension") ~
        get[String]("encargado")*/
      rowHead.createCell(0).setCellValue("Nombre")
      rowHead.createCell(1).setCellValue("Fecha")
      rowHead.createCell(2).setCellValue("Versión")
      rowHead.createCell(3).setCellValue("Tipo")
      rowHead.createCell(4).setCellValue("Nivel")
      rowHead.createCell(5).setCellValue("Extensión")
      rowHead.createCell(6).setCellValue("Encargado")

      for (j <- 0 to 6)
        rowHead.getCell(j).setCellStyle(style)

      for (s <- data) {
        val row = sheet.createRow(rNum)

        val cel0 = row.createCell(cNum)
        cel0.setCellValue(s.title)

        val cel1 = row.createCell(cNum + 1)
        cel1.setCellValue(s.fecha.toString().substring(5, 15))

        val cel2 = row.createCell(cNum + 2)
        cel2.setCellValue(s.version)

        val cel3 = row.createCell(cNum + 3)
        cel3.setCellValue(s.tipo)

        val cel4 = row.createCell(cNum + 4)
        cel4.setCellValue(s.parent_type)

        val cel5 = row.createCell(cNum + 5)
        cel5.setCellValue(s.extension)

        val cel6 = row.createCell(cNum + 6)
        cel6.setCellValue(s.encargado)


        rNum = rNum + 1
        cNum = 0

      }

      for (a <- 0 to 6) {
        sheet.autoSizeColumn((a.toInt));
      }
      wb.write(fileOut)
      fileOut.close()
    }
  }

}