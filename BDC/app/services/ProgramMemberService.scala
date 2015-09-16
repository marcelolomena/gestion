package services

import play.api.Play.current
import play.api.db.DB
import anorm.SqlParser._
import models._
import anorm._
import java.util.Date
//import com.typesafe.plugin._
import org.apache.commons.lang3.StringUtils
import SqlParser._
import scala.util.control.Exception._
import play.api.data.Form
import models.UserRoles

object ProgramMemberService extends CustomColumns {

  /*
  def insertProgramMemberDetails(pm: ProgramMembers): Long = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        """
          insert into art_program_members (
             program_id,role_id, member_id, is_active 
          ) 
          values(
					 {program_id},{role_id}, {memeber_id}, {is_active}
          )
          """).on(
          'program_id -> pm.program_id,
          'memeber_id -> pm.member_id,
          'role_id -> pm.role_id,
          'is_active -> pm.is_active).executeInsert(scalar[Long].singleOpt)

      result.last

    }
  }
  */
  
  def insertProgramMemberDetails(pm: ProgramMembers) = {
    DB.withConnection { implicit connection =>
      /*
      println("program_id:" +pm.program_id)
      println("role_id:" +pm.role_id)
      println("member_id:" +pm.member_id)
      println("is_active:" +pm.is_active)
      println("pdata:" +pm.pData)      
      */
      SQL("EXEC art.save_member_capacity {program_id},{role_id},{member_id},{is_active},{pdata}").on(
        'program_id -> pm.program_id, 'role_id -> pm.role_id,'member_id -> pm.member_id,'is_active -> pm.is_active,'pdata ->pm.pData).executeQuery().as(scalar[Int].single)
    }
  }  

  def updateProgramMemberDetails(obj: ProgramMembers): Int = {

    DB.withConnection { implicit connection =>
      SQL(""" update  art_program_members 
					set 
					program_id={program_id},role_id={role_id},member_id={member_id},is_active={is_active} where id={id}  """).on(
        'id -> obj.id,
        'program_id -> obj.program_id,
        'role_id -> obj.role_id,
        'member_id -> obj.member_id,
        'is_active -> obj.is_active).executeUpdate()
    }
  }

  def updateExternalProgramMemberDetails(obj: ProgramMembersExternal): Int = {

    DB.withConnection { implicit connection =>
      SQL(""" update  art_program_members_external 
          set 
          is_deleted={is_deleted} where id={id}  """).on(
        'id -> obj.id,
        'is_deleted -> obj.is_deleted).executeUpdate()
    }
  }

  def findAllProgramMember(program_id: String): Seq[ProgramMembers] = {
    var sqlString = ""
    //sqlString = "SELECT  * from art_program_members where program_id=" + program_id
    sqlString = "SELECT id,program_id,role_id,member_id,is_active, 'None' pData from art_program_members where program_id=" + program_id
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ProgramMembers.program_members *)
    }
  }

  def findActiveProgramMember(program_id: String): Seq[ProgramInternalMembers] = {
    var sqlString = "EXEC art.asignacion_interna {pId}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('pId -> program_id.toInt).executeQuery() as (ProgramInternalMembers.program_internal_members *)
    }
  }

  def findProgramMemberForProgram(program_id: String): Seq[Users] = {
    var sqlString = ""
    sqlString = "Select * from art_user where uid IN (SELECT  member_id from art_program_members where is_active=0 AND program_id=" + program_id + ") order by first_name asc";
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(Users.user *)
    }
  }

  def findProjectManagerForProgram(program_id: String): Seq[Users] = {
    var sqlString = ""
    sqlString = "Select * from art_user where uid IN (SELECT  member_id from art_program_members where is_active=0 AND program_id=" + program_id + " AND (role_id=6 OR role_id=28)) order by first_name asc";
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(Users.user *)
    }
  }

  def findAllProgramMembers(program_id: String): Seq[Users] = {
    var sqlString = ""
    sqlString = "Select * from art_user where uid IN (SELECT  member_id from art_program_members where is_active=0 AND program_id=" + program_id + ") order by first_name asc";
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(Users.user *)
    }
  }

  def findProgramMembersForRole(program_id: String, role_id: String): Seq[Users] = {
    var sqlString = ""
    sqlString = "Select * from art_user where uid IN (SELECT  member_id from art_program_members where is_active=0 AND program_id=" + program_id + " AND role_id=" + role_id + ") order by first_name asc";
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(Users.user *)
    }
  }

  def findResponsibleProgramMember(program_id: String, role_id: String): Seq[ProgramMembers] = {
    var sqlString = ""
    sqlString = "SELECT  * from art_program_members where program_id=" + program_id + " AND role_id=" + role_id
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ProgramMembers.program_members *)
    }
  }

  def findProgramManagers(role_id: String): Seq[ProgramMembers] = {
    var sqlString = ""
    sqlString = "SELECT id,program_id,role_id,member_id,is_active, 'None' pData from art_program_members where role_id=" + role_id + " AND is_active=0"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ProgramMembers.program_members *)
    }
  }

  def checkProgramMember(member_id: String, role_id: String, program_id: String): Boolean = {
    var sqlString = ""
    var isValid = true
    sqlString = "SELECT  * from art_program_members where is_active=0 AND program_id=" + program_id + " AND member_id=" + member_id + " AND role_id=" + role_id
    println(sqlString)
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(ProgramMembersOld.program_members_old *)
      if (result.size > 0) {
        isValid = false
      }
    }
    isValid
  }

  def findProgramMemberDetails(id: String) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "SELECT  id,program_id,role_id,member_id,is_active, 'None' pData from art_program_members where id = {id}  AND is_active= 0").on(
          'id -> id).as(
            ProgramMembers.program_members.singleOpt)
      result
    }
  }

  def findExternalProgramMemberDetails(id: String) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "SELECT  * from art_program_members_external where id = {id} ").on(
          'id -> id).as(
            ProgramMembersExternal.programMembersExternal.singleOpt)
      result
    }
  }
  def validateProgramMember(prorgam_member: Form[ProgramMembers]) = {

    var newform: play.api.data.Form[models.ProgramMembers] = null
    val role = prorgam_member.data.get("role_id").get
    val member_id = prorgam_member.data.get("member_id").get
    val program_id = prorgam_member.data.get("program_id").get
    if (checkProgramMember(member_id, role, program_id) == false) {
      newform = prorgam_member.withError("role_id", "Please select another role for the same user.")
      newform.fill(prorgam_member.get)
      newform
    } else {
      prorgam_member
    }
  }

  /**
   * User Profile role mapping service...
   */
  def findUserProfileMappingRoles(user_id: String): Seq[UserProfileMapping] = {
    val sqlString = "SELECT  * from art_user_profile_mapping where user_id=" + user_id

    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(UserProfileMapping.userProfileMapping *)
      result
    }
  }

  def findUserRoles(user_id: String): Seq[UserRole] = {
    val sqlString = "SELECT * from art_user_role where is_deleted=0 AND rId NOT IN (SELECT  user_role from art_user_profile_mapping where user_id=" + user_id + ")"

    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(UserRole.userRole *)
      result
    }
  }

  def insertUserProfileMapping(user_profile: UserProfileMapping): Long = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        """
          insert into art_user_profile_mapping (
             user_id, user_role
          ) 
          values(
           {user_id}, {user_role}
          )
          """).on(
          'user_id -> user_profile.user_id,
          'user_role -> user_profile.user_role).executeInsert(scalar[Long].singleOpt)

      var dm = false
      var pmo = false
      var pmr = false
      var pm = false

      val userProfileRoles = ProgramMemberService.findUserProfileMappingRoles(user_profile.user_id.toString())
      for (u <- userProfileRoles) {
        if (u.user_role == 7) {
          dm = true
        }
        if (u.user_role == 8) {
          pmo = true
        }
        if (u.user_role == 9) {
          pmr = true
        }
        if (u.user_role == 4 || u.user_role == 5) {
          pm = true
        }
      }
      if (dm) {
        UserService.updateUserRole(user_profile.user_id.toString(), 7, "dm")

      } else if (pmo) {
        UserService.updateUserRole(user_profile.user_id.toString(), 3, "pmo")

      } else if (pm) {
        UserService.updateUserRole(user_profile.user_id.toString(), 6, "pm")

      } else if (pmr) {
        UserService.updateUserRole(user_profile.user_id.toString(), 5, "pmr")

      }
      result.last

    }
  }
  def findUserProfileDetails(id: String): Option[UserProfileMapping] = {
    val sqlString = "SELECT  * from art_user_profile_mapping where id=" + id

    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(UserProfileMapping.userProfileMapping.singleOpt)
      result
    }
  }

  def deleteUserProfileMapping(id: String): Int = {
    DB.withConnection { implicit connection =>
      SQL("Delete  art_user_profile_mapping where id=" + id).executeUpdate()
    }
  }

  def findProgramUserAvailability(pid: String,uid: String): Seq[UserAvailibity] = {
    DB.withConnection { implicit connection =>
      SQL("EXEC art.list_member_capacity  {pId},{uid}").on(
        'pId -> pid.toInt,'uid -> uid.toInt).executeQuery().as(UserAvailibity.userAvailibity *)
    }
  } 
  
  def listMemberAvailability(mid: Int): Seq[MemberCapacity] = {
    DB.withConnection { implicit connection =>
      SQL("EXEC art.list_member_capacity_acum {mid}").on(
        'mid -> mid.toInt).executeQuery().as(MemberCapacity.memberCapacity *)
    }
  }  
 
  def updateMemberAvailability(id: String,porcentaje: String): Int = {
    DB.withConnection { implicit connection =>
      SQL("EXEC art.update_member_capacity {id},{porcentaje}").on(
        'id -> id.toInt,'porcentaje -> porcentaje.toInt).executeQuery().as(scalar[Int].single)
    }
  } 
  
}