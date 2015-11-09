package notifications;
import play.api.Play.current
import play.api.db.DB
import anorm.SqlParser._
import models._
import anorm._
import com.typesafe.plugin._;
import play.Play

object Mails {

  /**
   * send activation/verification mail to user
   */
  def sendActivationMail(verification_code: String, email: String, domain: String, uname: String, pass: String) = {
    val resetEmail = email;
    val url = "http://" + domain + "/activate-account?code=" + verification_code;
    val mail = use[MailerPlugin].email
    mail.setSubject("Activate Your Account")
    //mail.addRecipient(resetEmail)
    mail.setRecipient(resetEmail)
    val fromEmail = Play.application().configuration().getString("smtp.user")
    //mail.addFrom(fromEmail)
    mail.setFrom(fromEmail)
    mail.sendHtml("<html><div>Hello , <br/> Please activate your account. Please follow the following Link<br/><a href='" + url + "'>Activate</a></div><div >Account Details <br/> Username : - " + uname + "<br/> Password : - " + pass + "</div> </html>")

  }

}