package services

import scala.Option.option2Iterable
import org.apache.commons.lang3.StringUtils
import anorm._
import anorm.sqlToSimple
//import anorm.toParameterValue
import models.DocumentMaster
import models.VersionDetails
import play.Play
import play.api.Play.current
import play.api.db.DB
import models.CustomColumns
import SqlParser._
import scala.util.control.Exception._
import models.ServiceCatalogue
import play.i18n.Lang
import play.i18n.Messages
import models.ServiceCatalogueMaster
import models.ServiceCatalogues
import java.util.Date

object ServiceCatalogueService extends CustomColumns {
  val langObj = new Lang(Lang.forCode("es-ES"))

  def validateServiceCatalogueForm(form: play.api.data.Form[ServiceCatalogues]) = {
    var newform: play.api.data.Form[models.ServiceCatalogues] = null

    if (!form.data.get("service_name").get.isEmpty) {
      val service_name = form.data.get("service_name").get.trim()
      val obj = findServiceCatalogueByName(service_name)
      if (obj.size > 0) {
        newform = form.withError("service_name", Messages.get(langObj, "servcieCatalogue.serviceCodeValidationUnique"))
      }
    }

    if (!form.data.get("service_code").isEmpty && !findServiceCatalogueByServiceCode(form.data.get("service_code").get).isEmpty) {
      newform = form.withError("service_code", Messages.get(langObj, "servcieCatalogue.serviceCodeValidationUnique"))
    }

    if (form.data.get("service_scope").isEmpty) {
      newform = form.withError("service_scope", Messages.get(langObj, "servcieCatalogue.serviceScopeValidationEmpty"))
    }
    if (newform != null) {
      newform
    } else {
      form
    }
  }

  def validateServiceCatalogueFormEdit(form: play.api.data.Form[ServiceCatalogues]) = {
    var newform: play.api.data.Form[models.ServiceCatalogues] = null
    val service_scope_id = form.data.get("id").get.trim()
    val service_name = form.data.get("service_name").get.trim()
    val obj = findServiceCatalogueByNameForEdit(service_name, service_scope_id)
    if (obj.size > 0) {
      newform = form.withError("service_name", Messages.get(langObj, "servcieCatalogue.serviceCodeValidationUnique"))
    }
    if (form.data.get("service_scope").isEmpty) {
      newform = form.withError("service_scope", Messages.get(langObj, "servcieCatalogue.serviceScopeValidationEmpty"))
    }
    if (newform != null) {
      newform
    } else {
      form
    }
  }

  def findServiceCatalogueByNameForEdit(service_name: String, service_id: String): Seq[ServiceCatalogueMaster] = {
    var sql = "select t.* from art_service_catalogue t where t.is_deleted = 0  AND CONVERT(NVARCHAR(MAX), t.service_name) ='" + service_name.trim() + "' AND t.id <>'" + service_id + "'"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(ServiceCatalogueMaster.serviceCatalogueMaster *)
      result
    }
  }

  def findServiceCatalogueByName(serviceCatalogue: String) = {
    var sql = ""
    sql = "select t.* from art_service_catalogue t where  CONVERT(NVARCHAR(MAX), t.service_name) ='" + serviceCatalogue + "' AND t.is_deleted=0"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(ServiceCatalogueMaster.serviceCatalogueMaster *)
      result
    }
  }

  def findServiceCatalogueById(id: String): Option[ServiceCatalogueMaster] = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_service_catalogue where id LIKE {id} and is_deleted=0 ").on(
          'id -> id).as(
            ServiceCatalogueMaster.serviceCatalogueMaster.singleOpt)
      result
    }
  }

  def findServiceCatalogueByIdAll(id: String): Option[ServiceCatalogueMaster] = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_service_catalogue where id LIKE {id} ").on(
          'id -> id).as(
            ServiceCatalogueMaster.serviceCatalogueMaster.singleOpt)
      result
    }
  }

  def findServiceCatalogueByServiceCode(service_code: String): Option[ServiceCatalogueMaster] = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_service_catalogue where service_code LIKE {service_code} and is_deleted=0 ").on(
          'service_code -> service_code).as(
            ServiceCatalogueMaster.serviceCatalogueMaster.singleOpt)
      result
    }
  }

  def getServiceCatalogue(): Seq[ServiceCatalogueMaster] = {
    val sqlString =
      """
        |SELECT
        |id       ,
        |discipline       ,
        |service_code       ,
        |LTRIM(service_name) service_name,
        |description       ,
        |service_scope       ,
        |service_requestor_role       ,
        |executive_role_primary       ,
        |executive_role_secondary       ,
        |sla_value       ,
        |sla_unit       ,
        |updated_by       ,
        |creation_date   ,
        |updation_date       ,
        |is_deleted
        |  FROM art_service_catalogue
        |  WHERE is_deleted=0
        |  ORDER BY service_name
      """.stripMargin
    //var sqlString = "select * from art_service_catalogue where is_deleted=0";
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(
        ServiceCatalogueMaster.serviceCatalogueMaster *)
      result
    }
  }
  
  def getIncidentServiceCatalogue(): Seq[ServiceCatalogueMaster] = {

    var sqlString = "SELECT * FROM art_service_catalogue WHERE is_deleted=0 AND discipline = 1057 ORDER BY CAST(service_name AS VARCHAR)";
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(
        ServiceCatalogueMaster.serviceCatalogueMaster *)
      result
    }
  }  

  def serviceCatalogueCount(): Long = {
    DB.withConnection { implicit connection =>
      var sqlString = ""
      sqlString = "SELECT count(*) from art_service_catalogue"

      val count: Long = SQL(sqlString).as(scalar[Long].single)
      count
    }
  }
  def getServiceCatalogueAllList(pagNo: String, recordOnPage: String): Seq[ServiceCatalogueMaster] = {
    val rec = Integer.parseInt(pagNo.toInt.toString) * Integer.parseInt(recordOnPage.toInt.toString)
    val start = rec - Integer.parseInt(recordOnPage.toInt.toString)
    val end = Integer.parseInt(recordOnPage.toInt.toString)
    var sqlString = "SELECT * FROM  (SELECT  ROW_NUMBER() OVER(ORDER BY id ASC) AS Row, * FROM art_service_catalogue AS tbl)as ss WHERE  (Row >=" + (start + 1) + " AND Row <= " + (start + end) + ") "
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ServiceCatalogueMaster.serviceCatalogueMaster *)
    }
  }

  /**
   * update art_service_catalogue
   */

  def changeServiceCatalogue(id: String, is_deleted: Int, uid: Int): Int = {
    DB.withConnection { implicit connection =>
      SQL(""" update  art_service_catalogue set  updation_date={updation_date}, updated_by={updated_by}, is_deleted={is_deleted}
    		  where id={id}""")
        .on(
          'id -> id,
          'updation_date -> new Date,
          'updated_by -> uid,
          'is_deleted -> is_deleted).executeUpdate()
    }
  }

  def isServiceAllowedtoDelete(catalogue_id: String): Int = {
    var sqlString = "select count(*) from art_sub_task where catalogue_id=" + catalogue_id;
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(
        scalar[Long].single)
      result.toInt
    }
  }

  def insertServceiCatalogue(serviceCatalogue: ServiceCatalogueMaster) = {
    DB.withConnection { implicit connection =>

      val lastSave = SQL(
        """
          insert into art_service_catalogue ( discipline, service_code, service_name, description, service_scope,
           service_requestor_role, executive_role_primary, executive_role_secondary, 
           sla_value, sla_unit, creation_date,
          updation_date, updated_by, is_deleted
         ) values (
           {discipline},{service_code},{service_name},
          {description}, {service_scope}, {service_requestor_role}, {executive_role_primary}, {executive_role_secondary}, {sla_value},
    		  {sla_unit}, {creation_date}, {updation_date}, {updated_by}, {is_deleted})
          """).on(

          'discipline -> serviceCatalogue.discipline,
          'service_code -> serviceCatalogue.service_code,
          'service_name -> serviceCatalogue.service_name.trim(),
          'description -> serviceCatalogue.description,
          'service_scope -> serviceCatalogue.service_scope,
          'service_requestor_role -> serviceCatalogue.service_requestor_role,
          'executive_role_primary -> serviceCatalogue.executive_role_primary,
          'executive_role_secondary -> serviceCatalogue.executive_role_secondary,
          'sla_value -> serviceCatalogue.sla_value,
          'sla_unit -> serviceCatalogue.sla_unit,
          'creation_date -> serviceCatalogue.creation_date,
          'updation_date -> serviceCatalogue.updation_date,
          'updated_by -> serviceCatalogue.updated_by,
          'is_deleted -> serviceCatalogue.is_deleted).executeInsert(scalar[Long].singleOpt)

      lastSave.last
    }
  }

  def updateSrviceCatalogue(serviceCatalogue: ServiceCatalogueMaster): Int = {
    DB.withConnection { implicit connection =>
      SQL(""" update  art_service_catalogue set discipline={discipline}, service_code={service_code}, 
              service_name={service_name}, description={description}, service_scope={service_scope}, service_requestor_role={service_requestor_role}, 
          executive_role_primary={executive_role_primary}, executive_role_secondary={executive_role_secondary}, sla_value={sla_value},
          sla_unit={sla_unit}, creation_date={creation_date}, updation_date={updation_date}, updated_by={updated_by}, is_deleted={is_deleted}
    		  where id={id}""")
        .on(
          'id -> serviceCatalogue.id.get,
          'discipline -> serviceCatalogue.discipline,
          'service_code -> serviceCatalogue.service_code,
          'executive_role_secondary -> serviceCatalogue.executive_role_secondary,
          'service_name -> serviceCatalogue.service_name.trim(),
          'description -> serviceCatalogue.description,
          'service_scope -> serviceCatalogue.service_scope,
          'service_requestor_role -> serviceCatalogue.service_requestor_role,
          'executive_role_primary -> serviceCatalogue.executive_role_primary,
          'executive_role_secondary -> serviceCatalogue.executive_role_secondary,
          'sla_value -> serviceCatalogue.sla_value,
          'sla_unit -> serviceCatalogue.sla_unit,
          'creation_date -> serviceCatalogue.creation_date,
          'updation_date -> serviceCatalogue.updation_date,
          'updated_by -> serviceCatalogue.updated_by,
          'is_deleted -> serviceCatalogue.is_deleted).executeUpdate()
    }
  }

  def findServiceCatalogueByDescipline(id: String): Seq[ServiceCatalogueMaster] = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_service_catalogue where discipline={id} AND is_deleted=0").on(
          'id -> id).as(
            ServiceCatalogueMaster.serviceCatalogueMaster *)
      result
    }
  }

  def findAllServiceCatalogueByDescipline(id: String): Seq[ServiceCatalogueMaster] = {
    DB.withConnection { implicit connection =>
      val result = SQL(
        "select * from art_service_catalogue where discipline={id}").on(
          'id -> id).as(
            ServiceCatalogueMaster.serviceCatalogueMaster *)
      result
    }
  }

  def findActiveServiceCatalogueByDescipline(descipline_id: String): Seq[ServiceCatalogueMaster] = {
    DB.withConnection { implicit connection =>
      val sql =
        """
          |SELECT
          |id,
          |discipline,
          |service_code,
          |LTRIM(service_name) service_name,
          |description,
          |service_scope,
          |service_requestor_role,
          |executive_role_primary,
          |executive_role_secondary,
          |sla_value,
          |sla_unit,
          |updated_by,
          |creation_date,
          |updation_date,
          |is_deleted
          |FROM art_service_catalogue
          |WHERE is_deleted=0
          |AND discipline={id}
          |ORDER BY service_name
        """.stripMargin
      //val sql = "select * from art_service_catalogue where is_deleted=0 AND discipline=" + descipline_id
      val result = SQL(sql).on(
        'id -> descipline_id).as(ServiceCatalogueMaster.serviceCatalogueMaster *)
      result
    }
  }
}

