package services

import scala.Option.option2Iterable
import org.apache.commons.lang3.StringUtils
import anorm._
import anorm.sqlToSimple
//import anorm.toParameterValue
import models.DocumentMaster
import models.VersionDetails
import play.Play
import play.api.Play.current
import play.api.db.DB
import models.CustomColumns
import SqlParser._
import scala.util.control.Exception._
import play.i18n.Lang
import play.i18n.Messages
import models.SpiCpiCalculations
import models.SpiCpiPyCalculations
import models.Indicators

object SpiCpiCalculationsService extends CustomColumns {

  val langObj = new Lang(Lang.forCode("es-ES"))

  def findCalculationsById(id: String): Seq[SpiCpiCalculations] = {

    var sqlString = "EXEC art.grafico {programId}"
    val result_empty: Seq[SpiCpiCalculations] = null
    try {
      println("SIN ERROR!!!")
      DB.withConnection { implicit connection =>
        SQL(sqlString).on('programId -> id).executeQuery() as (SpiCpiCalculations.spiCpiCalculations *)
      }
    } catch {
      case e: com.microsoft.sqlserver.jdbc.SQLServerException => result_empty
    }
  }

  def graficoPorProyecto(id: String): Seq[SpiCpiPyCalculations] = {

    var sqlString = "EXEC art.proyectos {programId}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('programId -> id).executeQuery() as (SpiCpiPyCalculations.spiCpiPyCalculations *)
    }
  }

  def findIndicators(id: String, nivel: Int): Seq[Indicators] = {

    var sqlString = "EXEC art.calc_task {id},{nivel}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('id -> id.toInt, 'nivel -> nivel).executeQuery() as (Indicators.indicators *)
    }
  }
  
  def findIndicatorspro(id: String, nivel: Int): Seq[Indicators] = {

    var sqlString = "EXEC art.calc_task_proporcional {id},{nivel}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('id -> id.toInt, 'nivel -> nivel).executeQuery() as (Indicators.indicators *)
    }
  }

  def findCalculationsForDashboard(program_id: String): Option[SpiCpiCalculations] = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select *  from art_ind ind where pid={program_id} and fecha = (select max(fecha) fecha from art_ind ind where pid={program_id})").on(
          'program_id -> program_id).as(
            SpiCpiCalculations.spiCpiCalculations.singleOpt)
      result
    }
  }

  def findCalculationsBySubtaskId(subtask_id: String): Seq[SpiCpiCalculations] = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_sub_task_indicators where subtask_id={id}").on(
          'id -> subtask_id).as(
            SpiCpiCalculations.spiCpiCalculations *)
      result
    }
  }

}