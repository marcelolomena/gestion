package model

import anorm._
import anorm.SqlParser._
import play.api.libs.json._
import play.api.libs.json.Reads._

// Custom validation helpers
import play.api.libs.functional.syntax._ // Combinator syntax

/**
 * Class to check against existing users for login purposes
 * @param email email, can be None as long as username is set
 * @param username username, can be None as long as email is set
 * @param password user's password
 */
case class ExistingUser(email : Option[String], username : Option[String], password : String)
object ExistingUser {
  implicit val reads : Reads[ExistingUser] = (
      (JsPath \ "email").readNullable(email) and
      (JsPath \ "username").readNullable[String] and
      (JsPath \ "password").read[String]
  )(ExistingUser.apply _)
  implicit val writes = Json.writes[ExistingUser]
}

/**
 * Main base object for all users
 * @param email user's email
 * @param firstName user's first name
 * @param lastName user's last name, can be None
 * @param username chosen username
 * @param password chosen password
 * @param avatarUrl chosen avatar url
 * @param authorizedBoards boards this user has access to as a unique set
 * @param id user's unique ID
 */
case class UserBase(email : String,
                    firstName : String,
                    lastName : Option[String],
                    username : String,
                    password : String,
                    avatarUrl : Option[String],
                    var authorizedBoards : Option[Set[Long]],
                    var id : Option[Long])

object UserBase {
  implicit val reads : Reads[UserBase] = (
    (JsPath \ "email").read(email) and
    (JsPath \ "firstName").read[String] and
    (JsPath \ "lastName").readNullable[String].orElse(Reads.pure(null)) and
    (JsPath \ "username").read[String] and
    (JsPath \ "password").read(minLength[String](8)) and
    (JsPath \ "avatarUrl").readNullable[String] and
    (JsPath \ "authorizedBoards").readNullable[Set[Long]] and
    (JsPath \ "id").readNullable[Long]
  )(UserBase.apply _)

  implicit val writes = Json.writes[UserBase]

  implicit val authParser: RowParser[UserBase] = {
    get[String]("email") ~
    get[String]("first_name") ~
    get[Option[String]]("last_name") ~
    get[String]("username") ~
    get[String]("password") ~
    get[Option[String]]("avatar") ~
    get[Option[Long]]("board_id") ~
    get[Long]("user_id") map {
      case email~firstName~lastName~username~password~avatarUrl~authorizedBoards~id =>
        UserBase(email, firstName, lastName, username, password, avatarUrl, Option(Set(authorizedBoards.get)), Option(id))
    }
  }

  implicit val userParser: RowParser[UserBase] = {
    get[String]("email") ~
      get[String]("first_name") ~
      get[Option[String]]("last_name") ~
      get[String]("username") ~
      get[String]("password") ~
      get[Option[String]]("avatar") ~
      get[Long]("id") map {
      case email~firstName~lastName~username~password~avatarUrl~id =>
        UserBase(email, firstName, lastName, username, password, avatarUrl, Option(Set()), Option(id))
    }
  }

  implicit val userTParser: RowParser[UserBase] = {
    get[String]("email") ~
      get[String]("first_name") ~
      get[Option[String]]("last_name") ~
      get[String]("username") ~
      get[String]("password") ~
      get[Option[String]]("avatar") ~
      get[Long]("id_user") map {
      case email~firstName~lastName~username~password~avatarUrl~id =>
        UserBase(email, firstName, lastName, username, password, avatarUrl, Option(Set()), Option(id))
    }
  }
}

/**
 * Case class for assigning users to tickets
 * @param userId user to be assigned (assignee)
 * @param ticketId ticket to be assigned to
 * //@param boardId board ticket is a part of
 * //@param assignerId user who is assigning the ticket
 */
case class Collaborator(userId: Long, ticketId: Long, boardId: Long, assignerId: Option[Long], id: Option[Long])
object Collaborator {
  implicit val reads = Json.reads[Collaborator]
  implicit val writes = Json.writes[Collaborator]

  implicit val parser: RowParser[Collaborator] = {
    get[Long]("user_id") ~
      get[Long]("ticket_id") ~
      get[Long]("board_id") ~
      get[Option[Long]]("assigner_id") ~
      get[Option[Long]]("id") map {
      case userId~ticketId~boardId~assignerId~id =>
        Collaborator(userId,ticketId,boardId,assignerId,id)
    }
  }

  implicit val collaboratorParser: RowParser[Collaborator] = {
    get[Long]("user_id") ~
      get[Long]("ticket_id") ~
      get[Long]("board_id") ~
      get[Option[Long]]("assigner_id") ~
      get[Option[Long]]("id_collaborators") map {
      case userId~ticketId~boardId~assignerId~id =>
        Collaborator(userId,ticketId,boardId,assignerId,id)
    }
  }
}

case class Autocomplete(text: Option[String])
object Autocomplete {
  implicit val reads = Json.reads[Autocomplete]
  implicit val writes = Json.writes[Autocomplete]

  implicit val parser: RowParser[Autocomplete] = {
    get[Option[String]]("text") map {
      case text =>
        Autocomplete(text)
    }
  }
}

case class ResultAutocomplete(label: Option[String],value: Option[String])
object ResultAutocomplete {
  implicit val reads = Json.reads[ResultAutocomplete]
  implicit val writes = Json.writes[ResultAutocomplete]

  implicit val parser: RowParser[ResultAutocomplete] = {
    get[Option[String]]("label")  ~
      get[Option[String]]("value") map {
      case label ~ value =>
        ResultAutocomplete(label,value)
    }
  }
}


/**
 * Enum for various authorization levels.
 * On any board, there can be the following four
 * types, each with different access levels.
 * TODO: define what each level does
 */
object AuthLevel extends Enumeration {
  type AuthLevel = Int

  val SuperAdmin = 0
  val Admin = 1
  val Contributor = 2
  val Reader = 3
}

import model.AuthLevel.AuthLevel

/**
 * Case class for adding a user to a board
 * @param username username to be looked up and added to board
 * @param boardId id of board to be added to
 * @param authLevel hopeful authorization level of person to be added
 * @param assignerId person adding to board (assigner)
 */
case class UserBoardAuthorization(username : String, boardId : Long, authLevel : AuthLevel, assignerId : Long)
object UserBoardAuthorization {
  implicit val userBoardAuthorizationReads = Json.reads[UserBoardAuthorization]
}