package services

import play.api.Play.current
import play.api.db.DB
import play.api.data.Form
import models._
import anorm._
import play.i18n._
import anorm.SqlParser.scalar

object CategoryServices extends CustomColumns {

  val langObj = new Lang(Lang.forCode("es-ES"))

  def findCategoryList(pagNo: String, recordOnPage: String): Seq[Categories] = {

    val rec = Integer.parseInt(pagNo.toInt.toString) * Integer.parseInt(recordOnPage.toInt.toString)
    val start = rec - Integer.parseInt(recordOnPage.toInt.toString)
    val end = Integer.parseInt(recordOnPage.toInt.toString)
    var sqlString = ""

    sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY id) AS Row, * FROM art_risk_alert_category AS tbl)as ss WHERE  (  Row >=" + (start + 1) + " AND Row <= " + (start + end) + ")"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(Categories.category *)
    }
  }

  def count(): Long = {
    DB.withConnection { implicit connection =>
      SQL("SELECT count(*) from art_risk_alert_category").as(scalar[Long].single)
    }
  }

  def findCategoryById(id: String) = {
    DB.withConnection { implicit connection =>
      SQL(
        "select * from art_risk_alert_category  where id = {id}").on(
        'id -> id).as(
        Categories.category.singleOpt)

    }
  }

  def saveCategory(cat: Categories): Long = {
    DB.withConnection { implicit connection =>
      val lastsaved = SQL(
        """
          insert art_risk_alert_category ( description, is_active) values (
           {description},{is_active})
          """).on(
        'description -> cat.description,
        'is_active -> cat.is_active).executeInsert(scalar[Long].singleOpt)
      lastsaved.last
    }
  }

  def updateCategory(cat: Categories): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_risk_alert_category
          set
          description={description},
          is_active={is_active}
          where id={id}
          """).on(
        'id -> cat.id,
        'description -> cat.description,
        'is_active -> cat.is_active).executeUpdate()
    }
  }

  def validateCategoryForm(form: Form[Categories]): Form[Categories] = {
    var newform: Form[Categories] = null
    val category_id = form.data.get("id").get.trim()

    val descriptionlegth = form.data.get("description").get.trim().length
    if (descriptionlegth <= 10) {
      newform = form.withError("description", Messages.get(langObj, ("error.description.minmax")))
    }

    if (newform != null) {
      newform
    } else {
      form
    }
  }

}
