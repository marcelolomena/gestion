package controllers

import org.apache.commons.lang3.StringUtils
import art_forms.ARTForms
import models.Departments
import play.api.mvc.Action
import play.api.mvc.Controller
import services.DepartmentService
import services.GenrenciaService
import services.ProjectService
import services.UserService
import play.i18n._
import models.Activity
import models.ActivityTypes
import java.util.Date

object Department extends Controller {
  var username = ""
  var project_id = ""
  var title = ""
  var country = ""
  var state = ""
  var city = ""
  var description = ""
  var milestone_id = 0
  var milestone_code = ""
  var milestone_status = 0
  var tagTitle = ""
  var tagDescription = ""
  var tag = 0
  var pageNumber = "1"
  var recordOnPage = "10"
  var search = ""
  var mode = ""
  var team_id = ""
  var department = ""
  var team = -1
  var uId = -1
  var roleId = -1
  val langObj = new Lang(Lang.forCode("es-ES"))
  def departmentList() = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val result = request.session.get("username")
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
      username = result.get
      val departments = DepartmentService.findAllDepartmentList(pageNumber, recordOnPage)

      var totalCount = DepartmentService.departmentCount
      var pagination = Application.Pagination(totalCount, pageNumber, recordOnPage, search)
      Ok(views.html.department.departmentList(departments, username, totalCount, pagination))
    }
  }

  /**
   * create new milestone..
   */
  def addDepartment = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val result = request.session.get("username")
      val users = getDropDawnMap
      username = result.get
      var reportMap = new java.util.HashMap[String, String]()
      val genrenciaList = GenrenciaService.findAllGenrencia
      println(genrenciaList.size + "---------------1")
      for (g <- genrenciaList) {
        reportMap.put(g.dId.get + "", g.genrencia)
      }
      Ok(views.html.department.addDepartment(username, users, reportMap, ARTForms.departmentForm))
    }
  }

  def saveDepartment = Action { implicit request =>

    ARTForms.departmentForm.bindFromRequest.fold(
      hasErrors => {
        val result = request.session.get("username")
        val users = getDropDawnMap
        username = result.get

        var reportMap = new java.util.HashMap[String, String]()
        if ("0".equals(hasErrors.data.get("report_type"))) {
          val genrenciaList = GenrenciaService.findAllGenrencia
          for (g <- genrenciaList) {
            reportMap.put(g.dId.get + "", g.genrencia)
          }
        } else if ("1".equals(hasErrors.data.get("report_type"))) {
          val departmentList = DepartmentService.findAllDepartmentS
          for (d <- departmentList) {
            reportMap.put(d.dId.get + "", d.department)
          }
        }

        BadRequest(views.html.department.addDepartment(username, users, reportMap, hasErrors))
      },
      success => {
        var department = ""
        if (!success.department.isEmpty()) {
          department = success.department.trim()
        }
        val obj = DepartmentService.findDepartmentByName(department)
        if (obj.size > 0) {

          var reportMap = new java.util.HashMap[String, String]()
          if ("0".equals(success.report_type.toString)) {
            val genrenciaList = GenrenciaService.findAllGenrencia
            for (g <- genrenciaList) {
              reportMap.put(g.dId.get + "", g.genrencia)
            }
          } else if ("1".equals(success.report_type.toString)) {
            val departmentList = DepartmentService.findAllDepartmentS
            for (d <- departmentList) {
              reportMap.put(d.dId.get + "", d.department)
            }
          }
          val result = request.session.get("username")
          val users = getDropDawnMap
          username = result.get
          BadRequest(views.html.department.addDepartment(username, users, reportMap, ARTForms.departmentForm.withError("department", Messages.get(langObj, "department.departmentexist")).fill(success)))
        } else {
          val uId = Integer.parseInt(request.session.get("uId").get)
          val obj = Departments(success.dId, success.department, success.user_id, success.report_type, success.report_to, success.organization_depth, Option(uId), success.updation_date, success.is_deleted)
          val department_id = DepartmentService.saveDepartment(obj)

          /**
           * Activity log
           */
          val act = Activity(ActivityTypes.Department.id, "Department created by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), department_id.toInt)
          Activity.saveLog(act)
          Redirect(routes.Department.departmentList())
        }
      })
  }

  /**
   * edit panel of milestone
   */
  def editDepartment(dId: String) = Action { implicit request =>
    if (StringUtils.isNotBlank(dId)) {
      if (request.session.get("uId") == None) {
        Redirect(routes.Application.login())
      } else {

        val department = DepartmentService.findDepartmentById(Integer.parseInt(dId))
        department match {
          case None =>
            Redirect(routes.Department.departmentList())
          case Some(dep: Departments) =>
            val obj = Departments(dep.dId, dep.department, dep.user_id, dep.report_type, dep.report_to, dep.organization_depth, dep.updated_by, dep.updation_date, dep.is_deleted)
            val result = request.session.get("username")
            val users = getDropDawnMap
            username = result.get
            println(dep.report_type)
            var reportMap = new java.util.HashMap[String, String]()
            if (dep.report_type == 0) {
              val genrenciaList = GenrenciaService.findAllGenrencia
              for (g <- genrenciaList) {
                reportMap.put(g.dId.get + "", g.genrencia)
              }
            } else if (dep.report_type == 1) {

              val departmentLit = DepartmentService.findAllDepartmentS
              for (d <- departmentLit) {
                reportMap.put(d.dId.get + "", d.department)
              }
            }

            val geren = GenrenciaService.findAllGenrencia()
            Ok(views.html.department.departmentUpdate(username, users, reportMap, ARTForms.departmentForm.fill(obj)))
        }
      }
    } else {
      Redirect(routes.Department.departmentList())
    }
  }

  def updateDepartment() = Action { implicit request =>
    val myForm = ARTForms.departmentForm
    myForm.bindFromRequest.fold(
      hasErrors => {
        val result = request.session.get("username")
        username = result.get
        val users = getDropDawnMap
        var reportMap = new java.util.HashMap[String, String]()
        if ("0".equals(hasErrors.data.get("report_type"))) {
          val genrenciaList = GenrenciaService.findAllGenrencia
          for (g <- genrenciaList) {
            reportMap.put(g.dId.get + "", g.genrencia)
          }
        } else if ("1".equals(hasErrors.data.get("report_type"))) {
          val departmentLit = DepartmentService.findAllDepartmentS
          for (d <- departmentLit) {
            reportMap.put(d.dId.get + "", d.department)
          }
        }
        BadRequest(views.html.department.departmentUpdate(username, users, reportMap, hasErrors))
      },
      success => {
        val theForm = services.DepartmentService.validateDepartmentForm(myForm.fill(success))
        if (theForm.hasErrors) {
          val result = request.session.get("username")
          username = result.get
          val users = getDropDawnMap
          var reportMap = new java.util.HashMap[String, String]()
          if ("0".equals(success.report_type.toString())) {
            val genrenciaList = GenrenciaService.findAllGenrencia
            for (g <- genrenciaList) {
              reportMap.put(g.dId.get + "", g.genrencia)
            }
          } else if ("1".equals(success.report_type.toString())) {
            val departmentLit = DepartmentService.findAllDepartmentS
            for (d <- departmentLit) {
              reportMap.put(d.dId.get + "", d.department)
            }
          }
          BadRequest(views.html.department.departmentUpdate(username, users, reportMap, theForm))
        } else {
          val uId = Integer.parseInt(request.session.get("uId").get)
          val obj = Departments(success.dId, success.department, success.user_id, success.report_type, success.report_to, success.organization_depth, Option(uId), success.updation_date, success.is_deleted)
          DepartmentService.updateDepartment(obj)
          /**
           * Activity log
           */
          val act = Activity(ActivityTypes.Department.id, "Department updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), success.dId.get)
          Activity.saveLog(act)
          Redirect(routes.Department.departmentList())
        }
      })
  }

  /**
   * delete milestone details..
   */
  def updateDepartmentStatus(dId: String, status: Boolean) = Action { implicit request =>
    if (StringUtils.isNotBlank(dId)) {
      val dept_id = Integer.parseInt(dId)
      var is_deleted = 1
      if (status) {
        is_deleted = 0
      }
      val uid = Integer.parseInt(request.session.get("uId").get.trim())
      DepartmentService.changeDepartmentStatus(dept_id, is_deleted, uid)
      /**
       * Activity log
       */
      val act = Activity(ActivityTypes.Department.id, "Department status updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), dept_id)
      Activity.saveLog(act)
    }
    Ok("Success")
  }

  def getDepartmentReportTo = Action { implicit request =>
    val rType = request.getQueryString("report_type").get.toString()
    var stateString = ""
    if (StringUtils.isNotEmpty(rType)) {
      val typid = Integer.parseInt(rType)

      /*
       * 0 - genrecia 
       * 1 - departmemt
       */
      if (typid == 0) {
        stateString = "<option value=''>--Select Report To--</option>"
        val genrenciaList = GenrenciaService.findAllGenrencia
        for (g <- genrenciaList) {
          stateString += " <option value='" + g.dId.get + "'>" + g.genrencia + "</option>"
        }

      } else {

        stateString = "<option value=''>--Select Report To--</option>"
        val departmentLit = DepartmentService.findAllDepartmentS
        for (d <- departmentLit) {
          stateString += " <option value='" + d.dId.get + "'>" + d.department + "</option>"
        }
      }
      Ok(stateString)
    } else {
      Ok("")
    }

  }

  private def getDropDawnMap: java.util.HashMap[String, String] = {
    val users = UserService.findAllUsers
    var usersMap = new java.util.HashMap[String, String]()
    for (user <- users) {
      usersMap.put(user.uid.get.toString(), user.first_name + " " + user.last_name)
    }
    usersMap
  }

}