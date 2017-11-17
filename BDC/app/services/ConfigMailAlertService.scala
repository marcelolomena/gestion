package services

import java.util.Date
import play.api.data.Form
import anorm.SQL
import models.{ConfigMailAlert, CustomColumns, Stages}
import play.api.db.DB
import play.i18n.Lang
import play.api.Play.current

object ConfigMailAlertService extends CustomColumns {

  val langObj = new Lang(Lang.forCode("es-ES"))

  def findLastConfig() : Option[ConfigMailAlert] = {
    DB.withConnection { implicit connection =>
      SQL("SELECT TOP 1 * FROM art_risk_alert_conf ORDER BY fec DESC").as(ConfigMailAlert.config.singleOpt)
    }
  }

  def updateConfig(obj: ConfigMailAlert): Int = {
    DB.withConnection { implicit connection =>
      SQL("""update art_risk_alert_conf set uid = {uid},em1 = {em1},em2 = {em2},em3 = {em3},tpl = {tpl},fec = {fec} where id={id}""").on(
        'id -> obj.id.get,
        'uid -> obj.uid,
        'em1 -> obj.em1.get.toString.trim(),
        'em2 -> obj.em2.get.toString.trim(),
        'em3 -> obj.em3.get.toString.trim(),
        'tpl -> obj.tpl.trim(),
        'fec -> new Date()).executeUpdate()
    }
  }

  def validateConfigForm(form: Form[ConfigMailAlert]): Form[ConfigMailAlert] = {
    var newform: Form[ConfigMailAlert] = null
    /*
    val stage = form.data.get("stage").get.trim()
    val obj = StageService.findStageByName(stage)
    if (obj.size > 0) {
      newform = form.withError("stage", Messages.get(langObj, "stage.alreadyexist"))
    }
    val sequence = form.data.get("sequencing").get.trim()
    val isCodePresent = isDesciplineSequenced(sequence)
    if (isCodePresent) {
      newform = form.withError("sequencing", Messages.get(langObj, ("sequence.alreadyexist")))
    }
    */
    if (newform != null) {
      newform
    } else {
      form
    }
  }

}
