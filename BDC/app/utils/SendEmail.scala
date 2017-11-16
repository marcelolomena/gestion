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
                          recipientEmail: String
                        ): String = {
    try {

      val programName = program.get.program_description.get.toString
      val picod = program.get.program_code.toString
      val alertTitle = alert.get.event_title
      val first = user.get.first_name
      val last = user.get.last_name

      var subject = s"ALERTA PMO - ART ${picod} – ${programName}"
      if (increment>1)
        {
          subject = "RE-INSISTENCIA " + subject
        }

      val fromEmail = Play.application().configuration().getString("smtp.user")
      val mail = use[MailerPlugin].email
      mail.setSubject(subject)
      mail.setFrom(fromEmail.toString())
      mail.setRecipient(recipientEmail.toString())

      val builderRisk = StringBuilder.newBuilder
      builderRisk.append("<ul>")
      for (r <- risks) {
        builderRisk.append("<li>")
        builderRisk.append(r.name)
        builderRisk.append("</li>")
      }
      builderRisk.append("</ul>")

      val risksLst = builderRisk.toString()

      val builderProject = StringBuilder.newBuilder
      builderProject.append("<tr>")
      builderProject.append("<td>")
      builderProject.append("ART")
      builderProject.append("</td>")
      builderProject.append("<td>")
      builderProject.append(program.get.program_code.toString)
      builderProject.append("</td>")
      builderProject.append("</tr>")

      builderProject.append("<tr>")
      builderProject.append("<td>")
      builderProject.append("SAP")
      builderProject.append("</td>")
      builderProject.append("<td>")
      builderProject.append(program.get.sap_code.toString)
      builderProject.append("</td>")
      builderProject.append("</tr>")

      val projectsLst = builderProject.toString()

      val builderAlert = StringBuilder.newBuilder

      builderAlert.append("<tr>")
      builderAlert.append("<td>")
      builderAlert.append("Reiteración Alerta")
      builderAlert.append("</td>")
      builderAlert.append("<td>")
      builderAlert.append(alert.get.reiteration.get.toString)
      builderAlert.append("</td>")
      builderAlert.append("</tr>")

      builderAlert.append("<tr>")
      builderAlert.append("<td>")
      builderAlert.append("Variable Impactada")
      builderAlert.append("</td>")
      builderAlert.append("<td>")
      builderAlert.append(alert.get.impacted_variable.get.toString)
      builderAlert.append("</td>")
      builderAlert.append("</tr>")

      val alertLst = builderAlert.toString()
      val html = template.replaceAllLiterally("${programName}",programName)
      .replaceAllLiterally("${first}",first)
      .replaceAllLiterally("${last}",last)
      .replaceAllLiterally("${alertTitle}",alertTitle)
      .replaceAllLiterally("${risksLst}",risksLst)
      .replaceAllLiterally("${projectsLst}",projectsLst)
      .replaceAllLiterally("${alertLst}",alertLst)

      mail.sendHtml(html)

    } catch {
      case ex: Exception => return "Check SMTP Details"
    }

    "Success"
  }
}