package models

import anorm.SqlParser._
import play.api.Play.current
import java.util.Date
import anorm._
import play.api.db.DB
import play.api.data.Forms._
import play.api.data._

case class InputPert(programa : Int,
    lider: Int,
    plantilla: Int,
    cajero: Int,
    direccion: String,
    fecha: Date)

object InputPert {
  val  inputPert = {
    get[Int]("programa") ~
      get[Int]("lider") ~
      get[Int]("plantilla") ~
      get[Int]("cajero") ~
      get[String]("direccion") ~
      get[Date]("fecha")  map {
        case programa ~ 
        lider ~ 
        plantilla ~ 
        cajero ~ 
        direccion ~ 
        fecha  => InputPert(programa, lider, plantilla, cajero, direccion, fecha)
      }
  }
}

case class XPert(id: Option[Int], tId: Int, task_title : String, inicio : Date, fin : Date)

object XPert extends CustomColumns{

  val pert = {
    get[Option[Int]]("id") ~
      get[Int]("tId") ~
      get[String]("task_title") ~ 
      get[Date]("inicio") ~
      get[Date]("fin") map {
        case id ~ 
        tId ~ 
        task_title ~ 
        inicio ~ 
        fin =>  XPert(id, tId, task_title, inicio, fin)
      }
  }
}

