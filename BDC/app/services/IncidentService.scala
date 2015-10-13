package services

import play.api.db.DB
import models.Incident

/**
 * @author marcelo
 */
class IncidentService {
 
    def list(pageSize: String, pageNumber: String, Json: String): Seq[Incident] = {

    var sqlString = "EXEC art.list_incident {PageSize},{PageNumber},{Json}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('PageSize -> pageSize.toInt, 'PageNumber -> pageNumber.toInt, 'Json -> Json).executeQuery() as (Incident.incident *)
    }
  }

  def count(did: String, Json: String): Int = {
    //println(Json)
    var sqlString = "EXEC art.count_incident {did},{Json}"

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('did -> did.toInt, 'Json -> Json).executeQuery() as (scalar[Int].single)
    }
  }
  
}