package model

import akka.actor.{Actor, ActorRef}
import controllers.KanbanSocketController
import play.Logger
import play.api.libs.json.JsValue

import scala.collection.mutable.ListBuffer

/**
 */
class KanbanActor(out: ActorRef, implicit val user: UserBase, boardId: Option[Long]) extends Actor {

  boardId.isDefined match {
    case true =>
      KanbanSocketController.connected.getOrElseUpdate(boardId.get, new ListBuffer[KanbanActor]()) += this
    case false =>
      KanbanSocketController.floatingActors += this
  }

  def !(message : String) = {
    out ! message
  }
  def !=(ref: ActorRef) = {
    out != ref
  }

  override def postStop() = {
    boardId.isDefined match {
      case true =>
        KanbanSocketController.connected.get(boardId.get).get.remove(KanbanSocketController.connected.get(boardId.get).get.indexWhere(_.user.id.get == user.id.get))
      case false =>
        KanbanSocketController.floatingActors.remove(KanbanSocketController.floatingActors.indexWhere(_.user.id.get == user.id.get))
    }
    Logger.warn(s"user ${user.username} disconnected")
  }

  def receive = {
    case msg : JsValue =>
      out ! msg
  }
}