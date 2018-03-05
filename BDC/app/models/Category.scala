package models

import anorm.SqlParser._
import anorm._

case class Categories(id: Option[Int], description: String, is_active: Int)

object Categories extends CustomColumns {

  val category = {
    get[Option[Int]]("id") ~
      get[String]("description") ~
      get[Int]("is_active") map {
      case id ~ description ~ is_active => Categories(id, description, is_active)
    }
  }
}