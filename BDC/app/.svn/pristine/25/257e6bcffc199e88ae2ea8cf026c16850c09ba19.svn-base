package models

import anorm.SqlParser._
import anorm._
import java.util.Date

case class Stages(id: Option[Int], sequencing: Option[Int], stage: String, description: String, updated_by: Option[Int], updation_date: Option[Date], creation_date: Option[Date], is_deleted: Int)

object Stages {

  val stage = {
    get[Option[Int]]("id") ~
      get[Option[Int]]("sequencing") ~
      get[String]("stage") ~
      get[String]("description") ~
      get[Option[Int]]("updated_by") ~
      get[Option[Date]]("updation_date") ~
      get[Option[Date]]("creation_date") ~
      get[Int]("is_deleted") map {
        case id ~ sequencing ~ stage ~ description ~ updated_by ~ updation_date ~ creation_date ~ is_deleted => Stages(id, sequencing, stage, description, updated_by, updation_date, creation_date, is_deleted)
      }
  }
}