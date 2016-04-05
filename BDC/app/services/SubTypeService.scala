package services

import play.api.Play.current
import play.api.db.DB;
import models._
import anorm._
import com.typesafe.plugin._
import anorm.SqlParser._
import play.api.data.Form
import play.i18n._
import play.mvc._
object SubTypeService extends CustomColumns {
  val langObj = new Lang(Lang.forCode("es-ES"))
  /**
   * *
   *
   */

  def findAllSubTypes(pagNo: String, recordOnPage: String): Seq[SubTypes] = {
    val rec = Integer.parseInt(pagNo.toInt.toString) * Integer.parseInt(recordOnPage.toInt.toString)
    val start = rec - Integer.parseInt(recordOnPage.toInt.toString)
    val end = Integer.parseInt(recordOnPage.toInt.toString)
    var sqlString = ""

    //sqlString = "SELECT * from art_program_sub_type   limit " + start + "," + end
    //sqlString = "SELECT * from art_program_sub_type  where ( id BETWEEN  " + ( start  + 1 ) + " AND  "+(start + end)+")"
    sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY id) AS Row, * FROM art_program_sub_type AS tbl)as ss WHERE  (Row >=" + (start + 1) + " AND Row <= " + (start + end) + ")"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(SubTypes.subtypes *)
    }
  }

  /*  def subTypeCount(): Long = {
    DB.withConnection { implicit connection =>
      var sqlString = ""
      sqlString = "SELECT count(*) from art_program_sub_type "
      val count: Long = SQL(sqlString).as(scalar[Long].single)
      count
    }
  }*/

  def saveSubType(obj: SubTypes): Long = {
    DB.withConnection { implicit connection =>
      val lastsaved = SQL(
        """
          insert into art_program_sub_type ( sub_type, description, user_id, creation_date, is_deleted) values (
          {sub_type}, {description}, {user_id}, {creation_date}, {is_deleted})
          """).on(
          'sub_type -> obj.sub_type.trim(),
          'description -> obj.description,
          'user_id -> obj.user_id,
          'creation_date -> obj.creation_date,
          'is_deleted -> obj.is_deleted).executeInsert(scalar[Long].singleOpt)
      lastsaved.last
    }
  }
  def updateSubType(obj: SubTypes): Int = {
    DB.withConnection { implicit connection =>
      SQL(""" update  art_program_sub_type set sub_type={sub_type}, description={description}, user_id={user_id}, creation_date={creation_date} , is_deleted={is_deleted} where id={id}""")
        .on(
          'id -> obj.id.get,
          'sub_type -> obj.sub_type.trim(),
          'description -> obj.description,
          'user_id -> obj.user_id,
          'creation_date -> obj.creation_date,
          'is_deleted -> obj.is_deleted).executeUpdate()
    }
  }

  def findSubTypeById(id: String): Option[SubTypes] = {
    var sql = ""
    if (id != "") {
      sql = "select t.* from art_program_sub_type t where t.id='" + id + "'"

      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(SubTypes.subtypes.singleOpt)
        result
      }
    } else {
      null
    }
  }
  /**
   * delete sub type
   */

  def changeSubTypeStatus(id: String, is_deleted: Int, uid: Int): Int = {
    DB.withConnection { implicit connection =>
      SQL(""" update  art_program_sub_type set  user_id={user_id}, creation_date={creation_date} , is_deleted={is_deleted} where id={id}""")
        .on(
          'id -> id,
          'user_id -> uid,
          'creation_date -> new java.util.Date(),
          'is_deleted -> is_deleted).executeUpdate()
    }
  }
  /**
   * *
   *
   */
  def findAllSubTypeList(): Seq[SubTypes] = {
    var sqlString = ""

    sqlString = "SELECT * from art_program_sub_type where is_deleted = 0 order by sub_type"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(SubTypes.subtypes *)
    }
  }

  def findSubTypeList(): Seq[SubTypes] = {
    var sqlString = ""

    sqlString = "SELECT * from art_program_sub_type where is_deleted = 0"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(SubTypes.subtypes *)
    }
  }

  def subTypeCount(): Long = {
    DB.withConnection { implicit connection =>
      var sqlString = ""
      sqlString = "SELECT count(*) from art_program_sub_type"
      val count: Long = SQL(sqlString).as(scalar[Long].single)
      count
    }
  }
  def findSubTypeByName(sub_type: String): Seq[SubTypes] = {
    var sql = "select t.* from art_program_sub_type t where t.is_deleted = 0  AND  t.sub_type='" + sub_type + "'"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(SubTypes.subtypes *)
      result
    }
  }
  def findSubTypeByNameForEdit(sub_type: String, sub_type_id: String): Seq[SubTypeCase] = {
    var sql = "select d.* from art_program_sub_type d where d.is_deleted = 0  AND d.sub_type='" + sub_type.trim() + "' AND d.id <>'" + sub_type_id + "'"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(SubTypeCase.subType *)
      result
    }
  }
  def validateSubTypeForm(form: Form[SubTypeCase]): Form[SubTypeCase] = {
    var newform: Form[SubTypeCase] = null
    val sub_type_id = form.data.get("id").get.trim()
    // val descriptionlegth = form.data.get("description").get.trim().length()
    val sub_type = form.data.get("sub_type").get.trim()
    /*    if (descriptionlegth <= 4 || descriptionlegth >= 500) {
      newform = form.withError("description", Messages.get(langObj, ("error.description.minmax")))
    }*/

    val obj = findSubTypeByNameForEdit(sub_type, sub_type_id)
    if (obj.size > 0) {
      newform = form.withError("sub_type", Messages.get(langObj, "sub_type.alreadyexist"))
    }

    if (newform != null) {
      newform
    } else {
      form
    }
  }
}