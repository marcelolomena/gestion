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
    is_deleted: Int,
    idRRHH: Option[Int],
    codDivision: Option[Int],
    glosaDivision: Option[String]
    )

object Divisions extends CustomColumns {

  val division = {
    get[Option[Int]]("dId") ~
      get[String]("division") ~
      get[Long]("user_id") ~
      get[Option[Int]]("updated_by") ~
      get[Option[Date]]("updation_date") ~
      get[Int]("is_deleted") ~
      get[Option[Int]]("idRRHH") ~
      get[Option[Int]]("codDivision") ~
      get[Option[String]]("glosaDivision") map {
        case dId ~
          division ~
          user_id ~
          updated_by ~
          updation_date ~
          is_deleted ~
          idRRHH ~
          codDivision ~
          glosaDivision
        => Divisions(
          dId,
          division,
          user_id,
          updated_by,
          updation_date,
          is_deleted,
          idRRHH,
          codDivision,
          glosaDivision
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