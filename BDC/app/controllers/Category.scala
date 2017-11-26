package controllers

import play.api.mvc.{Action, Controller}
import play.i18n._
import services.CategoryServices
import org.apache.commons.lang3.StringUtils
import models._
import art_forms.ARTForms
import java.util.Date

object Category extends Controller with Secured  {

  val langObj = new Lang(Lang.forCode("es-ES"))

  def categoryList() = IsAuthenticatedAdmin() { _ =>
  { implicit request =>
    val username = request.session.get("username").get
    val pagNo = request.getQueryString("page")
    val pageRecord = request.getQueryString("record")
    val searchKey = request.getQueryString("search")

    var pageNumber = "1"
    var recordOnPage = "10"
    var search = ""

    if (pagNo != None) {
      pageNumber = pagNo.get.toString()
    }
    if (pageRecord != None) {
      recordOnPage = pageRecord.get.toString()
    }
    if (searchKey != None) {
      search = searchKey.get.toString()
    }

    val departments = CategoryServices.findCategoryList(pageNumber, recordOnPage)
    val totalCount = CategoryServices.count()
    val pagination = Application.Pagination(totalCount, pageNumber, recordOnPage, search)
    Ok(views.html.category.categoryList(departments, username, totalCount, pagination))
  }
  }

  def editCategory(id: String) = IsAuthenticatedAdmin() { _ =>
  { implicit request =>
    if (StringUtils.isNotBlank(id)) {
      val category = CategoryServices.findCategoryById(id)
      category match {
        case None =>
          Redirect(routes.Category.categoryList())
        case Some(cat: Categories) =>
          val obj = Categories(cat.id, cat.description, cat.is_active)
          println(obj)
          Ok(views.html.category.categoryEdit(ARTForms.categoryForm.fill(obj)))
      }
    } else {
      Redirect(routes.Category.categoryList)
    }
  }
  }

  def createCategory = IsAuthenticatedAdmin() { _ =>
  { implicit request =>
    val username = request.session.get("username").get

    Ok(views.html.category.categoryAdd(username,ARTForms.categoryForm))
  }
  }


  def saveCategory = IsAuthenticatedAdmin() { _ =>
  { implicit request =>

    ARTForms.categoryForm.bindFromRequest.fold(
      hasErrors => {
        val username = request.session.get("username").get.toString
        BadRequest(views.html.category.categoryAdd(username,hasErrors))
      },
      success => {
        val username = request.session.get("username").get.toString
        val description = success.description.trim()
        val obj = CategoryServices.findCategoryByName(description)

        if (obj.size > 0) {
          BadRequest(views.html.category.categoryAdd(username,ARTForms.categoryForm.withError("description", Messages.get(langObj, "Ya existe esta categoría")).fill(success)))
        } else {
          val uId = Integer.parseInt(request.session.get("uId").get)
          val obj = Categories(success.id, success.description, 1)
          val last = CategoryServices.saveCategory(obj)
          /**
            * Activity log
            */
          val act = Activity(ActivityTypes.Category.id, "New Category created by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), last.toInt)
          Activity.saveLog(act)
          Redirect(routes.Category.categoryList)
        }
      })
  }
  }


  def updateCategory() = IsAuthenticatedAdmin() { _ =>
  { implicit request =>
    val myForm = ARTForms.categoryForm.bindFromRequest

    myForm.fold(
      hasErrors => {
        println(hasErrors.errors)
        BadRequest(views.html.category.categoryEdit(hasErrors))
      },
      success => {
        val theForm = CategoryServices.validateCategoryForm(myForm.fill(success))
        if (theForm.hasErrors) {

          BadRequest(views.html.category.categoryEdit(theForm))
        } else {
          val obj = Categories(success.id, success.description, success.is_active)
          val last = CategoryServices.updateCategory(obj)
          /**
            * Activity log
            */
          val act = Activity(ActivityTypes.Category.id, "Category Updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), success.id.get)
          Activity.saveLog(act)
          Redirect(routes.Category.categoryList)
        }
      })
  }
  }

  def categoryUpdateStatus(id: String, status: Boolean) = IsAuthenticatedAdmin() { _ =>
  { implicit request =>
    if (StringUtils.isNotBlank(id)) {

      val category_id = Integer.parseInt(id)
      var is_deleted = 0
      if (status) {
        is_deleted = 1
      }

      CategoryServices.changeStatusCategoryStatus(category_id, is_deleted)
      /**
        * Activity log
        */
      val act = Activity(ActivityTypes.Category.id, "Category status updated by " + request.session.get("username").get, new Date(), Integer.parseInt(request.session.get("uId").get), category_id)
      Activity.saveLog(act)
    }
    Ok("Success")
  }
  }

}
