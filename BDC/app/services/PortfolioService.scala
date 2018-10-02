package services;
import play.api.Play.current
import play.api.db.DB
import anorm.SqlParser._
import models._
import anorm._
//import com.typesafe.plugin._
import org.apache.commons.lang3.StringUtils
import java.util.Date
import SqlParser.scalar
import java.text.DecimalFormat
import org.json.JSONObject
import services._
import play.api.data.Form
import java.text.SimpleDateFormat
import org.json.JSONArray
import play.libs.Json
import org.json.JSONObject
import play.api.libs.json
import play.i18n._
import play.mvc._

import controllers.Frontend.Program

import java.util.Calendar
import java.sql.Connection
import scala.math.BigDecimal.RoundingMode

object PortfolioService extends CustomColumns {

  val langObj = new Lang(Lang.forCode("es-ES"))

  def findAllPorfoliosPerfil(user_id: Int, page: Int): Seq[PortfolioMaster] = {
    var sqlString = "EXEC art.list_porfolios {uid},{page}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('uid -> user_id, 'page -> page).executeQuery() as (PortfolioMaster.pMaster *)
    }
  }

  def countAllPortfolio(user_id: Int): Int = {
    var sqlString = "EXEC art.count_portfolio {uid}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('uid -> user_id).executeQuery() as (scalar[Int].single)
    }
  }

  def findProgramsListForPortfolio(uId: Integer, portfolio: String): Seq[PortfolioPrograms] = {
    var sqlSting =
      """
        SELECT count(b.pId) proyectos, a.program_id, a.program_name, a.demand_manager, d.first_name+' '+d.last_name lider, c.workflow_status FROM art_program a
        JOIN art_project_master b ON a.program_id=b.program
        JOIN art_program_workflow_status c ON a.work_flow_status=c.id
        JOIN art_user d ON a.demand_manager=d.uid
        WHERE a.id_portfolio = {Portfolio} AND a.is_active=1
        GROUP BY a.program_id, a.program_name, c.workflow_status, a.demand_manager,d.first_name,d.last_name
      """
    DB.withConnection { implicit connection =>
      SQL(sqlSting).on('Portfolio -> portfolio).executeQuery() as (models.PortfolioPrograms.pPrograms *)
    }

  }

  def findPorfolioDetailsById(pId: String) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        """ SELECT a.*, b.first_name+' '+b.last_name lider FROM art_portfolio a JOIN art_user b ON a.uidlider=b.uid WHERE id={pId} """).on(
        'pId -> pId).as(models.PortfolioMaster.pMaster.singleOpt)
      result
    }
  }

}