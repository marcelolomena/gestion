package models

import anorm.SqlParser._
import anorm._
import java.util.Date

case class BudgetTypes(id: Option[Int], sequencing: Option[Int], budget_type: String, description: String, updated_by: Option[Int], updation_date: Option[Date], creation_date: Option[Date], is_deleted: Int)

object BudgetTypes {
  val bTypes = {
    get[Option[Int]]("id") ~
      get[Option[Int]]("sequencing") ~
      get[String]("budget_type") ~
      get[String]("description") ~
      get[Option[Int]]("updated_by") ~
      get[Option[Date]]("updation_date") ~
      get[Option[Date]]("creation_date") ~
      get[Int]("is_deleted") map {
        case id ~ sequencing ~ budget_type ~ description ~ updated_by ~ updation_date ~ creation_date ~ is_deleted => BudgetTypes(id, sequencing, budget_type, description, updated_by, updation_date, creation_date, is_deleted)
      }
  }
}