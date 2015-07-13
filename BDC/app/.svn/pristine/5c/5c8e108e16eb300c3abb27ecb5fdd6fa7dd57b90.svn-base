package services

import play.api.Play.current
import play.api.db.DB;
import anorm.SqlParser._
import models._
import anorm._
import com.typesafe.plugin._
import org.apache.commons.lang3.StringUtils
import play.api.data.Form
import play.i18n._
import play.mvc._

object UserRoleService extends CustomColumns {

  val langObj = new Lang(Lang.forCode("es-ES"))

  def findUserRoleList(pagNo: String, recordOnPage: String): Seq[UserRoleMaster] = {
    val rec = Integer.parseInt(pagNo.toInt.toString) * Integer.parseInt(recordOnPage.toInt.toString)
    val start = rec - Integer.parseInt(recordOnPage.toInt.toString)
    val end = Integer.parseInt(recordOnPage.toInt.toString)
    var sqlString = ""
    //sqlString = "SELECT * from art_user_role where is_deleted=0 and ( rId BETWEEN  " + ( start  + 1 ) + " AND  "+(start + end)+")"
    //sqlString = "SELECT * from art_user_role limit " + start + "," + end
    sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY rId) AS Row, * FROM art_user_role AS tbl)as ss WHERE  (Row >=" + (start + 1) + " AND Row <= " + (start + end) + ")"
    //println(sqlString)
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(UserRoles.userRoleMaster *)
    }
  }

  def findAllUserRoles(): Seq[UserRoleMaster] = {
    var sqlString = ""
    sqlString = "SELECT * from art_user_role where is_deleted = 0"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(UserRoles.userRoleMaster *)
    }
  }

  def findAllUserRolesCount(): Long = {
    var sqlString = ""
    sqlString = "SELECT count(*) from art_user_role"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(scalar[Long].single)
    }
  }

  def saveUserRole(obj: UserRoleMaster): Long = {
    DB.withConnection { implicit connection =>
      val lastsaved = SQL("""insert into art_user_role ( role, description, created_by, updation_date, is_deleted) values (
         {role}, {description}, {created_by}, {updation_date}, {is_deleted}) """).on(
        'role -> obj.role.trim(),
        'description -> obj.description,
        'created_by -> obj.created_by,
        'updation_date -> obj.updation_date,
        'is_deleted -> obj.is_deleted).executeInsert(scalar[Long].singleOpt)
      lastsaved.last
    }
  }

  def findUserRoleById(rId: String) = {
    var sql = ""
    if (rId != "") {
      sql = "select t.* from art_user_role t where t.rId='" + rId + "'"
      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(UserRoles.userRoleMaster.singleOpt)
        result
      }
    } else {
      null
    }
  }

  def updateUserRole(obj: UserRoleMaster): Int = {
    DB.withConnection { implicit connection =>
      SQL(""" update  art_user_role  set role={role}, description={description}, created_by={created_by}, updation_date={updation_date} , is_deleted={is_deleted} where rId={rId}""").on('rId -> obj.rId.get,
        'role -> obj.role.trim(),
        'description -> obj.description,
        'created_by -> obj.created_by,
        'updation_date -> obj.updation_date,
        'is_deleted -> obj.is_deleted).executeUpdate()
    }
  }
  def changeUserRoleStatus(rId: String, is_deleted: Int, uid: Int): Int = {
    DB.withConnection { implicit connection =>
      SQL(""" update  art_user_role  set  created_by={created_by}, updation_date={updation_date} , is_deleted={is_deleted} where rId={rId}""").on('rId -> rId,
        'created_by -> uid,
        'updation_date -> new java.util.Date,
        'is_deleted -> is_deleted).executeUpdate()
    }
  }

  def findUserRoleByRoleString(role: String) = {
    var sql = ""
    if (!role.isEmpty()) {
      sql = "select t.* from art_user_role t where t.role='" + role + "' AND t.is_deleted=0"
      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(UserRoles.userRoleMaster.singleOpt)
        result
      }
    } else {
      null
    }
  }

  def findUserRoleByRoleStringForUpdate(role: String, rId: String) = {
    var sql = ""
    if ((!role.isEmpty()) && (!rId.isEmpty())) {
      sql = "select t.* from art_user_role t where t.role='" + role + "' and t.rId !='" + rId + "'"
      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(UserRoles.userRoleMaster *)
        result
      }
    } else {
      null
    }
  }

  def validateUserRoleForm(form: Form[UserRoleChild]): Form[UserRoleChild] = {
    var newform: Form[UserRoleChild] = null
    val role = form.data.get("role").get.trim()
    val obj = findUserRoleByRoleString(role)
    if (!obj.isEmpty && role.equalsIgnoreCase(obj.get.role.trim())) {
      newform = form.withError("role", "Role Already Exists.")
    }
    val descriptionlegth = form.data.get("description").get.trim().length()
    if (descriptionlegth <= 4 || descriptionlegth >= 500) {
      newform = form.withError("description", Messages.get(langObj, ("error.description.minmax")))
    }
    if (newform != null) {
      newform
    } else {
      form
    }
  }

  def validateUserRoleFormForUpdate(form: Form[UserRoleChild]): Form[UserRoleChild] = {
    var newform: Form[UserRoleChild] = null
    val role = form.data.get("role").get.trim()
    val rId = form.data.get("rId").get.trim()
    val obj = findUserRoleByRoleStringForUpdate(role, rId)
    if (obj.size > 0) {
      newform = form.withError("role", Messages.get(langObj, "role.alreadyexist"))
    }
    val descriptionlegth = form.data.get("description").get.trim().length()
    if (descriptionlegth < 4 || descriptionlegth > 500) {
      newform = form.withError("description", Messages.get(langObj, ("error.description.minmax")))
    }
    if (newform != null) {
      newform
    } else {
      form
    }
  }
}