package models
import anorm.SqlParser._
import play.api.Play.current
import java.util.Date
import anorm._
import play.api.db.DB
import play.api.data.Forms._
import play.api.data._
import play.api.libs.json.Json

case class Project(pId: Option[Int], project_id: String, program: Int, project_mode: Int, project_name: String, description: String,
  project_manager: Int, start_date: Date, final_release_date: Date, completion_percentage: Option[Double],
  ppm_number: Option[Double], work_flow_status: Option[Int], baseline: Boolean, planned_hours: Option[Double])

object Project extends CustomColumns {

  val project = {
    get[Option[Int]]("pId") ~
      get[String]("project_id") ~
      get[Int]("program") ~
      get[Int]("project_mode") ~
      get[String]("project_name") ~
      get[String]("description") ~
      get[Int]("project_manager") ~
      get[Date]("start_date") ~
      get[Date]("final_release_date") ~
      get[Option[Double]]("completion_percentage") ~
      get[Option[Double]]("ppm_number") ~
      get[Option[Int]]("work_flow_status") ~
      get[Boolean]("baseline") ~ get[Option[Double]]("planned_hours") map {
        case pId ~ project_id ~ program ~ project_mode ~ project_name ~ description ~ project_manager ~
          start_date ~ final_release_date ~ completion_percentage ~
          ppm_number ~ work_flow_status ~ baseline ~ planned_hours =>
          Project(pId, project_id, program, project_mode, project_name, description, project_manager, start_date, final_release_date,
            completion_percentage, ppm_number,
            work_flow_status, baseline, planned_hours)
      }
  }
  implicit val projectWrites = Json.writes[Project]
}

case class ProjectDisplay(pId: Option[Int], project_id: String, program: Integer, project_name: String, name: String, description: String)

object ProjectDisplay {

  val projectDisplay = {
    get[Option[Int]]("pId") ~
      get[String]("project_id") ~
      get[Int]("program") ~
      get[String]("project_name") ~
      get[String]("name") ~
      get[String]("description") map {
        case pId ~ project_id ~ program ~ project_name ~ name ~ description =>
          ProjectDisplay(pId, project_id, program, project_name, name, description)
      }
  }

}

case class PMSetting(uId: Long, pId: Long)

object PMSetting {

  val pm = {
    get[Long]("uId") ~
      get[Long]("pId") map {
        case uId ~ pId =>
          PMSetting(uId, pId)
      }
  }
}

case class AdminSetting(uId: Long, pId: Long)

object AdminSetting {

  val admins = {
    get[Long]("uId") ~
      get[Long]("pId") map {
        case uId ~ pId =>
          AdminSetting(uId, pId)
      }
  }
}

case class UserSetting(uId: Long, pId: Long, show: Integer)

object UserSetting {

  val user = {
    get[Long]("uId") ~
      get[Long]("pId") ~ get[Int]("show_project") map {
        case uId ~ pId ~ show_project =>
          UserSetting(uId, pId, show_project)
      }
  }
}

case class ProjectSAPMaster(id: Option[Int], project_id: Integer, sap_id: Integer, is_active: Int, creation_date: Option[Date], last_update: Option[Date], planned_hours: Option[Double])

object ProjectSAPMaster {

  val project_sap_master = {
    get[Option[Int]]("id") ~ get[Int]("project_id") ~ get[Int]("sap_id") ~
      get[Int]("is_active") ~ get[Option[Date]]("creation_date") ~
      get[Option[Date]]("last_update") ~ get[Option[Double]]("planned_hours") map {
        case id ~ project_id ~ sap_id ~ is_active ~ creation_date ~
          last_update ~ planned_hours =>
          ProjectSAPMaster(id, project_id, sap_id, is_active, creation_date, last_update, planned_hours)

      }
  }
}

case class ProjectExpenseDetails(sap_id: Int, expense_type: Int, hardware: Option[Long], software: Option[Long], telecommunication: Option[Long],
  development: Option[Long], other: Option[Long], qa: Option[Long],
  improvements: Option[Long], recurring_first: Option[Long])

object ProjectExpenseDetails extends CustomColumns {

  val project_sap = {
    get[Int]("project_sap_id") ~ get[Int]("expense_type") ~
      get[Option[Long]]("hardware") ~ get[Option[Long]]("software") ~
      get[Option[Long]]("telecommunication") ~ get[Option[Long]]("development") ~
      get[Option[Long]]("other") ~ get[Option[Long]]("qa") ~
      get[Option[Long]]("improvements") ~ get[Option[Long]]("recurring_first") map {
        case project_sap_id ~ expense_type ~ hardware ~ software ~
          telecommunication ~ development ~ other ~ qa ~ improvements ~ recurring_first =>
          ProjectExpenseDetails(project_sap_id, expense_type, hardware, software, telecommunication, development, other, qa, improvements, recurring_first)

      }
  }
}

case class ProjectStatus(id: Option[Int], project_id: Int, status_for_date: Date, reason_for_change: String, status: Int)

object ProjectStatus {

  val pStatus = {
    get[Option[Int]]("id") ~ get[Int]("project_id") ~ get[Date]("status_for_date") ~ get[String]("reason_for_change") ~
      get[Int]("status") map {
        case id ~ project_id ~ status_for_date ~ reason_for_change ~ status =>
          ProjectStatus(id, project_id, status_for_date, reason_for_change, status)
      }

  }
  implicit val statusWrites = Json.writes[ProjectStatus]
}

case class ProjectMasters(project_id: String, program: Int, project_mode: Int, project_name: String, description: String,
  project_manager: Int, start_date: Date, final_release_date: Date,
  completion_percentage: Option[Double], ppm_number: Option[Double],
  work_flow_status: Option[Int], baseline: Boolean, planned_hours: Option[Double])

object ProjectMasters {

}

case class ProjectInvestment(investment_hardware: Option[Long], investment_software: Option[Long], investment_telecommunication: Option[Long],
  investment_development: Option[Long], investment_other: Option[Long], investment_qa: Option[Long],
  investment_improvements: Option[Long], investment_recurring_first: Option[Long])

object ProjectInvestment extends CustomColumns {

}

case class ProjectExpenditure(expenditure_hardware: Option[Long], expenditure_software: Option[Long], expenditure_telecommunication: Option[Long],
  expenditure_development: Option[Long], expenditure_other: Option[Long], expenditure_qa: Option[Long],
  expenditure_improvements: Option[Long], expenditure_recurring_first: Option[Long])

object ProjectExpenditure extends CustomColumns {

}

case class ProjectSAP(project_id: Integer, sap_id: Integer, project_investment: ProjectInvestment, project_expenditure: ProjectExpenditure, is_active: Int, creation_date: Option[Date], last_update: Option[Date], planned_hours: Option[Double])

object ProjectSAP {

}

case class CEOSetting(uId: Long, pId: Long)

object CEOSetting {

}
