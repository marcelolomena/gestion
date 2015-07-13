package models
import anorm.SqlParser._
import play.api.Play.current
import java.util.Date
import anorm._
import play.api.db.DB

case class EarnValue(id: Option[Int], parent_type: Int, parent_id: Int, recorded_date: Date,
                     erned_value: Option[Double], planned_value: Option[Double], actual_cost: Option[Double],
                     completion_percentage: Option[Double], scheduled_varience: Option[Double], cost_varience: Option[Double],
                     scheduled_perforamce_index: Option[Double], cost_performance_index: Option[Double], estimate_at_completion: Option[Double],
                     estimate_to_complete: Option[Double])

case class SPIValue(recorded_date: Date, planned_value: Option[Double], erned_value: Option[Double], scheduled_perforamce_index: Option[Double], cost_performance_index: Option[Double], actual_cost: Option[Double])

case class SPIAndProgValue(recorded_date: Date, scheduled_perforamce_index: Option[Double], cost_performance_index: Option[Double], program_name: String)

object EarnValue extends CustomColumns {

  val earnValueObj = {
    get[Option[Int]]("id") ~ get[Int]("parent_type") ~ get[Int]("parent_id") ~ get[Date]("recorded_date") ~
      get[Option[Double]]("erned_value") ~ get[Option[Double]]("planned_value") ~ get[Option[Double]]("actual_cost") ~
      get[Option[Double]]("completion_percentage") ~ get[Option[Double]]("scheduled_varience") ~ get[Option[Double]]("cost_varience") ~
      get[Option[Double]]("scheduled_perforamce_index") ~ get[Option[Double]]("cost_performance_index") ~ get[Option[Double]]("estimate_at_completion") ~
      get[Option[Double]]("estimate_to_complete") map {
        case id ~ parent_type ~ parent_id ~ recorded_date ~ erned_value ~ planned_value ~ actual_cost ~ completion_percentage ~
          scheduled_varience ~ cost_varience ~ scheduled_perforamce_index ~ cost_performance_index ~ estimate_at_completion ~
          estimate_to_complete => EarnValue(id, parent_type, parent_id, recorded_date, erned_value, planned_value, actual_cost, completion_percentage,
          scheduled_varience, cost_varience, scheduled_perforamce_index, cost_performance_index, estimate_at_completion,
          estimate_to_complete)
      }
  }

}
object SPIValue extends CustomColumns {

  val spiValueObj = {
    get[Date]("recorded_date") ~ get[Option[Double]]("planned_value") ~ get[Option[Double]]("erned_value") ~ get[Option[Double]]("scheduled_perforamce_index") ~ get[Option[Double]]("cost_performance_index") ~ get[Option[Double]]("actual_cost") map {
      case recorded_date ~ planned_value ~ erned_value ~ scheduled_perforamce_index ~ cost_performance_index ~ actual_cost => SPIValue(recorded_date, planned_value, erned_value, scheduled_perforamce_index, cost_performance_index, actual_cost)
    }
  }
}

object SPIAndProgValue extends CustomColumns {

  val spiProgValueObj = {
    get[Date]("recorded_date") ~ get[Option[Double]]("scheduled_perforamce_index") ~ get[Option[Double]]("cost_performance_index") ~ get[String]("program_name") map {
      case recorded_date ~ scheduled_perforamce_index ~ cost_performance_index ~ program_name => SPIAndProgValue(recorded_date, scheduled_perforamce_index, cost_performance_index, program_name)
    }
  }
}

case class ProjectEarnValue(id: Option[Int], recorded_date: Date,
                            erned_value: Option[Double], planned_value: Option[Double], actual_cost: Option[Double],
                            completion_percentage: Option[Double], scheduled_varience: Option[Double], cost_varience: Option[Double],
                            scheduled_perforamce_index: Option[Double], cost_performance_index: Option[Double], estimate_at_completion: Option[Double],
                            estimate_to_complete: Option[Double])

object ProjectEarnValue extends CustomColumns {

  val projectEarnValue = {
    get[Option[Int]]("id") ~ get[Date]("recorded_date") ~
      get[Option[Double]]("erned_value") ~ get[Option[Double]]("planned_value") ~ get[Option[Double]]("actual_cost") ~
      get[Option[Double]]("completion_percentage") ~ get[Option[Double]]("scheduled_varience") ~ get[Option[Double]]("cost_varience") ~
      get[Option[Double]]("scheduled_perforamce_index") ~ get[Option[Double]]("cost_performance_index") ~ get[Option[Double]]("estimate_at_completion") ~
      get[Option[Double]]("estimate_to_complete") map {
        case id ~ recorded_date ~ erned_value ~ planned_value ~ actual_cost ~ completion_percentage ~
          scheduled_varience ~ cost_varience ~ scheduled_perforamce_index ~ cost_performance_index ~ estimate_at_completion ~
          estimate_to_complete => ProjectEarnValue(id, recorded_date, erned_value, planned_value, actual_cost, completion_percentage,
          scheduled_varience, cost_varience, scheduled_perforamce_index, cost_performance_index, estimate_at_completion,
          estimate_to_complete)
      }
  }

}

case class TaskEarnValue(id: Option[Int], recorded_date: Date,
                         erned_value: Option[Double], planned_value: Option[Double], actual_cost: Option[Double],
                         completion_percentage: Option[Double], scheduled_varience: Option[Double], cost_varience: Option[Double],
                         scheduled_perforamce_index: Option[Double], cost_performance_index: Option[Double], estimate_at_completion: Option[Double],
                         estimate_to_complete: Option[Double])

object TaskEarnValue extends CustomColumns {

  val taskEarnValue = {
    get[Option[Int]]("id") ~ get[Date]("recorded_date") ~
      get[Option[Double]]("erned_value") ~ get[Option[Double]]("planned_value") ~ get[Option[Double]]("actual_cost") ~
      get[Option[Double]]("completion_percentage") ~ get[Option[Double]]("scheduled_varience") ~ get[Option[Double]]("cost_varience") ~
      get[Option[Double]]("scheduled_perforamce_index") ~ get[Option[Double]]("cost_performance_index") ~ get[Option[Double]]("estimate_at_completion") ~
      get[Option[Double]]("estimate_to_complete") map {
        case id ~ recorded_date ~ erned_value ~ planned_value ~ actual_cost ~ completion_percentage ~
          scheduled_varience ~ cost_varience ~ scheduled_perforamce_index ~ cost_performance_index ~ estimate_at_completion ~
          estimate_to_complete => TaskEarnValue(id, recorded_date, erned_value, planned_value, actual_cost, completion_percentage,
          scheduled_varience, cost_varience, scheduled_perforamce_index, cost_performance_index, estimate_at_completion,
          estimate_to_complete)
      }
  }

}

case class SubTaskEarnValue(id: Option[Int], sub_task_id: Option[Int], task_id: Option[Int],
                            project_id: Option[Int], program_id: Option[Int], fecha: Date,
                            pv_inc: Option[Double], pv: Option[Double], ev: Option[Double],
                            e_ev: Option[Double], ac: Option[Double], spi: Option[Double],
                            cpi: Option[Double], e_spi: Option[Double], e_cpi: Option[Double])

object SubTaskEarnValue extends CustomColumns {

  val subtaskEarnValue = {
    get[Option[Int]]("id") ~ get[Option[Int]]("sub_task_id") ~ get[Option[Int]]("task_id") ~
      get[Option[Int]]("project_id") ~ get[Option[Int]]("program_id") ~ get[Date]("fecha") ~
      get[Option[Double]]("pv_inc") ~ get[Option[Double]]("pv") ~ get[Option[Double]]("ev") ~
      get[Option[Double]]("e_ev") ~ get[Option[Double]]("ac") ~ get[Option[Double]]("spi") ~
      get[Option[Double]]("cpi") ~ get[Option[Double]]("e_spi") ~ get[Option[Double]]("e_cpi") map {
        case id ~ sub_task_id ~ task_id ~ project_id ~ program_id ~ fecha ~
          pv_inc ~ pv ~ ev ~ e_ev ~ ac ~ spi ~ cpi ~ e_spi ~ e_cpi => SubTaskEarnValue(id, sub_task_id, task_id, project_id, program_id, fecha,
          pv_inc, pv, ev, e_ev, ac, spi, cpi, e_spi, e_cpi)
      }
  }

}

case class SubTaskEV(sub_task_id: Option[Int], fecha: Date, ev: Option[Double])

object SubTaskEV extends CustomColumns {

  val subtaskEV = {
    get[Option[Int]]("sub_task_id") ~ get[Date]("fecha") ~ get[Option[Double]]("ev") map {
      case sub_task_id ~ fecha ~ ev => SubTaskEV(sub_task_id, fecha, ev)
    }
  }

}

case class MainEarnValue(fecha: Date,
                         pv_inc: Option[Double], pv: Option[Double], ev: Option[Double],
                         e_ev: Option[Double], ac: Option[Double], spi: Option[Double],
                         cpi: Option[Double], e_spi: Option[Double], e_cpi: Option[Double])

object MainEarnValue extends CustomColumns {

  val mainEarnValue = {
    get[Date]("fecha") ~
      get[Option[Double]]("pv_inc") ~ get[Option[Double]]("pv") ~ get[Option[Double]]("ev") ~
      get[Option[Double]]("e_ev") ~ get[Option[Double]]("ac") ~ get[Option[Double]]("spi") ~
      get[Option[Double]]("cpi") ~ get[Option[Double]]("e_spi") ~ get[Option[Double]]("e_cpi") map {
        case fecha ~
          pv_inc ~ pv ~ ev ~ e_ev ~ ac ~ spi ~ cpi ~ e_spi ~ e_cpi => MainEarnValue(fecha,
          pv_inc, pv, ev, e_ev, ac, spi, cpi, e_spi, e_cpi)
      }
  }

}