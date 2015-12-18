package models
import anorm.SqlParser._
import play.api.Play.current
import java.util.Date
import anorm._
import play.api.db.DB
import play.api.libs.json._

case class Divisions(
    dId: Option[Int],
    division: String,
    user_id: Long,
    updated_by: Option[Int],
    updation_date: Option[Date],
    is_deleted: Int)

object Divisions extends CustomColumns {

  val division = {
    get[Option[Int]]("dId") ~
      get[String]("division") ~
      get[Long]("user_id") ~
      get[Option[Int]]("updated_by") ~
      get[Option[Date]]("updation_date") ~
      get[Int]("is_deleted") map {
        case dId ~ division ~ user_id ~ updated_by ~ updation_date ~ is_deleted => Divisions(dId, division, user_id, updated_by, updation_date, is_deleted)
      }
  }
  implicit val divisionWrites = Json.writes[Divisions]

}