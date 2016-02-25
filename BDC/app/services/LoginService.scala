package services;
import play.api.Play.current
import play.api.db.DB
import anorm.SqlParser._
import models._
import anorm._
import com.typesafe.plugin._
import play.api.mvc._
import play.api.libs.ws.WS
import play.api.libs.concurrent.Execution.Implicits._
import scala.concurrent.Await
import scala.concurrent.duration._
import com.ning.http.client.Realm.AuthScheme
import play.api.libs.ws.Response
import scala.concurrent.Future
import scala.language.postfixOps
import scala.concurrent.Future
import play.api.libs.ws.Response
import java.net.URLEncoder
import akka.util.Timeout
import scala.concurrent.ExecutionContext.Implicits.global
import scala.concurrent.{ Await, Future }
import scala.concurrent.duration._
import play.api.data.Form

object LoginService {

	/**
	 * Authenticate a User.
	 */
	def authenticate(username: String, password: String): Option[Users] = {
		DB.withConnection { implicit connection =>
			SQL(
				"""
         select * from art_user where 
         uname = {username} and password = {password}
        """).on(
					'username -> username,
					'password -> password).as(Users.user.singleOpt)

		}
	}

	/**
	 * verify login username and password..
	 */
	def loginCheck(uname: String, password: String) = {
		DB.withConnection { implicit connection =>
			val result = SQL(
				"select * from art_user where uname = {uname} AND password = {password} AND isadmin=1").on(
					'uname -> uname,
					'password -> password).as(
						Login.login.singleOpt)
			result
		}
	}

	/**
	 * verify login username and password..
   * 
select IIF(LEN(emailTrab)>1,LEFT(emailTrab, CHARINDEX('@', emailTrab) - 1 ),null) mail,uname from RecursosHumanos a left outer join
art_user b on IIF(LEN(emailTrab)>1,LEFT(emailTrab, CHARINDEX('@', emailTrab) - 1 ),null)=uname
where uname is null 
rpizarrom
	 */
	def loginUserCheck(uname: String, password: String) = {
		DB.withConnection { implicit connection =>
		  var loginok: Boolean = false
			//val result = SQL("select * from art_user where uname='" + uname.trim() + "' AND status=1").as(Login.login.singleOpt)
		  var result : Option[Login] = null
		  try{
      result =SQL("art.loginUserCheck {uname}").on('uname -> uname).executeQuery() as (Login.login.singleOpt)
      loginok = true
		  }catch{
		    case e: Exception => loginok = false
		  }
			var isValid = false

			if (loginok) {
				val dbPassword = result.get.password

				isValid = org.mindrot.jbcrypt.BCrypt.checkpw(password, dbPassword)
			}
      
			if (isValid) {
				result
			} else {
				None
			}
		}
	}

	/**
	 * check user by email
	 */
	def emailCheck(email: String) = {
		DB.withConnection { implicit connection =>
			val result = SQL(
				"select * from art_user where email = {email} AND isadmin=1").on(
					'email -> email).as(
						Login.login.singleOpt)
			result
		}

	}

	/**
	 * update password for a user id
	 */
	def updatePassword(uid: String, password: String): Int = {
		DB.withConnection { implicit connection =>
			SQL(
				"""
				  update art_user
            set 
              password={password}
            
            where uid = {uid}
            
          """).on(
					'uid -> uid,
					'password -> password).executeUpdate()
		}
	}

	/**
	 * Validate login form
	 * Login user functionality
	 */
	def validateForm(form: Form[LoginMaster]) = {
		val username = form("uname").value.get
		val password = form("password").value.get
		val result = LoginService.loginUserCheck(username, password);
		result match {
			case None =>
				var newform = form.withError("password", "Incorrect User name or password.")
				newform.fill(form.get)
				newform
			case Some(login: models.Login) =>
				form
		}
	}

}