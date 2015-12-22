package models

import anorm.SqlParser._
import play.api.Play.current
import java.util.Date
import anorm._
import play.api.db.DB
import play.api.libs.json._

case class ImpactTypes(id: Option[Int], impact_type: String)

object ImpactTypes {

  val impactTypes = {
    get[Option[Int]]("id") ~
      get[String]("impact_type") map {
        case id ~ impact_type => ImpactTypes(id, impact_type)
      }
  }
  
  implicit val impactWrites = Json.writes[ImpactTypes]
}