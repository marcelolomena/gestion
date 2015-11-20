package services

import anorm._
import anorm.SqlParser._
import models._
import models.ImpactTypes
import play.api.Play.current
import play.api.db.DB

object ImpactTypeService {

  def findImpactTypeList(pagNo: String, recordOnPage: String): Seq[ImpactTypes] = {
    val rec = Integer.parseInt(pagNo.toInt.toString) * Integer.parseInt(recordOnPage.toInt.toString)
    val start = rec - Integer.parseInt(recordOnPage.toInt.toString)
    val end = Integer.parseInt(recordOnPage.toInt.toString)
    var sqlString = ""
    sqlString = "SELECT * from art_program_impact_type where ( id BETWEEN  " + (start + 1) + " AND  " + (start + end) + ")"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ImpactTypes.impactTypes *)
    }
  }
  
  def findAllImpactTypeList(): Seq[ImpactTypes] = {
    var sqlString = "SELECT * from art_program_impact_type"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ImpactTypes.impactTypes *)
    }
  }  

  /*  def impactTypeCount() :Long = {
    DB.withConnection { implicit connection =>
         var sqlString = ""
      sqlString = "SELECT count(*) from art_program_impact_type"
      val count: Long = SQL(sqlString).as(scalar[Long].single)
      count
    }
  }*/

  def findImpactTypeById(id: String) = {
    var sql = ""
    if (id != "") {
      sql = "select t.* from art_program_impact_type t where t.id='" + id + "'"
      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(ImpactTypes.impactTypes.singleOpt)
        result
      }
    } else {
      null
    }
  }

  def saveImpactType(obj: ImpactTypes): Int = {
    DB.withConnection { implicit connection =>
      SQL("""insert into art_program_impact_type ( impact_type) values (
           {impact_type}) """).on(
        'impact_type -> obj.impact_type).executeUpdate()
    }
  }

  def updateImpactType(obj: ImpactTypes): Int = {
    DB.withConnection { implicit connection =>
      SQL(""" update  art_program_impact_type  set id ={id},impact_type={impact_type} where id={id}""").on('id -> obj.id.get,
        'impact_type -> obj.impact_type).executeUpdate()
    }
  }

  def deleteImpactType(id: String) {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "Delete from art_program_impact_type where id='" + id + "'").on(
          'id -> id).executeUpdate()
    }
  }
}