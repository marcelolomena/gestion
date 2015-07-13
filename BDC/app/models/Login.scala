package models
import anorm.SqlParser._
import play.api.Play.current
import java.util.Date
import anorm._
import play.api.db.DB

case class Login(uid: Option[Int], uname: String, email: String, password: String, isadmin: Integer, status: Int, user_profile: String)

object Login {

  val login = {
    get[Option[Int]]("uid") ~
      get[String]("uname") ~
      get[String]("email") ~
      get[String]("password") ~
      get[Int]("isadmin") ~
      get[Int]("status") ~
      get[String]("user_profile") map {
        case uid ~ uname ~ email ~ password ~ isadmin ~ status ~ user_profile => Login(uid, uname, email, password, isadmin, status, user_profile)
      }
  }

}

case class LoginMaster(uname: String, password: String)

object LoginMaster {

  val loginInputs = {
    get[String]("uname") ~
      get[String]("password") map {
        case uname ~ password => LoginMaster(uname, password)
      }
  }

}

case class ForgotPasswordUserNameMaster(user_name: String)

object ForgotPasswordUserNameMaster {

  val forgotPass = {
    get[String]("user_name") map {
      case user_name => ForgotPasswordUserNameMaster(user_name)
    }
  }
}

case class ForgotPasswordMaster(id: Option[Int], email: String, user_name: String, verification_code: String, creation_date: Option[Date], verify_date: Option[Date], isverify: Option[Int])

object ForgotPasswordMaster {

  val forgotPassword = {
    get[Option[Int]]("id") ~
      get[String]("email") ~
      get[String]("user_name") ~
      get[String]("verification_code") ~
      get[Option[Date]]("creation_date") ~
      get[Option[Date]]("verify_date") ~
      get[Option[Int]]("isverify") map {
        case id ~ email ~ user_name ~ verification_code ~ creation_date ~ verify_date ~ isverify => ForgotPasswordMaster(id, email, user_name, verification_code, creation_date, verify_date, isverify)
      }
  }
}

case class PasswordMaster(id: Option[Int], old_password: String, new_password: String, confirm_password: String)

object PasswordMaster {

  val passwordInputs = {
    get[Option[Int]]("id") ~
      get[String]("old_password") ~
      get[String]("new_password") ~
      get[String]("confirm_password") map {
        case id ~ old_password ~ new_password ~ confirm_password => PasswordMaster(id, old_password, new_password, confirm_password)
      }
  }
}

case class PasswordRecoverMaster(new_password: String, confirm_password: String)

object PasswordRecoverMaster {

  val passwordRecover = {
    get[String]("new_password") ~
      get[String]("confirm_password") map {
        case new_password ~ confirm_password => PasswordRecoverMaster(new_password, confirm_password)
      }
  }

}

case class EmailMaster(id: Option[Int], email: String)

object EmailMaster {
  val emailMaster = {
    get[Option[Int]]("id") ~
      get[String]("email") map {
        case id ~ email => EmailMaster(id, email)
      }
  }
}