package services

import java.util.Date
import anorm.SQL
import anorm.sqlToSimple
//import anorm.toParameterValue
import models.BudgetTypes
import play.api.Play.current
import play.api.db.DB
import anorm.SqlParser._
import anorm._
import com.typesafe.plugin._
import play.api.data.Form
import play.i18n._
import play.mvc._
import models.CustomColumns
import models.CustomColumns

object BudgetTypeService extends CustomColumns {

  val langObj = new Lang(Lang.forCode("es-ES"))
  /**
   * *
   *
   */
  def findAllBudgetType(pagNo: String, recordOnPage: String): Seq[BudgetTypes] = {
    val rec = Integer.parseInt(pagNo.toInt.toString) * Integer.parseInt(recordOnPage.toInt.toString)
    val start = rec - Integer.parseInt(recordOnPage.toInt.toString)
    val end = Integer.parseInt(recordOnPage.toInt.toString)
    var sqlString = ""
    sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY sequencing ASC) AS Row, * FROM art_program_budget_type AS tbl)as ss WHERE  (Row >=" + (start + 1) + " AND Row <= " + (start + end) + ")  ORDER BY sequencing ASC"
    //sqlString = "SELECT * from art_program_budget_type  limit " + start + "," + end
    //var sqlString = "SELECT * from art_program_budget_type where ( id BETWEEN  " + start +1 + " AND  "+(start + end)+")"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(BudgetTypes.bTypes *)
    }
  }

  def saveBudgetType(obj: BudgetTypes): Long = {
    DB.withConnection { implicit connection =>
      val lastsaved = SQL(
        """
          insert into art_program_budget_type ( sequencing,budget_type,description,creation_date,updated_by,updation_date,is_deleted) values (
          {sequencing},{budget_type},{description},{creation_date},{updated_by},{updation_date},{is_deleted})
          """).on('budget_type -> obj.budget_type.trim(),
          'sequencing -> obj.sequencing,
          'description -> obj.description,
          'creation_date -> new Date(),
          'updated_by -> obj.updated_by,
          'updation_date -> new Date(),
          'is_deleted -> obj.is_deleted).executeInsert(scalar[Long].singleOpt)
      lastsaved.last
    }
  }
  def updateBudgetType(obj: BudgetTypes): Int = {

    DB.withConnection { implicit connection =>
      SQL(""" update  art_program_budget_type set sequencing={sequencing}, budget_type={budget_type},description={description},updated_by={updated_by},updation_date={updation_date},is_deleted={is_deleted} where id={id}  """).on(
        'id -> obj.id,
        'sequencing -> obj.sequencing,
        'budget_type -> obj.budget_type.trim(),
        'description -> obj.description,
        'sequencing -> obj.sequencing,
        'updated_by -> obj.updated_by,
        'updation_date -> new Date(),
        'is_deleted -> obj.is_deleted).executeUpdate()
    }
  }

  def findBudgetTypeById(id: String): Option[BudgetTypes] = {
    if (!id.isEmpty()) {
      var sql = "select t.* from art_program_budget_type t where t.id='" + id + "'"

      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(BudgetTypes.bTypes.singleOpt)
        result
      }
    } else {
      null
    }
  }

  def findBudgetTypeByName(budget_type: String): Seq[BudgetTypes] = {
    if (!budget_type.isEmpty()) {
      var sql = "select t.* from art_program_budget_type t where t.is_deleted=0  AND t.budget_type='" + budget_type.trim() + "' "
      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(BudgetTypes.bTypes *)
        result
      }
    } else {
      null
    }
  }
  /**
   * delete art_program_budget_type
   */
  def changeBudgetTypeStatus(id: String, is_deleted: Int, uid: Int): Int = {
    DB.withConnection { implicit connection =>
      SQL(""" update  art_program_budget_type set updated_by={updated_by},updation_date={updation_date},is_deleted={is_deleted} where id={id}  """).on(
        'id -> id,
        'updated_by -> uid,
        'updation_date -> new Date(),
        'is_deleted -> is_deleted).executeUpdate()
    }
  }

  /*  def findAllActiveBudgetType(): Seq[BudgetTypes] = {
    var sqlString = "SELECT * from art_program_budget_type where is_deleted=0"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(BudgetTypes.bTypes *)
    }
  }*/

  def findActiveBudgetTypes(): Seq[BudgetTypes] = {
    var sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY sequencing ASC) AS Row, * FROM art_program_budget_type AS tbl where is_deleted = 0) as ss"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(BudgetTypes.bTypes *)
    }
  }

  def budgetTypeCount(): Long = {
    DB.withConnection { implicit connection =>
      var sqlString = "SELECT count(*) from art_program_budget_type "
      val count: Long = SQL(sqlString).as(scalar[Long].single)
      count
    }
  }
  def isDesciplineSequenced(sequencing: String): Boolean = {
    if (!sequencing.trim().isEmpty()) {
      var sql = "select count(*) from art_program_budget_type  where is_deleted = 0  AND sequencing='" + sequencing.trim() + "'"

      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(scalar[Long].single)
        if (result == 0) {
          false
        } else {
          true
        }
      }
    } else {
      false
    }
  }
  def validateBudgetTypeForm(form: Form[BudgetTypes]): Form[BudgetTypes] = {
    var newform: Form[BudgetTypes] = null
    val budget_type = form.data.get("budget_type").get.trim()
    val obj = findBudgetTypeByName(budget_type)
    if (obj.size > 0) {
      newform = form.withError("budget_type", Messages.get(langObj, "budgettype.alreadyexist"))
    }
    val sequence = form.data.get("sequencing").get.trim()
    val isCodePresent = isDesciplineSequenced(sequence)
    if (isCodePresent) {
      newform = form.withError("sequencing", Messages.get(langObj, ("sequence.alreadyexist")))
    }
    if (newform != null) {
      newform
    } else {
      form
    }
  }

  def findBudgetTypeByNameForEdit(budget_type: String, budget_type_id: String): Seq[BudgetTypes] = {
    var sql = "select t.* from art_program_budget_type t where t.is_deleted=0  AND t.budget_type='" + budget_type + "' AND id <>'" + budget_type_id + "'"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(BudgetTypes.bTypes *)
      result
    }
  }

  def isDesciplineSequencedForEdit(sequencing: String, budget_type_id: String): Boolean = {
    if (!sequencing.trim().isEmpty()) {
      var sql = "select count(*) from art_program_budget_type  where is_deleted = 0  AND sequencing='" + sequencing.trim() + "' AND id <>'" + budget_type_id + "'"

      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(scalar[Long].single)
        if (result == 0) {
          false
        } else {
          true
        }
      }
    } else {
      false
    }
  }
  def validateEditBudgetTypeForm(form: Form[BudgetTypes]): Form[BudgetTypes] = {
    var newform: Form[BudgetTypes] = null
    val budget_type = form.data.get("budget_type").get.trim()
    val budget_type_id = form.data.get("id").get.trim()
    val obj = findBudgetTypeByNameForEdit(budget_type, budget_type_id)
    if (obj.size > 0) {
      newform = form.withError("budget_type", Messages.get(langObj, "budgettype.alreadyexist"))
    }
    val sequence = form.data.get("sequencing").get.trim()
    val isCodePresent = isDesciplineSequencedForEdit(sequence, budget_type_id)
    if (isCodePresent) {
      newform = form.withError("sequencing", Messages.get(langObj, ("sequence.alreadyexist")))
    }
    if (newform != null) {
      newform
    } else {
      form
    }
  }

}