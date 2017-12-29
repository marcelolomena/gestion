package controllers.Frontend

import akka.actor.{ActorRef, Props}
import model._
import play.Logger
import play.api.libs.json.{JsNumber, JsString, Json}

import scala.collection.mutable
import scala.collection.mutable.ListBuffer

/**
 * Service in domain of actors connected to our two way
 * socket connection.
 */
object KanbanSocketController {
  /**
   * users currently connected to board. BoardIds are the key, the actors are placed in to a list
   * as the value of that key
   */
  lazy val connected = new mutable.HashMap[Long, ListBuffer[KanbanActor]]()
  /**
   * users currently connected to the dashboard without any association to a boardId
   */
  lazy val floatingActors = new ListBuffer[KanbanActor]()

  /**
   * Funnel for creating new actors.
   * @param out reference to new actor
   * @param user user connecting
   * @param boardId boardId, can be nil if floatings
   * @return nothing
   */
  def props(out: ActorRef, user: UserBase, boardId: Option[Long]) = {
    boardId.isDefined match {
      case true =>
        Logger.debug(s"New Board User! ${user.username} for ${boardId.get}")
      case false =>
        Logger.debug(s"New Floating User! ${user.username}")
    }
    Props(new KanbanActor(out,user,boardId))
  }

  def addProject(project: FullProject, user: UserBase): Unit = {
    Logger.warn("sending new project")
    connected.get(project.project.boardId).get.foreach { actor =>
      Logger.warn("sending new project for user")
      actor ! Json.stringify(Json.obj(
        "action" -> JsString(SocketActions.newProject),
        "data" -> Json.obj(
          "project" -> Json.toJson(project),
          "user" -> Json.toJson(user)
        )
      ))
    }
  }

  def newComment(ticketId: Long, user: UserBase, boardId: Long, comment: String): Unit = {
    Logger.warn("sending new comment")
    connected.get(boardId).get.foreach { actor =>
      actor ! Json.stringify(Json.obj(
        "action" -> JsString(SocketActions.newComment),
        "data" -> Json.obj(
          "comment" -> JsString(comment),
          "user" -> Json.toJson(user),
          "boardId" -> JsNumber(boardId),
          "ticketId" -> JsNumber(ticketId)
        )
      ))
    }
  }

  def newBoard(board: Board, userAdded: UserBase, userAdding: UserBase): Unit = {
    Logger.debug("sending new board for user with board_id " + board.id.get)
    Logger.debug(Json.obj(
      "board" -> Json.toJson(board),
      "userAdding" -> Json.toJson(userAdding)
    ).toString())
    floatingActors.seq.foreach { actor =>
      Logger.debug("Todo pasando pal wea : " + actor.user.firstName)
      actor ! Json.stringify(
        Json.obj(
          "action" -> JsString(SocketActions.newBoard),
          "data" -> Json.obj(
            "board" -> Json.toJson(board),
            "userAdding" -> Json.toJson(userAdding),
            "projects" -> Option.empty[Project]
          )
        )
      )
    }
  }


  def newTicket(ticket: Ticket, user: UserBase, boardId: Long): Unit = {
    Logger.warn("sending new ticket")
    connected.get(boardId).get.foreach { actor =>
      Logger.warn("sending new ticket for user")
      actor ! Json.stringify(Json.obj(
        "action" -> JsString(SocketActions.newTicket),
        "data" -> Json.obj(
          "ticket" -> Json.toJson(ticket),
          "user" -> Json.toJson(user),
          "boardId" -> JsNumber(boardId)
        )
      ))
    }
  }

  def moveTicket(ticket: Ticket, user: UserBase, boardId: Long): Unit = {
    Logger.warn("sending move ticket")
    connected.get(boardId).get.foreach { actor =>
      Logger.warn("sending move ticket for user")
      actor ! Json.stringify(Json.obj(
        "action" -> JsString(SocketActions.moveTicket),
        "data" -> Json.obj(
          "ticket" -> Json.toJson(ticket),
          "user" -> Json.toJson(user)
        )
      ))
    }
  }

  def newKolumn(kolumn: Kolumn, user: UserBase, boardId: Long): Unit = {
    Logger.warn("sending new kolumn")
    connected.get(boardId).get.foreach { actor =>
      Logger.warn("sending kolumn for user")
      actor ! Json.stringify(Json.obj(
        "action" -> JsString(SocketActions.newKolumn),
        "data" -> Json.obj(
          "kolumn" -> Json.toJson(kolumn),
          "user" -> Json.toJson(user)
        )
      ))
    }
  }

  def addCollaboratorsForTicket(ticket: Ticket, collaboratorAdded: UserBase, user: UserBase, boardId: Long): Unit = {
    Logger.warn("sending move ticket to boardId : " + boardId)
    connected.get(boardId).get.foreach { actor =>
      Logger.warn("sending move ticket for user")
      actor ! Json.stringify(Json.obj(
        "action" -> JsString(SocketActions.addCollaborator),
        "data" -> Json.obj(
          "ticket" -> Json.toJson(ticket),
          "user" -> Json.toJson(user),
          "collaboratorAdded" -> Json.toJson(collaboratorAdded),
          "boardId" -> boardId
        )
      ))
    }
  }

def listUserAutocomplete(boardId: Long,resAuto: Seq[ResultAutocomplete]): Unit = {
  Logger.warn("sending autocomplete")
  connected.get(boardId).get.foreach { actor =>
    Logger.warn("sending autocomplete to user")
    actor ! Json.stringify(Json.obj(
      "action" -> JsString(SocketActions.listCollaborator),
      "data" -> resAuto
    ))
  }
}

  def addUserToBoard(board: FullBoard, userAdded: UserBase, userAdding: UserBase): Unit = {
    Logger.warn("sending added user to board")
    connected.getOrElse(board.board.id.get, Seq[KanbanActor]()).foreach { actor =>
      Logger.warn("sending added board for user")
      actor ! Json.stringify(Json.obj(
        "action" -> JsString(SocketActions.addUserToBoard),
        "data" -> Json.obj(
          "userAdded" -> Json.toJson(userAdded),
          "userAdding" -> Json.toJson(userAdding),
          "boardName" -> JsString(board.board.name)
        )
      ))
    }
    floatingActors.foreach { actor =>
      if(actor.user.id.get == userAdded.id.get) {
        Logger.warn("sending new board for user")
        actor ! Json.stringify(
          Json.obj(
            "action" -> JsString(SocketActions.newBoard),
            "data" -> Json.obj(
              "board" -> Json.toJson(board),
              "userAdding" -> Json.toJson(userAdding)
            )
          )
        )
        return
      }
    }
  }
}