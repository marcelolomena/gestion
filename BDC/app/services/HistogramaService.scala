package services

import play.api.Play.current
import play.api.db.DB;
import anorm.SqlParser._;
import models._;
import anorm._
import com.typesafe.plugin._;
import play.api.data.Form
import play.i18n._
import play.mvc._

/**
 * @author marcelo
 */
object HistogramaService {

  def listadoHistograma(uid: String,mes: String): Seq[Histograma] = {

    DB.withConnection { implicit connection =>
      SQL("EXEC art.histogramaListado2 {uid},{mes}").on(
        'uid -> uid.toInt,
        'mes ->mes).executeQuery().as(Histograma.histograma *)
    }
  }
  
  def listadoSubTareas(uid: String, plan_start_date: String, plan_end_date: String, SortColumnName: String, SortOrderBy: String, NumberOfRows: Int, StartRow: Int): Seq[XRecurso] = {
//println("uid:" + uid)
//println("SortColumnName:" + SortColumnName)
//println("SortOrderBy:" + SortOrderBy)
//println("NumberOfRows:" + NumberOfRows)
//println("StartRow:" + StartRow)


    DB.withConnection { implicit connection =>
      SQL("EXEC art.list_member_activity {uid},{plan_start_date},{plan_end_date},{SortColumnName},{SortOrderBy},{NumberOfRows},{StartRow}").on(
        'uid -> uid.toInt,
        'plan_start_date -> plan_start_date,
        'plan_end_date -> plan_end_date,
        'SortColumnName -> SortColumnName,
        'SortOrderBy -> SortOrderBy,
        'NumberOfRows -> NumberOfRows,
        'StartRow -> StartRow).executeQuery().as(XRecurso.xrecurso *)
    }
  }  
  
}