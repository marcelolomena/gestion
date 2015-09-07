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
import java.util.Date

object DistributionTimeSheetService {

  def distributionInternalTimeSheet(id: String, pid: String) = {
    DB.withConnection { implicit connection =>
      SQL("EXEC programa.distribucion_consumo_interno {uid},{pid}").on(
        'uid -> id.toInt,'pid -> pid.toInt).executeQuery().as(DistributionTimeSheet.disTime *)
    }
  }

    def distributionExternalTimeSheet(id: String, pid: String) = {
    DB.withConnection { implicit connection =>
      SQL("EXEC programa.distribucion_consumo_externo {rid},{pid}").on(
        'rid -> id.toInt,'pid -> pid.toInt).executeQuery().as(DistributionTimeSheet.disTime *)
    }
  }
}