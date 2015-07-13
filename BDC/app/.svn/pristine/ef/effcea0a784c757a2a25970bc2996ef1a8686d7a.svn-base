package models

import anorm.SqlParser._
import anorm._

case class Workflows(id: Option[Int], workflow_status: String)

object Workflows {
  
  val workflow = {
    get[Option[Int]]("id") ~
      get[String]("workflow_status") map {
        case id ~ workflow_status => Workflows(id, workflow_status)
      }
  }
}
