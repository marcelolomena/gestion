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
object PersonalService {

  def listadoAsignacionDependiente(uid: String, fecini: String, fecfin: String, SortColumnName: String, SortOrderBy: String, NumberOfRows: Int, StartRow: Int): Seq[Asignado] = {

    DB.withConnection { implicit connection =>
      SQL("EXEC art.asignacion_dependiente {uid},{fecini},{fecfin},{SortColumnName},{SortOrderBy},{NumberOfRows},{StartRow}").on(
        'uid -> uid.toInt,
        'fecini -> fecini,
        'fecfin -> fecfin,
        'SortColumnName -> SortColumnName,
        'SortOrderBy -> SortOrderBy,
        'NumberOfRows -> NumberOfRows,
        'StartRow -> StartRow).executeQuery().as(Asignado.asignado *)
    }
  }
  
  def listadoSubTareas(uid: String, SortColumnName: String, SortOrderBy: String, NumberOfRows: Int, StartRow: Int): Seq[XRecurso] = {
//println("uid:" + uid)
//println("SortColumnName:" + SortColumnName)
//println("SortOrderBy:" + SortOrderBy)
//println("NumberOfRows:" + NumberOfRows)
//println("StartRow:" + StartRow)


    DB.withConnection { implicit connection =>
      SQL("EXEC art.list_member_activity {uid},{SortColumnName},{SortOrderBy},{NumberOfRows},{StartRow}").on(
        'uid -> uid.toInt,
        'SortColumnName -> SortColumnName,
        'SortOrderBy -> SortOrderBy,
        'NumberOfRows -> NumberOfRows,
        'StartRow -> StartRow).executeQuery().as(XRecurso.xrecurso *)
    }
  }  
  
}