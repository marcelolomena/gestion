package services

import play.api.Play.current
import play.api.db.DB
import anorm.SqlParser._
import models._
import anorm._

object TemplateService extends CustomColumns {

  /**
   * get all tasks list
   */
  def findAllTemplates(): Seq[Template] = {
    DB.withConnection { implicit connection =>
      SQL("SELECT id,generic_project_type FROM art_program_generic_project_type where is_deleted = 0").as(Template.tmp *)
    }
  }

}