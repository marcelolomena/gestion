package services;
import play.api.Play.current
import play.api.db.DB
import anorm.SqlParser._
import models._
import anorm._
import java.util.Date
//import com.typesafe.plugin._
import org.apache.commons.lang3.StringUtils
import java.util.UUID
import play.api.data.Form
import play.i18n._

object UserService extends CustomColumns {

  val langObj = new Lang(Lang.forCode("es-ES"))
  /**
   * get all users..
   */
  def findAllUsers(): Seq[Users] = {
    DB.withConnection { implicit connection =>
      SQL("select * from art_user order by first_name asc").as(Users.user *)
    }

  }

  def findAllOfficeUsers(): Seq[Office] = {
    DB.withConnection { implicit connection =>
      SQL("select * from art_user where isadmin <> 1 order by first_name asc").as(Users.office *)
    }
  }

  def findAllAdminUsers(): Seq[Users] = {
    DB.withConnection { implicit connection =>
      SQL("select * from art_user where isadmin=0 order by first_name asc").as(Users.user *)
    }
  }

  def findAllDemandManager(): Seq[Users] = {
    DB.withConnection { implicit connection =>
      //SQL("select * from art_user where user_profile LIKE 'dm' OR user_profile LIKE 'prm' order by first_name asc").as(Users.user *)
      SQL("select * from art_user where CAST(user_profile AS VARCHAR) != 'bu' order by first_name asc").as(Users.user *)
    }

  }

  def findAllUserList(): Seq[Users] = {
		DB.withConnection { implicit connection =>
			SQL("SELECT * FROM art_user order by first_name asc").as(Users.user *)
		}

	}
  def findUsers(): Seq[Users] = {
    DB.withConnection { implicit connection =>
      SQL("select * from art_user where isadmin <> 1  order by first_name asc").as(Users.user *)
    }

  }

  def findAllUsersForSubTask(id: String): Seq[Users] = {
    val sql = "select * from art_user where isadmin <> 1 and uid NOT IN (select DISTINCT(user_id) from art_sub_task_allocation where task_id =" + id + " ) order by first_name asc "
    //println(sql);
    DB.withConnection { implicit connection =>
      SQL(sql).as(Users.user *)
    }

  }

  /**
   * get all user role
   */
  def findUserRoles(): Seq[UserRole] = {
    DB.withConnection { implicit connection =>
      SQL("SELECT  * FROM art_user_role").as(UserRole.userRole *)
    }
  }

  /**
   * save timesheet
   */
  def addTimesheet(timesheet: Timesheet): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
        insert into art_timesheet(id, task_id, user_id,pId,notes,task_for_date,hours)
       ) values (
        {id}, {task_id},{user_id},{pId},{notes},{task_for_date},
        {hours})
        """).on(
          'tmid -> timesheet.Id,
          'team_id -> timesheet.task_id,
          'user_id -> timesheet.user_id,
          'pId -> timesheet.pId,
          'notes -> timesheet.notes,
          'task_for_date -> timesheet.task_for_date,
          'hours -> timesheet.hours).executeUpdate()

    }
  }

  /**
   * save Forgot Password
   */
  def saveForgotPasswordDetails(obj: ForgotPasswordMaster): Option[Long] = {
    DB.withConnection { implicit connection =>
      val result : Option[Long] = SQL(
        """
					insert into art_forgot_password_master(email,user_name,verification_code,added_date,updated_date,isverify)
					values({email},{user_name},{verification_code},{added_date},{updated_date},{isverify}
					)
					""").on(
          'email -> obj.email,
          'user_name -> obj.user_name,
          'verification_code -> obj.verification_code,
          'added_date -> obj.creation_date.get,
          'updated_date -> obj.creation_date.get,
          'isverify -> obj.isverify.get).executeInsert()
      result
    }
  }

  /**
   * get Email from User Name Code if already exist or not
   */

  def getEmailByVerificationId(id: String): String = {
    DB.withConnection { implicit connection =>
      val sql = "select * from art_forgot_password_master where verification_code='" + id + "' and isverify= 0 "
      println(sql)
      val emailObj = SQL(sql).as(EmailMaster.emailMaster.singleOpt)
      if (!emailObj.isEmpty) {
        emailObj.get.email
      } else {
        "notEmail"
      }
    }
  }

  /**
   * get Email from verification Code if already exist or not
   */

  def getEmailByUseName(userName: String): String = {
    var email: String = "notEmail"
    val count: Long = getEmailCountByUseName(userName)
    if (count > 0) {
      DB.withConnection { implicit connection =>
        email = SQL("select email from art_user where uname='" + userName + "'").as(scalar[String].single)
        email;
      }
    } else {
      email;
    }
  }

  /**
   * get Email from verification Code if already exist or not
   */

  def getEmailCountByUseName(userName: String): Long = {
    DB.withConnection { implicit connection =>
      val count: Long = SQL("select count(*) from art_user where uname='" + userName + "'").as(scalar[Long].single)
      count;
    }
  }

  /**
   * get Email from verification Code if already exist or not
   */

  def checkEmailAlreadySent(userName: String): Long = {
    DB.withConnection { implicit connection =>
      val result: Long = SQL("select count(*) from art_forgot_password_master where user_name='" + userName + "' and isverify= 0 ").as(scalar[Long].single)
      result;
    }
  }

  /**
   * update team member information
   */
  def updateTimesheet(timesheet: Timesheet): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
         update art_timesheet
          set 
          notes =  {notes},
          hours={hours}
          where tmid = {tmid}
          """).on(
          'tmid -> timesheet.Id,
          'notes -> timesheet.notes,
          'hours -> timesheet.hours).executeUpdate()

    }
  }

  /**
   * update Password Reset information
   */
  def updateUserPassword(password_master: PasswordMaster): Int = {
    val encrypted_password: String = org.mindrot.jbcrypt.BCrypt.hashpw(password_master.confirm_password, org.mindrot.jbcrypt.BCrypt.gensalt());
    DB.withConnection { implicit connection =>
      SQL(
        """
			update art_user
			set password={password}
			where uId = {uId} """).on('uId -> password_master.id,
          'password -> encrypted_password).executeUpdate()

    }
  }

  /**
   * update profile image
   */
  def updateUserProfileImage(profile_image: String, id: String): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
			update art_user
			set profile_image = {profile_image}
			where uId = {uId} """).on('uId -> id,
          'profile_image -> profile_image).executeUpdate()
    }
  }

  def updateUserRole(user_id: String, isadmin: Integer, user_profile: String): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
      update art_user
      set isadmin = {isadmin},user_profile={user_profile}
      where uid = {uId} """).on('uId -> user_id,
          'isadmin -> isadmin,
          'user_profile -> user_profile).executeUpdate()
    }
  }

  /**
   * get all users..which is not in the list
   */
  /* def findUserNameById(id: String) = {
    DB.withConnection { implicit connection =>
     val sqlSting = "select first from art_user where uid=" + id+" order by added_date desc"
       DB.withConnection { implicit connection =>
        val result =  SQL(sqlSting).on('uid -> id).as(Users.user.singleOpt)
        result
      }
    }
  }*/

  /**
   * get all users..which is not in the list
   */
  def findUsers(teamId: String): Seq[Users] = {
    DB.withConnection { implicit connection =>
      SQL("select * from art_user where isadmin=0 AND  uid NOT IN ( SELECT user_id FROM art_team_member where team_id=" + teamId + ") order by first_name asc").as(Users.user *)
    }

  }

  /**
   * get Project manager
   *
   */
  def findPM(teamId: String): Seq[Users] = {
    DB.withConnection { implicit connection =>
      SQL("select * from art_user where isadmin=2 AND  uid NOT IN ( SELECT user_id FROM art_team_member where team_id=" + teamId + ") order by first_name asc").as(Users.user *)
    }

  }

  /**
   *  get all users
   */
  def findAllUsers(pagNo: String, recordOnPage: String): Seq[Users] = {
    val rec = Integer.parseInt(pagNo.toInt.toString) * Integer.parseInt(recordOnPage.toInt.toString);
    val start = rec - Integer.parseInt(recordOnPage.toInt.toString);
    val end = Integer.parseInt(recordOnPage.toInt.toString);
    DB.withConnection { implicit connection =>
      val sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY id) AS Row, * FROM art_user AS tbl where isadmin=0 )as ss WHERE  (Row >=" + (start + 1) + " AND Row <= " + (start + end) + ")"
      SQL(sqlString).as(Users.user *)
    }
  }

  /**
   *  get all users
   */
  def findAllUsers(pagNo: String, recordOnPage: String, search: String): Seq[Users] = {
    val rec = Integer.parseInt(pagNo.toInt.toString) * Integer.parseInt(recordOnPage.toInt.toString);
    val start = rec - Integer.parseInt(recordOnPage.toInt.toString);
    val end = Integer.parseInt(recordOnPage.toInt.toString);
    DB.withConnection { implicit connection =>
      //isadmin=0 AND 
      SQL("select * from art_user where first_name like '" + search + "%' OR last_name like '" + search + "%' OR email like '" + search + "%' OR rut_number like '" + search + "%' order by added_date desc limit " + start + "," + end).as(Users.user *)
    }
  }

  /**
   * Get total count of record
   */
  def findCount(search: String): Long = {
    DB.withConnection { implicit connection =>
      val count: Long = SQL("select count(*) from art_user where isadmin=0 AND first_name like '" + search + "%' OR last_name like '" + search + "%' OR email like '" + search + "%' OR rut_number like '" + search + "%'  ").as(scalar[Long].single)
      count;
    }
  }

  /**
   * get user details by email
   */
  /*def findUserDetailsByEmail(email: String):Option[Users] = {
	 var user:Option[Users] = null
		val count = checkEmailId(email)
		if (count == 1) {
			 DB.withConnection { implicit connection =>
				user= SQL(
					"select * from art_user where email = {email}").on(
						'email -> email).as(Users.user.singleOpt)
			}
		} 
	 user
	}
	 */

  def updateForgotPasswordFromActivation(verification_code: String): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
					update art_forgot_password_master
					set 
					isverify = 1
					where verification_code = {verification_code}
					""").on('verification_code -> verification_code).executeUpdate()

    }
  }

  def updateForgotPasswordFromEmail(email: String): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
					update art_forgot_password_master
					set 
					isverify = 1
					where email = {email}
					""").on('email -> email).executeUpdate()

    }
  }

  def findUserDetailsByEmail(email: String) = {
    if ("notEmail".equals(email)) {
      null
    } else {
      val count = checkEmailId(email)
      if (count == 1) {
        DB.withConnection { implicit connection =>
          val result = SQL(
            "select * from art_user where email = {email}").on(
              'email -> email).as(
                Users.user.singleOpt)
          result

        }
      } else {
        null
      }
    }

  }

  def findUserDetailsByUname(uname: String) = {
        DB.withConnection { implicit connection =>
          val result = SQL(
            "select * from art_user where email = {uname}").on(
              'uname -> uname).as(
                Users.user.singleOpt)
          result

      
    }

  }
  

  /**
   * get user details by code
   */
  def findUserDetailsByCode(verify_code: String) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_user where verify_code = {verify_code}").on(
          'verify_code -> verify_code).as(
            Users.user.singleOpt)
      result.get.uid
    }
  }

  /**
   * get user details by code
   */
  def findUserDetailsByUsername(username: String) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_user where uname = {username}").on(
          'username -> username).as(
            Users.user.singleOpt)
      result
    }
  }

  /**
   * check username is already exist or not
   */
  def checkUsername(uname: String): Long = {
    DB.withConnection { implicit connection =>
      val Ucount: Long = SQL("select count(*) from art_user where uname='" + uname.trim() + "'").as(scalar[Long].single)
      Ucount;
    }
  }

  def checkUserNameExist(uname: String, uId: String): Long = {
    val sql = "select count(*) from art_user where uname='" + uname + "' and uid<>" + uId
    DB.withConnection { implicit connection =>
      val Ucount: Long = SQL("select count(*) from art_user where uname='" + uname + "' and uid <> " + uId + "").as(scalar[Long].single)
      //println(Ucount);
      Ucount;
    }
  }

  def findAllProjectManagerList(): Seq[Users] = {
    DB.withConnection { implicit connection =>
      SQL("select * from art_user where isadmin=2 order by first_name asc").as(Users.user *)
    }

  }

  def findAllCEOList(): Seq[Users] = {
    DB.withConnection { implicit connection =>
      SQL("select * from art_user where isadmin=3 order by first_name asc").as(Users.user *)
    }

  }

  /**
   * get user details by email
   */
  def findUserDetailsByDepartment(department: String): Seq[Office] = {
    var sql = ""
    if (StringUtils.isNotEmpty(department)) {
      sql = "select * from art_user where department =" + department + " order by first_name asc"
    } else {
      sql = "select * from art_user  order by first_name asc"
    }
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(Users.office *)
      result
    }
  }

  def findUserPersonalDetailsByDepartment(department: String): Seq[Users] = {
    var sql = ""
    if (StringUtils.isNotEmpty(department)) {
      sql = "select * from art_user where department =" + department + " order by first_name asc"
    } else {
      sql = "select * from art_user  order by first_name asc"
    }
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(Users.user *)
      result
    }
  }

  def findUserOfficeDetailsByDepartment(department: String): Seq[Office] = {
    var sql = ""
    if (StringUtils.isNotEmpty(department)) {
      sql = "select * from art_user where department =" + department + " order by first_name asc"
    } else {
      sql = "select * from art_user  order by first_name asc"
    }
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(Users.office *)
      result
    }
  }
  /**
   * Skills
   *
   */
  def findAllSkills(): Seq[Skills] = {
    DB.withConnection { implicit connection =>
      SQL("select * from art_user_skills").as(Skills.skill *)
    }

  }

  /**
   * user skills...
   */
  def findUserSkills(): Seq[UserSkills] = {
    DB.withConnection { implicit connection =>
      SQL("select * from art_user_skills").as(UserSkills.uskills *)
    }

  }

  def findAllSkillsByUserId(uId: Integer): Seq[UserSkills] = {
    DB.withConnection { implicit connection =>
      SQL("select  * from art_user_skills_mapping where uId = " + uId).as(UserSkills.uskills *)
    }

  }

  def findUserSkillBySkill(uId: Integer, sId: Integer): Long = {
    DB.withConnection { implicit connection =>
      val isAvailable: Long = SQL("select count(*) from art_user_skills_mapping where sId='" + sId + "' and uId='" + uId + "'").as(scalar[Long].single)
      isAvailable
    }
  }

  def findUserSkillBySkillIdAndUserId(uId: Integer, sId: Integer): Option[UserSkills] = {
    DB.withConnection { implicit connection =>
      val obj = SQL("select * from art_user_skills_mapping where sId='" + sId + "' and uId='" + uId + "'").as(UserSkills.uskills.singleOpt)
      obj
    }
  }

  def deleteSkill(uId: String, sId: String) = {
    DB.withConnection { implicit connection =>
      SQL("Delete from art_user_skills_mapping where sId='" + sId + "' and uId='" + uId + "'").executeUpdate()
    }
  }

  def findSkillBySkillId(sId: Integer) = {
    DB.withConnection { implicit connection =>
      SQL("select * from art_user_skills where skill_id = " + sId).as(Skills.skill.singleOpt)
    }

  }

  /**
   * check email is already exist or not
   */

  def checkEmailId(email: String): Long = {
    DB.withConnection { implicit connection =>
      val Ucount: Long = SQL("select count(*) from art_user where email='" + email + "'").as(scalar[Long].single)
      Ucount;
    }
  }

  def checkRUT(rut: String): Long = {
    DB.withConnection { implicit connection =>
      val Ucount: Long = SQL("select count(*) from art_user where rut_number='" + rut + "'").as(scalar[Long].single)
      Ucount;
    }
  }

  /**
   * Normal User
   */
  def findUserProjectsForUser(uId: Integer): Seq[Project] = {
    val sqlSting = "select * from art_project_master where pId IN (select pId from art_user_project_mapping where uId=" + uId + " and show_project=1) order by pId desc"
    DB.withConnection { implicit connection =>
      SQL(sqlSting).as(Project.project *)
    }
  }

  def findUserProjectsForUserProgram(uId: String, program_id: String): Seq[Project] = {
    if (StringUtils.isNotBlank(program_id) && StringUtils.isNotBlank(uId)) {
      val sqlSting = "select * from art_project_master where program=" + program_id + " and pId IN (select pId from art_user_project_mapping where uId=" + uId + " and show_project=1) order by pId desc"
      DB.withConnection { implicit connection =>
        SQL(sqlSting).as(Project.project *)
      }
    } else {
      val projects: Seq[Project] = null
      projects
    }
  }
  def findUserProjectsForProgram(program_id: String): Seq[Project] = {
    if (StringUtils.isNotBlank(program_id)) {
      val sqlSting = "select * from art_project_master where program=" + program_id + ""
      DB.withConnection { implicit connection =>
        SQL(sqlSting).as(Project.project *)
      }
    } else {
      val projects: Seq[Project] = null
      projects
    }
  }

  def saveUserSetting(user: UserSetting): Int = {
    DB.withConnection { implicit connection =>
      SQL("insert into art_user_project_mapping ( uId, pId, show_project ) values ( {uId}, {pId}, {show} )").on('uId -> user.uId, 'pId -> user.pId, 'show -> user.show).executeUpdate()
    }
  }

  def updateUserSetting(user: UserSetting): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
         update art_user_project_mapping
          set 
          show_project = {show}
          where (uId = {uId} and pId = {pId})
          """).on(
          'uId -> user.uId,
          'pId -> user.pId,
          'show -> user.show).executeUpdate()
    }
  }

  def updateProjectForUser(uId: Integer, show: Integer): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
         update art_user_project_mapping
          set 
          show_project = {show_project}
          where uId = {uId}
          """).on('uId -> uId, 'show_project -> show).executeUpdate()

    }
  }

  def deleteUserSettingbyuIdandpId(uId: Integer, pId: Integer) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "Delete from art_user_project_mapping where (uId = {uId} and pId = {pId} )").on(
          'uId -> uId, 'pId -> pId).executeUpdate()
    }
  }
  def checkUserSettingbyuIdandpId(uId: Integer, pId: Integer): Boolean = {
    DB.withConnection { implicit connection =>
      var isExist = false
      val result = SQL(
        "select * from art_user_project_mapping where ( uId = {uId} and pId = {pId} )").on(
          'uId -> uId, 'pId -> pId).as(UserSetting.user *)

      if (result.size == 0) {
        isExist = true
      }

      isExist
    }
  }

  def findUserProjectsByUser(uId: Integer): Seq[Project] = {
    val sqlSting = "select * from art_project_master where  pId IN (select pId from  art_user_project_mapping where uId=" + uId + " ) order by pId desc"
    DB.withConnection { implicit connection =>
      SQL(sqlSting).as(Project.project *)
    }
  }
  def findUserProjects(uId: Integer, pId: Integer) = {
    val sqlSting = "select Distinct(uId),pId from  art_user_project_mapping where uId=" + uId + " AND Id=" + pId
    DB.withConnection { implicit connection =>
      SQL(sqlSting).as(PMSetting.pm.singleOpt)
    }
  }

  def findUserAllProjectsForUser: Long = {
    val sqlSting = "select count(*) from art_user_project_mapping"
    DB.withConnection { implicit connection =>
      val result: Long = SQL(sqlSting).as(scalar[Long].single)
      result
    }
  }

  /**
   * get user details by email
   */
  def findUserDetailsById(uId: Long) = {
    DB.withConnection { implicit connection =>
      val sql = "select * from art_user where uId =" + uId
      val result = SQL(sql).as(Users.user.singleOpt)

      result
    }
  }

  def findUserOfficeDetailsById(uId: Long) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_user where uId = {uId}").on(
          'uId -> uId).as(Users.office.singleOpt)
      result
    }
  }

  def findUser(uId: String) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_user where uId = {uId}").on(
          'uId -> uId).as(
            Users.user.singleOpt)
      result
    }
  }

  def findProjectListForUser(uId: Integer): Seq[Project] = {
    val sqlSting = "select * from art_project_master where pId NOT IN (select pId from  art_user_project_mapping where uId=" + uId + " and show_project=1 ) order by pId desc"
    DB.withConnection { implicit connection =>
      SQL(sqlSting).as(Project.project *)
    }
  }

  def findProjectListForUserAndProgram(uId: Integer, program: String): Seq[Project] = {
    val sqlSting = "select * from art_project_master where is_active = 1 AND (program='" + program + "' and pId IN (select pId from  art_user_project_mapping where uId=" + uId + " and show_project=1 )) OR (program='" + program + "' and project_mode <>'8' AND is_active = 1 ) order by start_date "
    DB.withConnection { implicit connection =>
      SQL(sqlSting).as(Project.project *)
    }
  }

  def findProjectsByUser(uId: Integer): Seq[Project] = {
    val sqlSting = "select * from art_project_master where  pId IN (select pId from  art_user_project_mapping where uId=" + uId + " and show_project=1) order by pId desc"
    //val sqlSting = "select * from art_project_master where  project_manager = " + uId + " order by pId desc"
    //println("Sql String -- " + sqlSting);
    DB.withConnection { implicit connection =>
      SQL(sqlSting).as(Project.project *)
    }
  }

  def insertUser(user: UserMaster): Long = {
    val passwordHash: String = org.mindrot.jbcrypt.BCrypt.hashpw(user.password, org.mindrot.jbcrypt.BCrypt.gensalt());

    val user_role = user.office.isadmin
    val profile = UserProfileServices.findUserProfileById(user_role.toString())
    var uProfile = ""
    if (!profile.isEmpty) {
      uProfile = profile.get.profile_code
    } else {
      uProfile = user.office.user_profile
    }
    DB.withConnection { implicit connection =>
      val result = SQL(
        """
          insert into art_user(uname, password, first_name, last_name, division, gerencia, department,email,
          birth_date,office_number,joining_date, isadmin, isverify ,verify_code, verify_date , status , added_date,
          rut_number,rate_hour, contact_number,user_type,work_hours, bonus_app,user_profile) values (
           {uname},{password},{first_name},{last_name},{division},{gerencia},{department},{email},
          {birth_date},{office_number},{joining_date},
          {isadmin},{isverify},{verify_code},{verify_date},{status},{added_date} , 
          {rut_number},{rate_hour}, {contact_number},{user_type},{work_hours}, {bonus_app},{user_profile})
          """).on(
          'uname -> user.uname,
          'password -> passwordHash,
          'first_name -> user.first_name,
          'last_name -> user.last_name,
          'division -> user.office.division,
          'gerencia -> user.office.gerencia,
          'department -> user.office.department,
          'email -> user.email,
          'birth_date -> user.birth_date,
          'office_number -> user.office.office_number,
          'joining_date -> user.office.joining_date,
          'isadmin -> user.office.isadmin,
          'isverify -> 1,
          'verify_code -> UUID.randomUUID().toString(),
          'verify_date -> new Date(),
          'status -> user.status,
          'added_date -> new Date(),
          'rut_number -> user.rut_number,
          'rate_hour -> user.office.rate_hour,
          'contact_number -> user.contact_number,
          'user_type -> user.office.user_type,
          'work_hours -> user.office.work_hours.bigDecimal,
          'bonus_app -> user.office.bonus_app,
          'user_profile -> uProfile).executeInsert(scalar[Long].singleOpt)

      result.last
    }
  }

  /**
   * update user information
   */
  def updateUser(user: UserMaster, id: String): Int = {

    val user_role = user.office.isadmin

    val profile = UserProfileServices.findUserProfileById(user_role.toString())
    var uProfile = ""
    if (!profile.isEmpty) {
      uProfile = profile.get.profile_code
    } else {
      uProfile = user.office.user_profile
    }

    //var i=1 :Int

    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_user
          set 
          uname= {uname},
          password={password},
          first_name= {first_name},
          last_name = {last_name},
          division =  {division}, 
          gerencia = {gerencia}, 
          department = {department},
          email = {email},
          birth_date = {birth_date},
          office_number = {office_number},
          joining_date = {joining_date},
          isadmin = {isadmin},
          isverify = {isverify},
          verify_code = {verify_code},
          verify_date = {verify_date},
          status ={status},   
          rut_number ={rut_number},
          rate_hour ={rate_hour},
          contact_number = {contact_number},
          user_type = {user_type},
          work_hours = {work_hours}, 
          bonus_app = {bonus_app},
          user_profile ={user_profile}
          where uid = {uid}
          
      """).on(
          'uid -> id,
          'uname -> user.uname,
          'password -> user.password,
          'first_name -> user.first_name,
          'last_name -> user.last_name,
          'division -> user.office.division,
          'gerencia -> user.office.gerencia,
          'department -> user.office.department,
          'email -> user.email,
          'birth_date -> user.birth_date,
          'office_number -> user.office.office_number,
          'joining_date -> user.office.joining_date,
          'isadmin -> user.office.isadmin,
          'isverify -> user.isverify,
          'verify_code -> user.verify_code,
          'verify_date -> user.verify_date,
          'status -> user.status,
          'rut_number -> user.rut_number,
          'rate_hour -> user.office.rate_hour,
          'contact_number -> user.contact_number,
          'user_type -> user.office.user_type,
          'work_hours -> user.office.work_hours.bigDecimal,
          'bonus_app -> user.office.bonus_app,
          'user_profile -> uProfile).executeUpdate()
    }

  }

  def updateUserProfile(user: UserMaster, id: String): Int = {
    /*
    val user_role = user.office.isadmin

    val profile = UserProfileServices.findUserProfileById(user_role.toString())
    var uProfile = ""
    if (!profile.isEmpty) {
      uProfile = profile.get.profile_code
    } else {
      uProfile = user.office.user_profile
    }
    */
    //var i=1 :Int

    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_user
          set 
          uname= {uname},
          first_name= {first_name},
          last_name = {last_name},
          division =  {division}, 
          gerencia = {gerencia}, 
          department = {department},
          email = {email},
          birth_date = {birth_date},
          office_number = {office_number},
          joining_date = {joining_date},
          isadmin = {isadmin},
          isverify = {isverify},
          verify_code = {verify_code},
          verify_date = {verify_date},
          status ={status},   
          rut_number ={rut_number},
          rate_hour ={rate_hour},
          contact_number = {contact_number},
          user_type = {user_type},
          work_hours = {work_hours}, 
          bonus_app = {bonus_app}
          where uid = {uid}
          
      """).on(
          'uid -> id,
          'uname -> user.uname,
          'first_name -> user.first_name,
          'last_name -> user.last_name,
          'division -> user.office.division,
          'gerencia -> user.office.gerencia,
          'department -> user.office.department,
          'email -> user.email,
          'birth_date -> user.birth_date,
          'office_number -> user.office.office_number,
          'joining_date -> user.office.joining_date,
          'isadmin -> user.office.isadmin,
          'isverify -> user.isverify,
          'verify_code -> user.verify_code,
          'verify_date -> user.verify_date,
          'status -> user.status,
          'rut_number -> user.rut_number,
          'rate_hour -> user.office.rate_hour,
          'contact_number -> user.contact_number,
          'user_type -> user.office.user_type,
          'work_hours -> user.office.work_hours.bigDecimal,
          'bonus_app -> user.office.bonus_app).executeUpdate()
    }

  }
  /**
   *  delete user by id
   */
  def deleteUser(uid: Integer) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "Delete from art_user where uid = {uid}").on(
          'uid -> uid).executeUpdate()
    }
  }

  /**
   * verify user
   */
  def updateVerifyDetails(uid: Int, isverify: Int, verify_date: Date) {
    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_user
          set 
          isverify =  {isverify},
          verify_date={verify_date}
          
          where uid = {uid}
          
      """).on(
          'uid -> uid,
          'isverify -> isverify,
          'verify_date -> verify_date).executeUpdate()
    }
  }

  /**
   * get user derails by Id
   */
  def findUserDetails(uId: Integer) = {
    println("ENTRO A LA WEA " + uId)
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_user where uId = {uId}").on(
          'uId -> uId).as(
            Users.user.singleOpt)
      result
    }
  }
  
    /**
   * get user derails by Id
   */
  def findUserByMemberId(uId: Integer) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select b.* from art_program_members a, art_user b where b.uid=a.member_id and a.id={uId}").on(
          'uId -> uId).as(
            Users.user.singleOpt)
      result
    }
  }

  def findUserOfficeDetails(uId: Integer) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_user where uId = {uId}").on(
          'uId -> uId).as(
            Users.office.singleOpt)
      result
    }
  }
  def insertSkills(skills: Skills): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          insert into art_user_skills(skill_id,skill) values ({skill_id},{skill})
          """).on(
          'skill_id -> skills.skill_id,
          'skill -> skills.skill).executeUpdate()

    }
  }

  def insertUserSkills(userSkills: UserSkills): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          insert into  art_user_skills_mapping(uId, prId,sId,rating,isEndorsed) values (
          {uId},{prId},{sId},{rating},{isEndorsed})
          """).on(
          'uId -> userSkills.uId,
          'prId -> userSkills.prId,
          'sId -> userSkills.sId,
          'rating -> userSkills.rating,
          'isEndorsed -> userSkills.isEndorsed).executeUpdate()

    }
  }

  def updateUserSkills(userSkills: UserSkills): Int = {

    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_user_skills_mapping set 
          prId =  {prId},
          rating = {rating},
          isEndorsed = {isEndorsed}
          where uId = {uId} and sId = {sId}
          
      """).on(
          'uId -> userSkills.uId,
          'prId -> userSkills.prId,
          'sId -> userSkills.sId,
          'rating -> userSkills.rating,
          'isEndorsed -> userSkills.isEndorsed).executeUpdate()
    }
  }

  def validateForgotPasswordForm(form: Form[ForgotPasswordUserNameMaster]) = {
    var newform: Form[ForgotPasswordUserNameMaster] = null
    val userName = form.data.get("user_name").get.toString().trim()
    val email = getEmailByUseName(userName)
    if ("notEmail".equals(email.trim())) {
      newform = form.withError("user_name", "please enter valid user name")
      newform.fill(form.get)
    }

    var chkEmailSent = (checkEmailAlreadySent(userName) == 0)
    chkEmailSent = true
    if (!chkEmailSent) {
      newform = form.withError("user_name", Messages.get(langObj, "error.user.email.activationlink"))
      newform.fill(form.get)
    }
    if (newform != null) {
      newform
    } else {
      form
    }
  }

  def isValidEmailAddress(email: String) = {
    val regex: String = "^[_A-Za-z0-9-]+(\\.[_A-Za-z0-9-]+)*@[A-Za-z0-9-]+(\\.[A-Za-z0-9-]+)*(\\.[_A-Za-z0-9-]+)";
    val bool = email.matches(regex)
    bool
  }

  def validateForm(form: Form[PasswordMaster]) = {
    var newform: Form[PasswordMaster] = null
    if (!(StringUtils.equals(form.data.get("new_password").get, form.data.get("confirm_password").get))) {
      newform = form.withError("confirm_password", Messages.get(langObj, "forgotpassword.confirmpassword.notmatch"))
      newform.fill(form.get)
    }
    val old_password = form.data.get("old_password").get
    val employeeid = Integer.parseInt(form.data.get("id").get)
    val isValid = UserService.isValidPassword(employeeid, old_password)
    if (!isValid) {
      newform = form.withError("old_password", Messages.get(langObj, "resetpassword.wrongpasswordentered"))
      newform.fill(form.get)
    }
    if (newform != null) {
      newform
    } else {
      form
    }

  }

  def validateRecoverForm(form: Form[PasswordRecoverMaster], id: String): Form[PasswordRecoverMaster] = {
    var newform: Form[PasswordRecoverMaster] = null

    if ((form.data.get("new_password").get.trim().length() < 4)) {
      newform = form.withError("new_password", "Password field should contain minimum of 4 characters")
    }
    if (!(StringUtils.equals(form.data.get("new_password").get, form.data.get("confirm_password").get))) {
      newform = form.withError("confirm_password", Messages.get(langObj, "forgotpassword.confirmpassword.notmatch"))
    }
    println(id)
    val email = UserService.getEmailByVerificationId(id)
    println(email)
    var users = UserService.findUserDetailsByEmail(email)
    println(users)
    if (users == null) {
      newform = form.withError("confirm_password", "You are using invalid verification link.")
    }
    if (newform != null) {
      newform
    } else {
      form
    }
  }

  def isValidPassword(employeeid: Int, old_password: String): Boolean = {
    val employee = UserService.findUserDetails(employeeid)
    org.mindrot.jbcrypt.BCrypt.checkpw(old_password, employee.get.password)
  }

  def findUsersForDivision(divisionId: String): Seq[Users] = {
    DB.withConnection { implicit connection =>
      var sqlString = "select * from art_user where division = " + divisionId + " order by first_name asc";
      //println("Sql String -- " + sqlString);
      SQL(sqlString).as(Users.user *)
    }

  }

  def findUsersCountForDivision(divisionId: String): Long = {
    DB.withConnection { implicit connection =>
      var sqlString = "select Count(*) from art_user where division = " + divisionId;
      //println("Sql String -- " + sqlString);
      val result = SQL(sqlString).as(scalar[Long].single)
      result
    }

  }

  def findPaginationUsersForDivision(divisionId: String, start: Integer, end: Integer): Seq[Users] = {
    DB.withConnection { implicit connection =>
      //var sqlString = "select * from art_user where division = " + divisionId + " order by first_name asc";
      var sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY last_name asc) AS Row, * FROM art_user AS tbl where division = " + divisionId + " )as ss WHERE  (  Row >=" + (start) + " AND Row <= " + (end) + ")"
      //println("Sql String -- " + sqlString);
      SQL(sqlString).as(Users.user *)
    }

  }

  /**
   * get Email from verification Code if already exist or not
   */

  def findEmployeeCountForDivision(divisionId: String): Long = {
    DB.withConnection { implicit connection =>
      var sqlString = "select count(*) from  art_user WHERE division=" + divisionId;
      //println("[findEmployeeCountForDivision] Sql string - " + sqlString);
      val result: Long = SQL(sqlString).as(scalar[Long].single)
      result;
    }
  }

  def findEmployeesForDivision(divisionId: String): Seq[Users] = {
    DB.withConnection { implicit connection =>
      var sqlString = "select * from  art_user WHERE  division=" + divisionId + " order by first_name asc";
      //println("[findEmployeeCountForDivision] Sql string - " + sqlString);
      return SQL(sqlString).as(Users.user *)
    }
  }

  def findEmployeesCountForDivision(divisionId: String): Long = {
    DB.withConnection { implicit connection =>
      var sqlString = "select COUNT(*) from  art_user WHERE  division=" + divisionId;
      //println("[findEmployeeCountForDivision] Sql string - " + sqlString);
      return SQL(sqlString).as(scalar[Long].single)
    }
  }

  def findPaginationEmployeesReportingToDivision(divisionId: String, start: Integer, end: Integer): Seq[Users] = {
    DB.withConnection { implicit connection =>
      var sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY last_name asc) AS Row, * FROM art_user AS tbl where division = " + divisionId + " and gerencia IS NULL)as ss WHERE  (  Row >=" + (start) + " AND Row <= " + (end) + ") "
      //var sqlString = "select * from  art_user WHERE    division=" + divisionId + " and gerencia IS NULL";
      //println("[findEmployeeCountForDivision] Sql string - " + sqlString);
      return SQL(sqlString).as(Users.user *);
    }
  }

  def findPaginationEmployeesForDivision(divisionId: String, start: Integer, end: Integer): Seq[Users] = {
    DB.withConnection { implicit connection =>

      var sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY last_name asc) AS Row, * FROM art_user AS tbl where division = " + divisionId + ")as ss WHERE  (  Row >=" + (start) + " AND Row <= " + (end) + ") "
      //var sqlString = "select * from  art_user WHERE  division=" + divisionId + " order by first_name asc";
      //println("[findEmployeeCountForDivision] Sql string - " + sqlString);
      return SQL(sqlString).as(Users.user *)
    }
  }

  def findEmployeeCountReportingToDivision(divisionId: String): Long = {
    DB.withConnection { implicit connection =>
      var sqlString = "select count(*) from  art_user WHERE   division=" + divisionId + " and gerencia IS NULL";
      //println("[findEmployeeCountForDivision] Sql string - " + sqlString);
      val result: Long = SQL(sqlString).as(scalar[Long].single)
      result;
    }
  }

  def findEmployeesReportingToDivision(divisionId: String): Seq[Users] = {
    DB.withConnection { implicit connection =>
      var sqlString = "select * from  art_user WHERE    division=" + divisionId + " and gerencia IS NULL";
      //println("[findEmployeeCountForDivision] Sql string - " + sqlString);
      return SQL(sqlString).as(Users.user *);
    }
  }

  def findEmployeesCountReportingToDivision(divisionId: String): Long = {
    DB.withConnection { implicit connection =>
      var sqlString = "select COUNT(*) from  art_user WHERE    division=" + divisionId + " and gerencia IS NULL";
      //println("[findEmployeeCountForDivision] Sql string - " + sqlString);
      return SQL(sqlString).as(scalar[Long].single);
    }
  }

  /**
   * get Email from verification Code if already exist or not
   */

  def findEmployeeCountForGenrencia(generenciaId: String, divisionId: String): Long = {
    DB.withConnection { implicit connection =>
      var sqlString = "select count(*) from  art_user WHERE  gerencia = " + generenciaId + " and division=" + divisionId;
      //println("[findEmployeeCountForGenrencia] Sql String - " + sqlString);
      val result: Long = SQL(sqlString).as(scalar[Long].single)
      result;
    }
  }

  /**
   * get Email from verification Code if already exist or not
   */

  def findEmployeesForGenrencia(generenciaId: String, divisionId: String): Seq[Users] = {
    DB.withConnection { implicit connection =>
      var sqlString = "select * from  art_user WHERE  gerencia = " + generenciaId + " and division=" + divisionId + " order by first_name asc";
      //println("[findEmployeeCountForGenrencia] Sql String - " + sqlString);
      return SQL(sqlString).as(Users.user *)
    }
  }

  def findEmployeesCountForGenrencia(generenciaId: String, divisionId: String): Long = {
    DB.withConnection { implicit connection =>
      var sqlString = "select COUNT(*) from  art_user WHERE  gerencia = " + generenciaId + " and division=" + divisionId;
      //println("[findEmployeeCountForGenrencia] Sql String - " + sqlString);
      return SQL(sqlString).as(scalar[Long].single)
    }
  }

  def findPaginationEmployeesForGenrencia(generenciaId: String, divisionId: String, start: Integer, end: Integer): Seq[Users] = {
    DB.withConnection { implicit connection =>
      //var sqlString = "select * from  art_user WHERE  gerencia = " + generenciaId + " and division=" + divisionId + " order by first_name asc";
      var sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY last_name asc) AS Row, * FROM art_user AS tbl where gerencia = " + generenciaId + " and division=" + divisionId + "  )as ss WHERE  (  Row >=" + (start) + " AND Row <= " + (end) + ") "
      //println("[findEmployeeCountForGenrencia] Sql String - " + sqlString);
      return SQL(sqlString).as(Users.user *)
    }
  }

  def findPaginationEmployeesForGenrenciaOnly(generenciaId: String, divisionId: String, start: Integer, end: Integer): Seq[Users] = {
    DB.withConnection { implicit connection =>
      //var sqlString = "select * from  art_user WHERE  gerencia = " + generenciaId + " and division=" + divisionId + " order by first_name asc";
      var sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY last_name asc) AS Row, * FROM art_user AS tbl where gerencia = " + generenciaId + " and division =" + divisionId + " and department IS NULL )as ss WHERE  (  Row >=" + (start) + " AND Row <= " + (end) + ")"
      // println("[findEmployeeCountForGenrencia] Sql String - " + sqlString);
      return SQL(sqlString).as(Users.user *)
    }
  }

  def findEmployeesCountForGenrenciaOnly(generenciaId: String, divisionId: String): Long = {
    DB.withConnection { implicit connection =>
      //var sqlString = "select * from  art_user WHERE  gerencia = " + generenciaId + " and division=" + divisionId + " order by first_name asc";
      var sqlString = "SELECT Count(*) FROM  art_user where gerencia = " + generenciaId + " and division =" + divisionId + " and  department IS NULL "
      //println("[findEmployeeCountForGenrencia] Sql String - " + sqlString);
      return SQL(sqlString).as(scalar[Long].single)
    }
  }
  /**
   * get Email from verification Code if already exist or not
   */

  def findEmployeeCountReportingToGenrencia(generenciaId: String, divisionId: String): Long = {
    DB.withConnection { implicit connection =>
      var sqlString = "select count(*) from  art_user WHERE   gerencia = " + generenciaId + " and division=" + divisionId + " and department IS NULL";
      //println("[findEmployeeCountForGenrencia] Sql String - " + sqlString);
      val result: Long = SQL(sqlString).as(scalar[Long].single)
      result;
    }
  }

  /**
   * get Email from verification Code if already exist or not
   */

  def findEmployeesReportingToGenrencia(generenciaId: String, divisionId: String): Seq[Users] = {
    DB.withConnection { implicit connection =>
      var sqlString = "select * from  art_user WHERE gerencia = " + generenciaId + " and division=" + divisionId + " and department IS NULL" + " order by first_name asc";
      //println("[findEmployeeCountForGenrencia] Sql String - " + sqlString);
      return SQL(sqlString).as(Users.user *)
    }
  }

  def findEmployeesCountReportingToGenrencia(generenciaId: String, divisionId: String): Long = {
    DB.withConnection { implicit connection =>
      var sqlString = "select COUNT(*) from  art_user WHERE gerencia = " + generenciaId + " and division=" + divisionId + " and department IS NULL";
      //println("[findEmployeeCountForGenrencia] Sql String - " + sqlString);
      return SQL(sqlString).as(scalar[Long].single)
    }
  }

  def findPaginationEmployeesReportingToGenrencia(generenciaId: String, divisionId: String, start: Integer, end: Integer): Seq[Users] = {
    DB.withConnection { implicit connection =>
      //var sqlString = "select * from  art_user WHERE gerencia = " + generenciaId + " and division=" + divisionId + " and department IS NULL" + " order by first_name asc";
      var sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY last_name asc) AS Row, * FROM art_user AS tbl where gerencia = " + generenciaId + " and division=" + divisionId + " and department IS NULL" + " order by first_name asc )as ss WHERE  (  Row >=" + (start) + " AND Row <= " + (end) + ")"
      //println("[findEmployeeCountForGenrencia] Sql String - " + sqlString);
      return SQL(sqlString).as(Users.user *)
    }
  }

  /**
   * get Email from verification Code if already exist or not
   */

  def findEmployeeCountForDepartment(departmentId: String, generenciaId: String, divisionId: String): Long = {
    DB.withConnection { implicit connection =>
      var sqlString = "select count(*) from  art_user WHERE  department=" + departmentId + " and gerencia=" + generenciaId + " and division=" + divisionId
      //println("[findEmployeeCountForDepartment] Sql String -- "  +sqlString);
      val result: Long = SQL(sqlString).as(scalar[Long].single)
      result;
    }
  }

  /**
   * get Email from verification Code if already exist or not
   */

  def findEmployeeForDepartment(departmentId: String, generenciaId: String, divisionId: String): Seq[Users] = {
    DB.withConnection { implicit connection =>
      var sqlString = "select * from  art_user WHERE  department=" + departmentId + " and gerencia=" + generenciaId + " and division=" + divisionId + " order by first_name asc";
      //println("[findEmployeeCountForDepartment] Sql String -- "  +sqlString);
      return SQL(sqlString).as(Users.user *)

    }
  }

  def findPaginationEmployeeForDepartment(departmentId: String, generenciaId: String, divisionId: String, start: Integer, end: Integer): Seq[Users] = {
    DB.withConnection { implicit connection =>
      var sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY first_name asc) AS Row, * FROM art_user AS tbl where department=" + departmentId + " and gerencia=" + generenciaId + " and division=" + divisionId + " )as ss WHERE  (  Row >=" + (start) + " AND Row <= " + (end) + ")"
      //var sqlString = "select * from  art_user WHERE  department=" + departmentId + " and gerencia=" + generenciaId + " and division=" + divisionId + " order by first_name asc";
      //println("[findEmployeeCountForDepartment] Sql String -- "  +sqlString);
      return SQL(sqlString).as(Users.user *)

    }
  }

  def searchUserCount(searchText: String, division: String, generencia: String, department: String): Long = {
    DB.withConnection { implicit connection =>

      var sqlString2 = " isadmin <> -1";
      if (StringUtils.isNotEmpty(searchText)) {
        sqlString2 = sqlString2 + " AND (first_name LIKE '%" + searchText + "%' OR last_name LIKE '%" + searchText + "%')";
      }
      if (StringUtils.isNotEmpty(division)) {
        sqlString2 = sqlString2 + " AND division= " + division;
      }
      if (StringUtils.isNotEmpty(generencia)) {
        sqlString2 = sqlString2 + " AND gerencia= " + generencia;
      }
      if (StringUtils.isNotEmpty(department)) {
        sqlString2 = sqlString2 + " AND department=" + department;
      }
      var sqlString = "SELECT COUNT(*) FROM  art_user  where " + sqlString2
      //sqlString = sqlString + " order by first_name asc";
      //println("[searchUser] Sql String -- " + sqlString);
      return SQL(sqlString).as(scalar[Long].single)
    }
  }

  def searchUser(searchText: String, division: String, generencia: String, department: String, start: Integer, end: Integer): Seq[Users] = {
    DB.withConnection { implicit connection =>

      var sqlString2 = " isadmin <> -1";
      if (StringUtils.isNotEmpty(searchText)) {
        sqlString2 = sqlString2 + " AND (first_name LIKE '%" + searchText + "%' OR last_name LIKE '%" + searchText + "%')";
      }
      if (StringUtils.isNotEmpty(division)) {
        sqlString2 = sqlString2 + " AND division= " + division;
      }
      if (StringUtils.isNotEmpty(generencia)) {
        sqlString2 = sqlString2 + " AND gerencia= " + generencia;
      }
      if (StringUtils.isNotEmpty(department)) {
        sqlString2 = sqlString2 + " AND department=" + department;
      }
      var sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY first_name asc) AS Row, * FROM art_user AS tbl where " + sqlString2 + " )as ss WHERE  (  Row >=" + (start) + " AND Row <= " + (end) + ")"
      //sqlString = sqlString + " order by first_name asc";
      //println("[searchUser] Sql String -- " + sqlString);
      return SQL(sqlString).as(Users.user *)
    }
  }

  def findProgramMember(program_id: String): Seq[Users] = {
    DB.withConnection { implicit connection =>
      SQL("select * from art_user where uid NOT IN (select member_id from art_program_members where program_id=" + program_id + ") order by first_name desc").as(Users.user *)
    }
  }

  def findProgramManagersDetails(user_list: String): Seq[Users] = {
    DB.withConnection { implicit connection =>
      SQL("select * from art_user where uid  IN (" + user_list + ")").as(Users.user *)
    }
  }

  def findAllProgramMember(): Seq[Users] = {
    DB.withConnection { implicit connection =>
      SQL("SELECT * FROM art_user a JOIN (SELECT DISTINCT member_id FROM art_program_members WHERE is_active=0) b ON a.uid=b.member_id ORDER BY a.last_name").as(Users.user *)
    }
  }

  def findProgramListForUser(employee_id: String): Seq[ProgramMaster] = {
    val sqlString = "select * from art_program where is_active=1 AND program_id IN(select DISTINCT(program) from art_project_master where is_active=1 AND pId IN ( select DISTINCT(pId) from art_task where is_active=1 AND tId IN ( select DISTINCT(task_id) from art_sub_task where (completion_percentage<100 OR completion_percentage Is Null) AND is_active=1 AND sub_task_id IN (select DISTINCT(sub_task_id) from art_sub_task_allocation where user_id =" + employee_id + " AND is_deleted = 1) )))"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ProgramMaster.pMaster *)
    }
  }

  def findUsersFromRole(role_id: String): Seq[Users] = {
    val sqlString = "select * from art_user where uid IN ( select user_id from art_user_profile_mapping where user_role = " + role_id + ") order by first_name"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(Users.user *)
    }
  }
  def findDatosRRHH(id: String): Seq[DataRRHH] = {

    var sqlString = "EXEC art.datosrrhh {id}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('id -> id.toInt).executeQuery() as (DataRRHH.datarrhh *)
    }
  }
}
