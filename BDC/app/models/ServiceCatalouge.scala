package models
import anorm.SqlParser._
import anorm._
import java.util.Date
import play.api.libs.json._

case class ServiceCatalogueMaster(id: Option[Int], discipline: Int, service_code: String, service_name: String,
  description: String, service_scope: String, service_requestor_role: Option[Int],
  executive_role_primary: Option[Int], executive_role_secondary: Option[Int],
  sla_value: Int, sla_unit: Int, creation_date: java.util.Date, updation_date: java.util.Date, updated_by: Int, is_deleted: Int)

object ServiceCatalogueMaster {

  val serviceCatalogueMaster = {
    get[Option[Int]]("id") ~
      get[Int]("discipline") ~
      get[String]("service_code") ~
      get[String]("service_name") ~
      get[String]("description") ~
      get[String]("service_scope") ~
      get[Option[Int]]("service_requestor_role") ~
      get[Option[Int]]("executive_role_primary") ~
      get[Option[Int]]("executive_role_secondary") ~
      get[Int]("sla_value") ~
      get[Int]("sla_unit") ~
      get[Date]("creation_date") ~
      get[Date]("updation_date") ~
      get[Int]("updated_by") ~
      get[Int]("is_deleted") map {
        case id ~ discipline ~ service_code ~ service_name ~ description ~ service_scope ~ service_requestor_role ~ executive_role_primary ~ executive_role_secondary ~ sla_value ~ sla_unit ~ creation_date ~ updation_date ~ updated_by ~ is_deleted => ServiceCatalogueMaster(id, discipline, service_code, service_name, description, service_scope, service_requestor_role, executive_role_primary, executive_role_secondary, sla_value, sla_unit, creation_date, updation_date, updated_by, is_deleted)
      }
  }
  implicit val serviceCatalogueWrites = Json.writes[ServiceCatalogueMaster]
}

case class ServiceCatalogues(id: Option[Int], discipline: Int, service_code: String, service_name: String,
  description: Option[String], service_scope: String, service_requestor_role: Option[Int],
  executive_role_primary: Option[Int], executive_role_secondary: Option[Int],
  sla_value: Int, sla_unit: Int)

object ServiceCatalogue {
  val serviceCatalogue = {
    get[Option[Int]]("id") ~
      get[Int]("discipline") ~
      get[String]("service_code") ~
      get[String]("service_name") ~
      get[Option[String]]("description") ~
      get[String]("service_scope") ~
      get[Option[Int]]("service_requestor_role") ~
      get[Option[Int]]("executive_role_primary") ~
      get[Option[Int]]("executive_role_secondary") ~
      get[Int]("sla_value") ~
      get[Int]("sla_unit") map {
        case id ~ discipline ~ service_code ~ service_name ~ description ~ service_scope ~ service_requestor_role ~ executive_role_primary ~ executive_role_secondary ~ sla_value ~ sla_unit => ServiceCatalogues(id, discipline, service_code, service_name, description, service_scope, service_requestor_role, executive_role_primary, executive_role_secondary, sla_value, sla_unit)
      }
  }
}

object slaUnitValues extends Enumeration {
  type slaUnitValues = Value
  val Months, Weeks, Days, Hours = Value
}