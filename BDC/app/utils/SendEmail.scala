package utils

import models.{ProgramMaster, RiskAlerts, RiskManagementMaster, Users}
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
    
    //mail.addFrom(fromEmail.toString())
    mail.setFrom(fromEmail.toString())
    //mail.addRecipient(recipientEmail.toString())
    mail.setRecipient(recipientEmail.toString())
    try {
      mail.sendHtml("<html><div> Hola,<br/>" + message.toString() + "</br><a href=" + url.toString() + ">" + url.toString() + " </a></div></html>")
    } catch {
      case ex: Exception => return "Check SMTP Details"
    }

    "Success"

  }

  def sendEmailRiskAlert(
                          user: Option[Users],
                          program: Option[ProgramMaster],
                          alert: Option[RiskAlerts],
                          risks: Seq[RiskManagementMaster],
                          risk_details: Option[RiskManagementMaster],
                          increment: Int,
                          template: String,
                          cc: String
                        ): String = {
    try {
      val programName = program.get.program_description.get.toString
      val picod = program.get.program_code.toString
      var subject = s"ALERTA PMO - ART ${picod} – ${programName}"
      val fromEmail = Play.application().configuration().getString("smtp.user")
      val mail = use[MailerPlugin].email

      if (increment>1)
      {
        subject = "RE-INSISTENCIA " + subject
      }

      mail.setSubject(subject)
      mail.setFrom(fromEmail.toString())
      mail.setRecipient("marcelo.mlomena@gmail.com"/*user.get.email.toString()*/)

      val mylist  = cc.split(",").toList
      mail.setCc(mylist:_*)

      val builderRisk = StringBuilder.newBuilder

      for (r <- risks) {
        builderRisk.append(r.name + "\n")
      }

      val html = template.replaceAllLiterally("${program.program_description}",program.get.program_description.get.toString)
        .replaceAllLiterally("${user.first_name}",user.get.first_name)
        .replaceAllLiterally("${user.last_name}",user.get.last_name)
        .replaceAllLiterally("${alert.event_title}",alert.get.event_title)
        .replaceAllLiterally("${risks.list}",builderRisk.toString())
        .replaceAllLiterally("${program.program_code}",program.get.program_code.toString)
        .replaceAllLiterally("${program.sap_code}",program.get.sap_code.getOrElse("No tiene").toString)
        .replaceAllLiterally("${alert.reiteration}",alert.get.reiteration.get.toString)
        .replaceAllLiterally("${alert.impacted_variable}",alert.get.impacted_variable.get.toString)


      mail.sendHtml(html)

    } catch {
      case ex: Exception => return ex.getMessage
    }

    "Success"
  }
}