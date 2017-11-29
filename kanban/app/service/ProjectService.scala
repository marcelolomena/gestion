package service

import anorm.SqlParser._
import anorm._
import controllers.KanbanSocketController
import model._
import play.api.db.DB
import play.api.Play.current

/**
 */
protected trait ProjectService {
  def insertNewProject(project : Project): ServiceResponse[Long] = {
    DB.withConnection { implicit c =>
      SQL(
        s"""
           |SELECT
           |COUNT(*) COUNT
           |FROM [art_live].[dbo].[board]
           |WHERE id=${project.boardId}
         """.stripMargin
      ).apply().head[Int]("COUNT") match {
        case 0 =>
          implicit val id = -1L
          ServiceResponse(StatusCode.IdentifierNotFound, s"boardId ${project.boardId} not found")
        case _ =>
          implicit val id : Long = SQL(
            s"""
               |INSERT INTO [art_live].[dbo].[project](board_id, name, prefix, created_by_user)
               |VALUES(${project.boardId}, '{project.name}', '${project.prefix}', ${project.createdByUserId})
               """.stripMargin
          ).executeInsert(scalar[Long].single)
          project.id = Option(id)
          KanbanSocketController.addProject(FullProject(project, Seq[Kolumn](), Seq[Ticket]()), SQL(
            s"""
               |SELECT *
               |FROM [art_live].[dbo].[user]
               |WHERE id=${project.createdByUserId}
             """.stripMargin
          ).as(UserBase.userParser.*).head)
          ServiceResponse(StatusCode.OK)
      }
    }
  }
  protected def getProjectsForBoards(ids: Seq[Long]): Seq[Project] = {
    DB.withConnection { implicit c =>
      SQL(
        s"""
           |SELECT * FROM [art_live].[dbo].[project]
           |WHERE board_id
           |IN (${ids.mkString(",")})
         """.stripMargin
      ).as(Project.parser.*)
    }
  }
}
