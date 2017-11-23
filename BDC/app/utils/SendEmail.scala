package utils

import models.{ProgramMaster, RiskAlerts, RiskManagementMaster, Users}
import play.api._
import play.api.Play.current
import play.Play
//import play.api.libs.mailer._
import com.typesafe.plugin._
import play.api.Play.current
import services._

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
      val program_code = program.get.program_code.toString

      var subject = s"ALERTA PMO - ART ${program_code} – ${programName}"
      val fromEmail = Play.application().configuration().getString("smtp.user")
      val mail = use[MailerPlugin].email

      /////
      val programDetail = ProgramService.findProgramOtherDetailsById(program.get.program_id.get.toString)
      val program_impact_type = ImpactTypeService.findImpactTypeById(programDetail.get.impact_type.toString()).get.impact_type
      val program_internal_state = program.get.internal_state
      val program_program_manager = UserService.findUserDetails(program.get.program_manager.toInt).get.first_name + " " +  UserService.findUserDetails(program.get.program_manager.toInt).get.last_name
      val program_release_date = ProgramService.findClouseDateBaslineChange(program.get.program_id.get.toString)
      val alert_count_current = RiskService.countCurrentAlerts(alert.get.id.get.toString).toString

      println("subject : " + subject )
      //println("program_impact_type : " + program_impact_type )
      //println("program_internal_state : " + program_internal_state )
      //println("program_program_manager : " + program_program_manager )
      //println("program_release_date : " + program_release_date )
      //println("alert_count_current : " + alert_count_current )
      /////

      /////
      val risk_category_name = RiskService.riskCategory(alert.get.id.get.toString).trim
      val risk_imapct = RiskService.riskImapct(alert.get.id.get.toString).trim
      val risk_state = RiskService.riskState(alert.get.id.get.toString).trim
      var alert_event_code: String = ""
      alert.get.event_code.get match {
        case 1 =>
          alert_event_code = "Riesgo"
        case 2 =>
          alert_event_code = "Incidente"
      }

      var risk_variable_imapact: String = ""
      RiskService.findRiskDetails(alert.get.risk_id.toString).get.variable_imapact match {
        case "0" => risk_variable_imapact = "Plazo"
        case "1"=> risk_variable_imapact = "Presupuesto"
        case "2"=> risk_variable_imapact = "Alcance"
        case "3"=> risk_variable_imapact = "Calidad"
        case "4"=> risk_variable_imapact = "Plazo/Presupuesto"
        case "5"=> risk_variable_imapact = "Plazo/Alcance"
        case "6"=> risk_variable_imapact = "Plazo/Alcance/Presupuesto"
        case "7"=> risk_variable_imapact = "Plazo/Calidad"
        case "8"=> risk_variable_imapact = "Presupuesto/Calidad"
        case "9"=> risk_variable_imapact = "Alcance/Calidad"
        case "10"=> risk_variable_imapact = "Plazo/Presupuesto/Alcance/CalidadPlazo/Presupuesto/Calidad"
      }

      var alert_criticality: String = ""
      alert.get.criticality.get.toInt match {
        case 1=> alert_criticality = "Alto"
        case 2=> alert_criticality = "Medio"
        case 3=> alert_criticality = "Bajo"

      }

      //println("risk_category_name : " + risk_category_name )
      //println("risk_imapct : " + risk_imapct )
      //println("risk_state : " + risk_state )
      //println("alert_event_code : " + alert_event_code )
      //println("risk_variable_imapact : " + risk_variable_imapact )
      //println("alert_criticality : " + alert_criticality )
      /////

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
/*
      val html = template.replaceAllLiterally("${program.program_description}",program.get.program_description.get.toString)
        .replaceAllLiterally("${user.first_name}",user.get.first_name)
        .replaceAllLiterally("${user.last_name}",user.get.last_name)
        .replaceAllLiterally("${alert.event_title}",alert.get.event_title)
        .replaceAllLiterally("${risks.list}",builderRisk.toString())
        .replaceAllLiterally("${program.program_code}",program.get.program_code.toString)
        .replaceAllLiterally("${program.sap_code}",program.get.sap_code.getOrElse("No tiene").toString)
        .replaceAllLiterally("${risk_state}",risk_state)
        .replaceAllLiterally("${alert.impacted_variable}",alert.get.impacted_variable.get.toString)
        .replaceAllLiterally("${program_impact_type}",program_impact_type)
        .replaceAllLiterally("${program_internal_state}",program_internal_state)
        .replaceAllLiterally("${program_program_manager}",program_program_manager)
        .replaceAllLiterally("${program_release_date}",program_release_date)
        .replaceAllLiterally("${alert_count_current}",alert_count_current)
        .replaceAllLiterally("${risk_imapct}",risk_imapct)
        .replaceAllLiterally("${alert_event_code}",alert_event_code)
        .replaceAllLiterally("${risk_category_name}",risk_category_name)
        .replaceAllLiterally("${risk_variable_imapact}",risk_variable_imapact)
        .replaceAllLiterally("${alert.reiteration}",alert.get.reiteration.get.toString)
        .replaceAllLiterally("${alert_criticality}",alert_criticality)

      mail.sendHtml(html)
*/

    } catch {
      case ex: Exception => return ex.getMessage
    }

    "OK"
  }
}