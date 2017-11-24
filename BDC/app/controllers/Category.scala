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

  def updateCategory() = IsAuthenticatedAdmin() { _ =>
  { implicit request =>
    val myForm = ARTForms.categoryForm.bindFromRequest
    println(myForm)

    myForm.fold(
      hasErrors => {
        println(hasErrors)
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

}
