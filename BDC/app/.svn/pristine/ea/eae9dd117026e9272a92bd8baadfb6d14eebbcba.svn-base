package utils

import com.typesafe.plugin._
import play.api.Play.current
import play.Play

object SendEmail {

  def sendEmailVerification(message: String, recipientEmail: String, url: String, fromEmail: String): String = {
    var mail = use[MailerPlugin].email
    mail.setSubject("Reset Your Password")
    mail.addFrom(fromEmail.toString())
    mail.addRecipient(recipientEmail.toString())
    try {
      mail.sendHtml("<html><div> Hello,<br/>" + message.toString() + "</br><a href=" + url.toString() + ">" + url.toString() + " </a></div></html>")
    } catch {
      case ex: Exception => return "Check SMTP Details"
    }
    "Success"
  }

  def sendEmailRiskAlert(message: String, recipientEmail: String): String = {
    val fromEmail = Play.application().configuration().getString("smtp.user")
    var mail = use[MailerPlugin].email
    mail.setSubject("Risk Alert")
    mail.addFrom(fromEmail.toString())
    mail.addRecipient(recipientEmail.toString())
    try {
      mail.sendHtml("<html><div> Hello,<br/>" + message.toString() + "</br></div></html>")
    } catch {
      case ex: Exception => return "Check SMTP Details"
    }
    "Success"
  }
}