package models

import anorm.SqlParser._
import anorm._
import java.util.Date

case class DocumentTypes(id: Option[Int], document_type: String,description:String,updated_by:Option[Int],updation_date:Option[Date],creation_date:Option[Date],is_deleted:Int)

object DocumentTypes {
	val dTypes = {
		get[Option[Int]]("id") ~
			get[String]("document_type")~
			get[String]("description")~
			get[Option[Int]]("updated_by")~
			get[Option[Date]]("updation_date")~
			get[Option[Date]]("creation_date")~
		  get[Int]("is_deleted") 	map {
				case id ~ document_type ~ description ~ updated_by~ updation_date ~creation_date ~ is_deleted=> DocumentTypes(id, document_type,description, updated_by,updation_date,creation_date,is_deleted)
			}
	}
}