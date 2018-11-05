package models

import anorm.SqlParser._
import anorm._
import java.util.Date
import play.api.libs.json._

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

/**/
case class PanelExcel(division: String, 
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

object PanelExcel {
  val panelexcel = {
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
        gasto => PanelExcel(division, programa, responsable, fecini, feccom, pai, pae, spi, cpi, inversion,gasto)
      }
    
  }
  implicit val panelWrites = Json.writes[PanelExcel]
}
/**/
case class Panel(division: String, 
    program_id: Int,
    programa: String, 
    responsable: String, 
    fecini: Option[Date], 
    feccom: Option[Date], 
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
      get[Int]("program_id") ~
      get[String]("programa") ~
      get[String]("responsable") ~
      get[Option[Date]]("fecini") ~
      get[Option[Date]]("feccom") ~
      get[String]("pai") ~
      get[String]("pae") ~
      get[String]("spi") ~
      get[String]("cpi") ~
      get[String]("inversion") ~
      get[String]("gasto") map {
        case division ~ 
        program_id ~ 
        programa ~ 
        responsable ~ 
        fecini ~ 
        feccom ~ 
        pai ~ 
        pae ~ 
        spi ~ 
        cpi ~ 
        inversion ~
        gasto => Panel(division, program_id, programa, responsable, fecini, feccom, pai, pae, spi, cpi, inversion,gasto)
      }
    
  }
  implicit val panelWrites = Json.writes[Panel]
}
/**/
case class PanelDepartamento(
    division: String, 
    estado: String, 
    program_id: Int,
    programa: String, 
    responsable: String, 
    fecini: Option[Date], 
    feccom: Option[Date], 
    pai: String, 
    pae: String, 
    spi: String,
    cpi: String,
    inversion: String,
    gasto: String
    )

object PanelDepartamento {
  val panelDepa = {
    get[String]("division") ~
    get[String]("estado") ~
      get[Int]("program_id") ~
      get[String]("programa") ~
      get[String]("responsable") ~
      get[Option[Date]]("fecini") ~
      get[Option[Date]]("feccom") ~
      get[String]("pai") ~
      get[String]("pae") ~
      get[String]("spi") ~
      get[String]("cpi") ~
      get[String]("inversion") ~
      get[String]("gasto") map {
        case 
        division ~ 
        estado ~ 
        program_id ~ 
        programa ~ 
        responsable ~ 
        fecini ~ 
        feccom ~ 
        pai ~ 
        pae ~ 
        spi ~ 
        cpi ~ 
        inversion ~
        gasto => PanelDepartamento(division, estado, program_id, programa, responsable, fecini, feccom, pai, pae, spi, cpi, inversion,gasto)
      }
    
  }
  implicit val panelDepaWrites = Json.writes[PanelDepartamento]
}

case class Indicadores(
    spi: Double,
    cpi: Double,
    pae: Double
)

object Indicadores {
  val ind = {
      get[Double]("spi") ~
      get[Double]("cpi") ~
      get[Double]("pae") map {
        case spi ~ 
        cpi ~ 
        pae => Indicadores(spi, cpi, pae)
      }
    
  }
  implicit val indWrites = Json.writes[Indicadores]
}

case class ATM(id: Int, 
    nivel: String, 
    codigo: Int, 
    programa: String, 
    responsable: String, 
    pfecini: Option[Date], 
    pfecter: Option[Date], 
    rfecini: Option[Date],
    rfecter: Option[Date],
    pai: Double,
    pae: Double
    )

object ATM {
  val atm = {
    get[Int]("id") ~
      get[String]("nivel") ~
      get[Int]("codigo") ~
      get[String]("programa") ~
      get[String]("responsable") ~
      get[Option[Date]]("pfecini") ~
      get[Option[Date]]("pfecter") ~
      get[Option[Date]]("rfecini") ~
      get[Option[Date]]("rfecter") ~
      get[Double]("pai") ~
      get[Double]("pae") map {
        case id ~ 
        nivel ~ 
        codigo ~ 
        programa ~ 
        responsable ~ 
        pfecini ~ 
        pfecter ~ 
        rfecini ~ 
        rfecter ~ 
        pai ~
        pae => ATM(id, nivel, codigo, programa, responsable, pfecini, pfecter, rfecini, rfecter, pai,pae)
      }
    
  }
  implicit val atmWrites = Json.writes[ATM]
}

/**/
case class ReportePrograma(id: Int, 
    nivel: String, 
    estado: String,
    codigo: Int, 
    programa: String, 
    responsable: String, 
    pfecini: Option[Date], 
    pfecter: Option[Date], 
    rfecini: Option[Date],
    rfecter: Option[Date],
    hplan: Option[Double],
    hreal: Option[Double]
    )

object ReportePrograma {
  val rpt = {
    get[Int]("id") ~
      get[String]("nivel") ~
      get[String]("estado") ~
      get[Int]("codigo") ~
      get[String]("programa") ~
      get[String]("responsable") ~
      get[Option[Date]]("pfecini") ~
      get[Option[Date]]("pfecter") ~
      get[Option[Date]]("rfecini") ~
      get[Option[Date]]("rfecter") ~
      get[Option[Double]]("hplan") ~
      get[Option[Double]]("hreal") map {
        case id ~ 
        nivel ~
        estado ~ 
        codigo ~ 
        programa ~ 
        responsable ~ 
        pfecini ~ 
        pfecter ~ 
        rfecini ~ 
        rfecter ~ 
        hplan ~
        hreal => ReportePrograma(id, nivel, estado, codigo, programa, responsable, pfecini, pfecter, rfecini, rfecter, hplan, hreal)
      }
    
  }
  implicit val rptWrites = Json.writes[ReportePrograma]
}
/**/

case class StateSubTarea(
    sub_task_id: Int, 
    programa: String, 
    proyecto: String, 
    subtarea: String,
    lider: String, 
    responsable: String, 
    asignadas: Double,
    consumidas: Double,
    pfecini: Option[Date], 
    pfecter: Option[Date], 
    rfecini: Option[Date],
    rfecter: Option[Date],
    pai: Double,
    estado: String
    )

object StateSubTarea {
  val state = {
    get[Int]("sub_task_id") ~
      get[String]("programa") ~
      get[String]("proyecto") ~
      get[String]("subtarea") ~
      get[String]("lider") ~
      get[String]("responsable") ~
      get[Double]("asignadas") ~
      get[Double]("consumidas") ~      
      get[Option[Date]]("pfecini") ~
      get[Option[Date]]("pfecter") ~
      get[Option[Date]]("rfecini") ~
      get[Option[Date]]("rfecter") ~
      get[Double]("pai") ~
      get[String]("estado") map {
        case sub_task_id ~ 
        programa ~ 
        proyecto ~ 
        subtarea ~ 
        lider ~         
        responsable ~ 
        asignadas ~         
        consumidas ~        
        pfecini ~ 
        pfecter ~ 
        rfecini ~ 
        rfecter ~ 
        pai ~
        estado => StateSubTarea(
            sub_task_id,
            programa,
            proyecto,
            subtarea,lider,
            responsable, asignadas, consumidas, pfecini, pfecter, rfecini, rfecter, pai,estado)
      }
    
  }
  implicit val estadosubtareaWrites = Json.writes[StateSubTarea]
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

case class ReportOnline(id: Int,tipo: String)

object Formatters {
  implicit val repoFormat = Json.format[ReportOnline]
}

case class Pie(dId: Int, 
    division: String, 
    cantidad: Int, 
    porcentaje: Double
    )
    
object Pie {
  val pie = {
    get[Int]("dId") ~
      get[String]("division") ~
      get[Int]("cantidad") ~
      get[Double]("porcentaje")  map {
        case dId ~ 
        division ~ 
        cantidad ~ 
        porcentaje  => Pie(dId, division, cantidad, porcentaje)
      }
    
  }
  implicit val pieWrites = Json.writes[Pie]
}

case class ReportHoras(
                        nombre: String,
                        mes: Int,
                        programa: String,
                        proyecto: String,
                        tarea: String,
                        subtarea: String,
                        horas: String,
                        area: String,
                        departamento: String
                      )

object ReportHoras {

  val reporthoras = {
    get[String]("nombre") ~
      get[Int]("mes") ~
      get[String]("programa") ~
      get[String]("proyecto") ~
      get[String]("tarea") ~
      get[String]("subtarea") ~
      get[String]("horas") ~
      get[String]("area") ~
      get[String]("departamento")  map {
      case nombre ~
          mes ~
          programa ~
          proyecto ~
          tarea ~
          subtarea ~
          horas ~
          area ~
          departamento => ReportHoras(
        nombre,
        mes,
        programa,
        proyecto,
        tarea,
        subtarea,
        horas,
        area,
        departamento
      )
    }

  }
}