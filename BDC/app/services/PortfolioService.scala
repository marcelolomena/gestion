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
}