package services

import java.util.Date
import anorm.SQL
import anorm.sqlToSimple
//import anorm.toParameterValue
import models.BudgetTypes
import play.api.Play.current
import play.api.db.DB
import anorm.SqlParser._
import anorm._
import com.typesafe.plugin._
import play.api.data.Form
import play.i18n._
import play.mvc._
import models.RiskSubCategory
import models.RiskCategoryNew

object RiskCategoryService {

  val langObj = new Lang(Lang.forCode("es-ES"))
  /**
   * *
   *
   */
  def findAllCategory(pagNo: String, recordOnPage: String): Seq[RiskCategoryNew] = {
    val rec = Integer.parseInt(pagNo.toInt.toString) * Integer.parseInt(recordOnPage.toInt.toString)
    val start = rec - Integer.parseInt(recordOnPage.toInt.toString)
    val end = Integer.parseInt(recordOnPage.toInt.toString)
    var sqlString = ""
    sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY sequencing ASC) AS Row, * FROM art_risk_category AS tbl where is_deleted = 0)as ss WHERE  (Row >=" + (start + 1) + " AND Row <= " + (start + end) + ")  ORDER BY sequencing ASC"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(RiskCategoryNew.riskCategoryNew    *)
    }
  }
  
  /**
   * *
   *
   */
  def findAllSubCategory(pagNo: String, recordOnPage: String): Seq[RiskSubCategory] = {
    val rec = Integer.parseInt(pagNo.toInt.toString) * Integer.parseInt(recordOnPage.toInt.toString)
    val start = rec - Integer.parseInt(recordOnPage.toInt.toString)
    val end = Integer.parseInt(recordOnPage.toInt.toString)
    var sqlString = ""
    sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY sequencing ASC) AS Row, * FROM art_risk_sub_category AS tbl where is_deleted = 0)as ss WHERE  (Row >=" + (start + 1) + " AND Row <= " + (start + end) + ")  ORDER BY sequencing ASC"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(RiskSubCategory.riskSubCategory  *)
    }
  }

  def saveRiskCategory(obj: RiskCategoryNew): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          insert into art_risk_category ( category_name, description, created_by, creation_date, updation_date, is_deleted) values (
          {category_name},{description},{created_by},{creation_date},{updation_date}, {is_deleted})
          """).on('category_name -> obj.category_name,
          'description -> obj.description,
          'created_by -> obj.created_by,
          'creation_date -> new Date(),
          'updation_date -> new Date(),
          'is_deleted -> obj.is_deleted).executeUpdate()
    }
  }
  
  def saveRiskSubCategory(obj: RiskSubCategory): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          insert into art_risk_sub_category ( category_id, name, description, created_by, creation_date, updation_date, is_deleted) values (
          {category_name},{description},{created_by},{creation_date},{updation_date}, {is_deleted})
          """).on('category_id -> obj.category_id ,
          'name -> obj.name,
          'description -> obj.description,
          'created_by -> obj.created_by,
          'creation_date -> new Date(),
          'updation_date -> new Date(),
          'is_deleted -> obj.is_deleted).executeUpdate()
    }
  }
  
  def updateRiskCategory(obj: RiskCategoryNew): Int = {

    DB.withConnection { implicit connection =>
      SQL(""" update  art_risk_category set category_name={category_name}, description={description},created_by={created_by},creation_date={creation_date},updation_date={updation_date},is_deleted={is_deleted} where id={id}  """).on(
        'id -> obj.id,
        'category_name -> obj.category_name ,
        'description -> obj.description ,
        'created_by -> obj.created_by ,
        'creation_date -> obj.creation_date,
        'updation_date -> new Date(),
        'is_deleted -> obj.is_deleted).executeUpdate()
    }
  }
  
  
  def updateRiskSubCategory(obj: RiskSubCategory): Int = {

   DB.withConnection { implicit connection =>
      SQL(""" update  art_risk_sub_category set category_id={category_id}, name={name}, description={description},created_by={created_by},creation_date={creation_date},updation_date={updation_date},is_deleted={is_deleted} where id={id}  """).on(
        'id -> obj.id,
        'category_id -> obj.category_id,
        'name -> obj.name ,
        'description -> obj.description ,
        'created_by -> obj.created_by ,
        'creation_date -> obj.creation_date,
        'updation_date -> new Date(),
        'is_deleted -> obj.is_deleted).executeUpdate()
    }
  }

  def findRiskCategoryById(id: String): Option[RiskCategoryNew] = {
    if (!id.isEmpty()) {
      var sql = "select t.* from art_risk_category t where t.id='" + id + "'"

      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(RiskCategoryNew.riskCategoryNew .singleOpt)
        result
      }
    } else {
      null
    }
  }
  
  
 def findRiskSubCategoryById(id: String): Option[RiskSubCategory] = {
    if (!id.isEmpty()) {
      var sql = "select t.* from art_risk_sub_category t where t.id='" + id + "'"

      DB.withConnection { implicit connection =>
        val result = SQL(sql).as(RiskSubCategory.riskSubCategory.singleOpt)
        result
      }
    } else {
      null
    }
  }



  /**
   * delete art_program_budget_type
   */
  def deleteRiskCategory(id: String) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "update  art_risk_category set is_deleted = 1  where id='" + id + "' ").on(
          'id -> id).executeUpdate()
    }
  }
  
   /**
   * delete art_program_budget_type
   */
  def deleteRiskSubCategory(id: String) = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "update  art_risk_sub_category set is_deleted = 1  where id='" + id + "' ").on(
          'id -> id).executeUpdate()
    }
  }

 

  def findActiveRiskCategory(): Seq[RiskCategoryNew] = {
    var sqlString = "SELECT * FROM  art_risk_category where is_deleted = 0"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(RiskCategoryNew.riskCategoryNew   *)
    }
  }
  
  def findActiveRiskSubCategory(): Seq[RiskSubCategory] = {
    var sqlString = "SELECT * FROM  art_risk_sub_category where is_deleted = 0"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(RiskSubCategory.riskSubCategory  *)
    }
  }
  
   def findRiskSubCategoryForRiskCategory(category_id : String): Seq[RiskSubCategory] = {
    var sqlString = "SELECT * FROM  art_risk_sub_category where is_deleted = 0 AND category_id=" + category_id
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(RiskSubCategory.riskSubCategory  *)
    }
  }

  
}