package services

import java.util.Date
import anorm.SQL
import anorm.sqlToSimple
//import anorm.toParameterValue
import models.DocumentTypes
import play.api.Play.current
import play.api.db.DB
import anorm.SqlParser._
import play.api.data.Form
import play.i18n._
import play.mvc._
import models.CustomColumns
object DocumentTypeService extends CustomColumns {
  val langObj = new Lang(Lang.forCode("es-ES"))
  def findAllDocumentType(pagNo: String, recordOnPage: String): Seq[DocumentTypes] = {
    val rec = Integer.parseInt(pagNo.toInt.toString) * Integer.parseInt(recordOnPage.toInt.toString)
    val start = rec - Integer.parseInt(recordOnPage.toInt.toString)
    val end = Integer.parseInt(recordOnPage.toInt.toString)

    var sqlString = ""
    sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY id) AS Row, * FROM art_program_document_type AS tbl)as ss WHERE  (Row >=" + (start + 1) + " AND Row <= " + (start + end) + ")"
    //sqlString = "SELECT * from art_program_document_type  limit " + start + "," + end
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(DocumentTypes.dTypes *)
    }
  }

  def findAllDocumentTypes(): Seq[DocumentTypes] = {
    var sqlString = "SELECT * FROM art_program_document_type where is_deleted = 0 "
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(DocumentTypes.dTypes *)
    }
  }

  def saveDocumentType(obj: DocumentTypes): Long = {
    DB.withConnection { implicit connection =>
      val lastsaved = SQL(
        """
          insert into art_program_document_type ( document_type,description,updated_by,updation_date,is_deleted) values (
          {document_type},{description},{updated_by},{updation_date},{is_deleted})
          """).on('document_type -> obj.document_type.trim(),
          'description -> obj.description,
          'updated_by -> obj.updated_by,
          'updation_date -> new Date(),
          'is_deleted -> obj.is_deleted).executeInsert(scalar[Long].singleOpt)
      lastsaved.last
    }
  }
  def updateDocumentType(obj: DocumentTypes): Int = {

    DB.withConnection { implicit connection =>
      SQL(""" update  art_program_document_type set document_type={document_type},description={description},updated_by={updated_by},updation_date={updation_date},is_deleted={is_deleted} where id={id}  """).on(
        'id -> obj.id,
        'document_type -> obj.document_type.trim(),
        'description -> obj.description,
        'updated_by -> obj.updated_by,
        'updation_date -> new Date(),
        'is_deleted -> obj.is_deleted).executeUpdate()
    }
  }

  def findDocumentTypeById(id: String): Option[DocumentTypes] = {
    if (!id.isEmpty()) {
      var sql = "select t.* from art_program_document_type t where t.id='" + id + "'"
      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(DocumentTypes.dTypes.singleOpt)
        result
      }
    } else {
      null
    }
  }

  def findDocumentTypeByName(document_type: String): Seq[DocumentTypes] = {
    if (!document_type.isEmpty()) {
      var sql = "select t.* from art_program_document_type t where t.is_deleted = 0  AND t.document_type='" + document_type.trim() + "'"
      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(DocumentTypes.dTypes *)
        result
      }
    } else {
      null
    }
  }
  /**
   * delete generic_project_type
   */

  def changeDocumentTypeStatus(id: String, is_deleted: Int, uid: Int): Int = {
    DB.withConnection { implicit connection =>
      SQL(""" update  art_program_document_type set updated_by={updated_by},updation_date={updation_date},is_deleted={is_deleted} where id={id}  """).on(
        'id -> id,
        'updated_by -> uid,
        'updation_date -> new Date(),
        'is_deleted -> is_deleted).executeUpdate()
    }
  }
  def documentTypeCount(): Long = {
    DB.withConnection { implicit connection =>
      var sqlString = ""
      sqlString = "SELECT count(*) from art_program_document_type"
      val count: Long = SQL(sqlString).as(scalar[Long].single)
      count
    }
  }
  def findDocumentTypeForEdit(document_type: String, document_type_id: String): Seq[DocumentTypes] = {
    if (!document_type.isEmpty()) {
      var sql = "select d.* from art_program_document_type d where d.is_deleted = 0  AND d.document_type='" + document_type.trim() + "' AND d.id <>'" + document_type_id + "'"
      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(DocumentTypes.dTypes *)
        result
      }
    } else {
      null
    }
  }
  def validateDocumentTypeForm(form: Form[DocumentTypes]): Form[DocumentTypes] = {
    var newform: Form[DocumentTypes] = null
    val document_type_id = form.data.get("id").get.trim()
    val document_type = form.data.get("document_type").get.trim()

    val obj = findDocumentTypeForEdit(document_type, document_type_id)
    if (obj.size > 0) {
      newform = form.withError("document_type", Messages.get(langObj, "document_type.alreadyexist"))
    }

    if (newform != null) {
      newform
    } else {
      form
    }
  }
}