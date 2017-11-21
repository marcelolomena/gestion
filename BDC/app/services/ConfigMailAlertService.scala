package services

import java.util.Date

import play.api.data.Form
import anorm.SQL
import anorm.SqlParser.scalar
import models.{ConfigMailAlert, CustomColumns, Stages}
import play.api.db.DB
import play.i18n._
import play.api.Play.current
import play.Play

object ConfigMailAlertService extends CustomColumns {

  val langObj = new Lang(Lang.forCode("es-ES"))

  def findLastConfig() : Option[ConfigMailAlert] = {
    DB.withConnection { implicit connection =>
      SQL("SELECT TOP 1 * FROM art_risk_alert_conf ORDER BY id DESC").as(ConfigMailAlert.config.singleOpt)
    }
  }

  def updateConfig(obj: ConfigMailAlert): Option[Long] = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          INSERT art_risk_alert_conf (uid, em1, em2, em3, tpl, fec) VALUES ( {uid},{em1},{em2},{em3},{tpl},{fec} )
        """).on(
        'id -> obj.id.get,
        'uid -> obj.uid,
        'em1 -> obj.em1,
        'em2 -> obj.em2,
        'em3 -> obj.em3,
        'tpl -> obj.tpl,
        'fec -> new Date()).executeInsert(scalar[Long].singleOpt)
    }
  }

  def validateConfigForm(form: Form[ConfigMailAlert]): Form[ConfigMailAlert] = {
    var newform: Form[ConfigMailAlert] = null

    val em1 = form.data.get("em1").get.trim()
    val em2 = form.data.get("em2").get.trim()
    val em3 = form.data.get("em3").get.trim()

    if(em1.toString.equals(em2.toString))
      newform = form.withError("em1", Messages.get(langObj, "error.confmail.alreadyexist"))

    if (newform != null) {
      newform
    } else {
      form
    }
  }

}