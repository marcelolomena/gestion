package services

import models._
import play.api.Play.current
import play.api.db.DB;
import anorm.SqlParser._
import models._
import anorm._
import com.typesafe.plugin._

import play.api.data.Form
import play.i18n._
import play.mvc._

object ProjectWorkflowStatusService extends CustomColumns {

  val langObj = new Lang(Lang.forCode("es-ES"))

  def findProjectWorkflowList(pagNo: String, recordOnPage: String): Seq[ProjectWorkflowMaster] = {
    val rec = Integer.parseInt(pagNo.toInt.toString) * Integer.parseInt(recordOnPage.toInt.toString)
    val start = rec - Integer.parseInt(recordOnPage.toInt.toString)
    val end = Integer.parseInt(recordOnPage.toInt.toString)
    var sqlString = ""
    //sqlString = "SELECT * from art_project_workflow_status limit " + start + "," + end
    // sqlString = "SELECT * from art_project_workflow_status limit  where ( id BETWEEN  " + (start + 1) + " AND  " + (start + end) + ")"

    sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY id) AS Row, * FROM art_project_workflow_status AS tbl)as ss WHERE  (Row >=" + (start + 1) + " AND Row <= " + (start + end) + ")"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ProjectWorkflowMaster.projectWorkflowMaster *)
    }
  }

  def saveProjectWorkFlowStatus(obj: ProjectWorkflowMaster): Long = {
    // println(obj)
    DB.withConnection { implicit connection =>
      val last = SQL("""insert into art_project_workflow_status ( project_workflow_status,description, created_by, updation_date, is_deleted) values (
           {project_workflow_status},{description}, {created_by}, {updation_date}, {is_deleted}) """).on(
        'project_workflow_status -> obj.project_workflow_status.trim(),
        'description -> obj.description,
        'created_by -> obj.created_by,
        'updation_date -> obj.updation_date,
        'is_deleted -> obj.is_deleted).executeInsert(scalar[Long].singleOpt)
      last.last
    }
  }

  def findProjectWorkflowStatusById(id: String) = {
    var sql = ""
    if (id != "") {
      sql = "select t.* from art_project_workflow_status t where t.id='" + id + "' AND  t.is_deleted = 0"
      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(ProjectWorkflowMaster.projectWorkflowMaster.singleOpt)
        result
      }
    } else {
      null
    }
  }

  def findProjectWorkflowStatusDetailById(id: String) = {
    var sql = ""
    if (id != "") {
      sql = "select t.* from art_project_workflow_status t where t.id='" + id + "'"
      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(ProjectWorkflowMaster.projectWorkflowMaster.singleOpt)
        result
      }
    } else {
      null
    }
  }

  def updateProjectWorkFlowStatus(obj: ProjectWorkflowMaster): Int = {
    DB.withConnection { implicit connection =>
      SQL(""" update  art_project_workflow_status  set project_workflow_status={project_workflow_status},description={description}, created_by={created_by}, updation_date={updation_date} , is_deleted={is_deleted} where id={id}""").on(
        'id -> obj.id.get,
        'project_workflow_status -> obj.project_workflow_status.trim(),
        'description -> obj.description,
        'created_by -> obj.created_by,
        'updation_date -> obj.updation_date,
        'is_deleted -> obj.is_deleted).executeUpdate()
    }
  }

  def changeProjectWorkflowStatus(id: String, is_deleted: Int, uid: Int): Int = {
    DB.withConnection { implicit connection =>
      SQL(""" update  art_project_workflow_status  set created_by={created_by}, updation_date={updation_date} , is_deleted={is_deleted} where id={id}""").on(
        'id -> id,
        'created_by -> uid,
        'updation_date -> new java.util.Date(),
        'is_deleted -> is_deleted).executeUpdate()
    }
  }

  def findAllProjectWorkflowList(): Seq[ProjectWorkflowMaster] = {
    var sqlString = "SELECT * from art_project_workflow_status where is_deleted = 0 order by project_workflow_status asc"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ProjectWorkflowMaster.projectWorkflowMaster *)
    }
  }

  def projectWorkflowStatusCount(): Long = {
    DB.withConnection { implicit connection =>
      var sqlString = ""
      sqlString = "SELECT count(*) from art_project_workflow_status"
      val count: Long = SQL(sqlString).as(scalar[Long].single)
      count
    }
  }

  def validateStatusForm(form: Form[ProjectWorkflow]): Form[ProjectWorkflow] = {
    var newform: Form[ProjectWorkflow] = null
    val descriptionlegth = form.data.get("description").get.trim().length()
    if (descriptionlegth < 4 || descriptionlegth > 500) {
      newform = form.withError("description", Messages.get(langObj, ("error.description.minmax")))
    }
    val project_workflow_status = form.data.get("project_workflow_status").get.trim()
    val obj = findStatusByName(project_workflow_status)
    if (obj.size > 0) {
      newform = form.withError("project_workflow_status", Messages.get(langObj, ("project_workflow_status.alreadyexist")))
    }
    if (newform != null) {
      newform
    } else {
      form
    }
  }
  def findStatusByName(project_workflow_status: String): Seq[ProjectWorkflow] = {
    var sql = "select t.* from art_project_workflow_status t where t.is_deleted = 0  AND  t.project_workflow_status='" + project_workflow_status + "'"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(ProjectWorkflow.projectWorkflow *)
      result
    }
  }
  def findStatusForEdit(project_workflow_status: String, project_workflow_status_id: String): Seq[ProjectWorkflow] = {
    var sql = "select d.* from art_project_workflow_status d where d.is_deleted = 0  AND d.project_workflow_status='" + project_workflow_status.trim() + "' AND d.id <>'" + project_workflow_status_id + "'"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(ProjectWorkflow.projectWorkflow *)
      result
    }

  }
  def validateStatusFormForEdit(form: Form[ProjectWorkflow]): Form[ProjectWorkflow] = {
    var newform: Form[ProjectWorkflow] = null
    val descriptionlegth = form.data.get("description").get.trim().length()
    if (descriptionlegth < 4 || descriptionlegth > 500) {
      newform = form.withError("description", Messages.get(langObj, ("error.description.minmax")))
    }
    val project_workflow_status_id = form.data.get("id").get.trim()

    val project_workflow_status = form.data.get("project_workflow_status").get.trim()

    val obj = findStatusForEdit(project_workflow_status, project_workflow_status_id)
    if (obj.size > 0) {
      newform = form.withError("project_workflow_status", Messages.get(langObj, "project_workflow_status.alreadyexist"))
    }
    if (newform != null) {
      newform
    } else {
      form
    }
  }
}