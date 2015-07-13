package controllers.Frontend

import play.api.mvc.Action
import play.api.mvc.Result
import play.api.mvc.Controller
import play.Play
import play.api.Play.current
import play.api.data._
import play.api.data.Forms._
import java.io.FileInputStream
import java.text.SimpleDateFormat
import services.ProgramTypeService
import models.Program_Master
import models.Program_Master
import services.PertService
import org.apache.commons.lang3.StringUtils
import art_forms.ARTForms
import services.DocumentTypeService
import services.UserService
import services.ProgramService
import services.ProjectService
import services.TemplateService
import services.PertService

object Pert extends Controller {

  def generatePert() = Action { implicit request =>
    request.session.get("username").map { user =>

      val userSession = request.session + ("uId" -> request.session.get("uId").get) + ("username" -> request.session.get("username").get) + ("utype" -> request.session.get("utype").get) + ("user_profile" -> request.session.get("user_profile").get)

      var programValues = new java.util.HashMap[String, String]()
      val programs = ProgramService.findActivePrograms
      if (programs.size > 0) {
        for (p <- programs) {
          programValues.put(p.program_id.get.toString(), p.program_name)
        }
      }

      var userValues = new java.util.HashMap[String, String]()
      val users = UserService.findAllCEOList
      if (users.size > 0) {
        for (u <- users) {
          userValues.put(u.uid.get.toString(), u.last_name)
        }
      }

      var templateValues = new java.util.HashMap[String, String]()
      val templates = TemplateService.findAllTemplates
      if (templates.size > 0) {
        for (t <- templates) {
          templateValues.put(t.id.toString(), t.generic_project_type)
        }
      }

      Ok(views.html.frontend.program.generatePert(programValues, userValues, templateValues, ARTForms.pertForm)).withSession(userSession)
    }.getOrElse {
      Redirect(routes.Login.loginUser());
    }
  }

  def resultPert() = Action { implicit request =>
    request.session.get("username").map { user =>

      val userSession = request.session + ("uId" -> request.session.get("uId").get) + ("username" -> request.session.get("username").get) + ("utype" -> request.session.get("utype").get) + ("user_profile" -> request.session.get("user_profile").get)

      var programValues = new java.util.HashMap[String, String]()
      val programs = ProgramService.findActivePrograms
      if (programs.size > 0) {
        for (p <- programs) {
          programValues.put(p.program_id.get.toString(), p.program_name)
        }
      }


      var userValues = new java.util.HashMap[String, String]()
      val users = UserService.findAllCEOList
      if (users.size > 0) {
        for (u <- users) {
          userValues.put(u.uid.get.toString(), u.last_name)
        }
      }

      var templateValues = new java.util.HashMap[String, String]()
      val templates = TemplateService.findAllTemplates
      if (templates.size > 0) {
        for (t <- templates) {
          templateValues.put(t.id.toString(), t.generic_project_type)
        }
      }

      ARTForms.pertForm.bindFromRequest.fold(
        hasErrors => {
          BadRequest(views.html.frontend.program.generatePert(programValues, userValues, templateValues, hasErrors)).withSession(userSession)
        },
        success => {
          var direccionText: String = if (!success.direccion.isEmpty) success.direccion else "";
         	
        	val calculo = PertService.pert(new SimpleDateFormat("dd-MM-yyyy").format(success.fecha), 
        	    success.plantilla, 2, success.cajero,success.programa,success.direccion,success.lider)
        	println(calculo)
        	
          Ok(views.html.frontend.program.generatePert(programValues, userValues, templateValues, ARTForms.pertForm)).withSession(userSession)

        });
    }.getOrElse {
      Redirect(routes.Login.loginUser());
    }
  }

}