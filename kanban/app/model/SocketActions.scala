package model

/**
 * Enum for possible actions to be sent over a socket.
 * Client uses these as keys to determine what actions
 * to take on the UI.
 */
object SocketActions extends Enumeration {
  type SocketActions = String

  val moveTicket = "moveTicket"
  val newTicket = "newTicket"
  val addCollaborator = "addCollaborator"
  val moveKolumn = "moveKolumn"
  val newKolumn = "newKolumn"
  val addUserToBoard = "addUserToBoard"
  val newBoard = "newBoard"
  val newProject = "newProject"
  val newComment = "newComment"
}