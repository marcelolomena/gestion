package services

import play.api.Play.current
import play.api.db.DB
import anorm.SqlParser._
import models._
import anorm._
//import com.typesafe.plugin._
import org.apache.commons.lang3.StringUtils
import play.api.data.Form
import play.i18n._
import play.mvc._
object ProgramTypeService extends CustomColumns {
  val langObj = new Lang(Lang.forCode("es-ES"))
  /**
   * *
   *
   */
  def findAllProgramTypeList(pagNo: String, recordOnPage: String): Seq[ProgramTypeMaster] = {
    val rec = Integer.parseInt(pagNo.toInt.toString) * Integer.parseInt(recordOnPage.toInt.toString)
    val start = rec - Integer.parseInt(recordOnPage.toInt.toString)
    val end = Integer.parseInt(recordOnPage.toInt.toString)
    var sqlString = ""

    //sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY id) AS Row, * FROM art_program_type AS tbl )as ss WHERE  (Row >=" + (start + 1) + " AND Row <= " + (start + end) + ")"
    //  sqlString = "SELECT * from art_program_type where is_deleted = 0 AND  ( id BETWEEN  " + (start + 1) + " AND  " + (start + end) + ")"
    sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY id) AS Row, * FROM art_program_type AS tbl)as ss WHERE  (Row >=" + (start + 1) + " AND Row <= " + (start + end) + ")"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ProgramTypeMaster.programtypes *)

    }
  }

  /*  def findAllProgramTypes(pagNo: String, recordOnPage: String): Seq[ProgramTypeMaster] = {
    val rec = Integer.parseInt(pagNo.toInt.toString) * Integer.parseInt(recordOnPage.toInt.toString)
    val start = rec - Integer.parseInt(recordOnPage.toInt.toString)
    val end = Integer.parseInt(recordOnPage.toInt.toString)
    var sqlString = ""

    //sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY id) AS Row, * FROM art_program_type AS tbl )as ss WHERE  (Row >=" + (start + 1) + " AND Row <= " + (start + end) + ")"
    sqlString = "SELECT * from art_program_type where is_deleted = 0 AND  ( id BETWEEN  " + (start + 1) + " AND  " + (start + end) + ")"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ProgramTypeMaster.programtypes *)

    }
  }*/
  /*  def subTypeCount(): Long = {
    DB.withConnection { implicit connection =>
      var sqlString = ""
      sqlString = "SELECT count(*) from art_program_sub_type "
      val count: Long = SQL(sqlString).as(scalar[Long].single)
      count
    }
  }*/

  def saveProgramType(obj: ProgramTypeMaster): Long = {

    // println(obj)
    DB.withConnection { implicit connection =>
      val lastsaved = SQL(
        """
          insert into art_program_type ( program_type, description, user_id, creation_date, is_deleted) values (
           {program_type}, {description}, {user_id}, {creation_date}, {is_deleted})
          """).on(

          'program_type -> obj.program_type.trim(),
          'description -> obj.description,
          'user_id -> obj.user_id,
          'creation_date -> obj.creation_date,
          'is_deleted -> obj.is_deleted).executeInsert(scalar[Long].singleOpt)
      lastsaved.last
    }
  }
  def updateProgramType(obj: ProgramTypeMaster): Int = {
    DB.withConnection { implicit connection =>
      SQL(""" update  art_program_type set program_type={program_type}, description={description}, user_id={user_id}, creation_date={creation_date} , is_deleted={is_deleted} where id={id}""")
        .on(
          'id -> obj.id.get,
          'program_type -> obj.program_type.trim(),
          'description -> obj.description,
          'user_id -> obj.user_id,
          'creation_date -> obj.creation_date,
          'is_deleted -> obj.is_deleted).executeUpdate()
    }
  }

  def findProgramTypeById(id: String): Option[ProgramTypeMaster] = {
    var sql = ""
    if (id != "") {
      sql = "select t.* from art_program_type t where t.id='" + id + "'"

      DB.withConnection { implicit connection =>

        val result = SQL(sql).as(ProgramTypeMaster.programtypes.singleOpt)
        result
      }
    } else {
      null
    }
  }
  /**
   * delete sub type
   */

  def changeProgramTypeStatus(id: String, is_deleted: Int, uid: Int): Int = {
    DB.withConnection { implicit connection =>
      SQL(""" update  art_program_type set  user_id={user_id}, creation_date={creation_date} , is_deleted={is_deleted} where id={id}""")
        .on(
          'id -> id,
          'user_id -> uid,
          'creation_date -> new java.util.Date,
          'is_deleted -> is_deleted).executeUpdate()
    }
  }

  /**
   * All program type list
   */
  def findAllWorkflowStatus(): Seq[ProgramWorkflowStatus] = {
    var sqlString = ""

    sqlString = "SELECT * from art_program_workflow_status"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ProgramWorkflowStatus.programWorkflowStatus *)
    }
  }
  
  def findWorkflowByProgramId(id: String): Option[ProgramWorkflowStatus] = {
    var sqlString = ""

    sqlString = "SELECT b.* FROM art_program a, art_program_workflow_status b WhERE a.work_flow_status=b.id AND a.program_id=" + id
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ProgramWorkflowStatus.programWorkflowStatus.singleOpt)
    }
  }    
  
  /**
   * All program type list
   */
  def findAllProgramType(): Seq[ProgramTypeMaster] = {
    var sqlString = ""

    sqlString = "SELECT * from art_program_type where is_deleted = 0 "
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ProgramTypeMaster.programtypes *)
    }
  }

  /**
   * Only active program type
   *
   */
  def findAllProgramTypeList(): Seq[ProgramTypeMaster] = {
    var sqlString = ""

    sqlString = "SELECT * from art_program_type where is_deleted = 0"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ProgramTypeMaster.programtypes *)
    }
  }

  def programTypeCount(): Long = {
    DB.withConnection { implicit connection =>
      var sqlString = ""
      sqlString = "SELECT count(*) from art_program_type"
      val count: Long = SQL(sqlString).as(scalar[Long].single)
      count
    }
  }

  def findProgramTypeByName(program_type: String): Seq[ProgramTypeCase] = {
    var sql = "select t.* from art_program_type t where t.is_deleted = 0  AND  t.program_type='" + program_type + "'"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(ProgramTypeCase.programType *)
      result
    }
  }
  def findProgramTypeByNameForEdit(program_type: String, program_type_id: String): Seq[ProgramTypeCase] = {
    var sql = "select d.* from art_program_type d where d.is_deleted = 0  AND d.program_type='" + program_type.trim() + "' AND d.id <>'" + program_type_id + "'"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(ProgramTypeCase.programType *)
      result
    }
  }
  def validateProgramTypeForm(form: Form[ProgramTypeCase]): Form[ProgramTypeCase] = {
    var newform: Form[ProgramTypeCase] = null
    val program_type_id = form.data.get("id").get.trim()
    // val descriptionlegth = form.data.get("description").get.trim().length()
    val program_type = form.data.get("program_type").get.trim()
    /*    if (descriptionlegth <= 4 || descriptionlegth >= 500) {
      newform = form.withError("description", Messages.get(langObj, ("error.description.minmax")))
    }*/

    val obj = findProgramTypeByNameForEdit(program_type, program_type_id)
    if (obj.size > 0) {
      newform = form.withError("program_type", Messages.get(langObj, "program_type.alreadyexist"))
    }

    if (newform != null) {
      newform
    } else {
      form
    }
  }
}