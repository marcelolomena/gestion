package models

import anorm.SqlParser._
import anorm._
import java.util.Date

case class RiskSubCategory(id: Option[Int], category_id: Int, name: String, description: String, created_by: Int, creation_date: Date, updation_date: Date, is_deleted: Int)


object RiskSubCategory extends CustomColumns {
  val riskSubCategory = {
    get[Option[Int]]("id") ~
      get[Int]("category_id") ~
      get[String]("name") ~
      get[String]("description") ~
      get[Int]("created_by") ~
      get[Date]("creation_date") ~
      get[Date]("updation_date") ~
      get[Int]("is_deleted") map {
        case id ~ category_id ~ name ~ description ~ created_by ~ creation_date ~ updation_date ~ is_deleted => RiskSubCategory(id, category_id, name, description, created_by, creation_date, updation_date, is_deleted)
      }
  }
}