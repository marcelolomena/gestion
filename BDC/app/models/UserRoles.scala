package models
import anorm.SqlParser._
import anorm._
import java.util.Date
import play.api.libs.json.Json

case class UserRoleChild(rId: Option[Int], role: String, description: String)

object UserRoleChild {

  val userRoleChild = {
    get[Option[Int]]("rId") ~
      get[String]("role") ~
      get[String]("description") map {
        case rId ~ role ~ description => UserRoleChild(rId, role, description)
      }
  }
}
case class UserRoleMaster(rId: Option[Int], role: String, description: String, created_by: Int, updation_date: Option[Date], is_deleted: Boolean);

object UserRoles extends CustomColumns{

  val userRoleMaster = {
    get[Option[Int]]("rId") ~
      get[String]("role") ~
      get[String]("description") ~
      get[Int]("created_by") ~
      get[Option[Date]]("updation_date") ~
      get[Boolean]("is_deleted") map {
        case rId ~ role ~ description ~ created_by ~ updation_date ~ is_deleted => UserRoleMaster(rId, role, description, created_by, updation_date, is_deleted)
      }
  }
}

case class UserPeriods(periods : String)

object UserPeriods extends CustomColumns{

  val userPeriods = {
    get[String]("periods")  map {
        case periods => UserPeriods(periods)
      }
  }
}

case class UserAvailibity(periodo: String, porcentaje: Double,horas: Double)

object UserAvailibity extends CustomColumns{

  val userAvailibity = {
    get[String]("periodo") ~  get[Double]("porcentaje") ~  get[Double]("horas") map {
        case periodo ~ porcentaje ~ horas => UserAvailibity(periodo,porcentaje,horas)
      }
  }
  implicit val avaWrites = Json.writes[UserAvailibity]
}

case class MemberCapacity(id: Option[Int], id_program_members: Int, periodo: Date, porcentaje: Double, horas: Double,total: Double)

object MemberCapacity extends CustomColumns{

  val memberCapacity = {
    get[Option[Int]]("id") ~ 
    get[Int]("id_program_members") ~ 
    get[Date]("periodo") ~ 
    get[Double]("porcentaje") ~ 
    get[Double]("horas") ~ 
    get[Double]("total") map {
        case id ~ id_program_members ~ periodo ~ porcentaje ~ horas ~ total => MemberCapacity(id,id_program_members,periodo,porcentaje,horas,total)
      }
  }
  implicit val capWrites = Json.writes[MemberCapacity]
}
