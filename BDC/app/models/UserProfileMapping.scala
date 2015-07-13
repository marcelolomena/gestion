package models
import anorm.SqlParser._
import anorm._
import java.util.Date

case class UserProfileMapping(id: Option[Int], user_id: Int, user_role: Int)

object UserProfileMapping {

  val userProfileMapping = {
    get[Option[Int]]("id") ~
      get[Int]("user_id") ~
      get[Int]("user_role") map {
        case id ~ user_id ~ user_role => UserProfileMapping(id, user_id, user_role)
      }
  }
}