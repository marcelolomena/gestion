package models

/**
 * @author marcelo
 */
import anorm._
import anorm.SqlParser._
import java.util.Date
import play.api.libs.json._

case class ErrorSQL(
  error_code: Int,
  error_text: String,
  id: Int)

object ErrorSQL {
  val errorsql = {
    get[Int]("error_code") ~
      get[String]("error_text") ~
      get[Int]("id") map {
        case error_code ~
          error_text ~
          id => ErrorSQL(
          error_code,
          error_text,
          id)
      }

  }
  implicit val errorWrites = Json.writes[ErrorSQL]
}