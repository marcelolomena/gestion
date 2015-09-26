package models

import anorm.SqlParser._
import anorm._
import java.util.Date

case class RiskAlerts(id: Option[Int],
                      risk_id: Int,
                      event_type: Option[Int],
                      event_code: Option[Int],
                      event_date: Option[Date],
                      event_title: String,
                      event_details: Option[String],
                      responsible: Option[Int],
                      person_invloved: Option[String],
                      alert_type: Option[Int],
                      criticality: Option[Int],
                      is_active: Option[Int])

object RiskAlerts extends CustomColumns {
  val alerts = {
    get[Option[Int]]("id") ~
      get[Int]("risk_id") ~
      get[Option[Int]]("event_type") ~
      get[Option[Int]]("event_code") ~
      get[Option[Date]]("event_date") ~
      get[String]("event_title") ~
      get[Option[String]]("event_details") ~
      get[Option[Int]]("responsible") ~
      get[Option[String]]("person_invloved") ~
      get[Option[Int]]("alert_type") ~
      get[Option[Int]]("criticality") ~
      get[Option[Int]]("is_active") map {
        case id ~
          risk_id ~
          event_type ~
          event_code ~
          event_date ~
          event_title ~
          event_details ~
          responsible ~
          person_invloved ~
          alert_type ~
          criticality ~
          is_active =>
          RiskAlerts(id,
            risk_id,
            event_type,
            event_code,
            event_date,
            event_title,
            event_details,
            responsible,
            person_invloved,
            alert_type,
            criticality,
            is_active)
      }
  }
}


case class RiskAlertsIncreased(id: Option[Int],
                      risk_id: Int,
                      event_type: Option[Int],
                      event_code: Option[Int],
                      event_date: Option[Date],
                      event_title: String,
                      event_details: Option[String],
                      responsible: Option[Int],
                      person_invloved: Option[String],
                      alert_type: Option[Int],
                      criticality: Option[Int],
                      is_active: Option[Int],
                      level: String,
                      title: String,
                      program_name: String)

object RiskAlertsIncreased extends CustomColumns {
  val alertsIncreased = {
    get[Option[Int]]("id") ~
      get[Int]("risk_id") ~
      get[Option[Int]]("event_type") ~
      get[Option[Int]]("event_code") ~
      get[Option[Date]]("event_date") ~
      get[String]("event_title") ~
      get[Option[String]]("event_details") ~
      get[Option[Int]]("responsible") ~
      get[Option[String]]("person_invloved") ~
      get[Option[Int]]("alert_type") ~
      get[Option[Int]]("criticality") ~
      get[Option[Int]]("is_active") ~ get[String]("level") ~
      get[String]("title") ~ 
      get[String]("program_name") map {
        case id ~
          risk_id ~
          event_type ~
          event_code ~
          event_date ~
          event_title ~
          event_details ~
          responsible ~
          person_invloved ~
          alert_type ~
          criticality ~
          is_active ~ level ~ title ~ program_name =>
          RiskAlertsIncreased(id,
            risk_id,
            event_type,
            event_code,
            event_date,
            event_title,
            event_details,
            responsible,
            person_invloved,
            alert_type,
            criticality,
            is_active,
            level,
            title,
            program_name)
      }
  }
}


