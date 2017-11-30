package service

import java.security.MessageDigest

import model._
import model.PersonnelValidators._
import org.apache.commons.codec.binary.Hex
import play.api.db.DB
import play.api.Play.current
import anorm._
import anorm.SqlParser._

/**
 */
object PersonnelService {
  def insertNewUser(user : UserBase): ServiceResponse[Long] = {
    DB.withConnection { implicit c =>
      val crypt = MessageDigest.getInstance("SHA-256")
      crypt.update(user.password.getBytes("UTF-8"))
      val password = Hex.encodeHex(crypt.digest()).mkString
      implicit val userId : Long = SQL(
        s"""
           |INSERT [user] (email, first_name, last_name, username, password, avatar)
           |VALUES ('${user.email}','${user.firstName}','${user.lastName.get}','${user.username}','$password', '${user.avatarUrl.get}')
         """.stripMargin
      ).executeInsert(scalar[Long].single)
      ServiceResponse(StatusCode.OK)
    }
  }

  def returnUserBaseById(userId: Long): UserBase = {
    DB.withConnection { implicit c =>
      SQL(
        s"""
           |SELECT *
           |FROM [user]
           |WHERE id=$userId
         """.stripMargin
      ).as(UserBase.userParser.*).head
    }
  }

  def bypass(uname : String): ServiceResponse[UserBase] = {
    DB.withConnection { implicit c =>
      val res = SQL(
        s"""
           |SELECT *
           |FROM [user]
           |WHERE username='${uname}'
         """.stripMargin
      ).as(UserBase.userParser.*)
      res.size match {
        case 0 =>
          ServiceResponse(StatusCode.IdentifierNotFound, message=s"uname for ${uname} not found")
        case _ =>
          implicit val any = res.head
          ServiceResponse(StatusCode.OK)
      }
    }
  }

  def returnExistingUser(existingUser : ExistingUser): ServiceResponse[UserBase] = {
    DB.withConnection { implicit c =>
      val crypt = MessageDigest.getInstance("SHA-256")
      crypt.update(existingUser.password.getBytes("UTF-8"))
      val password = Hex.encodeHex(crypt.digest()).mkString
      val res = SQL(
        s"""
           |SELECT *
           |FROM [user]
           |WHERE (email='${existingUser.email.getOrElse(-1)}'
           |OR username='${existingUser.username.getOrElse(-1)}')
           |AND password='$password'
         """.stripMargin
      ).as(UserBase.userParser.*)
      res.size match {
        case 0 =>
          ServiceResponse(StatusCode.IdentifierNotFound, message=s"user for ${existingUser.email} not found")
        case _ =>
          implicit val any = res.head
          ServiceResponse(StatusCode.OK)
      }
    }
  }

  def editUser(editUser : EditUser): ServiceResponse[Option[UserBase]] = {
    DB.withConnection { implicit c =>
      if(editUser.oldPassword.isDefined) {
        val crypt = MessageDigest.getInstance("SHA-256")
        crypt.update(editUser.oldPassword.get.getBytes("UTF-8"))
        val password = Hex.encodeHex(crypt.digest()).mkString
        SQL(
          s"""SELECT COUNT(*)
             |FROM [user]
             |WHERE id=${editUser.id}
             |AND password=$password""".stripMargin
        ).as(scalar[Long].single) match {
          case 0 =>
            return ServiceResponse(StatusCode.Unauthorized, message = s"passwords do not match")
          case _ =>
            if(editUser.newPassword.isDefined) {
              if (editUser.oldPassword.get.equals(editUser.newPassword.get)) {
                val crypt = MessageDigest.getInstance("SHA-256")
                crypt.update(editUser.newPassword.get.getBytes("UTF-*8"))
                editUser.editedPassword = Option(Hex.encodeHex(crypt.digest()).mkString)
              }
              else
                return ServiceResponse(StatusCode.Unauthorized, message = s"passwords do not match")
            }
        }
      }
      val buildQuery = new StringBuilder
      buildQuery ++=  "UPDATE [user] SET "
      val userMap = editUser.map
      for((k,v) <- userMap) {
        if(v.isDefined)
          buildQuery ++= s"""$k="${v.get}""""
      }
      buildQuery ++= s"WHERE id=${editUser.id}"
      SQL(buildQuery.toString()).executeUpdate()
      implicit val userBase = Option(SQL(s"SELECT * FROM [user] WHERE id=${editUser.id}").as(UserBase.userParser.*).head)
      ServiceResponse(StatusCode.OK)
    }
  }
}