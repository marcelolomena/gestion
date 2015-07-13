package services;
import play.api.Play.current
import play.api.db.DB;
import anorm.SqlParser._;
import models._;
import anorm._
import com.typesafe.plugin._;

object DashboardService {

  def cuentaRegistros(): Int = {
    DB.withConnection { implicit connection =>
      SQL("EXEC programa.panel_principal_count").executeQuery().as(scalar[Int].single)
    }
  }
  def reportPanel(): Seq[Panel] = {

    var sqlString = "EXEC programa.panel_principal"
    DB.withConnection { implicit connection =>
      SQL(sqlString).executeQuery() as (Panel.panel *)
    }
  }

  def reportPanelPaginado(pageSize: String, pageNumber: String): Seq[Panel] = {

    var sqlString = "EXEC programa.panel_principal_paginado {PageSize},{PageNumber}"
    DB.withConnection { implicit connection =>
      SQL(sqlString).on('PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt).executeQuery() as (Panel.panel *)
    }
  }
}