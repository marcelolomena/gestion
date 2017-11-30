package service

import anorm.SqlParser._
import anorm._
import model.AuthLevel.AuthLevel
import model.BoardValidators.NewBoardValidator
import model._
import play.api.db.DB
import play.api.Play.current
import scala.collection.mutable

/**
 * Trait for the lowest level of a Kanban Board,
 * the Board itself. Anything specifically regarding
 * the Board object should be in here.
 */
protected trait BoardService {
  /**
   * Return a list of boards that this specific user has access to.
   * @param id id of user being queried
   * @return sequence of boards the user has access to
   */
  protected def getBoardsAuthorizedForUser(id: Long) : Seq[Board] = {
    DB.withConnection{ implicit c =>
      SQL(
        s"""
           |SELECT board.id,board.name
           |FROM [art_live].[dbo].[board]
           |JOIN [art_live].[dbo].[user_authorized_boards]
           |ON board.id=user_authorized_boards.board_id
           |WHERE user_authorized_boards.user_id=$id
        """.stripMargin
      ).as(Board.parser.*)
    }
  }

  /**
   * Return a list of all the users that have access to the boards
   * in the provided sequence of IDs
   * @param ids board ids to get authorized users from
   * @return sequence of users attached to these boards
   */
  protected def getAuthorizedUsersForBoards(ids: Seq[Long]) : Seq[UserBase] = {
    DB.withConnection{ implicit c =>
      implicit val authorizedUsers = mutable.MutableList[UserBase]()
      val authorizedUsersPreProcessed = SQL(
        s"""
           |SELECT *
           |FROM [art_live].[dbo].[user_authorized_boards]
           |JOIN [art_live].[dbo].[user]
           |ON [user].id=user_authorized_boards.user_id WHERE
           |(${ids.mkString("user_authorized_boards.board_id="," OR user_authorized_boards.board_id=","")})
         """.stripMargin
      ).as(UserBase.authParser.*)

      for(user <- authorizedUsersPreProcessed) {
        if(!authorizedUsers.map(_.id.get).contains(user.id.get)) {
          authorizedUsers += user
          val filteredUser = authorizedUsers.filter(_.id == user.id).head
          val filteredBoardsOfUser = filteredUser.authorizedBoards.get
          val flattenedBoardsInRestOfList = authorizedUsersPreProcessed.filter(_.id == user.id)
            .map(_.authorizedBoards.get)
            .flatten
          filteredUser.authorizedBoards = Option(filteredBoardsOfUser ++ flattenedBoardsInRestOfList)
        }
      }
      authorizedUsers
    }
  }

  /**
   * Convenience method for querying the a specific users authentication
   * level for a specific board.
   * @param userId user id to check against
   * @param boardId board id to check against
   * @return authorization level
   */
  protected def getAuthLevelForBoard(userId: Long, boardId: Long): AuthLevel = {
    DB.withConnection { implicit c =>
      SQL(
        s"""
           |SELECT
           |auth_level
           |FROM [art_live].[dbo].[user_authorized_boards]
           |WHERE board_id=$boardId
            |AND user_id=$userId
         """.stripMargin
      ).apply().head[Int]("auth_level")
    }
  }

  /**
   * Insert a new board object into the database.
   * @param newBoardValidator case class with name of board and id of user
   *                          creating the board
   * @return id of new board
   */
  def insertNewBoard(newBoardValidator: NewBoardValidator): ServiceResponse[Long] = {
    DB.withConnection { implicit c =>
      implicit val boardId = SQL(
        s"""
           |INSERT INTO [art_live].[dbo].[board] (name)
           |VALUES('${newBoardValidator.name}')
         """.stripMargin
      ).executeInsert(scalar[Long].single)
      SQL(
        s"""
           |INSERT INTO [art_live].[dbo].[user_authorized_boards] (user_id, board_id, auth_level)
           |VALUES(${newBoardValidator.userId}, $boardId, ${AuthLevel.SuperAdmin})
         """.stripMargin
      ).executeInsert()
      ServiceResponse(StatusCode.OK)
    }
  }
}