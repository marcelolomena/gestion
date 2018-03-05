package models

import java.util.Date
import anorm.SqlParser._
import play.api.Play.current
import java.util.Date
import anorm._
import play.api.db.DB

case class ProgramMembersExternal(id: Option[Int], program_id: Int, provider_type: Int, provider_name: String, resource_name: Option[String], number_of_resources: Option[Int],
   control_field1 : Option[String], control_field2 : Option[String], created_by : Int, creation_date : Date, updation_date : Date, is_deleted : Int )

object ProgramMembersExternal {
  val programMembersExternal = {
    get[Option[Int]]("id") ~
      get[Int]("program_id") ~
      get[Int]("provider_type") ~
      get[String]("provider_name") ~
      get[Option[String]]("resource_name") ~
      get[Option[Int]]("number_of_resources") ~
      get[Option[String]]("control_field1") ~
      get[Option[String]]("control_field2") ~
      get[Int]("created_by") ~
      get[Date]("creation_date") ~
      get[Date]("updation_date") ~
      get[Int]("is_deleted") map {
        case id ~ program_id ~ provider_type ~ provider_name ~ resource_name ~ number_of_resources ~ control_field1 ~ control_field2 ~  created_by ~ creation_date ~ updation_date ~ is_deleted=>
          ProgramMembersExternal(id, program_id, provider_type, provider_name, resource_name, number_of_resources, control_field1, control_field2, created_by, creation_date, updation_date, is_deleted)
      }
  }
}


case class ProgramMembersExternalAllocation(id: Option[Int], program_id: Int, provider_type: Int, provider_name: String, resource_name: Option[String], number_of_resources: Option[Int],
   control_field1 : Option[String], control_field2 : Option[String], created_by : Int, creation_date : Date, updation_date : Date, is_deleted : Int, estimated_time : Double,hours : Double,diferencia : Double )

object ProgramMembersExternalAllocation {
  val programMembersExternalAllocation = {
    get[Option[Int]]("id") ~
      get[Int]("program_id") ~
      get[Int]("provider_type") ~
      get[String]("provider_name") ~
      get[Option[String]]("resource_name") ~
      get[Option[Int]]("number_of_resources") ~
      get[Option[String]]("control_field1") ~
      get[Option[String]]("control_field2") ~
      get[Int]("created_by") ~
      get[Date]("creation_date") ~
      get[Date]("updation_date") ~
      get[Int]("is_deleted") ~
      get[Double]("estimated_time") ~
      get[Double]("hours") ~
      get[Double]("diferencia") map {
        case id ~ program_id ~ provider_type ~ provider_name ~ resource_name ~ number_of_resources ~ control_field1 ~ control_field2 ~  created_by ~ creation_date ~ updation_date ~ is_deleted ~ estimated_time ~ hours ~ diferencia =>
          ProgramMembersExternalAllocation(id, program_id, provider_type, provider_name, resource_name, number_of_resources, control_field1, control_field2, created_by, creation_date, updation_date, is_deleted,estimated_time,hours,diferencia)
      }
  }
}