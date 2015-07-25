package models

import anorm.Pk
import java.util.Date
import anorm.SqlParser._
import play.api.Play.current
import java.util.Date
import anorm._
import play.api.db.DB
import play.api.libs.json.Json

case class DashboardSearch(delay_level: Option[String], project_classification: Option[String], program_type: Option[String], program_sub_type: Option[String], division: Option[String], program_role: Option[String], item_budget: Option[String], sort_type: Option[String], gerencia: Option[String], department: Option[String])

object DashboardSearch {
  val dashboardSearch = {
    get[Option[String]]("delay_level") ~
      get[Option[String]]("project_classification") ~
      get[Option[String]]("program_type") ~
      get[Option[String]]("program_sub_type") ~
      get[Option[String]]("division") ~
      get[Option[String]]("program_role") ~
      get[Option[String]]("item_budget") ~
      get[Option[String]]("sort_type") ~
      get[Option[String]]("gerencia") ~
      get[Option[String]]("department") map {
        case delay_level ~ project_classification ~ program_type ~ program_sub_type ~ division ~ program_role ~ item_budget ~ sort_type ~ gerencia ~ department => DashboardSearch(delay_level, project_classification, program_type, program_sub_type, division, program_role, item_budget, sort_type, gerencia, department)
      }
  }
}

object delayLevelValues extends Enumeration {
  type delayLevelValues = Value
  val OnTime = Value("0 - 0.7")
  val LessThankOneMonth = Value("0.7 - 0.9")
  val LessThanOrEqualTwoMonths = Value("0.9 - 1.0")
  val LessThanTwoMonths = Value(">= 1.0")

}

object projectClassificationValues extends Enumeration {
  type projectClassificationValues = Value
  val Small = Value("Small ( < 1.350 UF)")
  val Medium = Value("Meduim (>= 1.350 UF and < 12.500 UF")
  val Large = Value("Large(>= 12.500 UF)")
}

object programRolesValue extends Enumeration {
  type documentTypeValue = Value
  val Program, Projects, Task, SubTask, Division = Value
}

object itemBudgetValue extends Enumeration {
  type itemBudgetValue = Value
  val Infrastructure = Value("Infrastructure")
  val Corrective = Value("Corrective")
  val Evolutionar = Value("Evolutionar")
  val Regulatory = Value("Regulatory")
  val Audit = Value("Audit")
  val ATM = Value("ATM")
  val MinorProjects = Value("Minor Projects")
}

case class Panel(division: String, 
    programa: String, 
    responsable: String, 
    fecini: String, 
    feccom: String, 
    pai: String, 
    pae: String, 
    spi: String,
    cpi: String,
    inversion: String,
    gasto: String
    )

object Panel {
  val panel = {
    get[String]("division") ~
      get[String]("programa") ~
      get[String]("responsable") ~
      get[String]("fecini") ~
      get[String]("feccom") ~
      get[String]("pai") ~
      get[String]("pae") ~
      get[String]("spi") ~
      get[String]("cpi") ~
      get[String]("inversion") ~
      get[String]("gasto") map {
        case division ~ 
        programa ~ 
        responsable ~ 
        fecini ~ 
        feccom ~ 
        pai ~ 
        pae ~ 
        spi ~ 
        cpi ~ 
        inversion ~
        gasto => Panel(division, programa, responsable, fecini, feccom, pai, pae, spi, cpi, inversion,gasto)
      }
    
  }
  implicit val panelWrites = Json.writes[Panel]
}

case class ATM(id: Int, 
    nivel: String, 
    codigo: Int, 
    nombre: String, 
    responsable: String, 
    pini: Option[Date], 
    pter: Option[Date], 
    rini: Option[Date],
    rter: Option[Date],
    pai: Double,
    pae: Double
    )

object ATM {
  val atm = {
    get[Int]("id") ~
      get[String]("nivel") ~
      get[Int]("codigo") ~
      get[String]("nombre") ~
      get[String]("responsable") ~
      get[Option[Date]]("pini") ~
      get[Option[Date]]("pter") ~
      get[Option[Date]]("rini") ~
      get[Option[Date]]("rter") ~
      get[Double]("pai") ~
      get[Double]("pae") map {
        case id ~ 
        nivel ~ 
        codigo ~ 
        nombre ~ 
        responsable ~ 
        pini ~ 
        pter ~ 
        rini ~ 
        rter ~ 
        pai ~
        pae => ATM(id, nivel, codigo, nombre, responsable, pini, pter, rini, rter, pai,pae)
      }
    
  }
  implicit val atmWrites = Json.writes[ATM]
}


case class ATMExcel(id: Int, 
    nivel: String, 
    codigo: Int, 
    nombre: String, 
    responsable: String, 
    pini: String, 
    pter: String, 
    rini: String,
    rter: String,
    pai: Double,
    pae: Double
    )

object ATMExcel {
  val atmExcel = {
    get[Int]("id") ~
      get[String]("nivel") ~
      get[Int]("codigo") ~
      get[String]("nombre") ~
      get[String]("responsable") ~
      get[String]("pini") ~
      get[String]("pter") ~
      get[String]("rini") ~
      get[String]("rter") ~
      get[Double]("pai") ~
      get[Double]("pae") map {
        case id ~ 
        nivel ~ 
        codigo ~ 
        nombre ~ 
        responsable ~ 
        pini ~ 
        pter ~ 
        rini ~ 
        rter ~ 
        pai ~
        pae => ATMExcel(id, nivel, codigo, nombre, responsable, pini, pter, rini, rter, pai,pae)
      }
    
  }
  implicit val atmWrites = Json.writes[ATMExcel]
}