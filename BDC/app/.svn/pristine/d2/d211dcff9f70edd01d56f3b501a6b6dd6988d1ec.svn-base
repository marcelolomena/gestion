
package models

import anorm.SqlParser._
import anorm._
import java.util.Date

case class IssueSubCategory(id: Option[Int], category_id: Int, name: String, description: String, created_by: Int, creation_date: Date, updation_date: Date, is_deleted: Int)

object IssueSubCategory extends CustomColumns {
  val issueSubCategory = {
    get[Option[Int]]("id") ~
      get[Int]("category_id") ~
      get[String]("name") ~
      get[String]("description") ~
      get[Int]("created_by") ~
      get[Date]("creation_date") ~
      get[Date]("updation_date") ~
      get[Int]("is_deleted") map {
        case id ~ category_id ~ name ~ description ~ created_by ~ creation_date ~ updation_date ~ is_deleted => IssueSubCategory(id, category_id, name, description, created_by, creation_date, updation_date, is_deleted)
      }
  }
}