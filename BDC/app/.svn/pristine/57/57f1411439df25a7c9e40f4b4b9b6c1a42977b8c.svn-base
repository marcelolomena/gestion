package services

import play.api.Play.current
import play.api.db.DB
import anorm.SqlParser._
import models.Stages
import anorm._
import com.typesafe.plugin._
import com.sun.xml.internal.ws.wsdl.writer.document.Import
import java.util._
import play.api.data.Form
import play.i18n._
import play.mvc._
import models.CustomColumns
object StageService extends CustomColumns {

  val langObj = new Lang(Lang.forCode("es-ES"))
  def findAllStageList(pagNo: String, recordOnPage: String): Seq[Stages] = {
    val rec = Integer.parseInt(pagNo.toInt.toString) * Integer.parseInt(recordOnPage.toInt.toString)
    val start = rec - Integer.parseInt(recordOnPage.toInt.toString)
    val end = Integer.parseInt(recordOnPage.toInt.toString)
    var sqlString = ""
    sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY sequencing ASC) AS Row, * FROM art_program_stage AS tbl)as ss WHERE  (Row >=" + (start + 1) + " AND Row <= " + (start + end) + ") "
    //sqlString = "SELECT * from art_program_stage  limit " + start + "," + end

    //println("Sql -- " + sqlString);
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(Stages.stage *)
    }
  }

  def findAllStages(): Seq[Stages] = {
    var sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY sequencing ASC) AS Row, * FROM art_program_stage AS tbl where is_deleted = 0) as ss"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(Stages.stage *)
    }
  }

  def saveStage(obj: Stages, uId: String): Long = {
    DB.withConnection { implicit connection =>
      val lastsaved = SQL(
        """
          insert into art_program_stage (sequencing,stage,description,updated_by,updation_date,is_deleted) values (
         {sequencing},{stage},{description},{updated_by},{updation_date},{is_deleted})
          """).on(
          'sequencing -> obj.sequencing,
          'stage -> obj.stage.trim(),
          'description -> obj.description,
          'updated_by -> uId,
          'updation_date -> new Date(),
          'is_deleted -> obj.is_deleted).executeInsert(scalar[Long].singleOpt)
      lastsaved.last
    }
  }
  def updateStage(obj: Stages): Int = {
    DB.withConnection { implicit connection =>
      SQL(""" update  art_program_stage set sequencing ={sequencing},stage={stage},description={description},updated_by={updated_by},updation_date={updation_date},is_deleted={is_deleted} where id={id}  """).on(
        'id -> obj.id.get,
        'sequencing -> obj.sequencing,
        'stage -> obj.stage.trim(),
        'description -> obj.description,
        'sequencing -> obj.sequencing,
        'updated_by -> obj.updated_by,
        'updation_date -> new Date(),
        'is_deleted -> obj.is_deleted).executeUpdate()
    }
  }

  def findStageById(id: String): Option[Stages] = {
    if (!id.isEmpty()) {
      var sql = "select t.* from art_program_stage t where t.id='" + id + "'"

      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(Stages.stage.singleOpt)
        result
      }
    } else {
      null
    }
  }

  def findStageByName(stageName: String): Seq[Stages] = {
    if (!stageName.isEmpty()) {
      var sql = "select t.* from art_program_stage t where t.is_deleted = 0  AND t.stage='" + stageName.trim() + "'"
      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(Stages.stage *)
        result
      }
    } else {
      null
    }
  }
  /**
   * delete stage
   */
  def changeStageStatus(id: String, is_deleted: Int, uid: Int): Int = {
    DB.withConnection { implicit connection =>
      SQL(""" update  art_program_stage set updated_by={updated_by},updation_date={updation_date},is_deleted={is_deleted} where id={id}  """).on(
        'id -> id,
        'updated_by -> uid,
        'updation_date -> new Date(),
        'is_deleted -> is_deleted).executeUpdate()
    }
  }

  def stageCount(): Long = {
    DB.withConnection { implicit connection =>
      var sqlString = ""
      sqlString = "SELECT count(*) from art_program_stage"

      val count: Long = SQL(sqlString).as(scalar[Long].single)
      count
    }
  }

  def isDesciplineSequenced(sequencing: String): Boolean = {
    if (!sequencing.trim().isEmpty()) {
      var sql = "select count(*) from art_program_stage  where is_deleted = 0  AND sequencing='" + sequencing.trim() + "'"

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
  def validateStageForm(form: Form[Stages]): Form[Stages] = {
    var newform: Form[Stages] = null
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
    if (newform != null) {
      newform
    } else {
      form
    }
  }

  def findStageByNameForEdit(stageName: String, stage_id: String): Seq[Stages] = {
    if (!stageName.isEmpty()) {
      var sql = "select t.* from art_program_stage t where t.is_deleted = 0  AND t.stage='" + stageName.trim() + "' AND id <>'" + stage_id + "'"
      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(Stages.stage *)
        result
      }
    } else {
      null
    }
  }

  def isDesciplineSequencedForEdit(sequencing: String, stage_id: String): Boolean = {
    if (!sequencing.trim().isEmpty()) {
      var sql = "select count(*) from art_program_stage  where is_deleted = 0  AND sequencing='" + sequencing.trim() + "' AND id <>'" + stage_id + "'"
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
  def validateEditStageForm(form: Form[Stages]): Form[Stages] = {
    var newform: Form[Stages] = null
    val stage_id = form.data.get("id").get.trim()
    val stage = form.data.get("stage").get.trim()
    val obj = findStageByNameForEdit(stage, stage_id)
    if (obj.size != 0) {
      newform = form.withError("stage", Messages.get(langObj, "stage.alreadyexist"))
    }
    val sequence = form.data.get("sequencing").get.trim()
    val isCodePresent = isDesciplineSequencedForEdit(sequence, stage_id)
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