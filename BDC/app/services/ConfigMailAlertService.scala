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


  def findMailList(pagNo: String, recordOnPage: String): Seq[ConfigMailAlert] = {

    val rec = Integer.parseInt(pagNo.toInt.toString) * Integer.parseInt(recordOnPage.toInt.toString)
    val start = rec - Integer.parseInt(recordOnPage.toInt.toString)
    val end = Integer.parseInt(recordOnPage.toInt.toString)
    var sqlString = ""

    sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY id) AS Row, * FROM art_risk_alert_conf AS tbl)as ss WHERE  (  Row >=" + (start + 1) + " AND Row <= " + (start + end) + ")"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ConfigMailAlert.config *)
    }
  }

  def count(): Long = {
    DB.withConnection { implicit connection =>
      SQL("SELECT count(*) from art_risk_alert_conf").as(scalar[Long].single)
    }
  }

  def findLastConfig() : Option[ConfigMailAlert] = {
    DB.withConnection { implicit connection =>
      SQL("SELECT TOP 1 * FROM art_risk_alert_conf ORDER BY id DESC").as(ConfigMailAlert.config.singleOpt)
    }
  }

  def findConfigById(id: String) = {
    DB.withConnection { implicit connection =>
      SQL(
        "select * from art_risk_alert_conf  where id = {id}").on(
        'id -> id).as(
        ConfigMailAlert.config.singleOpt)

    }
  }

  def saveConfig(conf: ConfigMailAlert): Long = {
    DB.withConnection { implicit connection =>
      val lastsaved = SQL(
        """
          insert art_risk_alert_conf ( uid, em1, em2, em3, tpl, fec, is_active) values (
           {uid},{em1},{em2},{em3},{tpl},{fec},{is_active})
          """).on(
        'description -> conf.uid,
        'em1 -> conf.em1,
        'em2 -> conf.em2,
        'em3 -> conf.em3,
        'tpl -> conf.tpl,
        'fec -> conf.fec,
        'is_active -> conf.is_active).executeInsert(scalar[Long].singleOpt)
      lastsaved.last
    }
  }


  def updateConfig(obj: ConfigMailAlert): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          UPDATE art_risk_alert_conf SET uid={uid},em1={em1},em2={em2},em3={em3},tpl={tpl},fec={fec} WHERE id = {id}
        """).on(
        'id -> obj.id.get,
        'uid -> obj.uid,
        'em1 -> obj.em1,
        'em2 -> obj.em2,
        'em3 -> obj.em3,
        'tpl -> obj.tpl,
        'fec -> new Date()).executeUpdate()
    }
  }

  def changeStatusConfig(id: Integer, is_active: Int): Int = {

    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_risk_alert_conf
          set
			    is_active={is_active}
          where id={id}
          """).on(
        'id -> id,
        'is_active -> is_active).executeUpdate()
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