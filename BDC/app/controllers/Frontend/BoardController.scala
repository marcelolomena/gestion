package controllers.Frontend

import model.BoardValidators.{IDValidator, MoveTicketValidator, NewBoardValidator}
import model._
import play.api.mvc.Action
import service.KanbanService

/**
 *Controlador para todas las acciones relacionadas con el tablero mismo.
 */
object BoardController extends CoreController {
  def createNewTicket = Action(parse.json) { implicit request =>
    resultDispatch[Ticket, Long](KanbanService.insertNewTicket)
  }

  def moveTicket = Action(parse.json) { implicit request =>
    resultDispatch[MoveTicketValidator, Int](KanbanService.moveTicketToKolumn)
  }

  def bindCollaboratorToTicket = Action(parse.json) { implicit request =>
    resultDispatch[Collaborator, Long](KanbanService.addCollaboratorToTicket)
  }

  def postCommentToTicket = Action(parse.json) { implicit request =>
    resultDispatch[CommentItem, Long](KanbanService.addCommentToTicket)
  }

  def createNewKolumn = Action(parse.json) { implicit request =>
    resultDispatch[Kolumn, Long](KanbanService.insertNewKolumn)
  }

  def createNewProject = Action(parse.json) { implicit request =>
    resultDispatch[Project, Long](KanbanService.insertNewProject)
  }

  def createNewBoard = Action(parse.json) { implicit request =>
    resultDispatch[NewBoardValidator, Long](KanbanService.insertNewBoard)
  }

  def getBoardsForUser = Action(parse.json) { implicit request =>
    resultDispatch[IDValidator, Seq[FullBoard]](KanbanService.returnBoardsForUser)
  }

  def userBoardAuthorization = Action(parse.json) { implicit request =>
    resultDispatch[UserBoardAuthorization, Long](KanbanService.addUserToBoard)
  }
}