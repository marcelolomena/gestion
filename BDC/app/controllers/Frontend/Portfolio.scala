package controllers.Frontend

import java.util.Date

import org.apache.commons.lang3.StringUtils
import org.json.JSONObject
import org.json.JSONArray
import art_forms.ARTForms
import models._
import play.api.mvc.Action
import play.api.mvc.Controller
import services._
//import services.ProgramService
import services.ProjectService
import services.TimesheetService
import services.UserService
import services.DocumentService
import services.DistributionTimeSheetService
import services.GenericProjectService
import services.GenericService
import services.TaskService
import services.SubTaskServices
import java.text.SimpleDateFormat
import java.util.Calendar

import utils.ExportToExcel
import services.SubTypeService
import services.ProgramTypeService
import services.UserRoleService
import play.libs.Json
import services.ProgramMemberService
import services.SAPServices
import services.BudgetTypeService
import play.api._

import scala.math.BigDecimal.RoundingMode
import services.EarnValueService
import services.SpiCpiCalculationsService
import services.RiskService
import services.ProgramMemberExternalService
import services.ImpactTypeService

import scala.collection.mutable
import play.api.mvc.AnyContent

/**
 * This will have program and project details..
 */
object Portfolio extends Controller {

  def portfolioListing(programnumber: Integer) = Action { implicit request =>
    request.session.get("username").map { user =>
      val user_id = Integer.parseInt(request.session.get("uId").get)
      val username = request.session.get("username").get
      val profile = request.session.get("user_profile").get

      var start = 1;
      var end = 10;
      if (programnumber > 0) {
        start = ((programnumber - 1) * 10) + 1;
        end = start + 9;
      }
      val programs = PortfolioService.findAllPorfoliosPerfil(user_id.toInt, programnumber.toInt)
      val programCount = PortfolioService.countAllPortfolio(user_id.toInt)

      val userSession = request.session + ("uId" -> user_id.toString()) + ("username" -> username) + ("utype" -> request.session.get("utype").get) + ("user_profile" -> request.session.get("user_profile").get)
      Ok(views.html.frontend.portfolio.paginationPortfolioListing(programs, programCount)).withSession(userSession)
    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  /**
   * List of programs
   */
  def portfolio() = Action { implicit request =>
    request.session.get("username").map { user =>
      val user_id = Integer.parseInt(request.session.get("uId").get)
      val username = request.session.get("username").get
      val profile = request.session.get("user_profile").get

      val portfolio = PortfolioService.countAllPortfolio(user_id.toInt)

      val userSession = request.session + ("uId" -> user_id.toString()) + ("username" -> username) + ("utype" -> request.session.get("utype").get) + ("user_profile" -> request.session.get("user_profile").get)
      Ok(views.html.frontend.portfolio.portfolio(portfolio)).withSession(userSession)

    }.getOrElse {
      Redirect(routes.Login.loginUser())
    }
  }

  def portfolioDetails(portfolioId: String) = Action { implicit request =>
    request.session.get("username").map { user =>

        val uId = Integer.parseInt(request.session.get("uId").get)
        val utype = Integer.parseInt(request.session.get("utype").get)
        val portfolio = PortfolioService.findPorfolioDetailsById(portfolioId)
        val programList = PortfolioService.findProgramsListForPortfolio(uId, portfolioId)

          Ok(views.html.frontend.portfolio.portfolioDetails(
            portfolio, programList)).withSession("username" -> request.session.get("username").get, "utype" -> request.session.get("utype").get, "uId" -> request.session.get("uId").get, "user_profile" -> request.session.get("user_profile").get)


      }.getOrElse {
        Redirect(routes.Login.loginUser())
      }

    }

}