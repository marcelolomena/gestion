package controllers

import art_forms.ARTForms
import play.api.mvc.Action
import play.api.mvc.Controller
import services.SubTypeService
import java.util.Date
import models.SubTypeCase
import models.SubTypes
import models.Activity
import models.ActivityTypes
import play.i18n._

object SubType extends Controller {
  var username = ""
  var description = ""
  var pageNumber = "1"
  var recordOnPage = "10"
  var search = ""
  val langObj = new Lang(Lang.forCode("es-ES"))
  def subTypeList() = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val username = request.session.get("username").get
      val pagNo = request.getQueryString("page")
      val pageRecord = request.getQueryString("record")
      val searchKey = request.getQueryString("search")

      if (pagNo != None) {
        pageNumber = pagNo.get.toString()
      }
      if (pageRecord != None) {
        recordOnPage = pageRecord.get.toString()
      }

      if (searchKey != None) {
        search = searchKey.get.toString()
      }
      val subtypes = SubTypeService.findAllSubTypes(pageNumber, recordOnPage)
      var totalCount = SubTypeService.subTypeCount()
      var pagination = Application.Pagination(totalCount, pageNumber, recordOnPage, search)
      Ok(views.html.programSubType.subTypeList(subtypes, username, totalCount, pagination))
    }
  }

  def createSubType() = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val result = request.session.get("username")
      var username = result.get
      Ok(views.html.programSubType.addSubType(username, ARTForms.mySubTypeForm))
    }
  }

  def saveSubType() = Action { implicit request =>
    val result = request.session.get("username")
    var username = result.get
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val myForm = ARTForms.mySubTypeForm.bindFromRequest
      myForm.fold(
        errors => {
          println(errors.errors);
          BadRequest(views.html.programSubType.addSubType(username, errors))
        },
        subTypeform => {
          var programSubType = subTypeform.sub_type.trim()
          val obj = SubTypeService.findSubTypeByName(programSubType)
          if (obj.size > 0) {
            BadRequest(views.html.programSubType.addSubType(username, myForm.withError("sub_type", Messages.get(langObj, "sub_type.alreadyexist")).fill(subTypeform)))
          } else {
            if (subTypeform.sub_type.length() > 80) {
              programSubType = programSubType.substring(0, 79);
            }
            val objCreate = SubTypes(subTypeform.id, programSubType, subTypeform.description, Integer.parseInt(request.session.get("uId").get), new Date(), false)

            val last = SubTypeService.saveSubType(objCreate);
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Sub_Type.id, "Program Sub Type created by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), last.toInt)
            Activity.saveLog(act)
            Redirect(routes.SubType.subTypeList())
          }

        })
    }
  }

  def editSubType(id: String) = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val objSM = SubTypeService.findSubTypeById(id)
      //println("is Empty -- " + objSM.isEmpty);
      if (!objSM.isEmpty) {
        val SM = SubTypeCase(objSM.get.id, objSM.get.sub_type, objSM.get.description)
        val result = request.session.get("username")
        var username = result.get
        val f = ARTForms.mySubTypeForm.fill(SM)
        Ok(views.html.programSubType.editSubType(username, f))
      } else {
        Redirect(routes.SubType.subTypeList())
      }
    }
  }

  def updateSubType() = Action { implicit request =>
    val result = request.session.get("username")
    var username = result.get
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val myForm = ARTForms.mySubTypeForm.bindFromRequest
      myForm.fold(
        errors => {
          BadRequest(views.html.programSubType.editSubType(username, errors))
        },
        subTypeform => {
          val theForm = services.SubTypeService.validateSubTypeForm(myForm.fill(subTypeform))
          if (theForm.hasErrors) {
            BadRequest(views.html.programSubType.editSubType(username, theForm))
          } else {
            var programSubType = subTypeform.sub_type
            if (subTypeform.sub_type.length() > 80) {
              programSubType = programSubType.substring(0, 79);
            }
            val is_deleted = SubTypeService.findSubTypeById(subTypeform.id.get.toString).get.is_deleted
            val objUpdate = SubTypes(subTypeform.id, programSubType, subTypeform.description, Integer.parseInt(request.session.get("uId").get), new Date(), is_deleted)
            SubTypeService.updateSubType(objUpdate);
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Sub_Type.id, "Program Sub Type updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), subTypeform.id.get)
            Activity.saveLog(act)
            Redirect(routes.SubType.subTypeList())
          }

        })
    }
  }

  def updateSubTypeStatus(subtype_id: String, status: Boolean) = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      /*var subType = SubTypeService.findSubTypeById(id);
			if (subType.get.is_deleted) {
				val objUpdate = SubTypes(subType.get.id, subType.get.sub_type, subType.get.description, Integer.parseInt(request.session.get("uId").get), new Date(), false)
				SubTypeService.updateSubType(objUpdate)
			} else {
				val objUpdate = SubTypes(subType.get.id, subType.get.sub_type, subType.get.description, Integer.parseInt(request.session.get("uId").get), new Date(), true)
				SubTypeService.updateSubType(objUpdate)
			}*/
      var is_deleted = 1
      if (status) {
        is_deleted = 0
      }
      val uid = Integer.parseInt(request.session.get("uId").get.trim())
      SubTypeService.changeSubTypeStatus(subtype_id, is_deleted, uid)
      /**
       * Activity log
       */
      val act = Activity(ActivityTypes.Sub_Type.id, "Program Sub Type deleted by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), subtype_id.toInt)
      Activity.saveLog(act)
      Ok("Success")
    }
  }
}