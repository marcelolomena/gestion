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
object ProgramaService {
  def listado(uid: Int, page: Int, json: String): Seq[Programa] = {
    DB.withConnection { implicit connection =>
      SQL("EXEC art.list_program_master {uid},{page},{json}").on(
        'uid -> uid, 'page -> page, 'json -> json).executeQuery().as (Programa.programa *)
    }
  }
 
  def cantidad(uid: Int, json: String): Int = {
    DB.withConnection { implicit connection =>
      SQL("EXEC art.count_program_master {uid},{json}").on(
        'uid -> uid, 'json -> json).executeQuery().as(scalar[Int].single)
    }
  }
}