package services

import anorm._
import model.BoardValidators.GridValidator
import model.{ServiceResponse, StatusCode}
import models.{CustomColumns, ResultHealth}
import play.api.db.DB
import play.api.Play.current

object HealthService extends CustomColumns {
  def listSlow (grid : GridValidator): ServiceResponse[Seq[ResultHealth]] ={
    DB.withConnection { implicit c =>
      def listPMO : ServiceResponse[Seq[ResultHealth]] = {
        implicit val fullListPMO = SQL("EXEC art.get_health").as(ResultHealth.parser.*)
        ServiceResponse(StatusCode.OK)
      }
      listPMO
    }
  }

}
