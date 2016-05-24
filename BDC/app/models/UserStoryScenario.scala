package models

import anorm._
import anorm.SqlParser._
import java.util.Date
import play.api.libs.json._

/**
 * @author cristian
 */

case class UserStoryScenario(uss_id: Int,
                    uss_code: String,
                    us_id: Int,
                    //program_id: Int,
                    //program_name: String,
                    titulo: String,
                    contexto: String,
					          evento: String,
                    resultado:String,
                    created_by: Int,
                    created_by_name: String)

object UserStoryScenario {
  val userStoryScenario = {
    get[Int]("uss_id") ~
      get[String]("uss_code") ~
      get[Int]("us_id") ~
      //get[Int]("program_id") ~
      //get[String]("program_name") ~
      get[String]("titulo") ~
	    get[String]("contexto") ~
      get[String]("evento") ~
      get[String]("resultado") ~
      get[Int]("created_by") ~
      get[String]("created_by_name")  map {
        case uss_id ~
          uss_code ~
          us_id ~
          //program_id ~
          //program_name ~
          titulo ~
		      contexto ~
          evento ~
          resultado ~
          created_by ~
          created_by_name  => UserStoryScenario(uss_id,
          uss_code,
          us_id,
          //program_id,
          //program_name,
          titulo,
		      contexto,
          evento,
          resultado,
          created_by,
          created_by_name)
      }

  }
  
  implicit val userStoryScenarioWrites = new Writes[UserStoryScenario] {
    def writes(userStoryScenario: UserStoryScenario) = Json.obj(
      "uss_id" -> userStoryScenario.uss_id.toInt,
      "uss_code" -> userStoryScenario.uss_code.toString(),
      "us_id" -> userStoryScenario.us_id.toInt,
      "uss_code" -> userStoryScenario.uss_code.toString(),
      "titulo" -> userStoryScenario.titulo.toString(),
      "contexto" -> userStoryScenario.contexto.toString(),
      "evento" -> userStoryScenario.evento.toString(),
      "resultado" -> userStoryScenario.resultado.toString(),
      "created_by" -> userStoryScenario.created_by.toInt,
      "created_by_name" -> userStoryScenario.created_by_name.toString())
  }
  
  
}
/*
case class Status(
  log_id: Int,
  incident_id: Int,
  status_name: String,
  log_date: Date,
  note: String,
  user_creation_name: String)

object Status {
  val status = {
    get[Int]("log_id") ~
      get[Int]("incident_id") ~
      get[String]("status_name") ~
      get[Date]("log_date") ~
      get[String]("note") ~
      get[String]("user_creation_name") map {
        case log_id ~
          incident_id ~
          status_name ~
          log_date ~
          note ~
          user_creation_name => Status(
          log_id,
          incident_id,
          status_name,
          log_date,
          note,
          user_creation_name)
      }

  }
  implicit val statusWrites = Json.writes[Status]
}
*/

