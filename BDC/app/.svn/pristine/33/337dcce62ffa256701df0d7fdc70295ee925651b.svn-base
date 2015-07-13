package services

import java.util.Date
import anorm.SQL
import anorm.sqlToSimple
//import anorm.toParameterValue
import models.Deliverables
import play.api.Play.current
import play.api.db.DB
import anorm.SqlParser._
import play.api.data.Form
import play.i18n._
import play.mvc._
import models.CustomColumns
object DeliverableService extends CustomColumns {
  val langObj = new Lang(Lang.forCode("es-ES"))
  /**
   * *
   *
   */
  def findAllDeliverableList(pagNo: String, recordOnPage: String): Seq[Deliverables] = {
    val rec = Integer.parseInt(pagNo.toInt.toString) * Integer.parseInt(recordOnPage.toInt.toString)
    val start = rec - Integer.parseInt(recordOnPage.toInt.toString)
    val end = Integer.parseInt(recordOnPage.toInt.toString)
    var sqlString = ""
    sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY id) AS Row, * FROM art_program_deliverable AS tbl)as ss WHERE  (Row >=" + (start + 1) + " AND Row <= " + (start + end) + ")"
    //println(sqlString)
    //sqlString = "SELECT * from art_program_deliverable  limit " + start + "," + end
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(Deliverables.deliverable *)
    }
  }

  def findAllDeliverables(): Seq[Deliverables] = {
    var sqlString = "SELECT * from art_program_deliverable where is_deleted = 0 "
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(Deliverables.deliverable *)
    }
  }

  def saveDeliverable(obj: Deliverables, uId: String): Long = {
    DB.withConnection { implicit connection =>
      val lastsaved = SQL(
        """
          insert into art_program_deliverable ( deliverable,description,updated_by,updation_date,is_deleted) values (
          {deliverable},{description},{updated_by},{updation_date},{is_deleted})
          """).on(
          'deliverable -> obj.deliverable.trim(),
          'description -> obj.description,
          'updated_by -> uId,
          'updation_date -> new Date(),
          'is_deleted -> obj.is_deleted).executeInsert(scalar[Long].singleOpt)
      lastsaved.last
    }
  }
  def updateDeliverable(obj: Deliverables): Int = {
    DB.withConnection { implicit connection =>
      SQL(""" update  art_program_deliverable set deliverable={deliverable},description={description},updated_by={updated_by},updation_date={updation_date},is_deleted={is_deleted} where id={id}""").on(
        'id -> obj.id.get,
        'deliverable -> obj.deliverable.trim(),
        'description -> obj.description,
        'updated_by -> obj.updated_by,
        'updation_date -> new Date(),
        'is_deleted -> obj.is_deleted).executeUpdate()
    }
  }

  def findDeliverableById(id: String): Option[Deliverables] = {
    if (!id.isEmpty()) {
      var sql = "select t.* from art_program_deliverable t where t.id='" + id + "'"
      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(Deliverables.deliverable.singleOpt)
        result
      }
    } else {
      null
    }
  }

  def findDeliverableByName(deliverableName: String): Option[Deliverables] = {
    if (!deliverableName.isEmpty()) {
      var sql = "select t.* from art_program_deliverable t where t.is_deleted = 0  AND  t.deliverable='" + deliverableName + "'"
      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(Deliverables.deliverable.singleOpt)
        result
      }
    } else {
      null
    }
  }

  /**
   * delete deliverable
   */

  def changeDeliverableStatus(id: String, is_deleted: Int, uid: Int): Int = {
    DB.withConnection { implicit connection =>
      SQL(""" update  art_program_deliverable set updated_by={updated_by},updation_date={updation_date},is_deleted={is_deleted} where id={id}""").on(
        'id -> id,
        'updated_by -> uid,
        'updation_date -> new Date(),
        'is_deleted -> is_deleted).executeUpdate()
    }
  }

  def deliverableCount(): Long = {
    DB.withConnection { implicit connection =>
      var sqlString = ""
      sqlString = "SELECT count(*) from art_program_deliverable"
      val count: Long = SQL(sqlString).as(scalar[Long].single)
      count
    }
  }
  def findDeliverableByNameForEdit(deliverable: String, deliverable_id: String): Option[Deliverables] = {
    if (!deliverable_id.isEmpty()) {
      var sql = "select d.* from art_program_deliverable d where d.is_deleted = 0  AND d.deliverable='" + deliverable.trim() + "' AND d.id <>'" + deliverable_id + "'"
      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(Deliverables.deliverable.singleOpt)
        result
      }
    } else {
      null
    }
  }
  def validateDeliverableForm(form: Form[Deliverables]): Form[Deliverables] = {
    var newform: Form[Deliverables] = null
    val deliverable_id = form.data.get("id").get.trim()
    // val descriptionlegth = form.data.get("description").get.trim().length()
    val deliverable = form.data.get("deliverable").get.trim()
    /*    if (descriptionlegth <= 4 || descriptionlegth >= 500) {
      newform = form.withError("description", Messages.get(langObj, ("error.description.minmax")))
    }*/

    val obj = findDeliverableByNameForEdit(deliverable, deliverable_id)
    if (!obj.isEmpty) {
      newform = form.withError("deliverable", Messages.get(langObj, "deliverable.alreadyexist"))
    }

    if (newform != null) {
      newform
    } else {
      form
    }
  }
}