package models

import anorm._
import anorm.SqlParser._
import java.util.Date
import play.api.libs.json._

/**
 * @author cristian
 */

case class DataRRHH(division: String,
                    gerencia: String,
                    departamento: String)

object DataRRHH {
  val datarrhh = {
      get[String]("division") ~
      get[String]("gerencia") ~
	    get[String]("departamento")   map {
        case division ~
          gerencia ~
          departamento   => DataRRHH(division,
          gerencia,
          departamento)
      }

  }
}
