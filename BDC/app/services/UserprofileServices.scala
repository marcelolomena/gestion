package services

import controllers.UserProfile
import models.UserProfiles
import models.UserAvailability
import models.UserConsumo
import play.api.Play.current
import play.api.db.DB
import anorm.SqlParser._
import anorm._
//import com.typesafe.plugin._
import com.sun.xml.internal.ws.wsdl.writer.document.Import
import java.util._

object UserProfileServices {

  //art_program_stage  for the time

  def findAllUserProfileList(pagNo: String, recordOnPage: String): Seq[UserProfiles] = {
    val rec = Integer.parseInt(pagNo.toInt.toString) * Integer.parseInt(recordOnPage.toInt.toString)
    val start = rec - Integer.parseInt(recordOnPage.toInt.toString)
    val end = Integer.parseInt(recordOnPage.toInt.toString)
    var sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY id) AS Row, * FROM art_user_profile AS tbl where is_deleted = 0)as ss WHERE  (Row >=" + (start + 1) + " AND Row <= " + (start + end) + ")"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(UserProfiles.userprofile *)
    }
  }

  def userProfileCount(): Long = {
    var sqlString = "SELECT COUNT(*) FROM  art_user_profile WHERE is_deleted = 0"
    DB.withConnection { implicit connection =>
      val count: Long = SQL(sqlString).as(scalar[Long].single)
      count
    }
  }
  def isUserProfileCode(code: String): Boolean = {
    if (!code.trim().isEmpty()) {
      var sql = "select count(*) from art_user_profile  where is_deleted = 0  AND profile_code='" + code.trim() + "'"
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

  def saveUserProfile(obj: UserProfiles): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          insert into art_user_profile (profile_code,profile_name,description,creation_date,is_deleted) values (
         {profile_code},{profile_name},{description},{creation_date},{is_deleted})
          """).on(
          'profile_code -> obj.profile_code.trim(),
          'profile_name -> obj.profile_name.trim(),
          'description -> obj.description,
          'creation_date -> new Date(),
          'is_deleted -> obj.is_deleted).executeUpdate()
    }
  }

  def updateUserProfile(obj: UserProfiles): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          UPDATE  art_user_profile SET profile_code= {profile_code},profile_name={profile_name},description={description},updated_by={updated_by},updation_date={updation_date},is_deleted={is_deleted} where id={id}  """).on(
          'id -> obj.id.get,
          'profile_code -> obj.profile_code.trim(),
          'profile_name -> obj.profile_name.trim(),
          'description -> obj.description,
          'updated_by -> obj.updated_by.get,
          'updation_date -> new Date(),
          'is_deleted -> obj.is_deleted).executeUpdate()
    }
  }
  def findUserProfileById(profile_id: String): Option[UserProfiles] = {
    if (!profile_id.isEmpty()) {
      var sqlString = "select * from art_user_profile where is_deleted = 0 AND id =" + profile_id
      DB.withConnection { implicit connection =>
        val result = SQL(sqlString).as(UserProfiles.userprofile.singleOpt)
        result
      }
    } else {
      null
    }
  }

  def deleteUserProfile(profile_id: String) {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "update  art_user_profile set is_deleted = 1  where id='" + profile_id + "'").on(
          'id -> profile_id).executeUpdate()
    }
  }

  def findActiveUserProfiles() = {
    var sqlString = "SELECT * FROM  art_user_profile  where is_deleted = 0"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(UserProfiles.userprofile *)
    }
  }

  def findAvailability(uid: Integer): Seq[UserConsumo] = {
    DB.withConnection { implicit connection =>
      SQL("EXEC art.disponibilidad  {uid}").on(
        'uid -> uid.toInt).executeQuery().as(UserConsumo.userconsumo *)
    }
  }
}