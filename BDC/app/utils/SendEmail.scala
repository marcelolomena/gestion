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
                          recipientEmail: String
                        ): String = {

    val fromEmail = Play.application().configuration().getString("smtp.user")
    val mail = use[MailerPlugin].email
    mail.setSubject("Emisión Alertas desde ART")
    mail.setFrom(fromEmail.toString())

    mail.setRecipient(recipientEmail.toString())

    try {
      val programName = program.get.program_description.get.toString
      val alertTitle = alert.get.event_title
      val first = user.get.first_name
      val last = user.get.last_name
      val regards = s"""
                    Estimado: ${first} ${last},
                    """.stripMargin

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
      builderProject.append("<ul style=\"padding-right: 0px; padding-left: 0px; float: left; padding-bottom: 0px; margin: 15px 0px; width: 100%; padding-top: 0px; list-style-type: none;\">")

      builderProject.append("<li style=\"padding-right: 2px; display: inline; padding-left: 2px; float: left; padding-bottom: 2px; width: 50%; padding-top: 2px;\">")
      builderProject.append("ART")
      builderProject.append("</li>")
      builderProject.append("<li>")
      builderProject.append(program.get.program_code.toString)
      builderProject.append("</li>")

      builderProject.append("<li style=\"padding-right: 2px; display: inline; padding-left: 2px; float: left; padding-bottom: 2px; width: 50%; padding-top: 2px;\">")
      builderProject.append("SAP")
      builderProject.append("</li>")
      builderProject.append("<li>")
      builderProject.append(program.get.sap_code.toString)
      builderProject.append("</li>")

      builderProject.append("</ul>")

      val projectsLst = builderProject.toString()

      val builderAlert = StringBuilder.newBuilder
      builderAlert.append("<ul style=\"padding-right: 0px; padding-left: 0px; float: left; padding-bottom: 0px; margin: 15px 0px; width: 100%; padding-top: 0px; list-style-type: none;\">")

      builderAlert.append("<li style=\"padding-right: 2px; display: inline; padding-left: 2px; float: left; padding-bottom: 2px; width: 50%; padding-top: 2px;\">")
      builderAlert.append("Reiteración Alerta")
      builderAlert.append("</li>")
      builderAlert.append("<li>")
      builderAlert.append(alert.get.reiteration.get.toString)
      builderAlert.append("</li>")

      builderAlert.append("<li style=\"padding-right: 2px; display: inline; padding-left: 2px; float: left; padding-bottom: 2px; width: 50%; padding-top: 2px;\">")
      builderAlert.append("Variable Impactada")
      builderAlert.append("</li>")
      builderAlert.append("<li>")
      builderAlert.append(alert.get.impacted_variable.get.toString)
      builderAlert.append("</li>")


      builderAlert.append("</ul>")

      val alertLst = builderAlert.toString()


      val html =
        s"""
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
 |<html xmlns="http://www.w3.org/1999/xhtml">
 |<head>
 |<meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
 |<title>.:Alert ART:.</title>
 |<meta name="viewport" content="width=device-width, initial-scale=1.0"/>
 |</head>
 |<body style="margin: 0; padding: 0;">
 |	<table border="0" cellpadding="0" cellspacing="0" width="100%">
 |		<tr>
 |			<td style="padding: 10px 0 30px 0;">
 |				<table align="center" border="0" cellpadding="0" cellspacing="0" width="600" style="border: 1px solid #cccccc; border-collapse: collapse;">
 |					<tr>
 |						<td align="center" bgcolor="#002464" style="padding: 40px 0 30px 0; color: #153643; font-size: 28px; font-weight: bold; font-family: Arial, sans-serif;">
 |							<!--<img src="" alt="Mail Alerta" width="300" height="230" style="display: block;" />-->
 |              <table border="0" cellpadding="0" cellspacing="0" width="100%">
 |								<tr>
 |									<td align="center" style="color: #ffffff;" width="100%">
 |										Alerta PMO<br/>
 |									</td>
 |								</tr>
 |            </table>
 |						</td>
 |					</tr>
 |					<tr>
 |						<td bgcolor="#ffffff" style="padding: 40px 30px 40px 30px;">
 |							<table border="0" cellpadding="0" cellspacing="0" width="100%">
 |								<tr>
 |									<td style="color: #153643; font-family: Arial, sans-serif; font-size: 24px;">
 |										<b>${programName}</b>
 |									</td>
 |								</tr>
 |								<tr>
 |									<td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
 |										<b>${regards}</b>
 |									</td>
 |								</tr>
 |								<tr>
 |									<td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 16px; line-height: 20px;">
 |										${alertTitle}
 |									</td>
 |								</tr>
 |								<tr>
 |									<td style="padding: 20px 0 30px 0; color: #153643; font-family: Arial, sans-serif; font-size: 12px; line-height: 20px;">
 |                    Adicionalmente se presentan los siguientes riesgos:
 |										${risksLst}
 |									</td>
 |								</tr>
 |								<tr>
 |									<td>
 |										<table border="0" cellpadding="0" cellspacing="0" width="100%">
 |											<tr>
 |												<td width="260" valign="top">
 |													<table border="0" cellpadding="0" cellspacing="0" width="100%">
 |														<tr>
 |															<td>
 |																<img src="images/left.gif" alt="" width="100%" height="140" style="display: block;" />
 |															</td>
 |														</tr>
 |														<tr>
 |															<td style="padding: 25px 0 0 0; color: #153643; font-family: Arial, sans-serif; font-size: 12px; line-height: 20px;">
 |                                Información del proyecto<br>
 |																${projectsLst}
 |															</td>
 |														</tr>
 |													</table>
 |												</td>
 |												<td style="font-size: 0; line-height: 0;" width="20">
 |													&nbsp;
 |												</td>
 |												<td width="260" valign="top">
 |													<table border="0" cellpadding="0" cellspacing="0" width="100%">
 |														<tr>
 |															<td>
 |																<img src="images/right.gif" alt="" width="100%" height="140" style="display: block;" />
 |															</td>
 |														</tr>
 |														<tr>
 |															<td style="padding: 25px 0 0 0; color: #153643; font-family: Arial, sans-serif; font-size: 12px; line-height: 20px;">
 |																Información del riesgo<br>
 |                                ${alertLst}
 |															</td>
 |														</tr>
 |													</table>
 |												</td>
 |											</tr>
 |										</table>
 |									</td>
 |								</tr>
 |							</table>
 |						</td>
 |					</tr>
 |					<tr>
 |						<td bgcolor="#002464" style="padding: 30px 30px 30px 30px;">
 |							<table border="0" cellpadding="0" cellspacing="0" width="100%">
 |								<tr>
 |									<td style="color: #ffffff; font-family: Arial, sans-serif; font-size: 14px;" width="75%">
 |										&reg; BCH - Herramienta de Control y Seguimiento de Proyectos<br/>
 |									</td>
 |									<td align="right" width="25%">
 |										<table border="0" cellpadding="0" cellspacing="0">
 |											<tr>
 |												<td style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;">
 |													<a href="http://www.twitter.com/bancodechile" style="color: #ffffff;">
 |														<img src="images/tw.gif" alt="Twitter" width="38" height="38" style="display: block;" border="0" />
 |													</a>
 |												</td>
 |												<td style="font-size: 0; line-height: 0;" width="20">&nbsp;</td>
 |												<td style="font-family: Arial, sans-serif; font-size: 12px; font-weight: bold;">
 |													<a href="http://www.facebook.com/bancochile.cl" style="color: #ffffff;">
 |														<img src="images/fb.gif" alt="Facebook" width="38" height="38" style="display: block;" border="0" />
 |													</a>
 |												</td>
 |											</tr>
 |										</table>
 |									</td>
 |								</tr>
 |							</table>
 |						</td>
 |					</tr>
 |				</table>
 |			</td>
 |		</tr>
 |	</table>
 |</body>
 |</html>
        """.stripMargin

      //mail.sendHtml("<html><div> Hola,<br/>" + message.toString() + "</br></div></html>")
      mail.sendHtml(html.toString)
    } catch {
      case ex: Exception => return "Check SMTP Details"
    }

    "Success"
  }
}