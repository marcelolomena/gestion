package models
import anorm.SqlParser._
import java.util.Date
import anorm._
import play.api.libs.json._

case class Divisions(
    dId: Option[Int],
    division: String,
    user_id: Long,
    updated_by: Option[Int],
    updation_date: Option[Date],
    is_deleted: Int
    )

object Divisions extends CustomColumns {

  val division = {
    get[Option[Int]]("dId") ~
      get[String]("division") ~
      get[Long]("user_id") ~
      get[Option[Int]]("updated_by") ~
      get[Option[Date]]("updation_date") ~
      get[Int]("is_deleted") map {
        case dId ~
          division ~
          user_id ~
          updated_by ~
          updation_date ~
          is_deleted
        => Divisions(
          dId,
          division,
          user_id,
          updated_by,
          updation_date,
          is_deleted
        )
      }
  }
  implicit val divisionWrites = Json.writes[Divisions]

}


case class DivisionsList(
                      codDivision: Option[Int],
                      glosaDivision: Option[String]
                    )

object DivisionsList extends CustomColumns {

  val divisionList = {
      get[Option[Int]]("codDivision") ~
      get[Option[String]]("glosaDivision") map {
      case
        codDivision ~
        glosaDivision
      => DivisionsList(
        codDivision,
        glosaDivision
      )
    }
  }
  implicit val divisionListWrites = Json.writes[DivisionsList]

}
case class DummyList(
                          name: String,
                          value: String
                        )

object DummyList extends CustomColumns {

  val dummyList = {
    get[String]("name") ~
      get[String]("value") map {
      case
        name ~
          value
      => DummyList(
        name,
        value
      )
    }
  }
  implicit val dummyListWrites = Json.writes[DummyList]

}