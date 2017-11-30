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
           |SELECT * FROM [art_live].[dbo].[kolumn]
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
           |FROM [art_live].[dbo].[project]
           |WHERE id=${kolumn.projectId}
         """.stripMargin
      ).apply().head[Int]("COUNT") match {
        case 0 =>
          implicit val error = -1L
          ServiceResponse(StatusCode.IdentifierNotFound,
            message=s"projectId ${kolumn.projectId} not found")
        case _ =>
          //implicit val is_archive = bool2int(kolumn.isArchiveKolumn)
          implicit val insertedKolumn : Long = SQL(
            s"""
               |INSERT INTO [art_live].[dbo].[kolumn] (project_id,name,position,threshold,created_by_user,is_archive_kolumn)
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
            SQL(s"SELECT * FROM [art_live].[dbo].[user] WHERE id=${kolumn.createdByUserId}").as(UserBase.userParser.*).head,
            SQL(s"SELECT board_id FROM [art_live].[dbo].[project] WHERE id=${kolumn.projectId}").as(scalar[Long].single))
          ServiceResponse(StatusCode.OK)
      }
    }
  }
}