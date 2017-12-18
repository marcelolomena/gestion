package service

import anorm.SqlParser._
import anorm._
import controllers.Frontend.KanbanSocketController
import model.{Kolumn, ServiceResponse, StatusCode, UserBase}
import play.api.db.DB
import play.api.Play.current

/**
 * Trait service in domain of Kolumn.
 */
protected trait KolumnService {
  /**
   * Return a list of columns from a list of projects
   * @param ids ids of projects to be queried
   * @return sequence of kolumns from the projects queried
   */
  protected def getKolumnsForProjects(ids: Seq[Long]): Seq[Kolumn] = {
    DB.withConnection{ implicit c =>
      SQL(
        s"""
           |SELECT * FROM kolumn
           |WHERE project_id
           |IN (${ids.mkString(",")})
         """.stripMargin
      ).as(model.Kolumn.parser.*)
    }
  }

  /**
   * Insert a new kolumn for an existing project.
   * @param kolumn case class kolumn with appropriate project id inside
   * @return id of newly inserted kolumn
   */
  def insertNewKolumn(kolumn : Kolumn): ServiceResponse[Long] = {
    implicit def bool2int(b:Boolean) = if (b) 1 else 0
    DB.withConnection { implicit c =>
      SQL(
        s"""
           |SELECT
           |COUNT(*) COUNT
           |FROM project
           |WHERE id=${kolumn.projectId}
         """.stripMargin
      ).as(scalar[Int].single) match {
        case 0 =>
          implicit val error = -1L
          ServiceResponse(StatusCode.IdentifierNotFound,
            message=s"projectId ${kolumn.projectId} no se encuentra")
        case _ =>
          //implicit val is_archive = bool2int(kolumn.isArchiveKolumn)
          implicit val insertedKolumn : Long = SQL(
            s"""
               |INSERT INTO kolumn (project_id,name,position,threshold,created_by_user,is_archive_kolumn)
               |VALUES(
               |${kolumn.projectId},
               |'${kolumn.name}',
               |${kolumn.position},
               |${kolumn.threshold},
               |${kolumn.createdByUserId},
               |${kolumn.isArchiveKolumn})
            """.stripMargin
          ).executeInsert(scalar[Long].single)
          kolumn.id = Option(insertedKolumn)
          KanbanSocketController.newKolumn(
            kolumn,
            SQL(s"SELECT uid id,email,first_name,last_name,uname username,password,profile_image avatar FROM art_user WHERE uid=${kolumn.createdByUserId}").as(UserBase.userParser.*).head,
            SQL(s"SELECT board_id FROM project WHERE id=${kolumn.projectId}").as(scalar[Long].single))
          ServiceResponse(StatusCode.OK)
      }
    }
  }
}