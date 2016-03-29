package services

import play.api.Play.current
import play.api.db.DB
import anorm.SqlParser._
import models._
import anorm._
import com.typesafe.plugin._
import java.util.Date
import java.text.SimpleDateFormat
import java.util.Calendar
import org.apache.commons.lang3.StringUtils
import play.api.data.Form
import play.i18n._
import play.mvc._

object TaskDesciplineService extends CustomColumns {

  val langObj = new Lang(Lang.forCode("es-ES"))

  def findTaskDesciplineList(pagNo: String, recordOnPage: String): Seq[TaskDesciplines] = {
    val rec = Integer.parseInt(pagNo.toInt.toString) * Integer.parseInt(recordOnPage.toInt.toString)
    val start = rec - Integer.parseInt(recordOnPage.toInt.toString)
    val end = Integer.parseInt(recordOnPage.toInt.toString)
    var sqlString = ""
    sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY sequencing ASC) AS Row, * FROM art_task_discipline AS tbl)as ss WHERE  (Row >=" + (start + 1) + " AND Row <= " + (start + end) + ")"
    //sqlString = "SELECT * from art_task_discipline limit " + start + "," + end
    //sqlString = "SELECT * from art_task_discipline where ( id BETWEEN  " + ( start  + 1 ) + " AND  "+(start + end)+")"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(TaskDesciplines.taskDesciplineMaster *)
    }
  }

  def findTaskDesciplineById(id: String) = {
    var sql = ""
    if (id != "") {
      sql = "select t.* from art_task_discipline t where t.id='" + id + "'"
      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(TaskDesciplines.taskDesciplineMaster.singleOpt)
        result
      }
    } else {
      null
    }
  }

  def saveTaskDescipline(obj: TaskDesciplines): Long = {
    DB.withConnection { implicit connection =>
      val lastsaved = SQL("""insert into art_task_discipline (success.sequencing ,task_discipline, description, created_by, updation_date, is_deleted) values (
         {sequencing}, {task_discipline}, {description}, {created_by}, {updation_date}, {is_deleted}) """).on(
        'sequencing -> obj.sequencing,
        'task_discipline -> obj.task_discipline.trim(),
        'description -> obj.description,
        'created_by -> obj.created_by,
        'updation_date -> obj.updation_date,
        'is_deleted -> obj.is_deleted).executeInsert(scalar[Long].singleOpt)
      lastsaved.last
    }
  }

  def updateTaskDescipline(obj: TaskDesciplines): Int = {

    DB.withConnection { implicit connection =>
      SQL(""" update  art_task_discipline set sequencing= {sequencing}, task_discipline={task_discipline}, description={description}, created_by={created_by}, updation_date={updation_date} , is_deleted={is_deleted} where id={id}""")
        .on(
          'id -> obj.id.get,
          'sequencing -> obj.sequencing,
          'task_discipline -> obj.task_discipline.trim(),
          'description -> obj.description,
          'created_by -> obj.created_by,
          'updation_date -> obj.updation_date,
          'is_deleted -> obj.is_deleted).executeUpdate()
    }

  }
  def isDesciplineSequenced(sequencing: String): Boolean = {
    if (!sequencing.trim().isEmpty()) {
      var sql = "select count(*) from art_task_discipline  where is_deleted = 0  AND sequencing='" + sequencing.trim() + "'"
      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(scalar[Long].single)
        if (result == 0) {
          false
        } else {
          true
        }
      }
    } else {
      false
    }
  }
  def changeTaskDesciplineStatus(id: String, is_deleted: Int, uid: Int): Int = {

    DB.withConnection { implicit connection =>
      SQL(""" update  art_task_discipline set  created_by={created_by}, updation_date={updation_date} , is_deleted={is_deleted} where id={id}""")
        .on(
          'id -> id,
          'created_by -> uid,
          'updation_date -> new Date(),
          'is_deleted -> is_deleted).executeUpdate()
    }

  }
  def taskDesciplineCount(): Long = {
    DB.withConnection { implicit connection =>
      var sqlString = "SELECT count(*) from art_task_discipline "
      val count: Long = SQL(sqlString).as(scalar[Long].single)
      count
    }
  }
  def findAllTaskDesciplineList(): Seq[TaskDesciplines] = {
    var sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY sequencing ASC) AS Row, * FROM art_task_discipline AS tbl where is_deleted = 0) as ss ORDER BY task_discipline"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(TaskDesciplines.taskDesciplineMaster *)
    }
  }

  def findDisciplineByName(task_discipline: String): Option[TaskDesciplines] = {
    if (!task_discipline.isEmpty()) {
      var sql = "select t.* from art_task_discipline t where t.is_deleted = 0  AND t.task_discipline='" + task_discipline.trim() + "'"
      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(TaskDesciplines.taskDesciplineMaster.singleOpt)
        result
      }
    } else {
      null
    }
  }
  def validateTaskDesciplineForm(form: Form[TaskDesciplineChild]): Form[TaskDesciplineChild] = {
    var newform: Form[TaskDesciplineChild] = null
    val descriptionlegth = form.data.get("description").get.trim().length()
    val task_discipline = form.data.get("task_discipline").get.trim()
    if (descriptionlegth <= 4 || descriptionlegth >= 500) {
      newform = form.withError("description", Messages.get(langObj, ("error.description.minmax")))
    }

    val obj = findDisciplineByName(task_discipline)
    if (obj.size > 0) {
      newform = form.withError("task_discipline", Messages.get(langObj, "discipline.alreadyexist"))
    }
    val sequence = form.data.get("sequencing").get.trim()
    val isCodePresent = isDesciplineSequenced(sequence)
    if (isCodePresent) {
      newform = form.withError("sequencing", Messages.get(langObj, ("sequence.alreadyexist")))
    }
    if (newform != null) {
      newform
    } else {
      form
    }
  }

  def findDisciplineByNameForEdit(task_discipline: String, discipline_id: String): Seq[TaskDesciplines] = {
    var sql = "select t.* from art_task_discipline t where t.is_deleted = 0  AND t.task_discipline='" + task_discipline.trim() + "' AND t.id <>'" + discipline_id + "'"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(TaskDesciplines.taskDesciplineMaster *)
      result
    }
  }

  def isDesciplineSequencedForEdit(sequencing: String, discipline_id: String): Boolean = {
    var sql = "select count(*) from art_task_discipline  where is_deleted = 0  AND sequencing='" + sequencing.trim() + "' AND id <>'" + discipline_id + "'"

    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(scalar[Long].single)
      if (result == 0) {
        false
      } else {
        true
      }
    }
  }
  def validateEditTaskDesciplineForm(form: Form[TaskDesciplineChild]): Form[TaskDesciplineChild] = {
    var newform: Form[TaskDesciplineChild] = null
    val discipline_id = form.data.get("id").get.trim()
    val task_discipline = form.data.get("task_discipline").get.trim()
    val descriptionlegth = form.data.get("description").get.trim().length()
    if (descriptionlegth <= 4 || descriptionlegth >= 500) {
      newform = form.withError("description", Messages.get(langObj, ("error.description.minmax")))
    }
    val obj = findDisciplineByNameForEdit(task_discipline, discipline_id)
    if (obj.size > 0) {
      newform = form.withError("task_discipline", Messages.get(langObj, "discipline.alreadyexist"))
    }
    val sequence = form.data.get("sequencing").get.trim()
    val isCodePresent = isDesciplineSequencedForEdit(sequence, discipline_id)
    if (isCodePresent) {
      newform = form.withError("sequencing", Messages.get(langObj, ("sequence.alreadyexist")))
    }
    if (newform != null) {
      newform
    } else {
      form
    }
  }

}