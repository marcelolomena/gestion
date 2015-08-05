package models

import anorm.SqlParser._
import anorm._
import java.util.Date

/**
 * @author marcelo
 */
case class RiskState(id: Option[Int], state_name: String, description: String, is_deleted: Int)

object RiskState extends CustomColumns {
  val riskstate = {
    get[Option[Int]]("id") ~
      get[String]("state_name") ~
      get[String]("description") ~
      get[Int]("is_deleted") map {
        case id ~ state_name ~ description ~ is_deleted =>
          RiskState(id, state_name, description, is_deleted)
      }
  }
}