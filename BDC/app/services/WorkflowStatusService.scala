package services

import play.api.Play.current
import play.api.db.DB;
import anorm.SqlParser._
import models._
import anorm._
import com.typesafe.plugin._

object WorkflowStatusService {

  def findWorkflowList(pagNo: String, recordOnPage: String): Seq[Workflows] = {
    val rec = Integer.parseInt(pagNo.toInt.toString) * Integer.parseInt(recordOnPage.toInt.toString)
    val start = rec - Integer.parseInt(recordOnPage.toInt.toString)
    val end = Integer.parseInt(recordOnPage.toInt.toString)
    var sqlString = ""
    //sqlString = "SELECT * from art_program_workflow_status limit " + start + "," + end
    sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY id) AS Row, * FROM art_program_workflow_status AS tbl )as ss WHERE  (Row >=" + (start + 1) + " AND Row <= " + (start + end) + ")"

    println(sqlString);

    DB.withConnection { implicit connection =>
      SQL(sqlString).as(Workflows.workflow *)
    }
  }

  def saveWorkFlowStatus(obj: Workflows): Int = {
    DB.withConnection { implicit connection =>
      SQL("""insert into art_program_workflow_status ( workflow_status) values (
        {workflow_status}) """).on(
        'id -> obj.id,
        'workflow_status -> obj.workflow_status.trim()).executeUpdate()
    }
  }

  def findWorkflowStatusById(id: String) = {
    var sql = ""
    if (id != "") {
      sql = "select t.* from art_program_workflow_status t where t.id='" + id + "'"
      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(Workflows.workflow.singleOpt)
        result
      }
    } else {
      null
    }
  }

  def updateWorkFlowStatus(obj: Workflows): Int = {
    DB.withConnection { implicit connection =>
      SQL(""" update  art_program_workflow_status  set workflow_status={workflow_status} where id={id}""").on('id -> obj.id.get,
        'workflow_status -> obj.workflow_status.trim()).executeUpdate()
    }
  }
  def deleteWorkflowStatus(id: String) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "Delete from art_program_workflow_status where id='" + id + "'").on(
          'id -> id).executeUpdate()
    }
  }

  def findAllWorkflowList(): Seq[Workflows] = {

    var sqlString = ""
    sqlString = "SELECT * from art_program_workflow_status"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(Workflows.workflow *)
    }
  }
}