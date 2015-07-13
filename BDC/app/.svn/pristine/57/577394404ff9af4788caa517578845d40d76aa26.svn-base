package controllers
import models.Project
import models.Login
import play.api.mvc._
import java.util.Date
import anorm._
import java.text.SimpleDateFormat
import util.Random
import play._
import views.html._
import play.api.Play.current
import play.mvc.Http.MultipartFormData
import play.mvc.Http.MultipartFormData.FilePart
import java.io.File
import org.jboss.netty.util.internal.StringUtil
import org.apache.commons.lang3.StringUtils
import services.ProjectService
import services.GenrenciaService
import models.Users
import services.TaskService
import services.UserService
import models._
//import org.springframework.ui.Model
import services.DivisionService
import art_forms.ARTForms
import java.util.HashMap
import services.DepartmentService
import play.i18n._

object Genrencia extends Controller {
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
  def genrenciaList() = Action { implicit request =>

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
      val genrencias = GenrenciaService.findAllGenrenciaList(pageNumber, recordOnPage)

      var totalCount = GenrenciaService.genrenciaCount
      var pagination = Application.Pagination(totalCount, pageNumber, recordOnPage, search)
      Ok(views.html.genrencia.genrenciaList(genrencias, username, totalCount, pagination))

    }
  }

  /**
   * create new milestone..
   */
  def createGenrencia = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      val result = request.session.get("username")
      val containerMap = getDropDawnMap(null)
      var username = result.get
      Ok(views.html.genrencia.addGenrencia(username, containerMap, ARTForms.gerenciaForm))
    }
  }

  def saveGenrencia = Action { implicit request =>
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      ARTForms.gerenciaForm.bindFromRequest.fold(
        hasErrors => {
          val result = request.session.get("username")
          val containerMap = getDropDawnMap(null)
          var username = result.get
          BadRequest(views.html.genrencia.addGenrencia(username, containerMap, hasErrors))
        }, success => {
          var genrencia = ""
          if (!success.genrencia.isEmpty()) {
            genrencia = success.genrencia.trim()
          }
          val obj = services.GenrenciaService.findGenrenciaByName(genrencia)
          if (obj.size > 0) {
            val result = request.session.get("username")
            val containerMap = getDropDawnMap(null)
            var username = result.get
            BadRequest(views.html.genrencia.addGenrencia(username, containerMap, ARTForms.gerenciaForm.withError("genrencia", Messages.get(langObj, "gerencia.gerenciaexist")).fill(success)))
          } else {
            val obj = Genrencias(success.dId, success.genrencia, success.user_id, success.report_type, success.report_to, success.organization_depth, Option(Integer.parseInt(request.session.get("uId").get)), success.updation_date, success.is_deleted)
            val last = services.GenrenciaService.saveGenrencia(obj)
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Gerencia.id, "Gerencia created by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), last.toInt)
            Activity.saveLog(act)
            Redirect(routes.Genrencia.genrenciaList())
          }
        })
    }
  }

  /**
   * edit panel of milestone
   */
  def editGenrencia(dId: String) = Action { implicit request =>
    if (StringUtils.isNotBlank(dId)) {
      if (request.session.get("uId") == None) {
        Redirect(routes.Application.login())
      } else {
        val gen = GenrenciaService.findGenrenciaById(Integer.parseInt(dId))
        gen match {
          case None =>
            Redirect(routes.Genrencia.genrenciaList())
          case Some(dep: Genrencias) =>
            val departments = DepartmentService.findAllDepartmentListByGenrencia(dId)
            for (d <- departments) {
              val users = UserService.findUserDetailsByDepartment(d.dId.get.toString)
            }

            val obj = Genrencias(dep.dId, dep.genrencia, dep.user_id, dep.report_type, dep.report_to, dep.organization_depth, dep.updated_by, dep.updation_date, dep.is_deleted)
            val result = request.session.get("username")
            val users = UserService.findAllUsers
            username = result.get
            val containerMap = getDropDawnMap(dep.report_type.toString);
            Ok(views.html.genrencia.genrenciaUpdate(containerMap, username, ARTForms.gerenciaForm.fill(obj), departments))
        }
      }
    } else {
      Redirect(routes.Genrencia.genrenciaList())
    }
  }

  def updateGenrencia() = Action { implicit request =>
    val myForm = ARTForms.gerenciaForm.bindFromRequest
    val result = request.session.get("username")
    var username = result.get
    val containerMap = getDropDawnMap(null)
    if (request.session.get("uId") == None) {
      Redirect(routes.Application.login())
    } else {
      myForm.fold(
        hasErrors => {
          val departments = DepartmentService.findAllDepartmentListByGenrencia(hasErrors.data.get("id").get)
          BadRequest(views.html.genrencia.genrenciaUpdate(containerMap, username, hasErrors, departments))
        },
        success => {
          val theForm = services.GenrenciaService.validateGenrenciaForm(myForm.fill(success))
          if (theForm.hasErrors) {
            val departments = DepartmentService.findAllDepartmentListByGenrencia(success.dId.get.toString())
            BadRequest(views.html.genrencia.genrenciaUpdate(containerMap, username, theForm, departments))
          } else {
            val obj = Genrencias(success.dId, success.genrencia, success.user_id, success.report_type, success.report_to, success.organization_depth, Option(Integer.parseInt(request.session.get("uId").get)), success.updation_date, success.is_deleted)
            services.GenrenciaService.updateGenrencia(obj)
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Gerencia.id, "Gerencia updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), success.dId.get)
            Activity.saveLog(act)
            Redirect(routes.Genrencia.genrenciaList())
          }
        })
    }
  }

  /**
   * delete milestone details..
   */
  def genrenciaUpdateStatus(dId: String, status: Boolean) = Action { implicit request =>
    if (StringUtils.isNotBlank(dId)) {
      val gerencia_id = Integer.parseInt(dId)
      var is_deleted = 1
      if (status) {
        is_deleted = 0
      }
      val uid = Integer.parseInt(request.session.get("uId").get.trim())
      GenrenciaService.changeGenrenciaStatus(gerencia_id, is_deleted, uid)
      /**
       * Activity log
       */
      val act = Activity(ActivityTypes.Gerencia.id, "Gerencia status updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), gerencia_id)
      Activity.saveLog(act)
    }
    Ok("Success")
  }

  def getDenrenciaReportTo = Action { implicit request =>
    val rType = request.getQueryString("report_type").get.toString()
    var stateString = ""
    if (StringUtils.isNotEmpty(rType)) {
      val typid = Integer.parseInt(rType)

      /*
       * 0 - division
       * 1 - genrecia
       */
      if (typid == 0) {
        stateString = "<option value=''>--Select Report To--</option>"
        val divisonList = DivisionService.findAllDivisions
        for (d <- divisonList) {
          stateString += " <option value='" + d.dId.get + "'>" + d.division + "</option>"
        }

      } else {
        stateString = "<option value=''>--Select Report To--</option>"
        val genrenciaList = GenrenciaService.findAllGenrencia
        for (g <- genrenciaList) {
          stateString += " <option value='" + g.dId.get + "'>" + g.genrencia + "</option>"
        }

      }

      Ok(stateString)
    } else {
      Ok("")
    }

  }
  private def getDropDawnMap(selectedReportType: String): java.util.HashMap[String, java.util.HashMap[String, String]] = {
    var containerMap = new java.util.HashMap[String, java.util.HashMap[String, String]]()
    var reportTypeMap = new java.util.HashMap[String, String]()
    reportTypeMap.put("0", "Division");
    reportTypeMap.put("1", "Genrencia")
    containerMap.put("reportTypeMap", reportTypeMap)
    var reportToMap = new java.util.HashMap[String, String]()
    if (StringUtils.isNotEmpty(selectedReportType) && selectedReportType.equals("0")) {
      val divisonList = DivisionService.findAllDivisions
      for (d <- divisonList) {
        reportToMap.put(d.dId.get.toString, d.division);
      }
    } else {
      val reportTo = GenrenciaService.findAllGenrencia
      for (r <- reportTo) {
        reportToMap.put(r.dId.get.toString, r.genrencia);
      }
    }
    containerMap.put("reportToMap", reportToMap)
    val users = UserService.findAllUsers
    var usersMap = new java.util.HashMap[String, String]()
    for (user <- users) {
      usersMap.put(user.uid.get.toString(), user.first_name + " " + user.last_name)
    }
    containerMap.put("usersMap", usersMap)
    containerMap
  }
}