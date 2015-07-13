package models;

import java.util.Date
import org.joda.time.LocalDateTime
import anorm._
import anorm.SqlParser._
import play.api.Play.current
import play.api.db.DB
import org.joda.time.DateTime
import play.i18n._
import play.mvc._
import play.api.data._
import play.api.data.Forms._
import play.api.data.format.Formats._
import play.i18n._
import play.api.Play.current
//0 normal
//1 admin
//2 PMo
//3 ceo
//4 PL

/*case class Users(uid: Option[Int],
	uname: String,
	password: String,
	first_name: String,
	last_name: String,
	department: Integer,
	email: String,
	birth_date: Date,
	office_number: String,
	joining_date: Date,
	isadmin: Int,
	isverify: Int,
	verify_code: String,
	verify_date: Date,
	status: String,
	added_date: Date,
	rut_number: String,
	rate_hour: Integer,
	contact_number: String,
	user_type: Integer,
	work_hours: BigDecimal,
	bonus_app: Integer)*/

case class EmployeeSearchMaster(search_filter: Option[String], division: Option[String], gerencia: Option[String], department: Option[String],
                                parent_type: Option[String], parent_id: Option[String],start:Option[Int],end:Option[Int])

object EmployeeSearchMaster {

  val employeeSearchResult = {
    get[Option[String]]("search_filter") ~
      get[Option[String]]("division") ~
      get[Option[String]]("gerencia") ~
      get[Option[String]]("department") ~
      get[Option[String]]("parent_type") ~
      get[Option[String]]("parent_id") ~ 
      get[Option[Int]]("start") ~
      get[Option[Int]]("end") map {
        case search_filter ~ division ~ gerencia ~ department ~ parent_type ~ parent_id ~ start ~ end=>
          EmployeeSearchMaster(search_filter, division, gerencia, department, parent_type, parent_id,start,end)
      }
  }

}

case class ProfileImage(uid: Option[Int], x: Option[Int], y: Option[Int], h: Option[Int], w: Option[Int], profile_image: Option[String])

object ProfileImage {

  val profileImage = {
    get[Option[Int]]("uid") ~
      get[Option[Int]]("x") ~
      get[Option[Int]]("y") ~
      get[Option[Int]]("h") ~
      get[Option[Int]]("w") ~
      get[Option[String]]("profile_image") map {
        case uid ~ x ~ y ~ h ~ w ~ profile_image =>
          ProfileImage(uid, x, y, h, w, profile_image)
      }
  }
}

case class Office(uid: Int, division: Int, gerencia: Option[Int], department: Option[Int], joining_date: Date, office_number: String, isadmin: Int, rate_hour: Int, user_type: Int, work_hours: BigDecimal, bonus_app: Int, user_profile: String)

object Office {

}

case class UserMaster(uid: Option[Int], uname: String, profile_image: Option[String], first_name: String, last_name: String, email: String, password: String, birth_date: Date, rut_number: String, contact_number: String, isverify: Option[Int], verify_code: Option[String], verify_date: Option[Date], status: Int, added_date: Date, office: OfficeMaster)

object UserMaster {

}

case class OfficeMaster(division: Int, gerencia: Option[Int], department: Option[Int], joining_date: Date, office_number: String, isadmin: Int, rate_hour: Int, user_type: Int, work_hours: BigDecimal, bonus_app: Int, user_profile: String)

object OfficeMaster {

}

case class UsersList(uid: Option[Int],
                     uname: String,
                     password: String,
                     first_name: String,
                     last_name: String,
                     department: Integer,
                     email: String,
                     birth_date: Date,
                     office_number: String,
                     joining_date: Date,
                     isadmin: Int,
                     isverify: Int,
                     verify_code: String,
                     verify_date: Date,
                     status: String,
                     rut_number: String,
                     rate_hour: Integer,
                     contact_number: String,
                     user_type: Integer,
                     work_hours: BigDecimal,
                     bonus_app: Integer,
                     user_profile: String)

object UsersList {

  /*userList = {
		get[Option[Int]]("uid") ~ get[String]("uname") ~ get[String]("password") ~ get[String]("first_name") ~ get[String]("last_name") ~
			get[Int]("department") ~ get[String]("email") ~ get[Date]("birth_date") ~ get[String]("office_number") ~ get[Date]("joining_date") ~
			get[Int]("isadmin") ~ get[Int]("isverify") ~ get[String]("verify_code") ~ get[Date]("verify_date") ~ get[String]("status") ~
			get[Date]("added_date") ~ get[String]("rut_number") ~ get[Int]("rate_hour") ~ get[String]("contact_number") ~
			get[Int]("user_type") ~ get[java.math.BigDecimal]("work_hours") ~ get[Int]("bonus_app") map {
				case uid ~  uname ~ password ~ first_name ~ last_name ~ department ~ email ~ birth_date ~
					office_number ~ joining_date ~ isadmin ~ isverify ~ verify_code ~  verify_date ~ status ~
					added_date ~ rut_number ~ rate_hour ~ contact_number ~ user_type ~ work_hours ~ bonus_app =>
					UsersList(uid, uname, password, first_name, last_name, department, email, birth_date, office_number,
						joining_date, isadmin, isverify, verify_code, verify_date, status,added_date, rut_number, rate_hour, contact_number, user_type, work_hours, bonus_app)
			}
	}
 */
}

case class Skills(skill_id: Integer, skill: String)

object Skills {

  val skill = {
    get[Int]("skill_id") ~
      get[String]("skill") map {
        case skill_id ~ skill =>
          Skills(skill_id, skill)
      }
  }
}

case class SkillsMaster(uId: Int, skill_id: Int, rating: Int)

object SkillsMaster {

  val skill_rate = {
    get[Int]("uId") ~
      get[Int]("skill_id") ~
      get[Int]("rating") map {
        case uId ~ skill_id ~ rating => SkillsMaster(uId, skill_id, rating)
      }
  }
}

case class UserSkills(uId: Integer, prId: Integer, sId: Integer, rating: Integer, isEndorsed: Integer)

object UserSkills {
  val uskills = {
    get[Int]("uId") ~
      get[Int]("prId") ~
      get[Int]("sId") ~
      get[Int]("rating") ~
      get[Int]("isEndorsed") map {
        case uId ~ prId ~ sId ~ rating ~ isEndorsed =>
          UserSkills(uId, prId, sId, rating, isEndorsed)
      }
  }
}

trait ConvertToDate {

  def convertDate(in: AnyRef): Date = in match {
    case d: java.util.Date => d
    case j: DateTime       => j.toDate
    case l: LocalDateTime  => l.toDateTime.toDate
  }
}

case class Users(uid: Option[Int], uname: String, profile_image: Option[String], first_name: String, last_name: String, email: String, password: String, birth_date: Date, rut_number: String, contact_number: String, isverify: Option[Int], verify_code: Option[String], verify_date: Option[Date], status: Int, added_date: Date, user_profile: String)

object Users extends ConvertToDate {

  val langObj = new Lang(Lang.forCode("es-ES"))

  /**
   * map user information...
   */
  val user = {
    get[Option[Int]]("uid") ~ get[String]("uname") ~ get[Option[String]]("profile_image") ~ get[String]("first_name") ~ get[String]("last_name") ~ get[String]("email") ~
      get[String]("password") ~ get[Date]("birth_date") ~ get[String]("rut_number") ~ get[String]("contact_number") ~
      get[Option[Int]]("isverify") ~ get[Option[String]]("verify_code") ~ get[Option[Date]]("verify_date") ~ get[Int]("status") ~
      get[Date]("added_date") ~ get[String]("user_profile") map {
        case uid ~ uname ~ profile_image ~ first_name ~ last_name ~ email ~ password ~ birth_date ~ rut_number ~
          contact_number ~ isverify ~ verify_code ~ verify_date ~ status ~ added_date ~ user_profile =>
          Users(uid, uname, profile_image, first_name, last_name, email, password, birth_date, rut_number, contact_number, isverify, verify_code, verify_date, status, added_date, user_profile)
      }
  }

  val office = {
    get[Int]("uid") ~ get[Int]("division") ~ get[Option[Int]]("gerencia") ~ get[Option[Int]]("department") ~
      get[Date]("joining_date") ~ get[String]("office_number") ~ get[Int]("isadmin") ~ get[Int]("rate_hour") ~
      get[Int]("user_type") ~ get[java.math.BigDecimal]("work_hours") ~ get[Int]("bonus_app") ~ get[String]("user_profile") map {
        case uid ~ division ~ gerencia ~ department ~ joining_date ~ office_number ~
          isadmin ~ rate_hour ~ user_type ~ work_hours ~ bonus_app ~ user_profile =>
          Office(uid, division, gerencia, department, joining_date, office_number,
            isadmin, rate_hour, user_type, work_hours, bonus_app, user_profile)
      }
  }

  /**
   * insert new user information
   */

  object Rating extends Enumeration {
    type Designation = Value
    val Mala, Mediocre, Bien, Bastante_Bien, Sobresaliente = Value
  }

  //"Mala", "Mediocre", "Bien", "Bastante Bien", "Sobresaliente"
}

object MyGlobalObject {
  var aclString = ""
}
