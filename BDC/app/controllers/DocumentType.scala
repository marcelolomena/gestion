package controllers

import art_forms.ARTForms
import models.DocumentTypes
import play.api.mvc.Action
import play.api.mvc.Controller
import play.i18n.Lang
import play.i18n.Messages
import services.DocumentTypeService
import models.Activity
import models.ActivityTypes
import java.util.Date

object DocumentType extends Controller {
  var username = ""
  var description = ""
  var pageNumber = "1"
  var recordOnPage = "10"
  var search = ""
  val langObj = new Lang(Lang.forCode("es-ES"))

  def documentTypeList() = Action { implicit request =>
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
      val dtypes = DocumentTypeService.findAllDocumentType(pageNumber, recordOnPage)
      var totalCount = DocumentTypeService.documentTypeCount
      var pagination = Application.Pagination(totalCount, pageNumber, recordOnPage, search)
      Ok(views.html.documentType.documentTypeList(dtypes, username, totalCount, pagination))
    }
  }

  def createDocumentType() = Action { implicit request =>
    val result = request.session.get("username")
    var username = result.get
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      Ok(views.html.documentType.addDocumentType(username, ARTForms.DocumentTypeForm))
    }
  }

  def saveDocumentType() = Action { implicit request =>
    val result = request.session.get("username")
    var username = result.get
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      ARTForms.DocumentTypeForm.bindFromRequest.fold(
        errors => {
          BadRequest(views.html.documentType.addDocumentType(username, errors))
        },
        success => {
          val document_type = success.document_type.trim()
          val obj = DocumentTypeService.findDocumentTypeByName(document_type)
          if (obj.size > 0) {
            BadRequest(views.html.documentType.addDocumentType(username, ARTForms.DocumentTypeForm.withError("document_type", Messages.get(langObj, "document_type.alreadyexist")).fill(success)))
          } else {
            val uId = Integer.parseInt(request.session.get("uId").get)
            val objCreate = DocumentTypes(success.id, success.document_type, success.description, Option(uId), success.updation_date, success.creation_date, success.is_deleted)
            val last = DocumentTypeService.saveDocumentType(objCreate)
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Document_Type.id, "Document Type created by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), last.toInt)
            Activity.saveLog(act)
            Redirect(routes.DocumentType.documentTypeList())
          }
        })
    }
  }

  def editDocumentType(id: String) = Action { implicit request =>
    val result = request.session.get("username")
    var username = result.get
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val objSM = DocumentTypeService.findDocumentTypeById(id)
      if (!objSM.isEmpty) {
        val obj = DocumentTypes(objSM.get.id, objSM.get.document_type, objSM.get.description, objSM.get.updated_by, objSM.get.updation_date, objSM.get.creation_date, objSM.get.is_deleted)
        Ok(views.html.documentType.editDocumentType(username, ARTForms.DocumentTypeForm.fill(obj)))
      } else {
        Redirect(routes.DocumentType.documentTypeList())
      }
    }
  }

  def updateDocumentType() = Action { implicit request =>
    val result = request.session.get("username")
    var username = result.get
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val myForm = ARTForms.DocumentTypeForm.bindFromRequest
      myForm.fold(
        errors => {
          println(errors.errors)
          BadRequest(views.html.documentType.editDocumentType(username, errors))
        },
        success => {
          val theForm = DocumentTypeService.validateDocumentTypeForm(myForm.fill(success))
          if (theForm.hasErrors) {
            BadRequest(views.html.documentType.editDocumentType(username, theForm))
          } else {
            val uid = Integer.parseInt(request.session.get("uId").get.toString())
            val objUpdate = DocumentTypes(success.id, success.document_type, success.description, Option(uid), success.updation_date, success.creation_date, success.is_deleted)
            DocumentTypeService.updateDocumentType(objUpdate)
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Document_Type.id, "Document Type updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), success.id.get)
            Activity.saveLog(act)
            Redirect(routes.DocumentType.documentTypeList())
          }
        })
    }
  }

  def updateDocumentTypeStatus(id: String, status: Boolean) = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      var is_deleted = 1
      if (status) {
        is_deleted = 0
      }
      val uid = Integer.parseInt(request.session.get("uId").get.trim())
      DocumentTypeService.changeDocumentTypeStatus(id, is_deleted, uid)
      /**
       * Activity log
       */
      val act = Activity(ActivityTypes.Document_Type.id, "Document Type deleted by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), id.toInt)
      Activity.saveLog(act)
      Ok("Success")
    }
  }

}