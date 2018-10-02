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
  uidlider: Option[Int],
  lider: String)

object PortfolioMaster extends CustomColumns {

  val pMaster = {
    get[Option[Int]]("id") ~ get[String]("name") ~ get[String]("description") ~ get[String]("state") ~
      get[Option[Int]]("uidlider") ~ get[String]("lider") map {
      case id ~ name ~ description ~ state ~ uidlider ~ lider =>
        PortfolioMaster(id, name, description, state, uidlider, lider)
    }
  }

}

case class PortfolioPrograms(
                            //id, name, description, state, uidlider
                            proyectos: Option[Int],
                            program_id: Option[Int],
                            program_name: String,
                            lider: String,
                            workflow_status: String,
                            demand_manager: Option[Int])

object PortfolioPrograms extends CustomColumns {

  val pPrograms = {
    get[Option[Int]]("proyectos") ~ get[Option[Int]]("program_id") ~ get[String]("program_name") ~ get[String]("lider") ~ get[String]("workflow_status") ~
      get[Option[Int]]("demand_manager") map {
      case proyectos ~ program_id ~ program_name ~ lider ~ workflow_status ~ demand_manager =>
        PortfolioPrograms(proyectos, program_id, program_name, lider, workflow_status, demand_manager)
    }
  }

  implicit val pProgramsWrites = Json.writes[PortfolioPrograms]

}

