package models

import anorm.SqlParser._
import anorm._
import java.util.Date

case class IssueCategory(id: Option[Int], category_name: String, description: String, created_by: Int, creation_date: Date, updation_date: Date, is_deleted: Int)

object IssueCategory extends CustomColumns {
  val issueCategoryNew = {
    get[Option[Int]]("id") ~
      get[String]("category_name") ~
      get[String]("description") ~
      get[Int]("created_by") ~
      get[Date]("creation_date") ~
      get[Date]("updation_date") ~
      get[Int]("is_deleted") map {
        case id ~ category_name ~ description ~ created_by ~ creation_date ~ updation_date ~ is_deleted =>
          IssueCategory(id, category_name, description, created_by, creation_date, updation_date, is_deleted)
      }
  }
}