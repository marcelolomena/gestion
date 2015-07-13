package controllers

import play.api.mvc.Action
import play.api.mvc.AnyContent
import play.api.mvc.Request
import play.api.mvc.RequestHeader
import play.api.mvc.Result
import play.api.mvc.Results
import play.api.mvc.Security

trait Secured {

  private def username(request: RequestHeader) = request.session.get("username")
  private def userType(request: RequestHeader) = request.session.get("utype").get
  private def userId(request: RequestHeader) = request.session.get("uId")

  /**
   * Redirect to login if the user in not authorized.
   */
  private def onUnauthorized(request: RequestHeader) = Results.Redirect(routes.Application.login)

  // --

  /**
   * Action for authenticated users.
   */
  def IsAuthenticated(f: => String => Request[AnyContent] => Result) = Security.Authenticated(username, onUnauthorized) { user =>
    Action(request => f(user)(request))
  }

  def IsAuthenticatedAdmin()(f: => String => Request[AnyContent] => Result) = IsAuthenticated { user =>
    request =>
      if (!request.session.get("utype").isEmpty) {
        val u = Integer.parseInt(request.session.get("utype").get.trim)
        if (u == 2) {
          f(user)(request)
        } else {
          Results.BadRequest
        }
      } else {
        Results.Forbidden
      }
  }

  def IsAuthenticatedCL()(f: => String => Request[AnyContent] => Result) = IsAuthenticated { user =>
    request =>
      if (!request.session.get("utype").isEmpty) {
        val u = Integer.parseInt(request.session.get("utype").get)
        if (u == 3) {
          f(user)(request)
        } else {
          Results.BadRequest
        }
      } else {
        Results.Forbidden
      }
  }

}
