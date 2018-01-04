package models
import anorm.SqlParser._
import play.api.Play.current
import java.util.Date
import anorm._
import play.api.db.DB

case class GenericProjectType(id: Option[Int], generic_project_type: Option[String], description: String, project_type: Int, responsible: Int, states: Int, creation_date: Option[Date], updation_date: Option[Date])

object GenericProjectType {

  val projectDisplay = {
    get[Option[Int]]("id") ~
      get[Option[String]]("generic_project_type") ~
      get[String]("description") ~
      get[Int]("project_type") ~
      get[Int]("responsible") ~
      get[Int]("states") ~
      get[Option[Date]]("creation_date") ~
      get[Option[Date]]("updation_date") map {
        case id ~ generic_project_type ~ description ~ project_type ~ responsible ~ states ~ creation_date ~ updation_date =>
          GenericProjectType(id, generic_project_type, description, project_type, responsible, states, creation_date, updation_date)
      }
  }
}

case class ProjectType(id: Option[Int], description: String, project_type: Int, responsible: Int, states: Int, creation_date: Option[Date], updation_date: Option[Date])

object ProjectType {

  val projectDisplay = {
    get[Option[Int]]("id") ~
      get[String]("description") ~
      get[Int]("project_type") ~
      get[Int]("responsible") ~
      get[Int]("states") ~
      get[Option[Date]]("creation_date") ~
      get[Option[Date]]("updation_date") map {
        case id ~ description ~ project_type ~ responsible ~ states ~ creation_date ~ updation_date =>
          ProjectType(id, description, project_type, responsible, states, creation_date, updation_date)
      }
  }
}

case class GernericProject(pId: Option[Int], project_id: String, project_mode: Int, project_name: String, description: String,
  project_manager: Int, start_date: Date, final_release_date: Date, budget_approved: Int, sap_code: Option[String],
  total_sap: BigDecimal, budget_approved_staff: BigDecimal, budget_approved_contractor: BigDecimal,
  budget_approved_hardware: BigDecimal, budget_approved_software: BigDecimal, ppm_number: Option[Double], work_flow_status: Option[Int], baseline: Boolean)

object GernericProject extends CustomColumns {

  val genericProject = {
    get[Option[Int]]("pId") ~
      get[String]("project_id") ~
      get[Int]("project_mode") ~
      get[String]("project_name") ~
      get[String]("description") ~
      get[Int]("project_manager") ~
      get[Date]("start_date") ~
      get[Date]("final_release_date") ~
      get[Int]("budget_approved") ~
      get[Option[String]]("sap_code") ~
      get[java.math.BigDecimal]("total_sap") ~
      get[java.math.BigDecimal]("budget_approved_staff") ~
      get[java.math.BigDecimal]("budget_approved_contractor") ~
      get[java.math.BigDecimal]("budget_approved_hardware") ~
      get[java.math.BigDecimal]("budget_approved_software") ~
      get[Option[Double]]("ppm_number") ~
      get[Option[Int]]("work_flow_status") ~
      get[Boolean]("baseline") map {
        case pId ~ project_id ~ project_mode ~ project_name ~ description ~ project_manager ~
          start_date ~ final_release_date ~ budget_approved ~ sap_code ~ total_sap ~
          budget_approved_staff ~ budget_approved_contractor ~ budget_approved_hardware ~ budget_approved_software ~
          ppm_number ~ work_flow_status ~ baseline =>
          GernericProject(pId, project_id, project_mode, project_name, description, project_manager, start_date, final_release_date, budget_approved, sap_code,
            total_sap, budget_approved_staff, budget_approved_contractor, budget_approved_hardware, budget_approved_software, ppm_number,
            work_flow_status, baseline)
      }
  }
}

case class GenericTasks(tId: Option[Int], task_mode: Int, task_title: String, task_code: String,
  plan_start_date: Date, plan_end_date: Date, task_description: String, plan_time: BigDecimal,
  creation_date: Date, task_status: Int, status: Int, owner: Integer,
  task_discipline: Option[Int], completion_percentage: Option[Double], remark: Option[String],
  task_depend: Option[String], stage: Option[Int], user_role: Option[Int], deliverable: Int, task_type: Int, predefined_task_id: Int, is_active: Int)

object GenericTasks extends CustomColumns {

  val tasks = {
    get[Option[Int]]("tId") ~
      get[Int]("task_mode") ~
      get[String]("task_title") ~
      get[String]("task_code") ~
      get[Date]("plan_start_date") ~
      get[Date]("plan_end_date") ~
      get[String]("task_description") ~
      get[java.math.BigDecimal]("plan_time") ~
      get[Date]("creation_date") ~
      get[Int]("task_status") ~
      get[Int]("status") ~
      get[Int]("owner") ~
      get[Option[Int]]("task_discipline") ~
      get[Option[Double]]("completion_percentage") ~
      get[Option[String]]("remark") ~
      get[Option[String]]("task_depend") ~
      get[Option[Int]]("stage") ~
      get[Option[Int]]("user_role") ~
      get[Int]("deliverable") ~
      get[Int]("task_type") ~
      get[Int]("predefined_task_id") ~
      get[Int]("is_active") map {
        case tId ~ task_mode ~ task_title ~ task_code ~ plan_start_date ~ plan_end_date ~
          task_description ~
          plan_time ~ creation_date ~ task_status ~ status ~ owner ~ task_discipline ~
          completion_percentage ~ remark ~ task_depend ~ stage ~ user_role ~ deliverable ~ task_type ~ predefined_task_id ~ is_active =>
          GenericTasks(tId, task_mode, task_title, task_code, plan_start_date, plan_end_date,
            task_description,
            plan_time, creation_date, task_status, status, owner, task_discipline,
            completion_percentage, remark, task_depend, stage, user_role, deliverable, task_type, predefined_task_id, is_active)
      }
  }
}

case class PredefinedTasks(tId: Option[Int], task_type: Int, task_title: String, task_description: String, task_discipline: Option[Int],
  remark: Option[String], stage: Option[Int], user_role: Option[Int], deliverable: Int, catalogue_service: Int, is_active: Int)

object PredefinedTasks {

  val predefined_tasks = {
    get[Option[Int]]("tId") ~
      get[Int]("task_type") ~
      get[String]("task_title") ~
      get[String]("task_description") ~
      get[Option[Int]]("task_discipline") ~
      get[Option[String]]("remark") ~
      get[Option[Int]]("stage") ~
      get[Option[Int]]("user_role") ~
      get[Int]("deliverable") ~
      get[Int]("catalogue_service") ~
      get[Int]("is_active") map {
        case tId ~ task_type ~ task_title ~ task_description ~ task_discipline ~ remark ~ stage ~ user_role ~ deliverable ~ catalogue_service ~ is_active =>
          PredefinedTasks(tId, task_type, task_title, task_description, task_discipline, remark, stage, user_role, deliverable, catalogue_service, is_active)
      }
  }

}

case class DigestiblePredefinedTasks(
                                      tId: Option[Int],
                                      task_title: String,
                                      task_description: String,
                                      task_discipline: String,
                                      user_role: String,
                                      deliverable: String)

object DigestiblePredefinedTasks {

  val digestible_predefined_tasks = {
    get[Option[Int]]("tId") ~
      get[String]("task_title") ~
      get[String]("task_description") ~
      get[String]("task_discipline") ~
      get[String]("user_role") ~
      get[String]("deliverable") map {
      case tId ~ task_title ~ task_description ~ task_discipline ~ user_role ~ deliverable =>
        DigestiblePredefinedTasks(tId, task_title, task_description, task_discipline, user_role, deliverable)
    }
  }

}

case class GenericTask(tId: Option[Int], task_mode: Int, task_title: String,
  plan_start_date: Date, plan_end_date: Date, task_description: String, plan_time: BigDecimal, task_status: Int,
  status: Int, owner: Int, task_discipline: Option[Int], completion_percentage: Option[Double],
  remark: Option[String], task_depend: Option[String], task_details: GenericTaskDetails)
object GenericTask extends CustomColumns {

}

case class GenericTaskDetails(task_type: Int, task_code: String, stage: Option[Int], user_role: Option[Int], deliverable: Int, predefined_task_id: Int, is_active: Int)

object GenericTaskDetails {

}

case class ProjectTypeSearch(
                               type_id: Option[Int],
                               responsible_id: Option[Int])

object ProjectTypeSearch extends CustomColumns {
  val search = {
    get[Option[Int]]("type_id") ~
      get[Option[Int]]("responsible_id") map {
      case
        type_id ~
          responsible_id =>
        ProjectTypeSearch(
          type_id,
          responsible_id)
    }
  }
}

case class GenericTaskSearch(
                              discipline_id: Option[Int],
                              deliverable_id: Option[Int])

object GenericTaskSearch extends CustomColumns {
  val search = {
    get[Option[Int]]("discipline_id") ~
      get[Option[Int]]("deliverable_id") map {
      case
        discipline_id ~
          deliverable_id =>
        GenericTaskSearch(
          discipline_id,
          deliverable_id)
    }
  }
}

case class DigestGenericTaskSearch(task_title: Option[String],task_mode: Option[String],discipline_id: Option[Int])

object DigestGenericTaskSearch extends CustomColumns {
  val search = {
    get[Option[String]]("task_title") ~ get[Option[String]]("task_mode") ~ get[Option[Int]]("discipline_id") map {
      case
        task_title ~ task_mode ~ discipline_id=>
        DigestGenericTaskSearch(
          task_title,task_mode,discipline_id)
    }
  }
}