package model

import play.api.data.Form
import play.api.data.Forms._

/**
 * "Validators" (forms, specific case classes exclusively for services) for the Personnel category.
 */
object PersonnelValidators {
  lazy val editUserForm = Form(
    mapping(
      "firstName" -> optional(text),
      "lastName" -> optional(text),
      "oldPassword" -> optional(text),
      "newPassword" -> optional(text),
      "avatar" -> optional(text),
      "id" -> longNumber,
      "editedPassword" -> optional(text)
    )(EditUser.apply)(EditUser.unapply)
  )

  lazy val existingUserForm : Form[ExistingUser] = Form(
    mapping(
      "email" -> optional(email),
      "username" -> optional(nonEmptyText),
      "password" -> nonEmptyText(minLength=8)
    )(ExistingUser.apply)(ExistingUser.unapply)
      verifying ("Must provide email or username", f => f.email.isDefined || f.username.isDefined)
  )
  /**
   * Case class for editing a user object. All fields are optional. @editedPassword is
   * generated in the Personnel Service if old & new passwords are filled in
   * @param firstName first name to be changed
   * @param lastName last name to be changed (or added)
   * @param oldPassword users original password
   * @param newPassword users new password
   * @param avatar new chosen avatar
   * @param id user's id, non optional
   * @param editedPassword see class description
   */
  case class EditUser(firstName: Option[String],
                      lastName: Option[String],
                      oldPassword: Option[String],
                      newPassword: Option[String],
                      avatar: Option[String],
                      id: Long,
                      var editedPassword: Option[String] = None) {
    /**
     * Convert case class to a map
     * @return map with keys as the appropriate DB columns
     */
    def map : Map[String, Option[String]] = {
      Map(
        "first_name" -> firstName,
        "last_name" -> lastName,
        "password" -> editedPassword,
        "avatar" -> avatar
      )
    }
  }

  lazy val newUserForm : Form[UserBase] = Form(
    mapping(
      "email" -> email,
      "firstName" -> nonEmptyText,
      "lastName" -> optional(text),
      "username" -> nonEmptyText,
      "password" -> nonEmptyText(minLength=8),
      "avatar" -> optional(text),
      "authorizedBoards" -> ignored(Option(Set[Long]())),
      "id" -> ignored(Option(0L))
    )(UserBase.apply)(UserBase.unapply)
  )
}
