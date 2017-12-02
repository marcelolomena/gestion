package model

import anorm.{~, RowParser}
import anorm.SqlParser._
import org.joda.time.DateTime
import play.api.libs.json._

/**
 * Case class for Comments that are attached to tickets and users.
 * @param ticketId ticket to be attached to
 * @param comment comment string
 * @param userId user commenting
 * @param id id of comment
 */
case class CommentItem(ticketId: Option[Long], comment: Option[String], userId: Option[Long], var id: Option[Long])
object CommentItem {
  implicit val reads = Json.reads[CommentItem]
  implicit val writes = Json.writes[CommentItem]
  implicit val parser : RowParser[CommentItem] = {
    get[Option[Long]]("ticket_id") ~
    get[Option[String]]("comment") ~
    get[Option[Long]]("user_id") ~
    get[Option[Long]]("id") map {
      case ticketId~comment~userId~id =>
        CommentItem(ticketId, comment, userId, id)
    }
  }

}
/**
 * New issue.
 * @param projectId id of linked project
 * @param name name of ticket
 * @param description filer provided description
 * @param collaborators users attached to ticket
 * @param comments comments attached to ticket
 * @param readyForNextStage if ticket should be moved to next column
 * @param blocked if ticket is blocked by other tickets
 * @param currentKolumnId kolumn ticket is currently in
 * @param dueDate date ticket is due
 * @param archived has ticket been archived
 * @param priority importance of ticket
 * @param difficulty difficulty of ticket
 * @param assignerId id of person assigning the ticket
 */
case class Ticket(projectId : Long,
                  name : String,
                  description : Option[String],
                  var collaborators : Option[Seq[UserBase]],
                  var comments : Option[Seq[CommentItem]],
                  readyForNextStage : Option[Boolean],
                  blocked : Option[Boolean],
                  currentKolumnId : Long,
                  dueDate : Option[DateTime],
                  archived : Option[Boolean],
                  var priority : Option[Int],
                  var difficulty : Option[Int],
                  var assignerId : Long,
                  id : Option[Long])
object Ticket {
  implicit val reads = Json.reads[Ticket]
  implicit val writes = Json.writes[Ticket]

  //TODO: Ticket Row Parser
  implicit val collaboratorParser: RowParser[Ticket] = {
    get[Long]("project_id") ~
      get[String]("name") ~
      get[Option[String]]("description") ~
      UserBase.userParser.? ~
      CommentItem.parser.? ~
      get[Option[Boolean]]("ready_for_next_stage") ~
      get[Option[Boolean]]("blocked") ~
      get[Long]("current_kolumn_id") ~
      get[Option[DateTime]]("due_date") ~
      get[Option[Boolean]]("archived") ~
      get[Option[Int]]("priority") ~
      get[Option[Int]]("difficulty") ~
      get[Long]("assigner_id") ~
      get[Long]("id") map {
      case projectId~name~description~userId~commentItems~readyForNextStage~blocked~kolumnId
        ~dueDate~archived~priority~difficulty~assignerId~id =>
        Ticket(projectId, name, description, Option(Seq(userId.get)),
          Option(Seq(commentItems.getOrElse(CommentItem(Option.empty[Long], Option.empty[String], Option.empty[Long], Option.empty[Long])))), readyForNextStage, blocked,
          kolumnId, dueDate, archived, priority, difficulty, assignerId, Option(id))
    }
  }
  implicit val parser: RowParser[Ticket] = {
      get[Long]("project_id") ~
      get[String]("name") ~
      get[Option[String]]("description") ~
      get[Option[Boolean]]("ready_for_next_stage") ~
      get[Option[Boolean]]("blocked") ~
      get[Long]("current_kolumn_id") ~
      get[Option[DateTime]]("due_date") ~
      get[Option[Boolean]]("archived") ~
      get[Option[Int]]("priority") ~
      get[Option[Int]]("difficulty") ~
      get[Long]("assigner_id") ~
      get[Long]("id") map {
      case projectId~name~description~readyForNextStage~blocked~kolumnId
            ~dueDate~archived~priority~difficulty~assignerId~id =>
        Ticket(projectId, name, description, None, None, readyForNextStage, blocked,
          kolumnId, dueDate, archived, priority, difficulty, assignerId, Option(id))
    }
  }
}

/**
 * Named column for the attached Project
 * @param projectId id of project
 * @param name name of column
 * @param position position in row of columns
 * @param threshold how many issues allowed in column
 */
case class Kolumn(projectId : Long,
                  var name : String,
                  var position : Int,
                  var threshold : Int,
                  createdByUserId : Long,
                  isArchiveKolumn : Int,//Boolean
                  var id : Option[Long])
object Kolumn {
  implicit val reads = Json.reads[Kolumn]
  implicit val writes = Json.writes[Kolumn]
  implicit val parser: RowParser[Kolumn] = {
      get[Long]("project_id") ~
      get[String]("name") ~
      get[Int]("position") ~
      get[Int]("threshold") ~
      get[Long]("created_by_user") ~
      get[Int]("is_archive_kolumn") ~
      get[Long]("id") map {
      case projectId~name~position~threshold~created~isArchive~id =>
        Kolumn(projectId, name, position, threshold, created, isArchive, Option(id))
    }
  }
}

/**
 * Case class for project.
 * @param boardId id of board project is attached to
 * @param name name of project
 * @param prefix abbreviation of project
 * @param createdByUserId user who created project
 * @param id id of project
 */
case class Project(boardId : Long,
                   name : String,
                   prefix : String,
                   createdByUserId : Long,
                   var id : Option[Long])
object Project {
  implicit val reads = Json.reads[Project]
  implicit val writes = Json.writes[Project]
  implicit val parser: RowParser[Project] = {
      get[Long]("board_id") ~
      get[String]("name") ~
      get[String]("prefix") ~
      get[Long]("created_by_user") ~
      get[Long]("id") map {
      case boardId~name~prefix~created~id =>
        Project(boardId, name, prefix, created, Option(id))
    }
  }
}

/**
 * Base board object
 * @param name name of board
 * @param id id of board
 */
case class Board(name : String, id : Option[Long])
object Board {
  implicit val reads = Json.reads[Board]
  implicit val writes = Json.writes[Board]
  implicit val parser: RowParser[Board] = {
      get[String]("name") ~
      get[Long]("id") map {
      case name~id =>
        Board(name,Option(id))
    }
  }
}

/*
case class Board(name : String, id : Option[Long])
object Board {
  implicit val reads = Json.reads[Board]
  implicit val writes = Json.writes[Board]
  implicit val parser: RowParser[Board] = {
    get[String]("board.name") ~
      get[Long]("board.id") map {
      case name~id =>
        Board(name,Option(id))
    }
  }
}
*/
/**
 * Project with its columns and tickets
 * @param project project case
 * @param columns columns attached to project
 * @param tickets tickets attached to project
 */
case class FullProject(project : Project, columns : Seq[Kolumn], tickets : Seq[Ticket])
object FullProject {
  implicit val writes = new Writes[FullProject] {
    def writes(fullProject: FullProject): JsValue = {
      Json.obj(
        "project" -> Json.toJson(fullProject.project),
        "kolumns" -> Json.arr(
          Json.toJson(fullProject.columns)
        ),
        "tickets" -> Json.arr(
          Json.toJson(fullProject.tickets)
        )
      )
    }
  }
}

/**
 * Board with its (full) projects
 * @param board board case
 * @param projects (full) projects attached to board
 * @param users users authorized on board
 */
case class FullBoard(board : Board, projects : Seq[FullProject], users: Seq[UserBase])
object FullBoard {
  implicit val writes = new Writes[FullBoard] {
    def writes(fullBoard: FullBoard): JsValue = {
      Json.obj(
        "board" -> Json.toJson(fullBoard.board),
        "projects" -> Json.arr(
          Json.toJson(fullBoard.projects)
        ),
        "users" -> Json.arr(
          Json.toJson(fullBoard.users)
        )
      )
    }
  }
}