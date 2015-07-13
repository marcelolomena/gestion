package controllers

import java.util.Date
import org.apache.commons.lang3.StringUtils
import art_forms.ARTForms
import models.Users
import play.api.mvc.Action
import play.api.mvc.Controller
import services.DepartmentService
import services.DivisionService
import services.GenrenciaService
import services.UserService

/**
 * This is not in use now....
 * Kept it just for a reference
 */
object User extends Controller {

	/**
	 * get Address details..
	 */

	var username = ""
	var uname = ""
	var password = ""
	var first_name = ""
	var last_name = ""
	var email = ""
	var country_id = ""
	var state_id = ""
	var city_id = ""
	var isadmin = 0
	var isverify = 0
	var verify_code = ""
	var status = "Active"
	var mode = ""
	var pageRecord = ""
	var searchKey = ""
	var pageNumber = "1"
	var recordOnPage = "10"
	var search = ""
	var rut_number = ""
	var contact_number = ""
	var birth_date = new Date()
	var office_number = ""
	var joining_date = new Date()
	var designation = ""
	var depeartment_code = 0
	var rate_hour = 0
	var userSession = new play.api.mvc.Session
	var totalCount = 0
	/**
	 * user list
	 */
	val divisions = DivisionService.findAllDivisions
	val gerencias = GenrenciaService.findAllGenrencias
	val departments = DepartmentService.findAllDepartmentS

	var departmentsMap = new java.util.HashMap[String, String]()
	var divisionMap = new java.util.HashMap[String, String]()
	var gerenciasMap = new java.util.HashMap[String, String]()
	for (d <- divisions) {
		divisionMap.put(d.dId.toString(), d.division)
	}
	for (g <- gerencias) {

		gerenciasMap.put(g.dId.toString(), g.genrencia)
	}
	for (d <- departments) {
		departmentsMap.put(d.dId.toString(), d.department)
	}

	/*def userList = Action { implicit request =>

		//val passwordHash :String = org.mindrot.jbcrypt.BCrypt.hashpw("admin#123", org.mindrot.jbcrypt.BCrypt.gensalt());
		//println(passwordHash)
		var uId = -1
		var utype = -1
		if (request.session.get("uId") != None) {
			uId = Integer.parseInt(request.session.get("uId").get)
			utype = Integer.parseInt(request.session.get("utype").get)
		} else {
			uId = Integer.parseInt(request.session.get("uId").get)
			username = request.session.get("username").get
		}

		if (request.session.get("uId") == None && request.session.get("uId") == None) {
			Redirect(routes.Application.login())
		} else {

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
				userSession = request.session + ("uId" -> uId.toString()) + ("username" -> user.get.uname)

				username = user.get.uname
			} else {
				val result = request.session.get("username")
				username = result.get
				userSession = request.session + ("uId" -> uId.toString()) + ("username" -> username)

			}
			var pagination = Application.Pagination(totalCount, pageNumber, recordOnPage, search)

			val users = UserService.findAllUsers(pageNumber, recordOnPage, search);

			val countOfUsers = UserService.findCount(search);

			Ok(views.html.users.userList(users, username, countOfUsers, pagination)).withSession(userSession)

		}
	}*/

	/**
	 * Delete user
	 */
	def userDelete(uid: String) = Action { implicit request =>
		UserService.deleteUser(Integer.parseInt(uid));
		Ok("success");
	}

	/**
	 * Add new user
	 */
	def userAdd = Action { implicit request =>
		if (request.session.get("userId") == None) {
			Redirect(routes.Application.login());
		} else {
			val result = request.session.get("username")
			username = result.get
			Ok(views.html.users.userAdd(username, divisionMap, gerenciasMap, departmentsMap, ARTForms.userRegistrationForm))
		}

	}

	/**
	 * save new user information...
	 *
	 */
	def saveUser = Action { implicit request =>

		ARTForms.userRegistrationForm.bindFromRequest.fold(
			hasErrors => {
				BadRequest(views.html.users.userAdd(username, divisionMap, gerenciasMap, departmentsMap, hasErrors))
			},
			success => {

				//val objCreate = WorkflowMaster(success.id, success.workflow_status )
				//WorkflowStatusService.saveWorkFlowStatus(objCreate);
				// Redirect(routes.WorkflowStatus.workflowList())
				Ok("")
				//val userInformation = Users(NotAssigned,test., password, first_name, last_name, depeartment_code, email, birth_date, office_number, joining_date, isadmin, isverify, verify_code, new Date(), status, new Date(), rut_number, rate_hour, contact_number, user_type, work_hours, bonus_app)
				//val userval = Users.insert(userInformation);
			})

		/*		
	  first_name = request.body.asFormUrlEncoded.get("first_name")(0).trim()  ;
	 
			last_name = request.body.asFormUrlEncoded.get("last_name")(0).trim();

			depeartment_code = Integer.parseInt(request.body.asFormUrlEncoded.get("department")(0).trim())
			isadmin = Integer.parseInt(request.body.asFormUrlEncoded.get("isAdmin")(0))
			mode = request.body.asFormUrlEncoded.get("mode")(0).trim();
			rut_number = request.body.asFormUrlEncoded.get("rut_number")(0).trim();
			contact_number = request.body.asFormUrlEncoded.get("contact_number")(0).trim();

			birth_date = new SimpleDateFormat("dd-mm-yyyy").parse(request.body.asFormUrlEncoded.get("birth_date")(0).trim());
			office_number = request.body.asFormUrlEncoded.get("office_number")(0).trim();
			joining_date = new SimpleDateFormat("dd-MM-yyyy").parse(request.body.asFormUrlEncoded.get("joining_date")(0).trim());
			//designation = request.body.asFormUrlEncoded.get("designation")(0).trim();
			rate_hour = Integer.parseInt(request.body.asFormUrlEncoded.get("rate_hour")(0).trim())
			val user_type = Integer.parseInt(request.body.asFormUrlEncoded.get("user_type")(0).trim())
			val work_hours = BigDecimal(request.body.asFormUrlEncoded.get("work_hours")(0).trim())
			val bonus_app = Integer.parseInt(request.body.asFormUrlEncoded.get("bonus_app")(0).trim())

			if (mode == "add") {
				uname = request.body.asFormUrlEncoded.get("uname")(0).trim();
				password = request.body.asFormUrlEncoded.get("password")(0).trim();
				email = request.body.asFormUrlEncoded.get("email")(0).trim();
				isverify = 0
				verify_code = UUID.randomUUID().toString();
				status = "Active"

				val userInformation = Users(NotAssigned, uname, password, first_name, last_name, depeartment_code, email, birth_date, office_number, joining_date, isadmin, isverify, verify_code, new Date(), status, new Date(), rut_number, rate_hour, contact_number, user_type, work_hours, bonus_app)

				val userval = Users.insert(userInformation);
				/**
				 * send verification mail
				 */
				/*val userFound = UserService.findUserDetailsByEmail(email)
        if (userFound != null) {
          val verification_code = userFound.get.verify_code
          val uname = userFound.get.uname
          val pass = userFound.get.password
          var domain = request.host
          Mails.sendActivationMail(verification_code, email, domain, uname, pass);
        }*/
			} else if (mode == "edit") {
				val uId = Integer.parseInt(request.body.asFormUrlEncoded.get("uId")(0))
				val userFound = Users.findUserDetails(uId);

				userFound match {
					case None =>
						Redirect(routes.User.userList());
					case Some(userFound: Users) =>
						uname = userFound.uname
						password = userFound.password.toString()

						email = userFound.email
						isverify = userFound.isverify
						verify_code = userFound.verify_code
						status = request.body.asFormUrlEncoded.get("active")(0)
						val added_date = userFound.added_date
						val verify_date = userFound.verify_date
						val userInformation = Users(userFound.uid, uname, password, first_name, last_name, depeartment_code, email, birth_date, office_number, joining_date, isadmin, isverify, verify_code, verify_date, status, added_date, rut_number, rate_hour, contact_number, user_type, work_hours, bonus_app)

						Users.update(userInformation);
				}

			}*/

		//		Redirect(routes.User.userList());
	}

	/**
	 * get user information for update..
	 */
	def userUpdate(uId: String) = Action { implicit request =>
		if (request.session.get("uId") == None) {
			Redirect(routes.Application.login());
		} else {
			val user = UserService.findUserDetails(Integer.parseInt(uId));

			user match {
				case None =>
					//Redirect(routes.User.userList());
					Ok("")
				case Some(userFound: Users) =>
					val result = request.session.get("username")
					username = result.get
					val departments = DepartmentService.findAllDepartmentS
					Ok(views.html.users.userUpdate(user, username, departments))
			}
		}
	}

	/**
	 * verify user account...
	 */
	def activateUser(code: String) = Action {
		implicit request =>
			val uid = UserService.findUserDetailsByCode(code)
			UserService.updateVerifyDetails(Integer.parseInt(uid.toString()), 1, new Date())
			Ok(views.html.users.accountActivate("You account has been activeted, Thank You."))
	}

	/**
	 * Check user name for already exist or not
	 */
	def checkUser() = Action { implicit request =>
		val uname = request.getQueryString("uname");
		val userName = uname.get.toString();
		val record = UserService.checkUsername(userName);
		if (record == 0) {
			Ok("true");
		} else {
			Ok("false");
		}
	}
	def checkUserName() = Action { implicit request =>
		val uname = request.getQueryString("uname").get;
		val uId = request.getQueryString("uId").get;
		//val userName = uname.get.toString();
		val record = UserService.checkUserNameExist(uname, uId);
		if (record == 0) {
			Ok("true");
		} else {
			Ok("false");
		}
	}

	/**
	 * Check email for already exist or not
	 */
	def checkEmail() = Action { implicit request =>
		val email = request.getQueryString("email");
		val emailId = email.get.toString();
		val record = UserService.checkEmailId(emailId);

		if (record == 0) {
			Ok("true");
		} else {
			Ok("false");
		}
	}

	def getUserByDepartment = Action { implicit request =>
		var department_id = request.getQueryString("department_id").get.toString()
		var stateString = "<option value=''>--Select User--</option>"
		if (!StringUtils.isBlank(department_id)) {
			if (StringUtils.equals(department_id, "all")) {
				department_id = ""
			}

			val userDetails = UserService.findUserDetailsByDepartment(department_id)
			for (u <- userDetails) {
				val user = UserService.findUserDetailsById(u.uid.toLong)
				stateString += " <option value='" + u.uid + "' class='dep-user  user_type_" + u.user_type + "'>" + user.get.first_name + " " + user.get.last_name + "</option>"
			}
		}
		Ok(stateString)
	}

	def getUserCaculations = Action { implicit request =>
		var user_id = request.getQueryString("user_id").get.toString()
		var b_spent = request.getQueryString("budget_spent").get.toString()
		var b_available = request.getQueryString("budget_available").get.toString()
		val user = UserService.findUserDetailsById(Integer.parseInt(user_id))
		Ok(views.html.users.allocationCalculatioForUser(user))
	}

}