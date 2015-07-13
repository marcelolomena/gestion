package models

import anorm.SqlParser._
import play.api.Play.current
import java.util.Date
import anorm._
import play.api.db.DB
import play.api.data.Forms._
import play.api.data._

case class Template(id: Int, generic_project_type: String)

object Template extends CustomColumns {

  val tmp = {
    get[Int]("id") ~ get[String]("generic_project_type") map {
        case id ~ generic_project_type =>
          Template(id, generic_project_type)

      }
  }

}




