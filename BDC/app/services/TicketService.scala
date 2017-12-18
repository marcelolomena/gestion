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
        ).as(scalar[Int].single) match {
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



          val bId=SQL(
            s"""
               |SELECT
               |board_id
               |FROM project
               |WHERE id=${ticket.projectId}
         """.stripMargin
          ).as(scalar[Int].single)


          SQL(
            s"""
               |INSERT INTO collaborators(user_id, ticket_id, board_id, assigner_id)
               |VALUES(${ticket.assignerId}, $retId, $bId, ${ticket.assignerId})
           """.stripMargin
          ).executeInsert()

          KanbanSocketController.newTicket(
            SQL(
              s"""
                 |SELECT a.*,b.*, c.uid id,c.email,c.first_name,c.last_name,c.uname username,c.password,c.profile_image avatar
                 |FROM ticket a
                 |INNER JOIN collaborators b
                 |ON a.id = b.ticket_id
                 |INNER JOIN art_user c
                 |ON b.user_id=c.uid
                 |WHERE a.id=$retId
                 |AND a.id=b.ticket_id
            """.stripMargin
            ).as(Ticket.collaboratorParser.*).head._1,
            SQL(s"SELECT uid id,email,first_name,last_name,uname username,password,profile_image avatar FROM art_user WHERE uid=${ticket.assignerId}").as(UserBase.userParser.*).head,
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
      ).as(scalar[Int].single) match {
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
            SQL(s"SELECT uid id,email,first_name,last_name,uname username,password,profile_image avatar FROM art_user WHERE uid=${moveTicketValidator.userId}").as(UserBase.userParser.*).head,
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
         """.stripMargin
          ).as(scalar[Int].single) match {
            case 0 =>
              implicit val collaboratorId : Long = SQL(
                s"""
                   |INSERT INTO collaborators(user_id, ticket_id)
                   |VALUES(${collaborator.userId}, ${collaborator.ticketId})
             """.stripMargin
              ).executeInsert(scalar[Long].single)
              KanbanSocketController.addCollaboratorsForTicket(
                SQL(s"SELECT * from ticket where id=${collaborator.ticketId}").as(Ticket.parser.*).head,
                SQL(s"SELECT uid id,email,first_name,last_name,uname username,password,profile_image avatar from art_user where uid=${collaborator.userId}").as(UserBase.userParser.*).head,
                SQL(s"SELECT uid id,email,first_name,last_name,uname username,password,profile_image avatar from art_user where uid=${collaborator.assignerId.get}").as(UserBase.userParser.*).head,
                collaborator.boardId
              )
              ServiceResponse(StatusCode.OK)
            case _ =>
              implicit val error = 0L
              ServiceResponse(StatusCode.IdentifierNotFound,
                message=s"ID de usuario ya asignado al ticket"
              )
          }

        case _ =>
          implicit val error = 0L
          ServiceResponse(StatusCode.IdentifierNotFound,
            message=s"${collaborator.assignerId} no tiene autorización para agregar colaboradores"
          )
      }
    )
  }

  def addCommentToTicket(commentItem: CommentItem): ServiceResponse[Long] = {
    DB.withConnection( implicit c =>
      SQL(

        s"""
           |SELECT TOP 1 auth_level
           |FROM user_authorized_boards
           |JOIN project ON project.board_id = user_authorized_boards.board_id
           |JOIN ticket ON ticket.project_id = project.id
           |WHERE user_authorized_boards.user_id = ${commentItem.userId.get}
           |AND ticket.project_id = ${commentItem.ticketId.get}
           |
         """.stripMargin


      ).as(scalar[Int].single) match {
        case AuthLevel.SuperAdmin|AuthLevel.Admin|AuthLevel.Contributor =>
          implicit val collaboratorId : Long = SQL(
            s"""
               |INSERT INTO comments(user_id, ticket_id, comment)
               |VALUES(${commentItem.userId.get}, ${commentItem.ticketId.get}, ${commentItem.comment.get})
             """.stripMargin
          ).executeInsert(scalar[Long].single)
          commentItem.id = Option(collaboratorId)
          KanbanSocketController.newComment(
            commentItem.ticketId.get,
            SQL(s"SELECT uid id,email,first_name,last_name,uname username,password,profile_image avatar from art_user where uid=${commentItem.userId.get}").as(UserBase.userParser.*).head,
            SQL(s"SELECT board_id from project JOIN ticket where ticket.id=${commentItem.ticketId.get} AND project.id=ticket.project_id").as(scalar[Long].single),
            commentItem.comment.get
          )
          ServiceResponse(StatusCode.OK)
        case _ =>
          implicit val error = 0L
          ServiceResponse(StatusCode.IdentifierNotFound,
            message=s"${commentItem.userId} no tiene autorización para agregar comentario"
          )
      }
    )
  }

  protected def getTicketsForProjects(ids: Seq[Long]): Seq[Ticket] = {
    DB.withConnection { implicit c =>

     SQL(
        s"""
           |SELECT
           |a.project_id,
           |a.name,
           |a.description,
           |a.ready_for_next_stage,
           |a.blocked,
           |a.current_kolumn_id,
           |a.due_date,
           |a.archived,
           |a.priority,
           |a.difficulty,
           |a.assigner_id,
           |a.id,
           |b.user_id,
           |b.ticket_id,
           |b.board_id,
           |b.assigner_id,
           |b.id AS id_collaborators,
           |c.email,
           |c.first_name,
           |c.last_name,
           |c.uname username,
           |c.password,
           |c.profile_image avatar,
           |c.uid AS id_user,
           |d.ticket_id,
           |d.comment,
           |d.user_id,
           |d.id AS id_comments
           |FROM ticket a
           |INNER JOIN collaborators b ON a.id = b.ticket_id
           |INNER JOIN art_user c ON b.user_id=c.uid
           |LEFT OUTER JOIN comments d ON a.id=d.ticket_id
           |WHERE
           |project_id IN (${ids.mkString(",")})
           |AND a.id=b.ticket_id
         """.stripMargin
      ).as(Ticket.collaboratorParser *).groupBy(_._1)
        .mapValues(_.map(_._3).flatten)
        .map{ case (ticket,collaborators) => ticket.copy(collaborators = Option(collaborators)) }
        .toList

    }
  }

}