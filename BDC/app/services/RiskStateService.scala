package services

import anorm.SQL
import anorm.sqlToSimple
import play.api.Play.current
import play.api.db.DB
import anorm.SqlParser._
import anorm._
import models.RiskState
/**
 * @author marcelo
 */
object RiskStateService {
  
    def findActiveRiskState(): Seq[RiskState] = {
    var sqlString = "SELECT * FROM art_risk_state where is_deleted = 1"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(RiskState.riskstate *)
    }
  }
}