package models

import anorm.SqlParser._
import anorm._
import java.util.Date

case class GenericProjectTypes(id: Option[Int], generic_project_type: String, description: String, updated_by: Option[Int], updation_date: Option[Date], creation_date: Option[Date], is_deleted: Int)

object GenericProjectTypes extends CustomColumns{
  val pTypes = {
    get[Option[Int]]("id") ~
      get[String]("generic_project_type") ~
      get[String]("description") ~
      get[Option[Int]]("updated_by") ~
      get[Option[Date]]("updation_date") ~
      get[Option[Date]]("creation_date") ~
      get[Int]("is_deleted") map {
        case id ~ generic_project_type ~ description ~ updated_by ~ updation_date ~ creation_date ~ is_deleted => GenericProjectTypes(id, generic_project_type, description, updated_by, updation_date, creation_date, is_deleted)
      }
  }
}