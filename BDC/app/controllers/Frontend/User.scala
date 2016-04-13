package controllers.Frontend

import java.io.File
import play.Play
import play.api.data._
import play.api.Play.current
import java.util.Date
import org.apache.commons.lang3.StringUtils
import art_forms.ARTForms
import models.Activity
import models.ActivityTypes
import models.Departments
import models.ForgotPasswordMaster
import models.Genrencias
import models.OfficeMaster
import models.PasswordMaster
import models.PasswordRecoverMaster
import models.UserMaster
import models.UserSkills
import models.Users
import models.Users.Rating
import play.api.data.Form
import play.api.mvc.Action
import play.api.mvc.Controller
import play.i18n.Lang
import play.i18n.Messages
import services.DepartmentService
import services.DivisionService
import services.GenrenciaService
import services.UserService
import services.ProgramService
//import com.mongodb.casbah.Imports._
//import com.mongodb.casbah.MongoCollection
//import com.mongodb.DBObject
import java.util.Date
import utils.SendEmail
import services.UserProfileServices
import models.SubTasks
import services.SubTaskServices
import models.ProgramMembers
import services.ProgramMemberService
import org.json.JSONObject
import org.json.JSONArray
import models.UserProfileMapping
import services.UserRoleService
import services.ProjectService
import services.TaskService
import services.RiskService
import services.ActivityLogServices
import services.EarnValueService
import services.UserProfileServices

object User extends Controller {

  val langObj = new Lang(Lang.forCode("es-ES"))

  /**
   * employee details information page
   */
  def employeeDetails(employeeid: Long) = Action { implicit request =>
    request.session.get("username").map { user =>
      val employee = UserService.findUserDetails(employeeid.intValue())
      val employeeOffice = UserService.findUserOfficeDetails(employeeid.intValue())
      val programs = UserService.findProgramListForUser(employeeid.toString())
      val pUserProjectList = null // UserService.findProjectsByUser(Integer.parseInt(employee.get.uid.get.toString()))
      val alerts = RiskService.findUserAlertsIds(employeeid.toString())
      val availability = UserProfileServices.findAvailability(employeeid.intValue())
      
      var consumos = new JSONArray();
      for(a <- availability)
      {
         var consumo = new JSONObject();
         consumo.put(a.fecha.toString(),a.horas)
         consumos.put(consumo)
      }
      println(consumos)
      
      /*
      var consumos = new JSONObject();
      for(a <- availability)
      {
         consumos.put(a.fecha.toString(),a.horas)
      }
      */
      val program_task = ProgramService.programas_sin_avance_en_tareas(employeeid.toString())
      
      // EarnValueService.calculateSubTaskEarnValue()

      Ok(views.html.frontend.user.employee(employee, employeeOffice, pUserProjectList, ARTForms.imgCropForm, programs, alerts, consumos, program_task)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * All employee listing
   */
  def userManagement() = Action { implicit request =>

    var divisionList = DivisionService.findAllDivision()
    var gerenciaList = GenrenciaService.findAllGenrencia()
    var departmentList = DepartmentService.findAllDepartmentS()
    var divisionMap = new java.util.HashMap[String, String]()
    for (div <- divisionList) {
      divisionMap.put(div.dId.get.toString(), div.division)
    }

    var gerenciaMap = new java.util.HashMap[String, String]()
    for (ger <- gerenciaList) {
      gerenciaMap.put(ger.dId.get.toString(), ger.genrencia)
    }

    var departmentMap = new java.util.HashMap[String, String]()
    for (dep <- departmentList) {
      departmentMap.put(dep.dId.get.toString(), dep.department)
    }

    var employeeCountDivisionWise = new java.util.HashMap[String, String]()
    var employeeCountReportingDirectToDivision = new java.util.HashMap[String, String]()
    var genrenciaDivisionWiseMap = new java.util.HashMap[String, Seq[Genrencias]]()
    var departmentGenrenciaWiseMap = new java.util.HashMap[String, Seq[Departments]]()
    var employeeCountGenrenciaWise = new java.util.HashMap[String, String]()
    var employeeCountReportingDirectToGerencia = new java.util.HashMap[String, String]()
    var employeeCountDepartmentWise = new java.util.HashMap[String, String]()

    var divisionId: String = "";
    for (division <- divisionList) {
      if (StringUtils.isEmpty(divisionId))
        divisionId = division.dId.get.toString;
      var genrenciaDivisionWise = GenrenciaService.findAllGenrenciaListByDivision(division.dId.get.toString)
      for (genrencia <- genrenciaDivisionWise) {
        var departmentGenerenciaWise = DepartmentService.findAllDepartmentListByGenrencia(genrencia.dId.get.toString);
        for (department <- departmentGenerenciaWise) {
          //println("Employee Count for department id - " + department.dId .get.toString + "  is - " + UserService.findEmployeeCountForDepartment(department.dId.get.toString).toString);
          employeeCountDepartmentWise.put(department.dId.get.toString, UserService.findEmployeeCountForDepartment(department.dId.get.toString, genrencia.dId.get.toString, division.dId.get.toString).toString);
        }
        departmentGenrenciaWiseMap.put(genrencia.dId.get.toString, departmentGenerenciaWise);
        //println("Employee Count for genrencia id - " + genrencia.dId .get.toString + "  is - " + UserService.findEmployeeCountForGenrencia(genrencia.dId.get.toString).toString);
        employeeCountGenrenciaWise.put(genrencia.dId.get.toString, UserService.findEmployeeCountForGenrencia(genrencia.dId.get.toString, division.dId.get.toString).toString)
        employeeCountReportingDirectToGerencia.put(genrencia.dId.get.toString, UserService.findEmployeeCountReportingToGenrencia(genrencia.dId.get.toString, division.dId.get.toString).toString)
      }
      //println("Employee Count for division id - " + division.dId .get.toString + "  is - " + UserService.findEmployeeCountForDivision(division.dId.get.toString).toString);
      genrenciaDivisionWiseMap.put(division.dId.get.toString, genrenciaDivisionWise);
      employeeCountDivisionWise.put(division.dId.get.toString, UserService.findEmployeeCountForDivision(division.dId.get.toString).toString);
      employeeCountReportingDirectToDivision.put(division.dId.get.toString, UserService.findEmployeeCountReportingToDivision(division.dId.get.toString).toString)
    }
    var userList: Seq[Users] = null;
    if (StringUtils.isNotEmpty(divisionId)) {
      userList = UserService.findPaginationUsersForDivision(divisionId, 0, 10);
      //userList = UserService.findUsersForDivision(divisionId);
    }
    val totalCount = UserService.findUsersCountForDivision(divisionId);

    Ok(views.html.frontend.user.admin(userList, divisionMap, gerenciaMap, departmentMap, divisionList, employeeCountDivisionWise, genrenciaDivisionWiseMap, employeeCountGenrenciaWise, departmentGenrenciaWiseMap, employeeCountDepartmentWise, employeeCountReportingDirectToDivision, employeeCountReportingDirectToGerencia, ARTForms.employeeSearchResultForm, totalCount)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
  }

  /**
   * All employee listing
   */
  def employeeOverview() = Action { implicit request =>

    var divisionList = DivisionService.findAllDivision();
    var employeeCountDivisionWise = new java.util.HashMap[String, String]()
    var employeeCountReportingDirectToDivision = new java.util.HashMap[String, String]()
    var genrenciaDivisionWiseMap = new java.util.HashMap[String, Seq[Genrencias]]()
    var departmentGenrenciaWiseMap = new java.util.HashMap[String, Seq[Departments]]()
    var employeeCountGenrenciaWise = new java.util.HashMap[String, String]()
    var employeeCountReportingDirectToGerencia = new java.util.HashMap[String, String]()
    var employeeCountDepartmentWise = new java.util.HashMap[String, String]()
    var divisionId: String = "";

    for (division <- divisionList) {
      if (StringUtils.isEmpty(divisionId))
        divisionId = division.dId.get.toString;
      //println("division id -- " + division.dId.get.toString);
      var genrenciaDivisionWise = GenrenciaService.findAllGenrenciaListByDivision(division.dId.get.toString)
      for (genrencia <- genrenciaDivisionWise) {
        var departmentGenerenciaWise = DepartmentService.findAllDepartmentListByGenrencia(genrencia.dId.get.toString);
        for (department <- departmentGenerenciaWise) {
          //println("Employee Count for department id - " + department.dId .get.toString + "  is - " + UserService.findEmployeeCountForDepartment(department.dId.get.toString).toString);
          employeeCountDepartmentWise.put(department.dId.get.toString, UserService.findEmployeeCountForDepartment(department.dId.get.toString, genrencia.dId.get.toString, division.dId.get.toString).toString);
        }
        departmentGenrenciaWiseMap.put(genrencia.dId.get.toString, departmentGenerenciaWise);
        //println("Employee Count for genrencia id - " + genrencia.dId .get.toString + "  is - " + UserService.findEmployeeCountForGenrencia(genrencia.dId.get.toString).toString);
        employeeCountGenrenciaWise.put(genrencia.dId.get.toString, UserService.findEmployeeCountForGenrencia(genrencia.dId.get.toString, division.dId.get.toString).toString)
        employeeCountReportingDirectToGerencia.put(genrencia.dId.get.toString, UserService.findEmployeeCountReportingToGenrencia(genrencia.dId.get.toString, division.dId.get.toString).toString)
      }
      //println("Employee Count for division id - " + division.dId .get.toString + "  is - " + UserService.findEmployeeCountForDivision(division.dId.get.toString).toString);
      genrenciaDivisionWiseMap.put(division.dId.get.toString, genrenciaDivisionWise);
      employeeCountDivisionWise.put(division.dId.get.toString, UserService.findEmployeeCountForDivision(division.dId.get.toString).toString);
      employeeCountReportingDirectToDivision.put(division.dId.get.toString, UserService.findEmployeeCountReportingToDivision(division.dId.get.toString).toString)
    }
    var userList: Seq[Users] = null;
    var count: Long = 0;
    if (StringUtils.isNotEmpty(divisionId)) {
      userList = UserService.findPaginationEmployeesReportingToDivision(divisionId, 1, 10);
      count = UserService.findEmployeesCountReportingToDivision(divisionId)
    }
    Ok(views.html.frontend.user.employeeOverview(userList, divisionList, employeeCountDivisionWise, genrenciaDivisionWiseMap, employeeCountGenrenciaWise, departmentGenrenciaWiseMap, employeeCountDepartmentWise, employeeCountReportingDirectToDivision, employeeCountReportingDirectToGerencia, ARTForms.employeeSearchResultForm, count)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
  }

  def getEmployeeList(parentId: String, parentType: String, isSelfRef: Boolean, pagenumber: Integer) = Action { implicit request =>

    var start = 1;
    var end = 10;
    if (pagenumber > 0) {
      start = ((pagenumber - 1) * 10) + 1;
      end = start + 9;
    }

    var count: Long = 0
    var userList: Seq[Users] = null;
    if (parentType.equals("DIVISION")) {
      if (isSelfRef) {
        userList = UserService.findPaginationEmployeesReportingToDivision(parentId, start, end);
        count = UserService.findEmployeesCountReportingToDivision(parentId)
        //userList = UserService.findEmployeesReportingToDivision(parentId);
      } else {
        userList = UserService.findPaginationEmployeesForDivision(parentId, start, end);
        count = UserService.findEmployeesCountForDivision(parentId)
        //userList = UserService.findEmployeesForDivision(parentId);
      }
    } else if (parentType.equals("GENERENCIA")) {
      if (isSelfRef) {
        var genrencia = GenrenciaService.findGenrenciaById(Integer.parseInt(parentId));
        userList = UserService.findPaginationEmployeesForGenrenciaOnly(parentId, genrencia.get.report_to.toString(), start, end);

        count = UserService.findEmployeesCountForGenrenciaOnly(parentId, genrencia.get.report_to.toString());

      } else {
        var genrencia = GenrenciaService.findGenrenciaById(Integer.parseInt(parentId));
        count = UserService.findEmployeesCountForGenrencia(parentId, genrencia.get.report_to.toString);
        userList = UserService.findPaginationEmployeesForGenrencia(parentId, genrencia.get.report_to.toString, start, end);

      }
    } else if (parentType.equals("DEPARTMENT")) {
      if (isSelfRef) {
        var genrencia = GenrenciaService.findGenrenciaById(Integer.parseInt(parentId));
        userList = UserService.findPaginationEmployeesReportingToGenrencia(parentId, genrencia.get.report_to.toString, start, end);
        count = UserService.findEmployeesCountReportingToGenrencia(parentId, genrencia.get.report_to.toString);

      } else {
        var department = DepartmentService.findDepartmentById(Integer.parseInt(parentId));
        var genrencia = GenrenciaService.findGenrenciaById(department.get.report_to);
        userList = UserService.findPaginationEmployeeForDepartment(parentId, genrencia.get.dId.get.toString(), genrencia.get.report_to.toString, start, end);
        count = UserService.findEmployeeCountForDepartment(parentId, genrencia.get.dId.get.toString(), genrencia.get.report_to.toString);
      }
    }
    Ok(views.html.frontend.user.employeeList(userList, parentId, parentType, count, start)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
  }

  def searchEmployeeResult = Action { implicit request =>
    var userList: Seq[Users] = null;
    var parentId = "";
    var parentType = "";

    val userSession = request.session + ("uId" -> request.session.get("uId").get) + ("username" -> request.session.get("username").get) + ("utype" -> request.session.get("utype").get)
    request.session.get("username").map { user =>
      ARTForms.employeeSearchResultForm.bindFromRequest.fold(
        errors => {
          //println("errors -- " + errors.data)
          Ok("Something Went Worng").withSession(userSession)
        },
        searchCriteria => {
          var searchText: String = searchCriteria.search_filter.getOrElse("") //if (!searchCriteria.search_filter.isEmpty) searchCriteria.search_filter.get else "";
          var division: String = searchCriteria.division.getOrElse("") //if (!searchCriteria.division.isEmpty) searchCriteria.division.get else "";
          var gerencia: String = searchCriteria.gerencia.getOrElse("") //if (!searchCriteria.gerencia.isEmpty) searchCriteria.gerencia.get else "";
          var department: String = searchCriteria.department.getOrElse("")
          var pageNumber: Integer = searchCriteria.start.get
          var end: Integer = searchCriteria.end.get
          var start: Integer = 0
          if (pageNumber > 0) {
            start = ((pageNumber - 1) * 10) + 1;
            end = start + 9;
          }
          //if (!searchCriteria.department.isEmpty) searchCriteria.department.get else "";
          userList = UserService.searchUser(searchText, division, gerencia, department, start, end);
          val count = UserService.searchUserCount(searchText, division, gerencia, department)
          //println("Count Of Employee List -- " + count)
          //println("User List Size -- " + userList.size);
          Ok(views.html.frontend.user.employeeList(userList, parentId, parentType, count, pageNumber)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
        });

    }.getOrElse {
      Redirect(routes.Login.loginUser());
    }
  }

  def getGerenciaForDivision(divisionId: String) = Action { implicit request =>
    //println("divisionId =  "+divisionId)
    var genrenciaDivisionWise = GenrenciaService.findAllGenrenciaListByDivision(divisionId)
    var gerenciaOptions: String = "<option value='' class='blank'>--- Choose Gerencia ---</option>";
    for (gerencia <- genrenciaDivisionWise) {
      gerenciaOptions = gerenciaOptions + "<option value='" + gerencia.dId.get.toString + "' class='blank'>" + gerencia.genrencia.toString() + "</option>";
    }
    Ok(gerenciaOptions);
  }

  def getDepartmentForGerencia(gerenciaId: String) = Action { implicit request =>
    var departmentGenrenciaWise = DepartmentService.findAllDepartmentListByGenrencia(gerenciaId);
    var departmentOptions: String = "<option value='' class='blank'>--- Choose Department ---</option>";
    for (department <- departmentGenrenciaWise) {
      departmentOptions = departmentOptions + "<option value='" + department.dId.get.toString + "' class='blank'>" + department.department.toString() + "</option>";
    }
    Ok(departmentOptions);
  }

  def forgotPassword = Action { implicit request =>
    Ok(views.html.forgotPassword(ARTForms.forgotPasswordUserNameForm, request.flash))
  }

  def submitUserName() = Action { implicit request =>
    request.session.get("username").map { user =>
      Redirect(routes.User.employeeDetails(request.session.get("uId").get.toLong))
    }.getOrElse {
      ARTForms.forgotPasswordUserNameForm.bindFromRequest.fold(
        hasErrors => {
          BadRequest(views.html.forgotPassword(hasErrors, request.flash))
        }, success => {
          val form = UserService.validateForgotPasswordForm(ARTForms.forgotPasswordUserNameForm.fill(success))
          if (form.hasErrors) {
            if (StringUtils.equals(form.error("user_name").get.message, Messages.get(langObj, "error.user.email.activationlink"))) {
              implicit val newFlash = request.flash + ("test_error" -> "Activation link already sent.")
              BadRequest(views.html.forgotPassword(form, newFlash))
            } else {
              BadRequest(views.html.forgotPassword(form, request.flash))
            }
          } else {
            val isverify = 0
            val newUuid = java.util.UUID.randomUUID().toString()
            val emailFromUserName = UserService.getEmailByUseName(success.user_name)
            val data = ForgotPasswordMaster(None, emailFromUserName, success.user_name, newUuid, Option(new Date()), null, Option(isverify))
            val recordInsert = UserService.saveForgotPasswordDetails(ForgotPasswordMaster(None, emailFromUserName, success.user_name, newUuid, Option(new Date()), null, Option(isverify)))
            // val recordInsert = 1;

            if (recordInsert.get >= 1) {
              val resetEmail = emailFromUserName
              val message = "Please reset your password. Please follow the following Link"
              //println("newUuid:" + newUuid)
              val url = "http://" + request.host + "/password-recovery/" + newUuid;
              val fromEmail = Play.application().configuration().getString("mail.from")
              SendEmail.sendEmailVerification(message, resetEmail, url, fromEmail)
            }

            Redirect(routes.Login.loginUser())
          }
        })
    }
  }

  def resendActivation(userName: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      Redirect(routes.User.employeeDetails(request.session.get("uId").get.toLong))
    }.getOrElse {
      val email = UserService.getEmailByUseName(userName)
      UserService.updateForgotPasswordFromEmail(email)

      val isverify = 0
      val newUuid = java.util.UUID.randomUUID().toString()
      val data = ForgotPasswordMaster(None, email, userName, newUuid, Option(new Date()), null, Option(isverify))
      val recordInsert = UserService.saveForgotPasswordDetails(ForgotPasswordMaster(None, email, userName, newUuid, Option(new Date()), null, Option(isverify)))
      if (recordInsert.get >= 1) {
        //println("email : " + email)
        val resendEmail = email
        val message = "Por favor cambie su clave, siguendo el siguiente Link"
        val url = "http://" + request.host + "/password-recovery/" + newUuid
        //println("url : " + url)
        val fromEmail = Play.application().configuration().getString("mail.from")
        //println("fromEmail : " + fromEmail)
        SendEmail.sendEmailVerification(message, resendEmail, url, fromEmail)
      }
      Redirect(routes.Login.loginUser())

    }
  }

  def passwordRecovery(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      Redirect(routes.User.employeeDetails(request.session.get("uId").get.toLong))
    }.getOrElse {
      Ok(views.html.recoverPassword(ARTForms.recoverPasswordForm, id))
    }
  }

  def passwordUpdate(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      Redirect(routes.User.employeeDetails(request.session.get("uId").get.toLong))
    }.getOrElse {

      ARTForms.recoverPasswordForm.bindFromRequest.fold(
        hasErrors => {

          Ok(views.html.recoverPassword(hasErrors, id))
        },
        success => {

          val theForm: Form[PasswordRecoverMaster] = UserService.validateRecoverForm(ARTForms.recoverPasswordForm.fill(success), id)
          if (theForm.hasErrors) {

            BadRequest(views.html.recoverPassword(theForm, id))
          } else {

            val email = UserService.getEmailByVerificationId(id)
            var users = UserService.findUserDetailsByEmail(email)

            if (!users.isEmpty) {
              val resetPassword = PasswordMaster(users.get.uid, "", success.new_password, success.confirm_password)
              UserService.updateUserPassword(resetPassword)
              UserService.updateForgotPasswordFromActivation(id)
            }
            Redirect(routes.Login.loginUser())
          }
        })
    }
  }

  def addNewUser = Action { implicit request =>
    request.session.get("username").map { user =>
      val result = request.session.get("username")
      val username = result.get

      val divisions = DivisionService.findAllDivisions
      val profiles = UserProfileServices.findActiveUserProfiles()
      val departments = DepartmentService.findAllDepartmentS()
      val gerencias = GenrenciaService.findAllGenrencia()

      var divisionMap = new java.util.HashMap[String, String]()
      var departmentsMap = new java.util.HashMap[String, String]()
      val profileIdMap = new java.util.HashMap[String, String]()
      val profileCodeMap = new java.util.HashMap[String, String]()
      for (prof_id <- profiles) {
        profileIdMap.put(prof_id.id.get.toString(), prof_id.profile_name)
      }
      for (prof_code <- profiles) {
        profileCodeMap.put(prof_code.profile_code.toString(), prof_code.profile_name)
      }

      for (d <- departments) {
        departmentsMap.put(d.dId.get.toString(), d.department)
      }
      var gerenciasMap = new java.util.HashMap[String, String]()
      for (g <- gerencias) {
        gerenciasMap.put(g.dId.get.toString(), g.genrencia)
      }
      for (d <- divisions) {
        divisionMap.put(d.dId.get.toString(), d.division)
      }

      Ok(views.html.frontend.user.addUser(username, profileIdMap, profileCodeMap, divisionMap, gerenciasMap, departmentsMap, ARTForms.userRegistrationForm))
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def usersList = Action { implicit request =>
    request.session.get("username").map { user =>
      val users = UserService.findUsers
      Ok(views.html.frontend.user.users(users))
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def saveUser = Action { implicit request =>
    val result = request.session.get("username")
    ARTForms.userRegistrationForm.bindFromRequest.fold(
      hasErrors => {

        val username = result.get
        val divisions = DivisionService.findAllDivisions
        val departments = DepartmentService.findAllDepartmentS()
        val gerencias = GenrenciaService.findAllGenrencia()
        var divisionMap = new java.util.HashMap[String, String]()
        var departmentsMap = new java.util.HashMap[String, String]()

        for (d <- divisions) {
          divisionMap.put(d.dId.get.toString(), d.division)
        }
        for (d <- departments) {
          departmentsMap.put(d.dId.get.toString(), d.department)
        }
        var gerenciasMap = new java.util.HashMap[String, String]()
        for (g <- gerencias) {
          gerenciasMap.put(g.dId.get.toString(), g.genrencia)
        }

        val profiles = UserProfileServices.findActiveUserProfiles()
        val profileIdMap = new java.util.HashMap[String, String]()
        val profileCodeMap = new java.util.HashMap[String, String]()

        for (prof_id <- profiles) {
          profileIdMap.put(prof_id.id.get.toString(), prof_id.profile_name)
        }
        for (prof_code <- profiles) {
          profileCodeMap.put(prof_code.profile_code.toString(), prof_code.profile_name)
        }
        BadRequest(views.html.frontend.user.addUser(username, profileIdMap, profileCodeMap, divisionMap, gerenciasMap, departmentsMap, hasErrors))
      },
      users => {
        val last = UserService.insertUser(users)

        /**
         * Activity log
         */
        val act = Activity(ActivityTypes.User.id, "New user details added by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), last.toInt)
        Activity.saveLog(act)

        Redirect(routes.User.userManagement())

      })
  }

  def nameMemberUser(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>

      val result = request.session.get("username")

      val user = UserService.findUserByMemberId(Integer.parseInt(id))
      val name = user.get.first_name + " " + user.get.last_name

      Ok(name.toString()).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }
  
  def nameUser(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>

      val result = request.session.get("username")

      val user = UserService.findUser(id)
      val name = user.get.first_name + " " + user.get.last_name

      Ok(name.toString()).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }  

  def editUser(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>

      val result = request.session.get("username")
      val username = result.get
      val divisions = DivisionService.findAllDivisions
      val profiles = UserProfileServices.findActiveUserProfiles()
      val user1 = UserService.findUserDetailsById(Integer.parseInt(id).toLong)
      val office = UserService.findUserOfficeDetailsById(Integer.parseInt(id).toLong)
      val gerencias = GenrenciaService.findAllGenrenciaListByDivision(office.get.division.toString)
      var profileIdMap = new java.util.HashMap[String, String]()
      var profileCodeMap = new java.util.HashMap[String, String]()
      var departmentsMap = new java.util.HashMap[String, String]()
      var gerenciasMap = new java.util.HashMap[String, String]()
      var divisionMap = new java.util.HashMap[String, String]()

      for (d <- divisions) {
        divisionMap.put(d.dId.get.toString(), d.division)
      }
      for (g <- gerencias) {
        gerenciasMap.put(g.dId.get.toString(), g.genrencia)
      }
      if (!office.get.gerencia.isEmpty) {
        val departments = DepartmentService.findAllDepartmentListByGenrencia(office.get.gerencia.get.toString())
        for (d <- departments) {
          departmentsMap.put(d.dId.get.toString(), d.department)
        }
      }
      for (prof_id <- profiles) {
        profileIdMap.put(prof_id.id.get.toString(), prof_id.profile_name)
      }
      for (prof_code <- profiles) {
        profileCodeMap.put(prof_code.profile_code.toString(), prof_code.profile_name)
      }

      val officemaster = OfficeMaster(office.get.division, office.get.gerencia, office.get.department,
        office.get.joining_date, office.get.office_number, office.get.isadmin, office.get.rate_hour,
        office.get.user_type, office.get.work_hours, office.get.bonus_app, office.get.user_profile)

      val userMatser = UserMaster(user1.get.uid, user1.get.uname, user1.get.profile_image, user1.get.first_name, user1.get.last_name, user1.get.email, user1.get.password, user1.get.birth_date, user1.get.rut_number, user1.get.contact_number, user1.get.isverify, user1.get.verify_code, user1.get.verify_date, user1.get.status, user1.get.added_date, officemaster)

      Ok(views.html.frontend.user.editUser(id, username, profileIdMap, profileCodeMap, divisionMap, gerenciasMap, departmentsMap, ARTForms.userUpdateForm.fill(userMatser))).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def updateUser(id: String) = Action { implicit request =>
    val result = request.session.get("username")
    val username = result.get
    val user = UserService.findUserDetailsById(Integer.parseInt(id).toLong)

    ARTForms.userUpdateForm.bindFromRequest.fold(
      errors => {
        val office = UserService.findUserOfficeDetailsById(Integer.parseInt(id).toLong)
        val divisions = DivisionService.findAllDivisions
        var divisionMap = new java.util.HashMap[String, String]()
        var departmentsMap = new java.util.HashMap[String, String]()
        var gerenciasMap = new java.util.HashMap[String, String]()

        for (d <- divisions) {
          divisionMap.put(d.dId.get.toString(), d.division)
        }

        val gerencias = GenrenciaService.findAllGenrenciaListByDivision(office.get.division.toString)
        for (g <- gerencias) {
          gerenciasMap.put(g.dId.toString(), g.genrencia)
        }

        if (!office.get.gerencia.isEmpty) {
          val departments = DepartmentService.findAllDepartmentListByGenrencia(office.get.gerencia.get.toString())
          for (d <- departments) {
            departmentsMap.put(d.dId.toString(), d.department)
          }
        }
        val profiles = UserProfileServices.findActiveUserProfiles()
        val profileIdMap = new java.util.HashMap[String, String]()
        val profileCodeMap = new java.util.HashMap[String, String]()
        for (prof_id <- profiles) {
          profileIdMap.put(prof_id.id.get.toString(), prof_id.profile_name)
        }
        for (prof_code <- profiles) {
          profileCodeMap.put(prof_code.profile_code.toString(), prof_code.profile_name)
        }
        BadRequest(views.html.frontend.user.editUser(id, username, profileIdMap, profileCodeMap, divisionMap, gerenciasMap, departmentsMap, errors)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      },
      users => {

        val officemaster = OfficeMaster(users.office.division, users.office.gerencia, users.office.department,
          users.office.joining_date, users.office.office_number, users.office.isadmin, users.office.rate_hour,
          users.office.user_type, users.office.work_hours, users.office.bonus_app, users.office.user_profile)

        val userMatser = UserMaster(user.get.uid, users.uname, users.profile_image, users.first_name, users.last_name, users.email, users.password, users.birth_date, users.rut_number, users.contact_number, user.get.isverify, user.get.verify_code, user.get.verify_date, users.status, user.get.added_date, officemaster)

        UserService.updateUser(userMatser, id)

        /**
         * Activity log
         */
        val act = Activity(ActivityTypes.User.id, "User details updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), Integer.parseInt(id))
        Activity.saveLog(act)

        Redirect(routes.User.userManagement())

      })
  }

  def editUsersSkills(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>

      var skills: Seq[models.Skills] = UserService.findAllSkills
      var user = UserService.findUserDetails(Integer.parseInt(id))
      var userOffice = UserService.findUserOfficeDetails(Integer.parseInt(id))

      var skillhashMap = new java.util.HashMap[String, String]()
      for (sk <- skills) {
        skillhashMap.put(sk.skill_id.toString(), sk.skill)
      }

      var ratehashMap = new java.util.TreeMap[String, String]()
      for (g <- Rating.values) {
        if (StringUtils.equals(g.toString(), "Bastante_Bien")) {
          ratehashMap.put((g.id + 1).toString, "Bastante Bien");
        } else {
          ratehashMap.put((g.id + 1).toString, g.toString());
        }

      }

      Ok(views.html.frontend.user.editUsersSkills(user, ratehashMap, skillhashMap, ARTForms.skillUpdate)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def updateSkills(uId: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var skills: Seq[models.Skills] = UserService.findAllSkills
      var skillhashMap = new java.util.HashMap[String, String]()
      var ratehashMap = new java.util.TreeMap[String, String]()
      var user = UserService.findUserDetails(Integer.parseInt(uId))

      for (sk <- skills) {
        skillhashMap.put(sk.skill_id.toString(), sk.skill)
      }

      for (g <- Rating.values) {
        if (StringUtils.equals(g.toString(), "Bastante_Bien")) {
          ratehashMap.put((g.id + 1).toString, "Bastante Bien");
        } else {
          ratehashMap.put((g.id + 1).toString, g.toString());
        }
      }
      ARTForms.skillUpdate.bindFromRequest.fold(
        hasErrors => {
          BadRequest(views.html.frontend.user.editUsersSkills(user, ratehashMap, skillhashMap, hasErrors)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
        }, success => {
          val uSkills = UserSkills(success.uId, 0, success.skill_id, success.rating, 0)
          val isAvailable = UserService.findUserSkillBySkill(success.uId, success.skill_id)
          if (isAvailable == 0) {
            UserService.insertUserSkills(uSkills)
          } else {
            UserService.updateUserSkills(uSkills)
          }

          /**
           * Activity log
           */
          val act = Activity(ActivityTypes.UserSkills.id, "Skills updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), Integer.parseInt(uId))
          Activity.saveLog(act)

          Ok(views.html.frontend.user.editUsersSkills(user, ratehashMap, skillhashMap, ARTForms.skillUpdate)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
        })
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }

  }

  def editUserRoles(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var user = UserService.findUserDetails(Integer.parseInt(id))
      val userProfileRoles = ProgramMemberService.findUserProfileMappingRoles(id)
      val roles = ProgramMemberService.findUserRoles(id)
      Ok(views.html.frontend.user.userProfileRoleMapping(user, roles, userProfileRoles)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def updateUserRoles(user_id: String, role_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var response = new JSONObject()
      if (!StringUtils.isEmpty(user_id) && !StringUtils.isEmpty(role_id)) {
        val member = UserProfileMapping(Option(0), user_id.toInt, role_id.toInt)
        val obj = ProgramMemberService.insertUserProfileMapping(member)
        if (obj.isWhole()) {
          response.put("status", "Sucess")
        } else {
          response.put("status", "Fail")
        }

      } else {
        response.put("status", "Fail")
      }
      Ok(response.toString())
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }

  }
  def removeUserRoles(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      var response = new JSONObject()
      if (!StringUtils.isEmpty(id)) {
        val role = ProgramMemberService.findUserProfileDetails(id)
        role match {
          case None =>
            response.put("status", "Fail")
          case Some(role: UserProfileMapping) =>
            ProgramMemberService.deleteUserProfileMapping(id)
            response.put("status", "Sucess")
        }
      } else {
        response.put("status", "Fail")
      }

      Ok(response.toString())
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }

  }

  def editUsersProfile(id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val userObj = UserService.findUserDetailsById(Integer.parseInt(id).toLong)
      if (userObj.isEmpty) {
        Redirect(routes.User.employeeDetails(id.toLong))
      } else {
        var deptIdString = ""
        var departmentsMap = new java.util.HashMap[String, String]()
        var gerenciasMap = new java.util.HashMap[String, String]()
        var divisionMap = new java.util.HashMap[String, String]()
        var profiles = UserProfileServices.findActiveUserProfiles()
        var profileIdMap = new java.util.HashMap[String, String]()
        var profileCodeMap = new java.util.HashMap[String, String]()

        val divisions = DivisionService.findAllDivisions
        val username = request.session.get("username").get
        val office = UserService.findUserOfficeDetailsById(Integer.parseInt(id).toLong)
        val gerenciaList = GenrenciaService.findAllGenrenciaListByDivision(office.get.division.toString)

        for (g <- gerenciaList) {
          if (!g.dId.isEmpty) {
            gerenciasMap.put(g.dId.get.toString(), g.genrencia)
            deptIdString += g.dId.get + ","
          }
        }

        if (!deptIdString.isEmpty) {
          deptIdString = deptIdString.trim().substring(0, deptIdString.length() - 1)
          val departments = DepartmentService.findAllDepartmentsByGerentiaIds(deptIdString)
          if (!departments.isEmpty) {
            for (d <- departments) {
              departmentsMap.put(d.dId.get.toString(), d.department)
            }
          }
        }
        for (d <- divisions) {
          divisionMap.put(d.dId.get.toString(), d.division)
        }
        for (prof_id <- profiles) {
          profileIdMap.put(prof_id.id.get.toString(), prof_id.profile_name)
        }
        for (prof_code <- profiles) {
          profileCodeMap.put(prof_code.profile_code.toString(), prof_code.profile_name)
        }

        val officemaster = OfficeMaster(office.get.division, Option(office.get.gerencia.getOrElse(0)), Option(office.get.department.getOrElse(0)),
          office.get.joining_date, office.get.office_number, office.get.isadmin, office.get.rate_hour,
          office.get.user_type, office.get.work_hours, office.get.bonus_app, office.get.user_profile)

        val userMatser = UserMaster(userObj.get.uid, userObj.get.uname, userObj.get.profile_image, userObj.get.first_name, userObj.get.last_name, userObj.get.email, userObj.get.password, userObj.get.birth_date, userObj.get.rut_number, userObj.get.contact_number, userObj.get.isverify, userObj.get.verify_code, userObj.get.verify_date, userObj.get.status, userObj.get.added_date, officemaster)

        Ok(views.html.frontend.user.editUsersProfile(id, username, profileIdMap, profileCodeMap, divisionMap, gerenciasMap, departmentsMap, ARTForms.userUpdateForm.fill(userMatser))).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
      }

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def updateUsersProfile(id: String) = Action { implicit request =>
    request.session.get("username").map { user1 =>
      ARTForms.userUpdateForm.bindFromRequest.fold(
        hasErrors => {

          var departmentsMap = new java.util.HashMap[String, String]()
          var gerenciasMap = new java.util.HashMap[String, String]()
          var divisionMap = new java.util.HashMap[String, String]()
          var profileIdMap = new java.util.HashMap[String, String]()
          var profileCodeMap = new java.util.HashMap[String, String]()
          val result = request.session.get("username")
          val username = result.get
          val user = UserService.findUserDetailsById(Integer.parseInt(id).toLong)
          val office = UserService.findUserOfficeDetailsById(Integer.parseInt(id).toLong)
          val gerencias = GenrenciaService.findAllGenrenciaListByDivision(office.get.division.toString)
          val divisions = DivisionService.findAllDivisions
          val profiles = UserProfileServices.findActiveUserProfiles()

          for (d <- divisions) {
            divisionMap.put(d.dId.get.toString(), d.division)
          }

          for (g <- gerencias) {
            gerenciasMap.put(g.dId.get.toString(), g.genrencia)
          }
          if (!office.get.gerencia.isEmpty) {
            val departments = DepartmentService.findAllDepartmentListByGenrencia(office.get.gerencia.get.toString())
            for (d <- departments) {
              departmentsMap.put(d.dId.get.toString(), d.department)
            }
          }
          for (prof_id <- profiles) {
            profileIdMap.put(prof_id.id.get.toString(), prof_id.profile_name)
          }
          for (prof_code <- profiles) {
            profileCodeMap.put(prof_code.profile_code.toString(), prof_code.profile_name)
          }

          val officemaster = OfficeMaster(office.get.division, office.get.gerencia, office.get.department,
            office.get.joining_date, office.get.office_number, office.get.isadmin, office.get.rate_hour,
            office.get.user_type, office.get.work_hours, office.get.bonus_app, office.get.user_profile)

          val userMatser = UserMaster(user.get.uid, user.get.uname, user.get.profile_image, user.get.first_name, user.get.last_name, user.get.email, user.get.password, user.get.birth_date, user.get.rut_number, user.get.contact_number, user.get.isverify, user.get.verify_code, user.get.verify_date, user.get.status, user.get.added_date, officemaster)

          BadRequest(views.html.frontend.user.editUsersProfile(id, username, profileIdMap, profileCodeMap, divisionMap, gerenciasMap, departmentsMap, hasErrors)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
        },
        success => {
          val officemaster = OfficeMaster(success.office.division, success.office.gerencia, success.office.department,
            success.office.joining_date, success.office.office_number, success.office.isadmin, success.office.rate_hour,
            success.office.user_type, success.office.work_hours, success.office.bonus_app, success.office.user_profile)

          val userMatser = UserMaster(success.uid, success.uname, success.profile_image, success.first_name, success.last_name, success.email, success.password, success.birth_date, success.rut_number, success.contact_number, success.isverify, success.verify_code, success.verify_date, success.status, success.added_date, officemaster)
          UserService.updateUserProfile(userMatser, id)

          /**
           * Activity log
           */
          val act = Activity(ActivityTypes.User.id, "User profile updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), Integer.parseInt(id))
          Activity.saveLog(act)

          Redirect(routes.User.employeeDetails(id.toLong))
        })
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }
  /*
  def artLog() = Action { implicit request =>
    request.session.get("username").map { user =>
      val allActivities = ActivityLogServices.findPaginationActivityLog(10, 1)
      val countActivities = ActivityLogServices.countActivityLogServices()
      Ok(views.html.frontend.artLog(allActivities, countActivities)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }
*/
  def getLogList(pagenumber: Integer) = Action { implicit request =>
    request.session.get("username").map { user =>
      val allActivities = ActivityLogServices.findPaginationActivityLog(25, pagenumber)
      val countActivities = ActivityLogServices.countActivityLogServices()

      Ok(views.html.frontend.artLog(allActivities, countActivities)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def getSkillsByskillId(skill_id: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      val userSkillObj = UserService.findUserSkillBySkillIdAndUserId(Integer.parseInt(request.session.get("uId").get), Integer.parseInt(skill_id))
      var rating = ""
      if (!userSkillObj.isEmpty) {
        rating = userSkillObj.get.rating.toString()
      }
      Ok(rating)
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def deleteSkill(id: String, uId: String) = Action { implicit request =>
    request.session.get("username").map { user =>
      if (StringUtils.isEmpty(id)) {
        Ok("Fail")
      } else {
        val userSkillObj = UserService.findUserSkillBySkillIdAndUserId(Integer.parseInt(uId), Integer.parseInt(id))
        if (!userSkillObj.isEmpty) {

          UserService.deleteSkill(uId, id)
          Ok("Success")
        } else {
          Ok("Fail")

        }

      }
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

}