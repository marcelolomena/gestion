package services

import play.api.Play.current
import play.api.db.DB
import anorm.SqlParser._
import models.Stages
import anorm._
import com.typesafe.plugin._
import com.sun.xml.internal.ws.wsdl.writer.document.Import
import java.util._
import models.GenericProjectTypes
import models.CustomColumns
import models.ComboStatus

object GenericProjectTypeService extends CustomColumns{

  /**
   * *
   *
   */
  def findAllGenericProjectType(pagNo: String, recordOnPage: String): Seq[GenericProjectTypes] = {
    val rec = Integer.parseInt(pagNo.toInt.toString) * Integer.parseInt(recordOnPage.toInt.toString)
    val start = rec - Integer.parseInt(recordOnPage.toInt.toString)
    val end = Integer.parseInt(recordOnPage.toInt.toString)
    var sqlString = ""
    sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY id) AS Row, * FROM art_program_generic_project_type AS tbl where is_deleted = 0)as ss WHERE  (Row >=" + (start + 1) + " AND Row <= " + (start + end) + ")"
    //sqlString = "SELECT * from art_program_generic_project_type  limit " + start + "," + end
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(GenericProjectTypes.pTypes *)
    }
  }

  def saveGenericProjectType(obj: GenericProjectTypes): Long = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        """
          insert into art_program_generic_project_type (generic_project_type,description,creation_date,is_deleted) values (
          {generic_project_type},{description},{creation_date},{is_deleted})
          """).on(
          'generic_project_type -> obj.generic_project_type,
          'description -> obj.description,
          'creation_date -> new Date(),
          'is_deleted -> obj.is_deleted).executeInsert(scalar[Long].singleOpt)
          
        result.last  
    }
  }
  def updateGenericProjectType(obj: GenericProjectTypes): Int = {
    DB.withConnection { implicit connection =>
      SQL(""" update  art_program_generic_project_type set generic_project_type={generic_project_type},description={description},updated_by={updated_by},updation_date={updation_date},is_deleted={is_deleted} where id={id}  """).on(
        'id -> obj.id.get,
        'generic_project_type -> obj.generic_project_type,
        'description -> obj.description,
        'updated_by -> obj.updated_by,
        'updation_date -> new Date(),
        'is_deleted -> obj.is_deleted).executeUpdate()
    }
  }

  def findGenericProjectTypeById(id: String): Option[GenericProjectTypes] = {
    if (!id.isEmpty()) {
      var sql = "select t.* from art_program_generic_project_type t where t.id='" + id + "'"
      println(sql)
      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(GenericProjectTypes.pTypes.singleOpt)
        result
      }
    } else {
      println("nunca puede entrar aca")
      null
    }
  }
  
   def findActiveGenericProjectTypeById(id: String): Option[GenericProjectTypes] = {
    if (!id.isEmpty()) {
      var sql = "select t.* from art_program_generic_project_type t where t.id='" + id + "' AND is_deleted=0 ORDER BY generic_project_type"
      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(GenericProjectTypes.pTypes.singleOpt)
        result
      }
    } else {
      null
    }
  }
   
   def findAllActiveGenericProjectType2(): Seq[ComboStatus] = {
    
      var sql = "select a.id status_id, t.generic_project_type status_name from art_program_generic_project_type t join art_project_type_master a on t.id=a.project_type WHERE a.states=0 and t.is_deleted=0 order by generic_project_type"
      DB.withConnection { implicit connection =>
        SQL(sql).as(ComboStatus.comboStatus *)
      }
   
  }

  def findGenericProjectTypeByName(genericProjectType: String): Option[GenericProjectTypes] = {
    if (!genericProjectType.isEmpty()) {
      var sql = "select t.* from art_program_generic_project_type t where t.generic_project_type='" + genericProjectType.trim() + "'"
      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(GenericProjectTypes.pTypes.singleOpt)
        result
      }
    } else {
      null
    }
  }
  /**
   * delete generic_project_type
   */
  def deleteGenericProjectType(id: String) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "update  art_program_generic_project_type set is_deleted = 1  where id='" + id + "'").on(
          'id -> id).executeUpdate()
    }
  }

  def findAllActiveGenericProjectType(): Seq[GenericProjectTypes] = {
    var sqlString = "SELECT * from art_program_generic_project_type where  is_deleted = 0 ORDER BY generic_project_type"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(GenericProjectTypes.pTypes *)
    }
  }

  /*  def findActiveGenericProjectType(): Seq[GenericProjectTypes] = {
    var sqlString = "SELECT * from art_program_generic_project_type where is_deleted = 0 "
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(GenericProjectTypes.pTypes *)
    }
  }*/
  def genericProjectTypeCount(): Long = {
    DB.withConnection { implicit connection =>
      var sqlString = ""
      sqlString = "SELECT count(*) from art_program_generic_project_type where is_deleted = 0 "
      val count: Long = SQL(sqlString).as(scalar[Long].single)
      count
    }
  }
}