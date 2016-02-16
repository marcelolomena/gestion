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

  def listadoAsignacionDependiente(uid: String, fecini: String, fecfin: String, size: String, page: String): Seq[Asignado] = {

    DB.withConnection { implicit connection =>
      SQL("EXEC art.asignacion_dependiente {uid},{fecini},{fecfin},{size},{page}").on(
        'uid -> uid.toInt,
        'fecini -> fecini,
        'fecfin -> fecfin,
        'size -> size.toInt,
        'page -> page.toInt).executeQuery().as(Asignado.asignado *)
    }
  }
}