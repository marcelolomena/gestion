package controllers

import java.lang.Long
import models._
import play.api.mvc.Action
import play.api.mvc.Controller
import services.LoginService
import services.ProjectService
import services.UserService
import art_forms.ARTForms
import views.html.defaultpages.badRequest
import org.apache.commons.lang3.StringUtils
import play.api.data.Form
import java.util.UUID
import java.awt.image._
import java.io.File
import java.awt.image.BufferedImage
import javax.imageio.ImageIO
import org.imgscalr.Scalr
import play.api.libs.json
import scala.tools.nsc.doc.model.Val
import play.api.libs.json.Json
import play.mvc.Results.Redirect
import play.Play

object Application extends Controller with Secured {

  /**
   * get the session user name..
   */
  var username = ""
  var project_name = ""
  var document = ""
  var statename = ""
  var cityname = ""
  var description = ""
  var budget = 0
  var budget_approved = 0
  var sap_code = ""
  var company_url = ""
  var countryname = ""
  var pageNumber = ""
  var recordOnPage = "10"
  var search = ""
  var totalCount = 0
  var projectId = ""
  var file_name = ""
  var project_sub_code = ""
  var project_manager = 0
  var budget_approved_staff = 0
  var budget_approved_contractor = 0
  var budget_approved_hardware = 0
  var budget_approved_software = 0
  var department_code = 0
  var program: Integer = -1
  var userSession = new play.api.mvc.Session

  var program_master: Option[ProgramMaster] = null
  /**
   * get all country details..
   */

  /**
   *   controller to get home page...
   */
  def index = IsAuthenticatedAdmin() { _ =>
    { implicit request =>
      var uId = -1
      var utype = -1

      val pagNo = request.getQueryString("page")
      val pageRecord = request.getQueryString("record")
      val searchKey = request.getQueryString("search")
      if (pagNo != None) {
        pageNumber = pagNo.get.toString()
      } else {
        pageNumber = "1"
      }
      if (pageRecord != None) {
        recordOnPage = pageRecord.get.toString()
      }
      if (searchKey != None) {
        search = searchKey.get.toString()
      }

      if (uId != -1) {
        val user = UserService.findUserDetailsById(uId)
        userSession = request.session + ("uId" -> uId.toString()) + ("username" -> user.get.uname) + ("utype" -> "1") + ("user_profile" -> user.get.user_profile)

        username = user.get.uname
      } else {
        val result = request.session.get("username")
        username = result.get
        userSession = request.session + ("uId" -> uId.toString()) + ("username" -> username) + ("utype" -> request.session.get("utype").get) + ("user_profile" -> request.session.get("user_profile").get)

      }
      //var pagination = Application.Pagination(totalCount, pageNumber, recordOnPage, search)

      //val users = UserService.findAllUsers(pageNumber, recordOnPage, search);

      // val countOfUsers = UserService.findCount(search);

      Redirect(routes.Division.divisionList()).withSession(userSession)
      //Ok(views.html.users.userList(users, username, countOfUsers, pagination)).withSession(userSession)

    }
  }

  /**
   * controller to display project list...
   */
  def projectList(page: Int) = IsAuthenticatedAdmin() { _ =>
    { implicit request =>
      var uId = -1
      var utype = -1

      if (request.session.get("uId") != None) {
        uId = Integer.parseInt(request.session.get("uId").get)
        utype = Integer.parseInt(request.session.get("utype").get)
      } else {
        uId = Integer.parseInt(request.session.get("uId").get)
        username = request.session.get("username").get
      }

      val pagNo = request.getQueryString("page")
      val pageRecord = request.getQueryString("record")
      val searchKey = request.getQueryString("search")
      if (pagNo != None) {
        pageNumber = pagNo.get.toString()
      } else {
        pageNumber = "1"
      }
      if (pageRecord != None) {
        recordOnPage = pageRecord.get.toString()
      }
      if (searchKey != None) {
        search = searchKey.get.toString()
      }

      if (uId != -1) {
        val user = UserService.findUserDetailsById(uId)
        userSession = request.session + ("uId" -> uId.toString()) + ("username" -> user.get.uname) + ("utype" -> "1") + ("user_profile" -> user.get.user_profile)

        username = user.get.uname
      } else {
        val result = request.session.get("username")
        username = result.get
        userSession = request.session + ("uId" -> uId.toString()) + ("username" -> username) + ("utype" -> request.session.get("utype").get) + ("user_profile" -> request.session.get("user_profile").get)

      }

      val projects = ProjectService.findAllProject(pageNumber, recordOnPage, search)
      if (search != "") {
        totalCount = Integer.parseInt(ProjectService.findTotalCount(search).toString)
      } else {
        totalCount = Integer.parseInt(ProjectService.findCount.toString)
      }

      var pagination = Application.Pagination(totalCount, pageNumber, recordOnPage, search)

      val users = UserService.findAllUsers(pageNumber, recordOnPage, search);

      val countOfUsers = UserService.findCount(search);

      Ok(views.html.users.userList(users, username, countOfUsers, pagination)).withSession(userSession)

    }

  }

  /**
   * Login form...
   */
  def login = IsAuthenticatedAdmin() { _ =>
    { implicit request =>

      val utype = Integer.parseInt(request.session.get("utype").get)
      if (utype == 1) {
        val userSession = request.session + ("uId" -> request.session.get("uId").get.toString()) + ("username" -> request.session.get("username").get.toString()) + ("utype" -> request.session.get("utype").get) + ("user_profile" -> request.session.get("user_profile").get)
        //Redirect(routes.Application.projectList(1)).withSession(userSession)
        Ok("")
      } else {
        Redirect(controllers.Frontend.routes.Login.loginUser()).withNewSession
      }
    }

  }

  /**
   * check user name and password from database...
   */
  def loginForm = IsAuthenticatedAdmin() { _ =>
    {
      implicit request =>
        val Uname = request.body.asFormUrlEncoded.get("uname")(0)
        val Pass = request.body.asFormUrlEncoded.get("pass")(0)

        val result = LoginService.loginCheck(Uname, Pass)

        result match {
          case None =>
            Redirect(routes.Application.login())
          case Some(login: Login) =>

            val userData = UserService.findUserDetailsById(Long.valueOf(login.uid.toString()))
            val userOffice = UserService.findUserOfficeDetailsById(Long.valueOf(login.uid.toString()))

            if (userData != null) {
              val userSession = request.session + ("uId" -> login.uid.toString()) + ("username" -> login.uname.toString()) + ("utype" -> userOffice.get.isadmin.toString) + ("user_profile" -> userOffice.get.user_profile.toString)
              //Redirect(routes.Application.projectList(1)).withSession(userSession)
              Ok("ok")
            } else {
              Redirect(controllers.Frontend.routes.Login.loginUser()).withNewSession
            }
          //val userSession = request.session + ("uId" -> login.uid.toString()) + ("username" -> login.uname.toString())

        }
    }

  }

  /**
   * clear session on signout
   */
  def signout = Action {
    Redirect(controllers.Frontend.routes.Login.loginUser()).withNewSession
  }

  def resetPassword() = Action { implicit request =>
    request.session.get("username").map { user =>
      Ok(views.html.resetPassword(ARTForms.resetPasswordForm)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
    }.getOrElse {
      Redirect(controllers.Frontend.routes.Login.loginUser()).withNewSession
    }
  }

  def changeProfileImage(id: Long) = Action { implicit request =>
    request.session.get("username").map { user =>
      val employee = UserService.findUserDetails(id.intValue())
      var employeeImage = ""
      if (!employee.get.profile_image.isEmpty) {
        employeeImage = employee.get.profile_image.get.toString()
      } else {
        employeeImage = "male_l.jpg"
      }
      Ok(views.html.changeProfileImage(employee, employeeImage, ARTForms.imgCropForm)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
    }.getOrElse {
      Redirect(controllers.Frontend.routes.Login.loginUser()).withNewSession
    }
  }
  def confirmPasswordUpdate = Action { implicit request =>
    request.session.get("username").map { user =>
      ARTForms.resetPasswordForm.bindFromRequest().fold(
        hasError => {
          BadRequest(views.html.resetPassword(hasError)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
        },
        success => {
          var isValid = false
          val employeeid = Integer.parseInt(request.session.get("uId").get)
          val theForm = UserService.validateForm(ARTForms.resetPasswordForm.fill(success))
          if (theForm.hasErrors) {
            BadRequest(views.html.resetPassword(theForm.fill(success))).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
          } else {
            val resetPassword = PasswordMaster(Option(employeeid), success.old_password, success.new_password, success.confirm_password)
            UserService.updateUserPassword(resetPassword)
            Redirect(controllers.Frontend.routes.User.employeeDetails(Long.parseLong(request.session.get("uId").get))).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
          }
        })
    }.getOrElse {
      Redirect(controllers.Frontend.routes.Login.loginUser()).withNewSession
    }
  }

  def uploadImage(id: Long) = Action(parse.multipartFormData) { implicit request =>
    request.session.get("username").map { user =>
      request.body.file("profile_image").map { picture =>
        val filename = picture.filename
        val contentType = picture.contentType
        var employeeImage = "male_l.jpg"
        val employee = UserService.findUserDetails(id.intValue())

        ARTForms.imgCropForm.bindFromRequest().fold(
          hasErrors => {
            BadRequest(views.html.changeProfileImage(employee, employeeImage, hasErrors)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
          },
          success => {
            var filePath: String = Play.application().configuration().getString("bdc.documents.location") + "/alldocuments/";
            if (filename.isEmpty()) {
              employeeImage = employee.get.profile_image.getOrElse("male_l.jpg")
              val form = ARTForms.imgCropForm.withError("profile_image", "File can not be empty.")
              BadRequest(views.html.changeProfileImage(employee, employeeImage, form)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
            } else if (checkIfPhoto(contentType.toString())) {
              employeeImage = employee.get.profile_image.getOrElse("male_l.jpg")
              val form = ARTForms.imgCropForm.withError("profile_image", "Please file format select jpg/gif/png.")
              BadRequest(views.html.changeProfileImage(employee, employeeImage, form)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
            } else {
              import java.io.File
              if (!(employee.get.profile_image.isEmpty)) {
                val file = new File(filePath + employee.get.profile_image.get)
                if (file.exists()) {
                  file.delete()
                }
              }
              val extension = filename.substring((filename.lastIndexOf(".") + 1), filename.length()).trim()
              println("extension   " + extension)
              employeeImage = UUID.randomUUID().toString() + "." + extension
              var orImg = ImageIO.read(picture.ref.file)
              val f = new File(filePath + employeeImage)
              //Resize image
              var dir: File = new File(filePath);
              if (!dir.exists()) {
                dir.mkdirs();
              }

              var rsImg = Scalr.resize(orImg, 400)
              ImageIO.write(rsImg, "jpg", f)
              //picture.ref.moveTo(new File(filePath + employeeImage), true)
              UserService.updateUserProfileImage(employeeImage, id.toString())
              Ok(views.html.changeProfileImage(employee, employeeImage, ARTForms.imgCropForm)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
            }
          })
      }.getOrElse {
        Redirect(routes.Application.index).flashing("error" -> "Missing file")
      }
    }.getOrElse {
      Redirect(controllers.Frontend.routes.Login.loginUser()).withNewSession
    }
  }

  def cropImage(id: Long) = Action { implicit request =>
    request.session.get("username").map { user =>
      val employee = UserService.findUserDetails(id.intValue())
      var employeeImage = employee.get.profile_image.getOrElse("male_l.jpg")
      ARTForms.imgCropForm.bindFromRequest().fold(
        hasErrors => {
          BadRequest(views.html.changeProfileImage(employee, employeeImage, hasErrors)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
        },
        success => {
          import java.io.File
          var filePath: String = Play.application().configuration().getString("bdc.documents.location") + "/alldocuments/";
          val file = new File(filePath + employeeImage)
          val x = request.body.asFormUrlEncoded.get("x")(0).toInt
          val y = request.body.asFormUrlEncoded.get("y")(0).toInt
          val h = request.body.asFormUrlEncoded.get("h")(0).toInt
          val w = request.body.asFormUrlEncoded.get("w")(0).toInt

          val extension = employeeImage.substring((employeeImage.lastIndexOf(".") + 1), employeeImage.length()).trim()
          val image = ImageIO.read(file)
          var crImg = image.getSubimage(x, y, w, h)
          crImg = Scalr.resize(crImg, 400, 400)
          val file2 = new File(filePath + employeeImage)
          val newTest = ImageIO.write(crImg, extension, file2)
          UserService.updateUserProfileImage(employeeImage, id.toString())
          Redirect(controllers.Frontend.routes.User.employeeDetails(id)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
        })
    }.getOrElse {
      Redirect(controllers.Frontend.routes.Login.loginUser()).withNewSession
    }
  }

  // check if photo is type jpeg or gif
  def checkIfPhoto(file: String) = {
    file match {
      case "image/jpeg" => true
      case "image/gif" => true
      case "image/png" => true
      case _ => false
    }
  }

  /**
   * pagination
   */
  def Pagination(count: Long, page: String, recordOnPage: String, search: String): String = {
    var i = 0
    var str = ""
    val pageDisplay = Math.ceil(count.toInt / Integer.parseInt(recordOnPage)).toInt
    if (pageDisplay != 1) {
      if (page != "1") {
        str += "<li class=preItem><a href=?page=1&record=" + recordOnPage + ">First</a></li>"
      }
      for (i <- 1 to pageDisplay) {
        if (page.toInt == i) {
          str += "<li><a href=javascript:void(0) class=color-black >" + i + "</a></li>"
        } else {
          str += "<li><a href=?page=" + i + "&record=" + recordOnPage + ">" + i + "</a></li>"
        }
      }

      if (page.toInt != pageDisplay && count != 0) {
        str += "<li class=preItem><a href=?page=" + pageDisplay + "&record=" + recordOnPage + ">Last</a></li>"
      }
    }
    return str
  }

  def PaginationProject(count: Int, page: Int, recordOnPage: Int): String = {
    var str = ""
    val pageDisplay = Math.ceil(count / recordOnPage).toInt
    if (pageDisplay != 1) {
      if (page != 1) {
        str += "<li class=preItem><a href=?page=1&record=" + recordOnPage + ">First</a></li>"
      }
      for (i <- 1 to pageDisplay) {
        if (page == i) {
          str += "<li><a href=javascript:void(0) class=color-black >" + i + "</a></li>"
        } else {
          str += "<li><a href=?page=" + i + "&record=" + recordOnPage + ">" + i + "</a></li>"
        }
      }

      if (page != pageDisplay && count != 0) {
        str += "<li class=preItem><a href=?page=" + pageDisplay + "&record=" + recordOnPage + ">Last</a></li>"
      }
    }
    return str
  }

  def PaginationTask(count: Int, page: Int, recordOnPage: Int): String = {
    var str = ""
    val pageDisplay = Math.ceil(count / recordOnPage).toInt
    if (pageDisplay != 1) {
      if (page != 1) {
        str += "<li class=preItem><a href=?pages=1&records=" + recordOnPage + ">First</a></li>"
      }
      for (i <- 1 to pageDisplay) {
        if (page == i) {
          str += "<li><a href=javascript:void(0) class=color-black >" + i + "</a></li>"
        } else {
          str += "<li><a href=?pages=" + i + "&records=" + recordOnPage + ">" + i + "</a></li>"
        }
      }

      if (page != pageDisplay && count != 0) {
        str += "<li class=preItem><a href=?pages=" + pageDisplay + "&records=" + recordOnPage + ">Last</a></li>"
      }
    }
    return str
  }

}