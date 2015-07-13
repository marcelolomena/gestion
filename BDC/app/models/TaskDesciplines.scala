package models

import anorm.SqlParser._
import anorm._
import java.util.Date

case class TaskDesciplines(id: Option[Int], sequencing: Option[Int], task_discipline: String, description: String, created_by: Int, updation_date: Option[Date], is_deleted: Int);

object TaskDesciplines {

  val taskDesciplineMaster = {
    get[Option[Int]]("id") ~
      get[Option[Int]]("sequencing") ~
      get[String]("task_discipline") ~
      get[String]("description") ~
      get[Int]("created_by") ~
      get[Option[Date]]("updation_date") ~
      get[Int]("is_deleted") map {
        case id ~ sequencing ~ task_discipline ~ description ~ created_by ~ updation_date ~ is_deleted => TaskDesciplines(id, sequencing, task_discipline, description, created_by, updation_date, is_deleted)
      }
  }

}

case class TaskDesciplineChild(id: Option[Int], sequencing: Option[Int], task_discipline: String, description: String)

object TaskDesciplineChild {

  val taskDesciplines = {
    get[Option[Int]]("id") ~
      get[Option[Int]]("sequencing") ~
      get[String]("task_discipline") ~
      get[String]("description") map {
        case id ~ sequencing ~ task_discipline ~ description => TaskDesciplineChild(id, sequencing, task_discipline, description)
      }
  }
}