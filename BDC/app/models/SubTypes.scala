package models

import anorm.SqlParser._
import anorm._
import java.util.Date

case class SubTypes(id: Option[Int], sub_type: String, description: String, user_id: Int, creation_date: Date, is_deleted: Boolean)

object SubTypes extends CustomColumns{

  val subtypes = {
    get[Option[Int]]("id") ~
      get[String]("sub_type") ~
      get[String]("description") ~
      get[Int]("user_id") ~
      get[Date]("creation_date") ~
      get[Boolean]("is_deleted") map {
        case id ~
          sub_type ~
          description ~
          user_id ~
          creation_date ~
          is_deleted => SubTypes(id, sub_type, description, user_id, creation_date, is_deleted)
      }
  }

}

case class SubTypeCase(id: Option[Int], sub_type: String, description: String)

object SubTypeCase {

  val subType = {
    get[Option[Int]]("id") ~
      get[String]("sub_type") ~
      get[String]("description") map {
        case id ~
          sub_type ~
          description => SubTypeCase(id, sub_type, description)
      }
  }
}