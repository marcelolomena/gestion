package models

import anorm.SqlParser._
import anorm._
import java.util._

case class Deliverables(id: Option[Int], deliverable: String, description: String, updated_by: Option[Int], updation_date: Option[Date], creation_date: Option[Date], is_deleted: Int)

object Deliverables {

  val deliverable = {
    get[Option[Int]]("id") ~
      get[String]("deliverable") ~
      get[String]("description") ~
      get[Option[Int]]("updated_by") ~
      get[Option[Date]]("updation_date") ~
      get[Option[Date]]("creation_date") ~
      get[Int]("is_deleted") map {
        case id ~ deliverable ~ description ~ updated_by ~ updation_date ~ creation_date ~ is_deleted => Deliverables(id, deliverable, description, updated_by, updation_date, creation_date, is_deleted)
      }
  }
}