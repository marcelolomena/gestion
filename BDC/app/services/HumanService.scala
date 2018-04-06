package services

import play.api.Play.current
import play.api.db.DB;
import anorm.SqlParser._;
import models._;
import anorm._
import com.typesafe.plugin._;
import play.api.data.Form
import play.i18n._
import play.mvc._

/**
 * @author marcelo
 */
object HumanService extends CustomColumns {

  def ifHeExists(uid: Int): Int = {

    DB.withConnection { implicit connection =>
      val sqlString =
        """
          |SELECT count(*) FROM RecursosHumanos WHERE emailTrab=(select email
          |from art_user where uid={uid}) and periodo=(select MAX(periodo) from RecursosHumanos)
        """.stripMargin
      SQL(sqlString).on('uid->uid).as(scalar[Int].single)

    }
  }

  
}