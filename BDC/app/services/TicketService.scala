package service

import anorm.SqlParser._
import anorm._
import controllers.Frontend.KanbanSocketController
import model.BoardValidators.MoveTicketValidator
import model._
import play.api.db.DB
import play.api.Play.current

import scala.collection.mutable

/**
 * Trait service in domain of Ticket.
 */
protected trait TicketService {
  def insertNewTicket(ticket : Ticket): ServiceResponse[Long] = {
    DB.withConnection { implicit c =>
      implicit var retId: Long = -1L
      SQL(
        s"""
           |SELECT
           |COUNT(*) COUNT
           |FROM project
           |WHERE id=${ticket.projectId}
         """.stripMargin
      ).apply().head[Int]("COUNT") match {
        case 0 =>
          ServiceResponse(StatusCode.IdentifierNotFound, message=s"projectId ${ticket.projectId} not found")
        case _ =>
          retId = SQL(
            s"""
               |INSERT INTO ticket(project_id, name, description, priority, difficulty, assigner_id, current_kolumn_id)
               |VALUES(${ticket.projectId}, '${ticket.name}', '${ticket.description.get}',
               |${ticket.priority.get}, ${ticket.difficulty.get}, ${ticket.assignerId}, ${ticket.currentKolumnId})
             """.stripMargin
          ).executeInsert(scalar[Long].single)
          SQL(
            s"""
               |INSERT INTO collaborators(user_id, ticket_id)
               |VALUES(${ticket.assignerId}, $retId)
           """.stripMargin
          ).executeInsert()

          KanbanSocketController.newTicket(
            SQL(
              s"""
                 |SELECT * FROM ticket
                 |INNER JOIN collaborators
                 |ON ticket.id = collaborators.ticket_id
                 |INNER JOIN [user]
                 |ON collaborators.user_id=[user].id
                 |WHERE ticket.id=$retId
                 |AND ticket.id=collaborators.ticket_id
            """.stripMargin
            ).as(Ticket.collaboratorParser.*).head,
            SQL(s"SELECT * FROM user WHERE id=${ticket.assignerId}").as(UserBase.userParser.*).head,
            SQL(s"SELECT board_id FROM project WHERE id=${ticket.projectId}").as(scalar[Long].single)
          )
          ServiceResponse(StatusCode.OK)
      }
    }
  }

  def moveTicketToKolumn(moveTicketValidator : MoveTicketValidator): ServiceResponse[Int] = {
    DB.withConnection { implicit c =>
      SQL(
        s"""
           |SELECT
           |COUNT(*) COUNT
           |FROM ticket
           |WHERE id=${moveTicketValidator.ticketId}
            |AND current_kolumn_id=${moveTicketValidator.oldKolumnId}
            |AND project_id=${moveTicketValidator.projectId}
         """.stripMargin
      ).apply().head[Int]("COUNT") match {
        case 0 =>
          implicit val error = 0
          ServiceResponse(StatusCode.IdentifierNotFound,
            message=s"ticket ${moveTicketValidator.ticketId} not found for kolumn ${moveTicketValidator.oldKolumnId}"
          )
        case _ =>
          implicit val numRowsAffected : Int = SQL(
            s"""
               |UPDATE ticket
               |SET current_kolumn_id=${moveTicketValidator.newKolumnId}
                |WHERE id=${moveTicketValidator.ticketId}
             """.stripMargin
          ).executeUpdate()
          KanbanSocketController.moveTicket(
            SQL(s"SELECT * FROM ticket WHERE id=${moveTicketValidator.ticketId}").as(Ticket.parser.*).head,
            SQL(s"SELECT * FROM user WHERE id=${moveTicketValidator.userId}").as(UserBase.userParser.*).head,
            SQL(s"SELECT board_id FROM project WHERE id=${moveTicketValidator.projectId}").as(scalar[Long].single)
          )
          ServiceResponse(StatusCode.OK)
      }
    }
  }

  def addCollaboratorToTicket(collaborator: Collaborator): ServiceResponse[Long] = {
    DB.withConnection( implicit c =>
      SQL(
        s"""
           |SELECT auth_level
           |FROM user_authorized_boards
           |WHERE user_id = ${collaborator.assignerId.get}
            |AND board_id = ${collaborator.boardId}
         """.stripMargin
      ).as(scalar[Int].single) match {
        case AuthLevel.SuperAdmin|AuthLevel.Admin|AuthLevel.Contributor =>
          SQL(
            s"""
               |SELECT COUNT(*) COUNT
               |FROM collaborators
               |WHERE user_id=${collaborator.userId}
                |AND ticket_id=${collaborator.ticketId}
            """.stripMargin).apply().head[Int]("COUNT") match {
            case 0 =>
              implicit val collaboratorId : Long = SQL(
                s"""
                   |INSERT INTO collaborators(user_id, ticket_id)
                   |VALUES(${collaborator.userId}, ${collaborator.ticketId})
             """.stripMargin
              ).executeInsert(scalar[Long].single)
              KanbanSocketController.addCollaboratorsForTicket(
                SQL(s"SELECT * from ticket where id=${collaborator.ticketId}").as(Ticket.parser.*).head,
                SQL(s"SELECT * from user where id=${collaborator.userId}").as(UserBase.userParser.*).head,
                SQL(s"SELECT * from user where id=${collaborator.assignerId.get}").as(UserBase.userParser.*).head,
                collaborator.boardId
              )
              ServiceResponse(StatusCode.OK)
            case _ =>
              implicit val error = 0L
              ServiceResponse(StatusCode.IdentifierNotFound,
                message=s"user id already assigned to ticket"
              )
          }

        case _ =>
          implicit val error = 0L
          ServiceResponse(StatusCode.IdentifierNotFound,
            message=s"${collaborator.assignerId} does not have authorization to add collaborators"
          )
      }
    )
  }

  def addCommentToTicket(commentItem: CommentItem): ServiceResponse[Long] = {
    DB.withConnection( implicit c =>
      SQL(
        s"""
           |SELECT auth_level
           |FROM user_authorized_boards
           |JOIN ticket
           |JOIN project
           |WHERE user_authorized_boards.user_id = ${commentItem.userId.get}
           |AND (ticket.project_id = ${commentItem.ticketId.get}
           |AND project.board_id = user_authorized_boards.board_id)
           |LIMIT 1
         """.stripMargin
      ).as(scalar[Int].single) match {
        case AuthLevel.SuperAdmin|AuthLevel.Admin|AuthLevel.Contributor =>
          implicit val collaboratorId : Long = SQL(
            s"""
               |INSERT INTO comments(user_id, ticket_id, comment)
               |VALUES(${commentItem.userId.get}, ${commentItem.ticketId.get}, "${commentItem.comment.get}")
             """.stripMargin
          ).executeInsert(scalar[Long].single)
          commentItem.id = Option(collaboratorId)
          KanbanSocketController.newComment(
            commentItem.ticketId.get,
            SQL(s"SELECT * from user where id=${commentItem.userId.get}").as(UserBase.userParser.*).head,
            SQL(s"SELECT board_id from project JOIN ticket where ticket.id=${commentItem.ticketId.get} AND project.id=ticket.project_id").as(scalar[Long].single),
            commentItem.comment.get
          )
          ServiceResponse(StatusCode.OK)
        case _ =>
          implicit val error = 0L
          ServiceResponse(StatusCode.IdentifierNotFound,
            message=s"${commentItem.userId} does not have authorization to add comment"
          )
      }
    )
  }

  protected def getTicketsForProjects(ids: Seq[Long]): Seq[Ticket] = {
    DB.withConnection { implicit c =>
      val ticketsPreProcessed = SQL(
        s"""
           |SELECT * FROM [art_live].[dbo].[ticket]
           |INNER JOIN [art_live].[dbo].[collaborators]
           |ON ticket.id = collaborators.ticket_id
           |INNER JOIN [art_live].[dbo].[user]
           |ON collaborators.user_id=[user].id
           |LEFT OUTER JOIN [art_live].[dbo].[comments]
           |ON ticket.id=comments.ticket_id
           |WHERE project_id
           |IN (${ids.mkString(",")})
           |AND ticket.id=collaborators.ticket_id
         """.stripMargin
      ).as(Ticket.collaboratorParser.*)
      implicit val ticketsPostProcessed = mutable.MutableList[model.Ticket]()
      for ((k,v) <- ticketsPreProcessed.groupBy(_.id.get)) {
        ticketsPostProcessed += v.head.copy(
          collaborators=Option(v.map(_.collaborators.get).flatten),
          comments=Option(v.map(_.comments.get).flatten)
        )
      }
      ticketsPostProcessed
    }
  }
}