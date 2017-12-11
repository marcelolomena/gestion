package controllers

import art_forms.ARTForms
import models.ConfigMailAlert
import play.api.mvc.{Action, Controller}
import services.ConfigMailAlertService
import java.util.Date
import models.Activity
import models.ActivityTypes

object ConfigMail extends Controller with Secured {


  def mailList() = IsAuthenticatedAdmin() { _ =>
  { implicit request =>
    val username = request.session.get("username").get
    val pagNo = request.getQueryString("page")
    val pageRecord = request.getQueryString("record")
    val searchKey = request.getQueryString("search")

    var pageNumber = "1"
    var recordOnPage = "10"
    var search = ""

    if (pagNo != None) {
      pageNumber = pagNo.get.toString()
    }
    if (pageRecord != None) {
      recordOnPage = pageRecord.get.toString()
    }
    if (searchKey != None) {
      search = searchKey.get.toString()
    }

    val mailAlert = ConfigMailAlertService.findMailList(pageNumber, recordOnPage)
    val totalCount = ConfigMailAlertService.count()
    val pagination = Application.Pagination(totalCount, pageNumber, recordOnPage, search)
    Ok(views.html.configMail.mailList(mailAlert, username, totalCount, pagination))
  }
  }


  def editConfig() = Action { implicit request =>
    val username = request.session.get("username").get
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val objSM = ConfigMailAlertService.findLastConfig()
      if (!objSM.isEmpty) {
        val obj = ConfigMailAlert(objSM.get.id,
          objSM.get.uid,
          objSM.get.em1,
          objSM.get.em2,
          objSM.get.em3,
          objSM.get.tpl,
          objSM.get.fec,
          objSM.get.is_active
        )
        Ok(views.html.configMail.editConfigMail(username, ARTForms.configMailForm.fill(obj)))
      } else {
        Redirect(routes.ConfigMail.editConfig())
      }
    }
  }

  def createConfig = IsAuthenticatedAdmin() { _ =>
  { implicit request =>
    val username = request.session.get("username").get

    Ok(views.html.configMail.mailAdd(username,ARTForms.configMailForm))
  }
  }


  def updateConfig() = Action { implicit request =>
    val username = request.session.get("username").get
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val myForm = ARTForms.configMailForm.bindFromRequest
      myForm.fold(
        errors => {
          BadRequest(views.html.configMail.editConfigMail(username, errors))
        },
        success => {
          val the_Form = ConfigMailAlertService.validateConfigForm(myForm)
          if (the_Form.hasErrors) {
            BadRequest(views.html.configMail.editConfigMail(username, the_Form))
          } else {
            val uid = Integer.parseInt(request.session.get("uId").get.toString())
            val objUpdate = ConfigMailAlert(success.id,
              uid,
              success.em1,
              success.em2,
              success.em3,
              success.tpl,
              success.fec,
              success.is_active)
            val lastid = ConfigMailAlertService.updateConfig(objUpdate)
            //println("lastid : "+ lastid.get.toString)
            /**
              * Activity log
              */
            val act = Activity(
              ActivityTypes.ConfigMail.id,
              "ConfigMail updated by " + request.session.get("username").get,
              new Date(),
              Integer.parseInt(request.session.get("uId").get),
              success.id.get)
            Activity.saveLog(act)
            Redirect(routes.ConfigMail.editConfig())
          }
        })
    }
  }

}