package models
import anorm.SqlParser._
import play.api.Play.current
import java.util.Date
import anorm._
import play.api.db.DB

case class Genrencias(dId: Option[Int], genrencia: String, user_id: Long, report_type: Int, report_to: Int, organization_depth: Int, updated_by: Option[Int], updation_date: Option[Date], is_deleted: Int)

object Genrencias extends CustomColumns {

  val genrencia = {
    get[Option[Int]]("dId") ~ get[String]("genrencia") ~ get[Long]("user_id") ~ get[Int]("report_type") ~ get[Int]("report_to") ~ get[Int]("organization_depth") ~ get[Option[Int]]("updated_by") ~ get[Option[Date]]("updation_date") ~ get[Int]("is_deleted") map {
      case dId ~ genrencia ~ user_id ~ report_type ~ report_to ~ organization_depth ~ updated_by ~ updation_date ~ is_deleted => Genrencias(dId, genrencia, user_id, report_type, report_to, organization_depth, updated_by, updation_date, is_deleted)
    }
  }

}