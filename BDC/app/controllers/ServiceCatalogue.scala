package controllers

import java.lang.Long
import models._
import play.api.mvc.Action
import play.api.mvc.Controller
import art_forms.ARTForms
import views.html.defaultpages.badRequest
import org.apache.commons.lang3.StringUtils
import play.api.data.Form
import play.api.libs.json
import scala.tools.nsc.doc.model.Val
import play.api.libs.json.Json
import play.mvc.Results.Redirect
import services.DivisionService
import services.TaskDesciplineService
import services.UserRoleService
import services.ServiceCatalogueService
import anorm.NotAssigned
import java.util.Date
import services.ServiceCatalogueService
import services.UserService
import models.ServiceCatalogues;
import play.i18n._
object ServiceCatalogue extends Controller with Secured {
  var username = ""
  var description = ""
  var pageNumber = "1"
  var recordOnPage = "10"
  var search = ""
  val langObj = new Lang(Lang.forCode("es-ES"))
  /**
   * Login form...
   */

  def serviceCatalogueList() = IsAuthenticatedAdmin() { _ =>
    { implicit request =>
      val result = request.session.get("username")
      val username = result.get
      val pagNo = request.getQueryString("page")
      val pageRecord = request.getQueryString("record")
      val searchKey = request.getQueryString("search")

      if (pagNo != None) {
        pageNumber = pagNo.get.toString()
      }
      if (pageRecord != None) {
        recordOnPage = pageRecord.get.toString()
      }
      if (searchKey != None) {
        search = searchKey.get.toString()
      }
      var isAllowedtoDeleteMap = new java.util.HashMap[String, Boolean]();
      val serviceCatalogueList = ServiceCatalogueService.getServiceCatalogueAllList(pageNumber, recordOnPage)
      for (s <- serviceCatalogueList) {
        if (ServiceCatalogueService.isServiceAllowedtoDelete(s.id.get.toString) > 0) {
          isAllowedtoDeleteMap.put(s.id.get.toString, false);
        } else {
          isAllowedtoDeleteMap.put(s.id.get.toString, true);
        }
      }

      var disciplineMap = new java.util.LinkedHashMap[String, String]();
      for (d <- TaskDesciplineService.findAllTaskDesciplineList) {
        disciplineMap.put(d.id.get.toString, d.task_discipline.toString())
      }

      var totalCount = ServiceCatalogueService.serviceCatalogueCount()
      var pagination = Application.Pagination(totalCount, pageNumber, recordOnPage, search)
      Ok(views.html.serviceCatalogue.serviceCatalogueList(totalCount, pagination, username, serviceCatalogueList, isAllowedtoDeleteMap, disciplineMap))
    }
  }

  def serviceCatalogueListNew(id: String) = IsAuthenticatedAdmin() { _ =>
    { implicit request =>
      val serviceCatalogueList = ServiceCatalogueService.findAllServiceCatalogueByDescipline(id)
      Ok(views.html.serviceCatalogue.serviceCatalogueListNew(serviceCatalogueList))
    }
  }

  def serviceCatalogueListByDesciplineId(descipline_id: String) = IsAuthenticatedAdmin() { _ =>
    { implicit request =>
      var serviceCatalogueWise = ServiceCatalogueService.findActiveServiceCatalogueByDescipline(descipline_id)
      var serviceCatalogueOptions: String = "<option value='' class='blank'>--- Choose Service Catalogue ---</option>";
      for (d <- serviceCatalogueWise) {
        serviceCatalogueOptions = serviceCatalogueOptions + "<option value='" + d.id.get.toString + "' class='blank'>" + d.service_name.toString() + "</option>";
      }
      Ok(serviceCatalogueOptions);
    }
  }

  def addServiceCatalogue = IsAuthenticatedAdmin() { _ =>
    { implicit request =>
      val result = request.session.get("username")
      var username = result.get
      var disciplineMap = new java.util.LinkedHashMap[String, String]();
      for (d <- TaskDesciplineService.findAllTaskDesciplineList) {
        disciplineMap.put(d.id.get.toString, d.task_discipline.toString())
      }

      var userRoleMap = new java.util.HashMap[String, String]();
      for (u <- UserRoleService.findAllUserRoles) {
        userRoleMap.put(u.rId.get.toString, u.role.toString());
      }
      var slaUnitMap = new java.util.HashMap[String, String]();
      for (slu <- models.slaUnitValues.values) {
        slaUnitMap.put(slu.id.toString, slu.toString())
      }
      Ok(views.html.serviceCatalogue.addServiceCatalogue(username, disciplineMap, userRoleMap, slaUnitMap, ARTForms.serviceCatalogueForm))
    }
  }

  def saveCatalogue = IsAuthenticatedAdmin() { _ =>
    { implicit request =>
      val result = request.session.get("username")
      var username = result.get
      var disciplineMap = new java.util.LinkedHashMap[String, String]();
      for (d <- TaskDesciplineService.findAllTaskDesciplineList) {
        disciplineMap.put(d.id.get.toString, d.task_discipline.toString())
      }
      var userRoleMap = new java.util.HashMap[String, String]();
      for (u <- UserRoleService.findAllUserRoles) {
        userRoleMap.put(u.rId.get.toString, u.role.toString());
      }
      var slaUnitMap = new java.util.HashMap[String, String]();
      for (slu <- models.slaUnitValues.values) {
        slaUnitMap.put(slu.id.toString, slu.toString())
      }
      ARTForms.serviceCatalogueForm.bindFromRequest.fold(
        hasErrors => {

          println(hasErrors.errors);

          //println("----- " + hasErrors.error("service_scope").get.message  );
          for (e <- hasErrors.errors) {
            println("Key -- " + e.key);
            println("Message -- " + e.message);
          }
          BadRequest(views.html.serviceCatalogue.addServiceCatalogue(username, disciplineMap, userRoleMap, slaUnitMap, hasErrors))
        },
        success => {

          val theForm = ServiceCatalogueService.validateServiceCatalogueForm(ARTForms.serviceCatalogueForm.fill(success))
          println("The Form Errors -- " + theForm.errors);
          if (theForm.hasErrors) {
            println("Errors - " + theForm.errors("service_scope"));
            BadRequest(views.html.serviceCatalogue.addServiceCatalogue(username, disciplineMap, userRoleMap, slaUnitMap, theForm))
          } else {
            println("Form Successfully Validated");
            var description = ""
            if (theForm.get.description.isEmpty) {
              description = theForm.get.service_name;
            } else {
              description = theForm.get.description.get;
            }
            var service_requestor_role = 0;
            if (!theForm.get.service_requestor_role.isEmpty) {
              service_requestor_role = Integer.parseInt(theForm.get.service_requestor_role.get.toString)
            }

            var executive_role_primary = 0;
            if (!theForm.get.executive_role_primary.isEmpty) {
              executive_role_primary = Integer.parseInt(theForm.get.executive_role_primary.get.toString());
            }

            var executive_role_secondary = 0;
            if (!theForm.get.executive_role_secondary.isEmpty) {
              executive_role_secondary = theForm.get.executive_role_secondary.get;
            }

            /*            println("Discipline - " + theForm.get.discipline);
            println("service_code - " + theForm.get.service_code);
            println("service_name - " + theForm.get.service_name);
            println("description - " + description);
            println("service_scope - " + theForm.get.service_scope);
            println("service_requestor_role - " + service_requestor_role);
            println("executive_role_primary - " + executive_role_primary);
            println("executive_role_secondary - " + executive_role_secondary);
            println("sla_value - " + theForm.get.sla_value);
            println("sla_unit - " + theForm.get.sla_unit);*/

            var serviceCatalogueMaster = ServiceCatalogueMaster(theForm.get.id, theForm.get.discipline, theForm.get.service_code,
              theForm.get.service_name, description, theForm.get.service_scope,
              Option(service_requestor_role), Option(executive_role_primary), Option(executive_role_secondary),
              theForm.get.sla_value, theForm.get.sla_unit, new Date(),
              new Date(), UserService.findUserDetailsByUsername(username).get.uid.get, 0);
            val last = ServiceCatalogueService.insertServceiCatalogue(serviceCatalogueMaster);
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Service_Catalogue.id, "Service Catalogue created by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), last.toInt)
            Activity.saveLog(act)
            Redirect(routes.ServiceCatalogue.serviceCatalogueList())
          }
        })
    }
  }

  /**
   * Login form...
   */
  def editServiceCatalogue(id: String) = IsAuthenticatedAdmin() { _ =>
    { implicit request =>

      val result = request.session.get("username")
      var username = result.get

      var disciplineMap = new java.util.LinkedHashMap[String, String]();
      for (d <- TaskDesciplineService.findAllTaskDesciplineList) {
        disciplineMap.put(d.id.get.toString, d.task_discipline.toString())
      }

      var userRoleMap = new java.util.HashMap[String, String]();
      for (u <- UserRoleService.findAllUserRoles) {
        userRoleMap.put(u.rId.get.toString, u.role.toString());
      }

      var slaUnitMap = new java.util.HashMap[String, String]();
      for (slu <- models.slaUnitValues.values) {
        slaUnitMap.put(slu.id.toString, slu.toString())
      }

      var serviceCatalogueMaster = ServiceCatalogueService.findServiceCatalogueByIdAll(id);
      var serviceCatalogue = ServiceCatalogues(serviceCatalogueMaster.get.id, serviceCatalogueMaster.get.discipline,
        serviceCatalogueMaster.get.service_code,
        serviceCatalogueMaster.get.service_name, Option(serviceCatalogueMaster.get.description),
        serviceCatalogueMaster.get.service_scope, serviceCatalogueMaster.get.service_requestor_role,
        serviceCatalogueMaster.get.executive_role_primary, serviceCatalogueMaster.get.executive_role_secondary,
        serviceCatalogueMaster.get.sla_value, serviceCatalogueMaster.get.sla_unit);

      Ok(views.html.serviceCatalogue.editServiceCatalogue(username, disciplineMap, userRoleMap, slaUnitMap, ARTForms.serviceCatalogueForm.fill(serviceCatalogue)))
    }
  }

  def updateServiceCatalogue() = IsAuthenticatedAdmin() { _ =>
    { implicit request =>
      val result = request.session.get("username")
      var username = result.get
      var disciplineMap = new java.util.LinkedHashMap[String, String]();
      for (d <- TaskDesciplineService.findAllTaskDesciplineList) {
        disciplineMap.put(d.id.get.toString, d.task_discipline.toString())
      }

      var userRoleMap = new java.util.HashMap[String, String]();
      for (u <- UserRoleService.findAllUserRoles) {
        userRoleMap.put(u.rId.get.toString, u.role.toString());
      }

      var slaUnitMap = new java.util.HashMap[String, String]();
      for (slu <- models.slaUnitValues.values) {
        slaUnitMap.put(slu.id.toString, slu.toString())
      }

      ARTForms.serviceCatalogueForm.bindFromRequest.fold(
        hasErrors => {

          println(hasErrors.errors);

          //println("----- " + hasErrors.error("service_scope").get.message  );
          for (e <- hasErrors.errors) {
            println("Key -- " + e.key);
            println("Message -- " + e.message);
          }
          BadRequest(views.html.serviceCatalogue.editServiceCatalogue(username, disciplineMap, userRoleMap, slaUnitMap, hasErrors))
        },
        success => {
          println("Form Validated Successfully.. Adding custom vallidations.");

          val theForm = ServiceCatalogueService.validateServiceCatalogueFormEdit(ARTForms.serviceCatalogueForm.fill(success))
          println("The Form Errors -- " + theForm.errors);
          if (theForm.hasErrors) {
            println("Errors - " + theForm.errors("service_scope"));
            BadRequest(views.html.serviceCatalogue.editServiceCatalogue(username, disciplineMap, userRoleMap, slaUnitMap, theForm))
          } else {

            var description = ""
            if (theForm.get.description.isEmpty) {
              description = theForm.get.service_name;
            } else {
              description = theForm.get.description.get;
            }
            var service_requestor_role = 0;
            if (!theForm.get.service_requestor_role.isEmpty) {
              service_requestor_role = Integer.parseInt(theForm.get.service_requestor_role.get.toString)
            }

            var executive_role_primary = 0;
            if (!theForm.get.executive_role_primary.isEmpty) {
              executive_role_primary = Integer.parseInt(theForm.get.executive_role_primary.get.toString());
            }

            var executive_role_secondary = 0;
            if (!theForm.get.executive_role_secondary.isEmpty) {
              executive_role_secondary = theForm.get.executive_role_secondary.get;
            }

            /*            println("Discipline - " + theForm.get.discipline);
            println("service_code - " + theForm.get.service_code);
            println("service_name - " + theForm.get.service_name);
            println("description - " + description);
            println("service_scope - " + theForm.get.service_scope);
            println("service_requestor_role - " + service_requestor_role);
            println("executive_role_primary - " + executive_role_primary);
            println("executive_role_secondary - " + executive_role_secondary);
            println("sla_value - " + theForm.get.sla_value);
            println("sla_unit - " + theForm.get.sla_unit);

            println("Id -- " + theForm.get.id);*/

            val is_deleted = ServiceCatalogueService.findServiceCatalogueByIdAll(theForm.get.id.get.toString()).get.is_deleted
            val uId = request.session.get("uId").get.trim
            var serviceCatalogueMaster = ServiceCatalogueMaster(theForm.get.id, theForm.get.discipline, theForm.get.service_code,
              theForm.get.service_name, description, theForm.get.service_scope,
              Option(service_requestor_role), Option(executive_role_primary), Option(executive_role_secondary),
              theForm.get.sla_value, theForm.get.sla_unit, new Date(),
              new Date(), Integer.parseInt(uId), is_deleted);

            var id = ServiceCatalogueService.updateSrviceCatalogue(serviceCatalogueMaster);
            /**
             * Activity log
             */
            val act = Activity(ActivityTypes.Service_Catalogue.id, "Service Catalogue updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), theForm.get.id.get)
            Activity.saveLog(act)
            Redirect(routes.ServiceCatalogue.serviceCatalogueList())
          }
        })
    }
  }

  def updateCatalogueServiseStatus(id: String, status: Boolean) = IsAuthenticatedAdmin() { _ =>
    { implicit request =>
      val result = request.session.get("username")
      val username = result.get
      var is_deleted = 1
      if (status) {
        is_deleted = 0
      }
      /*  var serviceCatalogue = ServiceCatalogueService.findServiceCatalogueById(id);

      var serviceCatalogueMaster = ServiceCatalogueMaster(serviceCatalogue.get.id, serviceCatalogue.get.discipline, serviceCatalogue.get.service_code,
        serviceCatalogue.get.service_name, serviceCatalogue.get.description, serviceCatalogue.get.service_scope,
        serviceCatalogue.get.service_requestor_role, serviceCatalogue.get.executive_role_primary, serviceCatalogue.get.executive_role_secondary,
        serviceCatalogue.get.sla_value, serviceCatalogue.get.sla_unit, serviceCatalogue.get.creation_date,
        new Date(), Integer.parseInt(request.session.get("uId").get), 1);*/

      val uid = Integer.parseInt(request.session.get("uId").get.trim())
      ServiceCatalogueService.changeServiceCatalogue(id, is_deleted, uid);
      /**
       * Activity log
       */
      val act = Activity(ActivityTypes.Service_Catalogue.id, "Service Catalogue deleted by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), id.toInt)
      Activity.saveLog(act)
      Ok("Success")
    }
  }

}