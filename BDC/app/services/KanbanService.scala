package service

import anorm.SqlParser._
import anorm._
import controllers.Frontend.KanbanSocketController
import model.BoardValidators.IDValidator
import model.{Autocomplete, _}
import play.api.db.DB
import play.api.Play.current

import scala.collection.mutable

/**
 * Clase Master Child para la totalidad del "Board Services".
 * Combination of BoardService, KolumnService, TicketService, ProjectService
 */
object KanbanService extends BoardService
                        with KolumnService
                        with TicketService
                        with KanbanProjectService {

  def listUser (auto: Autocomplete): ServiceResponse[Seq[ResultAutocomplete]] ={
    DB.withConnection { implicit c =>
      def createComboBox : ServiceResponse[Seq[ResultAutocomplete]] = {
        implicit val fullBox = SQL(s"SELECT uid AS value, first_name + ' ' + last_name AS label FROM art_user WHERE first_name like '%${auto.text.get}%' ORDER BY first_name,last_name").as(ResultAutocomplete.parser.*)
        ServiceResponse(StatusCode.OK)
      }
      createComboBox
    }
  }
  /**
   * Return full boards (with projects, kolumns, tickets, etc.) authorized for a user
   * @param id id of user
   * @return sequence of (full) boards
   */
  def returnBoardsForUser(id : IDValidator): ServiceResponse[Seq[FullBoard]] = {
    var authorizedUsers = Seq[UserBase]()
    var authorizedProjects = Seq[Project]()
    var projectKolumns = Seq[Kolumn]()
    var tickets = Seq[Ticket]()

    val authorizedBoards = getBoardsAuthorizedForUser(id.id)

    if (authorizedBoards.isEmpty) return createFullBoard

    authorizedUsers = getAuthorizedUsersForBoards(authorizedBoards.map(_.id.get))

    authorizedProjects = getProjectsForBoards(authorizedBoards.map(_.id.get))

    if (authorizedProjects.isEmpty) return createFullBoard

    projectKolumns = getKolumnsForProjects(authorizedProjects.map(_.id.get))

    tickets = getTicketsForProjects(authorizedProjects.map(_.id.get))

    def createFullBoard : ServiceResponse[Seq[FullBoard]] = {
      implicit val fullBoards = new mutable.MutableList[FullBoard]()
      for (board <- authorizedBoards) { // iterate through all boards
        val projectsForBoard: Seq[Project] = authorizedProjects.filter(project => project.boardId == board.id.get) // filter projects for this board
        val fullProjects = new mutable.MutableList[FullProject]()
        for (project <- projectsForBoard) { // iterate through filtered projects
          val kolumnsForProject: Seq[model.Kolumn] = projectKolumns.filter(kolumn => kolumn.projectId == project.id.get) // filter kolumns for this project
          val ticketsForProject: Seq[model.Ticket] = tickets.filter(ticket => ticket.projectId == project.id.get) // filter tickets for this project
          fullProjects += FullProject(project, kolumnsForProject, ticketsForProject)
        }
        fullBoards += FullBoard(board, fullProjects, authorizedUsers.filter(user => user.authorizedBoards.get.contains(board.id.get)))
      }
      ServiceResponse(StatusCode.OK)
    }
    createFullBoard
  }

  /**
   * Dar autorización al usuario para usar un tablero
   * @param userBoardAuthorization user authorization case to look up user by username, and then
   *                               add them to the appropriate boardId
   * @return id en la tabla de colaboradores despues de la inserción
   */
  def addUserToBoard(userBoardAuthorization: UserBoardAuthorization): ServiceResponse[Long] = {
    DB.withConnection { implicit c =>
      implicit var retId : Long = -1L
      getAuthLevelForBoard(userBoardAuthorization.assignerId, userBoardAuthorization.boardId) match {
        case AuthLevel.Admin | AuthLevel.SuperAdmin =>
          SQL(
            s"""
               |SELECT
               |uid
               |FROM art_user
               |WHERE uname='${userBoardAuthorization.username}'
            """.stripMargin
          ).as(scalar[Long].singleOpt).getOrElse(-1) match {
            case -1 =>
              ServiceResponse(StatusCode.IdentifierNotFound, s"no hay usuario para username ${userBoardAuthorization.username}")
            case userIdFromUsername : Long =>
              retId = SQL(
                s"""
                   |INSERT INTO user_authorized_boards(board_id, auth_level, user_id)
                   |VALUES(${userBoardAuthorization.boardId}, ${userBoardAuthorization.authLevel}, $userIdFromUsername)
                """.
                  stripMargin
              ).executeInsert(scalar[Long].single)

              val boards : Seq[FullBoard] = returnBoardsForUser(IDValidator(userIdFromUsername)).data
              val board = boards.filter(_.board.id.get == userBoardAuthorization.boardId).head

              KanbanSocketController.addUserToBoard(
                board,
                SQL(s"SELECT uid id,email,first_name,last_name,uname username,password,profile_image avatar FROM art_user WHERE uid=$userIdFromUsername").as(UserBase.userParser.*).head,
                SQL(s"SELECT uid id,email,first_name,last_name,uname username,password,profile_image avatar FROM art_user WHERE uid=${userBoardAuthorization.assignerId}").as(UserBase.userParser.*).head
              )

              ServiceResponse(StatusCode.OK)
          }
        case _ =>
          ServiceResponse(StatusCode.Unauthorized, "asignador no está autorizado a agregar usuario")
      }
    }
  }
}