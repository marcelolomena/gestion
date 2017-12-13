package models

import anorm.SqlParser._
import anorm._
import java.util.Date
import play.api.libs.json._

/**
  * @author marcelo
  */
case class ConfigMailAlert(id: Option[Int], uid: Int, em1: Option[String], em2: Option[String],
                           em3: Option[String], tpl: String, fec: java.util.Date, is_active: Int,
                           description: String)

object ConfigMailAlert extends CustomColumns{

  val config = {
    get[Option[Int]]("id") ~
      get[Int]("uid") ~
      get[Option[String]]("em1") ~
      get[Option[String]]("em2") ~
      get[Option[String]]("em3") ~
      get[String]("tpl") ~
      get[Date]("fec") ~
      get[Int]("is_active") ~
      get[String]("description") map {
      case id ~ uid ~ em1 ~ em2 ~ em3 ~ tpl ~ fec ~ is_active ~ description =>
        ConfigMailAlert(id, uid,  em1, em2, em3, tpl, fec, is_active, description)
    }
  }
  implicit val configMailAlertWrites = Json.writes[ConfigMailAlert]
}