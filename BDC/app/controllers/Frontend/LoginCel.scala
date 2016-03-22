package controllers.Frontend

import java.lang.Boolean
import java.util.Date

import art_forms.ARTForms
import models.Activity
import models.ActivityTypes
import models.Project
import models.UserSetting
import play.api.mvc.Action
import play.api.mvc.Controller
import services.AdminService
import services.LoginService
import services.ProjectManagerService
import services.ProjectService
import services.UserService
//import services.ProgramaService
import com.microsoft.sqlserver.jdbc.SQLServerException

object LoginCel extends Controller {

  def loginUser = Action { implicit request =>
    val sesssionToMaintain = request.session.get("username")
    val utypeSession = request.session.get("utype")
    val us = UserService.findAllUsers();

    /*val act = Activity(ActivityTypes.Program.id, "New Program Test", new Date(), 1, 100)
		val logs = Activities.saveLog(act)
		val alls = Activities.getConnection.find()
		for (a <- alls) {
			println(a);
		}*/
    /*var builder = MongoDBObject.newBuilder
		
		 builder += "foo" -> "bala"
     builder += "x" -> "y"
     builder += ("pie" -> 3.14)
     builder += ("spam" -> "eggs", "mmm" -> "bacon")
		
		val newObj = builder.result
		
      val deals = MongoConnection("localhost")("mydb")("log")
      deals.save(newObj)
      
		println("--------"+newObj)
		
		println("==========="+MongoFactory.mongoColl)*/

    Ok(views.html.frontend.user.loginUser(ARTForms.loginForm)).withNewSession
  }

  /**
   * User login method
   */
  def loggedIn = Action { implicit request =>
    ARTForms.loginForm.bindFromRequest().fold(
      hasErrors => {
        println(hasErrors.errors);
        BadRequest("ERROR"+hasErrors.errors)
      },
      success => {
        val theForm = LoginService.validateForm(ARTForms.loginForm.fill(success))
        if (theForm.hasErrors) {
          BadRequest("ERROR"+theForm.hasErrors)
        } else {

          try {
            val result = LoginService.loginUserCheck(theForm.data.get("uname").get, theForm.data.get("password").get)

            val uType = result.get.isadmin
            val user_profile = result.get.user_profile
            val uid = result.get.uid.get.toString()
            //val numSub=ProgramaService.cantidadSubalternos(uid)
            //println("numSub : " + numSub)
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Login.id, "Login by Mobile " + result.get.uname, new Date(), result.get.uid.get, result.get.uid.get)
            Activity.saveLog(act)

            Redirect(routes.TimeSheetCel.productsTimesheet()).withSession("username" -> result.get.uname, "utype" -> result.get.isadmin.toString(), "uId" -> result.get.uid.get.toString(), "user_profile" -> user_profile)
          } catch {
            case e: SQLServerException => Ok(views.html.frontend.user.loginUser(ARTForms.loginForm)).withNewSession
          }

        }
      })
  }

  /**
   * User log out method
   */
  def loggedOut = Action {
    implicit request =>

      /**
       * Activity log
       */
      val act = Activity(ActivityTypes.Login.id, "Log out by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), Integer.parseInt(request.session.get("uId").get))
      Activity.saveLog(act)

      Redirect(routes.Login.loginUser()).withNewSession
  }

  /**
   * User Setting for project management...not in use
   */
  def userSetting = Action { implicit request =>
    request.session.get("username").map { user =>

      val uId = Integer.parseInt(request.session.get("uId").get)
      val utype = Integer.parseInt(request.session.get("utype").get)
      var pIds = "";

      val pList = UserService.findProjectsByUser(uId)

      for (p <- pList) {
        if (pIds == "")
          pIds = p.pId.toString
        else
          pIds = pIds + ", " + p.pId.toString

      }

      val pUserProjectList = UserService.findProjectListForUser(uId)

      Ok(views.html.frontend.user.customizeSetting(pUserProjectList, pList, pIds, uId.toString)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }

  }

  /**
   * Update Project display setting...not in use
   */
  def updateUserProjectManagementSetting = Action {
    implicit request =>

      val pIds = request.body.asFormUrlEncoded.get("pId")(0).split(",")
      val uId = Integer.parseInt(request.body.asFormUrlEncoded.get("uId")(0).toString())

      UserService.updateProjectForUser(uId, 0)

      if (pIds.length > 0) {
        for (p <- pIds) {
          val pId = Integer.parseInt(p.toString().trim())
          val isExist = UserService.checkUserSettingbyuIdandpId(uId, pId)
          if (isExist) {
            val pmSetting = UserSetting(uId, pId, 1)
            UserService.saveUserSetting(pmSetting)
          } else {
            val pmSetting = UserSetting(uId, pId, 1)
            UserService.updateUserSetting(pmSetting)
          }

        }

        Ok("Success")
      } else {
        Ok("fail")
      }
  }

  /**
   * Search user projects....Not in use
   */
  def userSearchSetting = Action { implicit request =>

    val uId = Integer.parseInt(request.session.get("uId").get)
    val search = request.getQueryString("search").get
    val utype = Integer.parseInt(request.session.get("utype").get)
    var pList: Seq[Project] = null
    var stringList = ""

    pList = ProjectService.searchProjects(search)
    for (p <- pList) {
      var isSelected: Boolean = false
      var pmProject: Option[models.PMSetting] = null
      var adminProject: Option[models.AdminSetting] = null
      var ceoProject: Option[models.CEOSetting] = null

      if (utype == 1) {
        //admin
        // adminProject = AdminService.findAdminProjects(uId, Integer.parseInt(p.pId.toString()))
        if (!adminProject.isEmpty) {
          isSelected = true
        }
      } else if (utype == 2) {
        //pm
        pmProject = ProjectManagerService.findProjectManagerProjects(uId, Integer.parseInt(p.pId.toString()))
        if (!pmProject.isEmpty) {

          isSelected = true
        }
      }

      if (stringList == "") {
        if (isSelected) {
          stringList = "<a herf='/project-details/" + p.pId + "' target='_blank' class='p_details_list'><span style='float:left;width: 550px; '><input type='checkbox' class='chk-select' checked='checked'  name='" + p.pId + "' value=''>" + ProjectService.findProjectDetails(Integer.parseInt(p.pId.toString)).get.project_name + "<br></span></a>"
        } else {
          stringList = "<a herf='/project-details/" + p.pId + "' target='_blank' class='p_details_list'><span style='float:left;width: 550px; '><input type='checkbox' class='chk-select'   name='" + p.pId + "' value=''>" + ProjectService.findProjectDetails(Integer.parseInt(p.pId.toString)).get.project_name + "<br></span></a>"
        }

      } else {
        if (isSelected) {
          stringList = stringList + " <a herf='/project-details/" + p.pId + "' target='_blank' class='p_details_list'><span style='float:left;width: 550px; '><input type='checkbox' class='chk-select' checked='checked'   name='" + p.pId + "' value=''>" + ProjectService.findProjectDetails(Integer.parseInt(p.pId.toString)).get.project_name + "<br></span></a>"
        } else {
          stringList = stringList + " <a herf='/project-details/" + p.pId + "' target='_blank' class='p_details_list'><span style='float:left;width: 550px; '><input type='checkbox' class='chk-select'   name='" + p.pId + "' value=''>" + ProjectService.findProjectDetails(Integer.parseInt(p.pId.toString)).get.project_name + "<br></span></a>"
        }

      }

    }

    //val string = " <a herf='/project-details/@p.pId' target='_blank' class='p_details_list'><span style='float:left;width: 550px; '><input type='checkbox' class='chk-select' checked=true  name='@p.pId' value=''>@Project.findProjectDetails(Integer.parseInt(p.pId.toString)).get.project_name<br></span></a>'

    Ok(stringList)

  }

}