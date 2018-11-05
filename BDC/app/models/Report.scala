package models

import anorm.SqlParser._
import anorm._
import java.util.Date
import play.api.libs.json._

/**
  * @author marcelo
  */

case class ResultHealth(
                         nombre: String,
                         programa: String,
                         texto: String,
                         id_programa: Int,
                         id_proyecto: Option[Int],
                         indicador_0: Int,
                         indicador_1: Int,
                         indicador_2: Int,
                         indicador_3: Int,
                         indicador_4: Int,
                         indicador_5: Int,
                         indicador_6: Int,
                         indicador_7: Int
                       )
object ResultHealth {
  implicit val reads = Json.reads[ResultHealth]
  implicit val writes = Json.writes[ResultHealth]

  implicit val parser: RowParser[ResultHealth] = {
    get[String]("nombre")  ~
      get[String]("programa")  ~
      get[String]("texto")  ~
      get[Int]("id_programa")  ~
      get[Option[Int]]("id_proyecto")  ~
      get[Int]("indicador_0") ~
      get[Int]("indicador_1") ~
      get[Int]("indicador_2") ~
      get[Int]("indicador_3") ~
      get[Int]("indicador_4") ~
      get[Int]("indicador_5") ~
      get[Int]("indicador_6") ~
      get[Int]("indicador_7") map {
      case nombre ~
          programa ~
          texto ~
          id_programa ~
          id_proyecto ~
          indicador_0 ~
          indicador_1 ~
          indicador_2 ~
          indicador_3 ~
          indicador_4 ~
          indicador_5 ~
          indicador_6 ~
          indicador_7 =>
          ResultHealth(
          nombre,
          programa,
          texto,
          id_programa,
          id_proyecto,
          indicador_0,
          indicador_1,
          indicador_2,
          indicador_3,
          indicador_4,
          indicador_5,
          indicador_6,
          indicador_7
        )
    }
  }
}


case class Grid(x: Int, y: Int, z: Int, v: JsValue)

object Grid {
  implicit val implicitGridWrites = new Writes[Grid] {
    def writes(grid: Grid): JsValue = {
      Json.obj(
        "page" -> grid.x,
        "total" -> grid.y,
        "records" -> grid.z,
        "rows" -> grid.v
      )
    }
  }
}

case class Bubble(a: String, v: JsValue)

object Bubble {
  implicit val implicitBubbleWrites = new Writes[Bubble] {
    def writes(bubble: Bubble): JsValue = {
      Json.obj(
        "name" -> bubble.a,
        "data" -> bubble.v
      )
    }
  }
}

case class Report(
                  program_id: Int,
                  project_id: Option[BigDecimal],
                  task_id: Option[BigDecimal],
                  subtask_id: Option[BigDecimal],
                  program_name: Option[String],
                  nombre_lider: Option[String],
                  program_type: Option[String],
                  work_flow_status: Option[String],
                  impact_type: Option[String],
                  name_div: Option[String],
                  name_man: Option[String],
                  name_dep: Option[String],
                  plan_start_date: Option[Date],
                  plan_end_date: Option[Date],
                  real_start_date: Option[Date],
                  real_end_date: Option[Date],
                  release_date: Option[Date],
                  pai: Option[BigDecimal],
                  pae: Option[BigDecimal],
                  spi: Option[BigDecimal],
                  cpi: Option[BigDecimal],
                  hours: Option[BigDecimal],
                  allocation: Option[BigDecimal],
                  pcod: Option[BigDecimal],
                  foco: Option[String],
                  tamano: Option[String],
                  count_project: Option[BigDecimal],
                  count_task: Option[BigDecimal],
                  count_subtask: Option[BigDecimal],
                  tipo: Option[String],
                  pmo: Option[String],
                  count_subtask_usr: Option[BigDecimal]
 )

object Report {

  val report = {
      get[Int]("program_id") ~
      get[Option[BigDecimal]]("project_id") ~
      get[Option[BigDecimal]]("task_id") ~
      get[Option[BigDecimal]]("subtask_id") ~
      get[Option[String]]("program_name") ~
      get[Option[String]]("nombre_lider") ~
      get[Option[String]]("program_type") ~
      get[Option[String]]("work_flow_status") ~
      get[Option[String]]("impact_type") ~
      get[Option[String]]("name_div") ~
      get[Option[String]]("name_man") ~
      get[Option[String]]("name_dep") ~
      get[Option[Date]]("plan_start_date") ~
      get[Option[Date]]("plan_end_date") ~
      get[Option[Date]]("real_start_date") ~
      get[Option[Date]]("real_end_date") ~
      get[Option[Date]]("release_date") ~
      get[Option[BigDecimal]]("pai") ~
      get[Option[BigDecimal]]("pae")  ~
      get[Option[BigDecimal]]("spi") ~
      get[Option[BigDecimal]]("cpi") ~
      get[Option[BigDecimal]]("hours") ~
      get[Option[BigDecimal]]("allocation") ~
      get[Option[BigDecimal]]("pcod") ~
      get[Option[String]]("foco") ~
      get[Option[String]]("tamano") ~
      get[Option[BigDecimal]]("count_project") ~
      get[Option[BigDecimal]]("count_task") ~
      get[Option[BigDecimal]]("count_subtask") ~
      get[Option[String]]("tipo") ~
      get[Option[String]]("pmo") ~
      get[Option[BigDecimal]]("count_subtask_usr")  map {
      case
        program_id ~
        project_id  ~
        task_id  ~
        subtask_id  ~
        program_name ~
        nombre_lider ~
        program_type ~
        work_flow_status ~
        impact_type ~
        name_div ~
        name_man ~
        name_dep ~
        plan_start_date ~
        plan_end_date ~
        real_start_date ~
        real_end_date ~
        release_date ~
        pai ~
        pae ~
        spi ~
        cpi ~
        hours ~
        allocation ~
        pcod ~
        foco ~
        tamano ~
        count_project ~
        count_task ~
        count_subtask ~
        tipo ~
        pmo ~
        count_subtask_usr => Report(
        program_id ,
        project_id,
        task_id,
        subtask_id,
        program_name,
        nombre_lider,
        program_type,
        work_flow_status,
        impact_type,
        name_div ,
        name_man,
        name_dep ,
        plan_start_date,
        plan_end_date,
        real_start_date,
        real_end_date,
        release_date,
        pai,
        pae,
        spi,
        cpi,
        hours,
        allocation,
        pcod,
        foco,
        tamano,
        count_project,
        count_task,
        count_subtask,
        tipo,
        pmo,
        count_subtask_usr
        )
    }

  }

  implicit object ReportFormat extends Format[Report] {
    def writes(report: Report): JsValue = {
      val reportSeq = Seq(
        "program_id" -> JsNumber(report.program_id),
        "project_id" -> JsNumber(report.project_id.getOrElse(0)),
        "task_id" -> JsNumber(report.task_id.getOrElse(0)),
        "subtask_id" -> JsNumber(report.subtask_id.getOrElse(0)),
        "program_name" -> JsString(report.program_name.getOrElse("")),
        "nombre_lider" -> JsString(report.nombre_lider.getOrElse("")),
        "program_type" -> JsString(report.program_type.getOrElse("")),
        "work_flow_status" -> JsString(report.work_flow_status.getOrElse("")),
        "impact_type" -> JsString(report.impact_type.getOrElse("")),
        "name_div" -> JsString(report.name_div.getOrElse("")),
        "name_man" -> JsString(report.name_man.getOrElse("")),
        "name_dep" -> JsString(report.name_dep.getOrElse("")),
        "plan_start_date" -> JsString(new java.text.SimpleDateFormat("dd/MM/yyyy").format(report.plan_start_date.getOrElse(new Date(0)))),
        "plan_end_date" -> JsString(new java.text.SimpleDateFormat("dd/MM/yyyy").format(report.plan_end_date.getOrElse(new Date(0)))),
        "real_start_date" -> JsString(new java.text.SimpleDateFormat("dd/MM/yyyy").format(report.real_start_date.getOrElse(new Date(0)))),
        "real_end_date" -> JsString(new java.text.SimpleDateFormat("dd/MM/yyyy").format(report.real_end_date.getOrElse(new Date(0)))),
        "release_date" -> JsString(new java.text.SimpleDateFormat("dd/MM/yyyy").format(report.release_date.getOrElse(new Date(0)))),
        "pai" -> JsNumber(report.pai.getOrElse(0)),
        "pae" -> JsNumber(report.pae.getOrElse(0)),
        "spi" -> JsNumber(report.spi.getOrElse(0)),
        "cpi" -> JsNumber(report.cpi.getOrElse(0)),
        "hours" -> JsNumber(report.hours.getOrElse(0)),
        "allocation" -> JsNumber(report.allocation.getOrElse(0)),
        "pcod" -> JsNumber(report.pcod.getOrElse(0)),
        "foco" -> JsString(report.foco.getOrElse("")),
        "tamano" -> JsString(report.tamano.getOrElse("")),
        "count_project" -> JsNumber(report.count_project.getOrElse(0)),
        "count_task" -> JsNumber(report.count_task.getOrElse(0)),
        "count_subtask" -> JsNumber(report.count_subtask.getOrElse(0)),
        "tipo" -> JsString(report.tipo.getOrElse("")),
        "pmo" -> JsString(report.pmo.getOrElse("")),
        "count_subtask_usr" -> JsNumber(report.count_subtask_usr.getOrElse(0))
      )
      JsObject(reportSeq)
    }

    def reads(json: JsValue): JsResult[Report] = {
      JsSuccess(Report(
        0,
        Option[BigDecimal](0),
        Option[BigDecimal](0),
        Option[BigDecimal](0),
        Option[String](""),
        Option[String](""),
        Option[String](""),
        Option[String](""),
        Option[String](""),
        Option[String](""),
        Option[String](""),
        Option[String](""),
        Option[Date](new Date),
        Option[Date](new Date),
        Option[Date](new Date),
        Option[Date](new Date),
        Option[Date](new Date),
        Option[BigDecimal](0),
        Option[BigDecimal](0),
        Option[BigDecimal](0),
        Option[BigDecimal](0),
        Option[BigDecimal](0),
        Option[BigDecimal](0),
        Option[BigDecimal](0),
        Option[String](""),
        Option[String](""),
        Option[BigDecimal](0),
        Option[BigDecimal](0),
        Option[BigDecimal](0),
        Option[String](""),
        Option[String](""),
        Option[BigDecimal](0)
      ))
    }
  }

  case class Pie(
                  dId: BigDecimal,
                  name: String,
                  y: BigDecimal,
                  porcentaje: BigDecimal
                )

  object Pie {
    val pie = {
      get[BigDecimal]("dId") ~
        get[String]("name") ~
        get[BigDecimal]("y") ~
        get[BigDecimal]("porcentaje")  map {
        case dId ~
          name ~
          y ~
          porcentaje  => Pie(dId, name, y, porcentaje)
      }
    }
  }

  object Pie2 {
    val pie2 = {
      get[BigDecimal]("dId") ~
        get[String]("division") ~
        get[BigDecimal]("cantidad") ~
        get[BigDecimal]("porcentaje")  map {
        case dId ~
          division ~
          cantidad ~
          porcentaje  => Pie(dId, division, cantidad, porcentaje)
      }
    }
  }

  implicit object PieFormat extends Format[Pie] {
    def writes(pie: Pie): JsValue = {
      val pieSeq = Seq(
        "dId" -> JsNumber(pie.dId),
        "name" -> JsString(pie.name),
        "y" -> JsNumber(pie.y),
        "porcentaje" -> JsNumber(pie.porcentaje)
      )
      JsObject(pieSeq)
    }

    def reads(json: JsValue): JsResult[Pie] = {
      JsSuccess(Pie(
        0,
        "",
        0,
        0
      ))
    }
  }

  case class Point(
                     x: BigDecimal,
                     y: BigDecimal,
                     z: BigDecimal,
                     programa: String
                   )
  object Point {
    val point = {
      get[BigDecimal]("x") ~
        get[BigDecimal]("y") ~
        get[BigDecimal]("z") ~
        get[String]("programa")  map {
        case x ~
          y ~
          z ~
          programa  => Point(x, y, z, programa)
      }
    }
  }

  implicit object BubbleFormat extends Format[Point] {
    def writes(point: Point): JsValue = {
      val pointSeq = Seq(
        "x" -> JsNumber(point.x),
        "y" -> JsNumber(point.y),
        "z" -> JsNumber(point.z),
        "programa" -> JsString(point.programa)
      )
      JsObject(pointSeq)
    }

    def reads(json: JsValue): JsResult[Point] = {
      JsSuccess(Point(
        0,
        0,
        0,
        ""
      ))
    }
  }

}