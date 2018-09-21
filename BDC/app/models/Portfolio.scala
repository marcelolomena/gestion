package models
import anorm.SqlParser._
import play.api.Play.current
import java.util.Date
import anorm._
import play.api.db.DB
import play.api.data.format.Formats._
import play.api.data.Form
import play.api.data.Forms._
import play.api.data._
import play.api.libs.json.Json


case class PortfolioMaster(
  //id, name, description, state, uidlider
  id: Option[Int],
  name: String,
  description: String,
  state: String,
  uidlider: Option[Int])

object PortfolioMaster extends CustomColumns {

  val pMaster = {
    get[Option[Int]]("id") ~ get[String]("name") ~ get[String]("description") ~ get[String]("state") ~
      get[Option[Int]]("uidlider") map {
      case id ~ name ~ description ~ state ~ uidlider =>
        PortfolioMaster(id, name, description, state, uidlider)
    }
  }

}
