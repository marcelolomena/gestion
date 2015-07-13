package controllers

import java.util.Date
import art_forms.ARTForms
import models.ProgramTypeCase
import models._
import play.api.mvc.Action
import play.api.mvc.Controller
import services.ProgramTypeService
import play.i18n._
object ProgramType extends Controller {
  var username = ""
  var description = ""
  var pageNumber = "1"
  var recordOnPage = "10"
  var search = ""

  val langObj = new Lang(Lang.forCode("es-ES"))

  def programTypeList() = Action { implicit request =>
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
      val programtypes = ProgramTypeService.findAllProgramTypeList(pageNumber, recordOnPage)

      var totalCount = ProgramTypeService.programTypeCount()

      var pagination = Application.Pagination(totalCount, pageNumber, recordOnPage, search)
      Ok(views.html.programType.programTypeList(programtypes, username, totalCount, pagination))
    }
  }

  def createProgramType() = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val result = request.session.get("username")
      var username = result.get
      Ok(views.html.programType.addProgramType(username, ARTForms.programTypeForm))
    }
  }

  def saveProgramType() = Action { implicit request =>
    val result = request.session.get("username")
    var username = result.get
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val myForm = ARTForms.programTypeForm.bindFromRequest
      myForm.fold(
        errors => {
          BadRequest(views.html.programType.addProgramType(username, errors))
        },
        programTypeForm => {
          var programType = programTypeForm.program_type.trim()
          val obj = ProgramTypeService.findProgramTypeByName(programType)
          if (obj.size > 0) {
            BadRequest(views.html.programType.addProgramType(username, myForm.withError("program_type", Messages.get(langObj, "program_type.alreadyexist")).fill(programTypeForm)))
          } else {
            if (programTypeForm.program_type.length() > 80) {
              programType = programType.substring(0, 79);
            }
            val objCreate = ProgramTypeMaster(programTypeForm.id, programType, programTypeForm.description, Integer.parseInt(request.session.get("uId").get), new Date(), false)
            val last = ProgramTypeService.saveProgramType(objCreate);
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Program_Type.id, "Program Type created by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), last.toInt)
            Activity.saveLog(act)
            Redirect(routes.ProgramType.programTypeList())
          }
        })
    }
  }

  def editProgramType(id: String) = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val objSM = ProgramTypeService.findProgramTypeById(id)
      if (!objSM.isEmpty) {
        val SM = ProgramTypeCase(objSM.get.id, objSM.get.program_type, objSM.get.description)
        val result = request.session.get("username")
        var username = result.get
        val f = ARTForms.programTypeForm.fill(SM)
        Ok(views.html.programType.editProgramType(username, f))
      } else {
        Redirect(routes.SubType.subTypeList())
      }
    }
  }

  def updateProgramType() = Action { implicit request =>
    val result = request.session.get("username")
    var username = result.get
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {

      val myForm = ARTForms.programTypeForm.bindFromRequest
      myForm.fold(
        errors => {
          BadRequest(views.html.programType.editProgramType(username, errors))
        },
        programTypeForm => {
          val theForm = services.ProgramTypeService.validateProgramTypeForm(myForm.fill(programTypeForm))
          if (theForm.hasErrors) {
            BadRequest(views.html.programType.editProgramType(username, theForm))
          } else {
            var programType = programTypeForm.program_type
            if (programTypeForm.program_type.length() > 80) {
              programType = programType.substring(0, 79);
            }
            val is_deleted = ProgramTypeService.findProgramTypeById(programTypeForm.id.get.toString).get.is_deleted

            val objUpdate = ProgramTypeMaster(programTypeForm.id, programType, programTypeForm.description, Integer.parseInt(request.session.get("uId").get), new Date(), is_deleted)
            ProgramTypeService.updateProgramType(objUpdate);
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Program_Type.id, "Program Type updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), programTypeForm.id.get)
            Activity.saveLog(act)
            Redirect(routes.ProgramType.programTypeList())
          }
        })
    }
  }

  def updateProgramTypeStatus(id: String, status: Boolean) = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      var is_deleted = 1
      if (status) {
        is_deleted = 0
      }
      val uid = Integer.parseInt(request.session.get("uId").get.trim())
      ProgramTypeService.changeProgramTypeStatus(id, is_deleted, uid)
      /**
       * Activity log
       */
      val act = Activity(ActivityTypes.Program_Type.id, "Program Type deleted by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), id.toInt)
      Activity.saveLog(act)
      /*      var programType = ProgramTypeService.findProgramTypeById(id);
      var isDel = false
      if (programType.get.is_deleted) {
        isDel = false
      } else {
        isDel = true
      }
      val objUpdate = ProgramTypeMaster(programType.get.id, programType.get.program_type, programType.get.description, Integer.parseInt(request.session.get("uId").get), new Date(), isDel)
      ProgramTypeService.updateProgramType(objUpdate)*/
      Ok("Success")
    }
  }
}