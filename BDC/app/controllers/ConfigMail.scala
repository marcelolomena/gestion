package controllers

import art_forms.ARTForms
import models.ConfigMailAlert
import play.api.mvc.{Action, Controller}
import services.ConfigMailAlertService
import java.util.Date
import models.Activity
import models.ActivityTypes
import org.apache.commons.lang3.StringUtils
import play.Logger
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

  def editConfiguration(id: String) = IsAuthenticatedAdmin() { _ =>
  { implicit request =>
    val username = request.session.get("username").get
    if (StringUtils.isNotBlank(id)) {
      val category = ConfigMailAlertService.findConfigById(id)
      category match {
        case None =>
          Redirect(routes.Category.categoryList())
        case Some(conf: ConfigMailAlert) =>
          val obj = ConfigMailAlert(conf.id, conf.uid, conf.em1, conf.em2, conf.em3,
            conf.tpl, conf.fec, conf.is_active, conf.description)
          Ok(views.html.configMail.editConfigMail(username, ARTForms.configMailForm.fill(obj)))
      }
    } else {
      Redirect(routes.ConfigMail.mailList)
    }
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
          objSM.get.is_active,
          objSM.get.description
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

  def saveConfig = IsAuthenticatedAdmin() { _ =>
  { implicit request =>
    val uid = Integer.parseInt(request.session.get("uId").get)
    ARTForms.configMailForm.bindFromRequest.fold(
      hasErrors => {
        val username = request.session.get("username").get.toString
        BadRequest(views.html.configMail.mailAdd(username,hasErrors))
      },
      success => {
        val username = request.session.get("username").get.toString
        val em1 = success.em1.get.trim()
        val em2 = success.em3.get.trim()
        val em3 = success.em3.get.trim()
        val fec = success.fec
        val active = success.is_active
        val tpl = success.tpl

        //val obj = CategoryServices.findCategoryByName(description)

        //if (obj.size > 0) {
          //BadRequest(views.html.category.categoryAdd(username,ARTForms.categoryForm.withError("description", Messages.get(langObj, "Ya existe esta categoría")).fill(success)))
        //} else {
          val uid = Integer.parseInt(request.session.get("uId").get)
          val obj = ConfigMailAlert(success.id, uid, success.em1,
            success.em2,success.em3,success.tpl,success.fec, active, success.description)
          val last = ConfigMailAlertService.saveConfig(obj)
          /**
            * Activity log
            */
          val act = Activity(ActivityTypes.ConfigMail.id, "New Mail Template created by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), last.toInt)
          Activity.saveLog(act)
          Redirect(routes.ConfigMail.mailList)
        //}
      })
  }
  }

  def updateStatusConfig(id: String, status: Boolean) = IsAuthenticatedAdmin() { _ =>
  { implicit request =>
    if (StringUtils.isNotBlank(id)) {

      val conf_id = Integer.parseInt(id)
      var is_deleted = 0
      if (status) {
        is_deleted = 1
      }

      ConfigMailAlertService.changeStatusConfig(conf_id, is_deleted)
      /**
        * Activity log
        */
      val act = Activity(ActivityTypes.ConfigMail.id, "Mail Template status updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), conf_id)
      Activity.saveLog(act)
    }
    Ok("Success")
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
          //Logger.debug("quwe paso " + errors)
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
              success.is_active,
              success.description)
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
            Redirect(routes.ConfigMail.mailList)
          }
        })
    }
  }

}