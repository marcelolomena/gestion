package services

import play.api.Play.current
import play.api.db.DB
import anorm.SqlParser._
import models._
import anorm._
import com.typesafe.plugin._
import anorm.SqlQueryResult

object FunctionRoleService {

  def checkDBAccess(role: String, function: String) = {
    DB.withConnection { implicit connection =>
      SQL("EXEC usuario.acceso {user_role},{user_function}").on(
        'user_role -> role, 'user_function -> function).executeQuery().as(scalar[Int].single)
    }
  }
}