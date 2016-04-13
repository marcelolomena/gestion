package models

import anorm.SqlParser._
import anorm._
import java.util.Date

case class UserProfiles(id: Option[Int], profile_code: String, profile_name: String, description: String, updated_by: Option[Int], updation_date: Option[Date], creation_date: Option[Date], is_deleted: Int)

object UserProfiles {

  val userprofile = {
    get[Option[Int]]("id") ~
      get[String]("profile_code") ~
      get[String]("profile_name") ~
      get[String]("description") ~
      get[Option[Int]]("updated_by") ~
      get[Option[Date]]("updation_date") ~
      get[Option[Date]]("creation_date") ~
      get[Int]("is_deleted") map {
        case id ~ profile_code ~ profile_name ~ description ~ updated_by ~ updation_date ~ creation_date ~ is_deleted => UserProfiles(id, profile_code, profile_name, description, updated_by, updation_date, creation_date, is_deleted)
      }
  }
}

case class UserAvailability(busy : Double, free : Double)
object UserAvailability extends CustomColumns {

  val useravailabity = {
    get[Double]("busy") ~
      get[Double]("free")  map {
        case busy ~ free  => UserAvailability(busy, free)
      }
  }
}
case class UserConsumo(fecha : Date, horas : Double)
object UserConsumo extends CustomColumns {

  val userconsumo = {
    get[Date]("fecha") ~
      get[Double]("horas")  map {
        case fecha ~ horas  => UserConsumo(fecha, horas)
      }
  }
}