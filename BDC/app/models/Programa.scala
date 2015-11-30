package models

import anorm._
import anorm.SqlParser._
import java.util.Date
import play.api.libs.json._

/**
 * @author marcelo

d.division,t1.program_type,t2.sub_type,w.workflow_status,a.program_id,a.program_name,a.release_date
 */
case class Programa(
  program_id: Int,
  division: String,
  program_type: String,
  sub_type: String,
  workflow_status: String,
  program_name: String,
  release_date: Option[Date],
  pai: Double,
  pae: Double,
  spi: Double,
  cpi: Double)

object Programa {
  val programa = {
    get[Int]("program_id") ~
      get[String]("division") ~
      get[String]("program_type") ~
      get[String]("sub_type") ~
      get[String]("workflow_status") ~
      get[String]("program_name") ~
      get[Option[Date]]("release_date") ~
      get[Double]("pai") ~ 
      get[Double]("pae") ~
      get[Double]("spi") ~
      get[Double]("cpi") map {
        case program_id ~
          division ~
          program_type ~
          sub_type ~
          workflow_status ~
          program_name ~
          release_date ~
          pai ~
          pae ~
          spi ~
          cpi => Programa (
          program_id,
          division,
          program_type,
          sub_type,
          workflow_status,
          program_name,
          release_date,
          pai,
          pae,
          spi,
          cpi)
      }

  }
  implicit val programaWrites = Json.writes[Programa]
}