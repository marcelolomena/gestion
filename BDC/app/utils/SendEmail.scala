package utils

import play.api._
import play.api.Play.current
import play.Play
//import play.api.libs.mailer._
import com.typesafe.plugin._
import play.api.Play.current





object SendEmail {

  def sendEmailVerification(message: String, recipientEmail: String, url: String, fromEmail: String): String = {
    println("message :" + message)
    println("recipientEmail :" + recipientEmail)
    println("fromEmail :" + fromEmail)
    println("user smtp :" + Play.application().configuration().getString("smtp.user"))
    println("user pwd :" + Play.application().configuration().getString("smtp.password"))
    println("url :" + url)
    
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