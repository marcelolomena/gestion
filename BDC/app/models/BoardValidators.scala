package model

import play.api.data.Form
import play.api.data.Forms._
import play.api.libs.json.Json

/**
 * "Validators" (forms, specific case classes exclusively for services) for the Board category.
 */
object BoardValidators {

  /**
   * Move Ticket case for moving a ticket from column to column.
   * @param ticketId id of ticket
   * @param userId user moving ticket
   * @param oldKolumnId column ticket had been a part of
   * @param newKolumnId column ticket is moving to
   * @param projectId project ticket is a part of
   */
  case class MoveTicketValidator(ticketId : Long, userId: Long, oldKolumnId : Long, newKolumnId : Long, projectId : Long)
  object MoveTicketValidator {
    implicit val reads = Json.reads[MoveTicketValidator]
  }

  implicit lazy val newBoardForm : Form[NewBoardValidator] = Form(
      mapping(
        "name" -> nonEmptyText,
        "id" -> ignored(0L)
    )(NewBoardValidator.apply)(NewBoardValidator.unapply)
  )
  case class NewBoardValidator(name : String, var userId : Long)
  object NewBoardValidator {
    implicit val reads = Json.reads[NewBoardValidator]
  }

  implicit lazy val newProjectForm : Form[NewProjectValidator] = Form(
    mapping(
      "name" -> nonEmptyText,
      "prefix" -> nonEmptyText(maxLength = 3)
    )(NewProjectValidator.apply)(NewProjectValidator.unapply)
  )

  /**
   * Case for creating a new project
   * @param name name of project
   * @param prefix abbreviation of project (@limited to 3 chars)
   */
  case class NewProjectValidator(name : String, prefix : String)

  /**
   * Simple case for id. More of a convenience class for
   * de-serialization of json envelopes.
   * @param id id to be validated
   */
  case class IDValidator(id : Long)
  object IDValidator {
    implicit val reads = Json.reads[IDValidator]
  }

  /**
   * Simple case for multiple ids. More of a convenience class for
   * de-serialization of json envelopes of arrays.
   * @param ids ids to be validated
   */
  case class MultipleIDValidator(ids : Seq[Long])
  object MultipleIDValidator {
    implicit val reads = Json.reads[MultipleIDValidator]
  }
}