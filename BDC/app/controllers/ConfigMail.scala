package controllers

import art_forms.ARTForms
import models.ConfigMailAlert
import play.api.mvc.{Action, Controller}
import services.ConfigMailAlertService

object ConfigMail extends Controller {

  def editConfig() = Action { implicit request =>
    val result = request.session.get("username")
    var username = result.get
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val objSM = ConfigMailAlertService.findLastConfig()
      if (!objSM.isEmpty) {
        val obj = ConfigMailAlert(objSM.get.id, objSM.get.uid, objSM.get.em1, objSM.get.em2, objSM.get.em3, objSM.get.tpl, objSM.get.fec)
        Ok(views.html.configMail.editConfigMail(username, ARTForms.configMailForm.fill(obj)))
      } else {
        Redirect(routes.Stage.stageList())
      }
    }
  }

  def updateConfig() = Action { implicit request =>
    val result = request.session.get("username")
    val username = result.get
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
            val objUpdate = ConfigMailAlert(success.id, uid, success.em1, success.em2,success.em3, success.tpl, success.fec)
            ConfigMailAlertService.updateConfig(objUpdate)
            /**
              * Activity log
              */
            //val act = Activity(ActivityTypes.Stage.id, "Stage updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), success.id.get)
            //Activity.saveLog(act)
            Redirect(routes.ConfigMail.editConfig())
          }
        })
    }
  }

}
