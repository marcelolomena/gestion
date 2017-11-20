package models

import anorm.SqlParser._
import anorm._
import java.util.Date
import play.api.libs.json._

case class RiskAlertsIncreased(id: Option[Int],
                               risk_id: Int,
                               //event_type: Option[Int],
                               event_code: Option[Int],
                               event_date: Option[Date],
                               event_title: String,
                               event_details: Option[String],
                               responsible: Option[Int],
                               person_invloved: Option[String],
                               //alert_type: Option[Int],
                               criticality: Option[Int],
                               is_active: Option[Int],
                               level: String,
                               title: String,
                               program_name: String)

object RiskAlertsIncreased extends CustomColumns {
  val alertsIncreased = {
    get[Option[Int]]("id") ~
      get[Int]("risk_id") ~
      //get[Option[Int]]("event_type") ~
      get[Option[Int]]("event_code") ~
      get[Option[Date]]("event_date") ~
      get[String]("event_title") ~
      get[Option[String]]("event_details") ~
      get[Option[Int]]("responsible") ~
      get[Option[String]]("person_invloved") ~
      //get[Option[Int]]("alert_type") ~
      get[Option[Int]]("criticality") ~
      get[Option[Int]]("is_active") ~ get[String]("level") ~
      get[String]("title") ~
      get[String]("program_name") map {
        case id ~
          risk_id ~
          //event_type ~
          event_code ~
          event_date ~
          event_title ~
          event_details ~
          responsible ~
          person_invloved ~
          //alert_type ~
          criticality ~
          is_active ~ level ~ title ~ program_name =>
          RiskAlertsIncreased(id,
            risk_id,
            //event_type,
            event_code,
            event_date,
            event_title,
            event_details,
            responsible,
            person_invloved,
            //alert_type,
            criticality,
            is_active,
            level,
            title,
            program_name)
      }
  }
}

case class RiskAlerts(id: Option[Int],
                      risk_id: Int,
                      event_code: Option[Int],
                      event_date: Option[Date],
                      event_title: String,
                      event_details: Option[String],
                      responsible: Option[Int],
                      person_invloved: Option[String],
                      criticality: Option[Int],
                      is_active: Option[Int],
                      category_id: Option[Int],
                      impacted_variable: Option[String],
                      reiteration: Option[Int],
                      status_id: Option[Int],
                      task_id: Option[Int],
                      change_state: Option[Date],
                      responsible_answer: Option[String])

object RiskAlerts extends CustomColumns {
  val alerts = {
    get[Option[Int]]("id") ~
      get[Int]("risk_id") ~
      get[Option[Int]]("event_code") ~
      get[Option[Date]]("event_date") ~
      get[String]("event_title") ~
      get[Option[String]]("event_details") ~
      get[Option[Int]]("responsible") ~
      get[Option[String]]("person_invloved") ~
      get[Option[Int]]("criticality") ~
      get[Option[Int]]("is_active") ~
      get[Option[Int]]("category_id") ~
      get[Option[String]]("impacted_variable") ~
      get[Option[Int]]("reiteration") ~
      get[Option[Int]]("status_id") ~
      get[Option[Int]]("task_id") ~
      get[Option[Date]]("change_state") ~
      get[Option[String]]("responsible_answer") map {
        case id ~
          risk_id ~
          event_code ~
          event_date ~
          event_title ~
          event_details ~
          responsible ~
          person_invloved ~
          criticality ~
          is_active ~
          category_id ~
          impacted_variable ~
          reiteration ~
          status_id ~
          task_id ~
          change_state ~
          responsible_answer =>
          RiskAlerts(id,
            risk_id,
            event_code,
            event_date,
            event_title,
            event_details,
            responsible,
            person_invloved,
            criticality,
            is_active,
            category_id,
            impacted_variable,
            reiteration,
            status_id,
            task_id,
            change_state,
            responsible_answer)
      }
  }
}

case class RiskAlertsExtended(id: Option[Int],
                      risk_id: Int,
                      event_code: Option[Int],
                      event_date: Option[Date],
                      event_title: String,
                      event_details: Option[String],
                      responsible: Option[Int],
                      person_invloved: Option[String],
                      criticality: Option[Int],
                      is_active: Option[Int],
                      category_id: Option[Int],
                      impacted_variable: Option[String],
                      reiteration: Option[Int],
                      status_id: Option[Int],
                      task_id: Option[Int],
                      change_state: Option[Date],
                      responsible_answer: Option[String],
                              category: String,
                              status: String)

object RiskAlertsExtended extends CustomColumns {
  val alerts = {
    get[Option[Int]]("id") ~
      get[Int]("risk_id") ~
      get[Option[Int]]("event_code") ~
      get[Option[Date]]("event_date") ~
      get[String]("event_title") ~
      get[Option[String]]("event_details") ~
      get[Option[Int]]("responsible") ~
      get[Option[String]]("person_invloved") ~
      get[Option[Int]]("criticality") ~
      get[Option[Int]]("is_active") ~
      get[Option[Int]]("category_id") ~
      get[Option[String]]("impacted_variable") ~
      get[Option[Int]]("reiteration") ~
      get[Option[Int]]("status_id") ~
      get[Option[Int]]("task_id") ~
      get[Option[Date]]("change_state") ~
      get[Option[String]]("responsible_answer") ~
      get[String]("category") ~
      get[String]("status") map {
      case id ~
        risk_id ~
        event_code ~
        event_date ~
        event_title ~
        event_details ~
        responsible ~
        person_invloved ~
        criticality ~
        is_active ~
        category_id ~
        impacted_variable ~
        reiteration ~
        status_id ~
        task_id ~
        change_state ~
        responsible_answer ~
        category ~
        status =>
        RiskAlertsExtended(id,
          risk_id,
          event_code,
          event_date,
          event_title,
          event_details,
          responsible,
          person_invloved,
          criticality,
          is_active,
          category_id,
          impacted_variable,
          reiteration,
          status_id,
          task_id,
          change_state,
          responsible_answer,
          category,
          status)
    }
  }
}

case class RiskStatus(id: Option[Int], description: String, is_active: Int);

object RiskStatus {

  val status = {
    get[Option[Int]]("id") ~
      get[String]("description") ~
      get[Int]("is_active") map {
        case id ~ description ~ is_active => RiskStatus(id, description, is_active)
      }
  }
  implicit val riskStatusWrites = Json.writes[RiskStatus]
}

case class RiskCategory(id: Option[Int], description: String, is_active: Int);

object RiskCategory {

  val category = {
    get[Option[Int]]("id") ~
      get[String]("description") ~
      get[Int]("is_active") map {
        case id ~ description ~ is_active => RiskCategory(id, description, is_active)
      }
  }
  implicit val riskCategoryWrites = Json.writes[RiskCategory]
}

case class AlertReport(
                        program_program_code: Int,
                        alert_id: Int,
                        program_workflow_status: String,
                        program_program_name: String,
                        alert_impacted_variable: String,
                        risk_category: String,
                        risk_sub_category: String,
                        alert_category: String,
                        alert_criticality: String,
                        program_program_manager: String,
                        alert_responsible: String,
                        alert_event_title: String,
                        alert_status: String,
                        alert_reiteration: Int,
                        alert_responsible_answer: String,
                        risk_name: String
                      )

object AlertReport {

  val reportAlert = {
    get[Int]("program_program_code") ~
      get[Int]("alert_id") ~
      get[String]("program_workflow_status") ~
      get[String]("program_program_name") ~
      get[String]("alert_impacted_variable") ~
      get[String]("risk_category") ~
      get[String]("risk_sub_category") ~
      get[String]("alert_category") ~
      get[String]("alert_criticality") ~
      get[String]("program_program_manager") ~
      get[String]("alert_responsible") ~
      get[String]("alert_event_title") ~
      get[String]("alert_status") ~
      get[Int]("alert_reiteration") ~
      get[String]("alert_responsible_answer") ~
      get[String]("risk_name") map {
      case
        program_program_code ~
          alert_id ~
          program_workflow_status ~
          program_program_name ~
          alert_impacted_variable ~
          risk_category ~
          risk_sub_category ~
          alert_category ~
          alert_criticality ~
          program_program_manager ~
          alert_responsible ~
          alert_event_title ~
          alert_status ~
          alert_reiteration ~
          alert_responsible_answer ~
          risk_name  => AlertReport(
                      program_program_code,
                      alert_id,
                      program_workflow_status,
                      program_program_name,
                      alert_impacted_variable,
                      risk_category,
                      risk_sub_category,
                      alert_category,
                      alert_criticality,
                      program_program_manager,
                      alert_responsible,
                      alert_event_title,
                      alert_status,
                      alert_reiteration,
                      alert_responsible_answer,
                      risk_name)
            }
  }
  implicit val reportAlertWrites = Json.writes[AlertReport]
}

case class AlertsSearch(
                      event_code: Option[Int],
                      criticality: Option[Int],
                      category_id: Option[Int],
                      status_id: Option[Int])

object AlertsSearch extends CustomColumns {
  val search = {
      get[Option[Int]]("event_code") ~
      get[Option[Int]]("criticality") ~
      get[Option[Int]]("category_id") ~
      get[Option[Int]]("status_id") map {
      case
        event_code ~
        criticality ~
        category_id ~
        status_id =>
        AlertsSearch(
          event_code,
          criticality,
          category_id,
          status_id)
    }
  }
}