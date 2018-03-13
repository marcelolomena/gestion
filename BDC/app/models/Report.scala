package models

import anorm.SqlParser._
import anorm._
import java.util.Date
import play.api.libs.json._

/**
  * @author marcelo
  */

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

case class Report(
                  program_id: Int,
                  project_id: Option[BigDecimal],
                  task_id: Option[BigDecimal],
                  subtask_id: Option[BigDecimal],
                  program_name: Option[String],
                  nombre_lider: Option[String],
                  program_type: Option[String],
                  work_flow_status: Option[String],
                  name_div: Option[String],
                  name_man: Option[String],
                  name_dep: Option[String],
                  plan_start_date: Option[Date],
                  plan_end_date: Option[Date],
                  real_start_date: Option[Date],
                  real_end_date: Option[Date],
                  pai: Option[BigDecimal],
                  pae: Option[BigDecimal],
                  spi: Option[BigDecimal],
                  cpi: Option[BigDecimal],
                  hours: Option[BigDecimal],
                  allocation: Option[BigDecimal],
                  pcod: Option[BigDecimal],
                  foco: Option[String],
                  tamano: Option[String]
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
      get[Option[String]]("name_div") ~
      get[Option[String]]("name_man") ~
      get[Option[String]]("name_dep") ~
      get[Option[Date]]("plan_start_date") ~
      get[Option[Date]]("plan_end_date") ~
      get[Option[Date]]("real_start_date") ~
      get[Option[Date]]("real_end_date") ~
      get[Option[BigDecimal]]("pai") ~
      get[Option[BigDecimal]]("pae")  ~
      get[Option[BigDecimal]]("spi") ~
      get[Option[BigDecimal]]("cpi") ~
      get[Option[BigDecimal]]("hours") ~
      get[Option[BigDecimal]]("allocation") ~
      get[Option[BigDecimal]]("pcod") ~
      get[Option[String]]("foco") ~
      get[Option[String]]("tamano") map {
      case
        program_id ~
        project_id  ~
        task_id  ~
        subtask_id  ~
        program_name ~
        nombre_lider ~
        program_type ~
        work_flow_status ~
        name_div ~
        name_man ~
        name_dep ~
          plan_start_date ~
          plan_end_date ~
          real_start_date ~
          real_end_date ~
          pai ~
          pae ~
        spi ~
        cpi ~
          hours ~
          allocation ~
        pcod ~
        foco ~
        tamano => Report(
        program_id ,
        project_id,
        task_id,
        subtask_id,
        program_name ,
        nombre_lider ,
        program_type ,
        work_flow_status ,
        name_div ,
        name_man,
        name_dep ,
        plan_start_date,
        plan_end_date,
        real_start_date,
        real_end_date,
        pai,
        pae,
        spi ,
        cpi,
        hours,
        allocation,
        pcod,
        foco,
        tamano
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
        "name_div" -> JsString(report.name_div.getOrElse("")),
        "name_man" -> JsString(report.name_man.getOrElse("")),
        "name_dep" -> JsString(report.name_dep.getOrElse("")),
        "plan_start_date" -> JsString(new java.text.SimpleDateFormat("dd/MM/yyyy").format(report.plan_start_date.getOrElse(new Date(0)))),
        "plan_end_date" -> JsString(new java.text.SimpleDateFormat("dd/MM/yyyy").format(report.plan_end_date.getOrElse(new Date(0)))),
        "real_start_date" -> JsString(new java.text.SimpleDateFormat("dd/MM/yyyy").format(report.real_start_date.getOrElse(new Date(0)))),
        "real_end_date" -> JsString(new java.text.SimpleDateFormat("dd/MM/yyyy").format(report.real_end_date.getOrElse(new Date(0)))),
        "pai" -> JsNumber(report.pai.getOrElse(0)),
        "pae" -> JsNumber(report.pae.getOrElse(0)),
        "spi" -> JsNumber(report.spi.getOrElse(0)),
        "cpi" -> JsNumber(report.cpi.getOrElse(0)),
        "hours" -> JsNumber(report.hours.getOrElse(0)),
        "allocation" -> JsNumber(report.allocation.getOrElse(0)),
        "pcod" -> JsNumber(report.pcod.getOrElse(0)),
        "foco" -> JsString(report.foco.getOrElse("")),
        "tamano" -> JsString(report.tamano.getOrElse(""))
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
        Option[String]("")
      ))
    }

  }

/*
  val report = {
    get[Int]("id") ~
      get[String]("tipo") ~
      get[Int]("program_id") ~
      get[Option[String]]("program_name") ~
      get[Int]("period_art") ~
      get[Int]("period_rrhh") ~
      get[String]("email") ~
      get[Option[String]]("nombre_lider") ~
      get[Option[String]]("program_type") ~
      get[Option[String]]("work_flow_status") ~
      get[Option[Int]]("cod_div") ~
      get[Option[String]]("name_div") ~
      get[Option[Int]]("cod_man") ~
      get[Option[String]]("name_man") ~
      get[Option[Int]]("cod_dep") ~
      get[Option[String]]("name_dep") ~
      get[Option[Int]]("project_id") ~
      get[Option[String]]("project_name") ~
      get[Option[Int]]("task_id") ~
      get[Option[String]]("task_name") ~
      get[Option[Int]]("subtask_id") ~
      get[Option[String]]("subtask_name") ~
      get[Option[Float]]("hours") ~
      get[Option[Date]]("plan_start_date") ~
      get[Option[Date]]("plan_end_date") ~
      get[Option[Float]]("estimated_time") ~
      get[Option[Float]]("completion_percentage") ~
      get[Option[Float]]("expected_percentage") ~
      get[Option[Date]]("real_start_date") ~
      get[Option[Date]]("real_end_date") ~
      get[Option[Float]]("valor_ganado_esperado") ~
      get[Option[Float]]("valor_ganado") ~
      get[Option[Float]]("spi") ~
      get[Option[Float]]("cpi") ~
      get[Option[Float]]("ha") ~
      get[Option[Float]]("ev") ~
      get[Option[Float]]("pv") ~
      get[Option[Float]]("pai") ~
      get[Option[Float]]("pae") map {
      case   id ~
        tipo ~
        program_id ~
        program_name ~
        period_art ~
        period_rrhh ~
        email ~
        nombre_lider ~
        program_type ~
        work_flow_status ~
        cod_div ~
        name_div ~
        cod_man ~
        name_man ~
        cod_dep ~
        name_dep ~
        project_id ~
        project_name ~
        task_id ~
        task_name ~
        subtask_id ~
        subtask_name ~
        hours ~
        plan_start_date ~
        plan_end_date ~
        estimated_time ~
        completion_percentage ~
        expected_percentage ~
        real_start_date ~
        real_end_date ~
        valor_ganado_esperado ~
        valor_ganado ~
        spi ~
        cpi ~
        ha ~
        ev ~
        pv ~
        pai ~
        pae => Report(id ,
        tipo ,
        program_id ,
        program_name ,
        period_art ,
        period_rrhh ,
        email ,
        nombre_lider ,
        program_type ,
        work_flow_status ,
        cod_div ,
        name_div ,
        cod_man ,
        name_man ,
        cod_dep ,
        name_dep ,
        project_id ,
        project_name ,
        task_id ,
        task_name ,
        subtask_id ,
        subtask_name ,
        hours ,
        plan_start_date ,
        plan_end_date ,
        estimated_time ,
        completion_percentage ,
        expected_percentage ,
        real_start_date ,
        real_end_date ,
        valor_ganado_esperado ,
        valor_ganado ,
        spi ,
        cpi ,
        ha ,
        ev ,
        pv ,
        pai ,
        pae)
    }

  }


    implicit val reportWrites = new Writes[Report] {
      def writes(report: Report) = Json.obj(
        "id" -> report.id,
        "tipo" -> report.tipo,
        "program_id" -> report.program_id,
        "program_name" -> report.program_name.get,
        "period_art" -> report.period_art,
        "period_rrhh" -> report.period_rrhh,
        "email" -> report.email,
        "nombre_lider" -> report.nombre_lider.get,
        "program_type" -> report.program_type.get,
        "work_flow_status" -> report.work_flow_status.get,
        "cod_div" -> report.cod_div.get,
        "name_div" -> report.name_div.get,
        "cod_man" -> report.cod_man.get,
        "name_man" -> report.name_man.get,
        "cod_dep" -> report.cod_dep.get,
        "name_dep" -> report.name_dep.get,
        "project_id" -> report.project_id.get,
        "project_name" -> report.project_name.get,
        "task_id" -> report.task_id.get,
        "task_name" -> report.task_name.get,
        "subtask_id" -> report.task_name.get,
        "subtask_name" -> report.subtask_name.get,
        "hours" -> report.hours.get,
        "plan_start_date" -> report.plan_start_date.get,
        "plan_end_date" -> report.plan_end_date.get,
        "estimated_time" -> report.estimated_time.get,
        "completion_percentage" -> report.completion_percentage.get,
        "expected_percentage" -> report.expected_percentage.get,
        "real_start_date" -> report.real_start_date.get,
        "real_end_date" -> report.real_end_date.get,
        "valor_ganado_esperado" -> report.valor_ganado_esperado.get,
        "valor_ganado" -> report.valor_ganado.get,
        "spi" -> report.spi.get,
        "cpi" -> report.cpi.get,
        "ha" -> report.ha.get,
        "ev" -> report.ev.get,
        "pv" -> report.pv.get,
        "pai" -> report.pai.get,
        "pae" -> report.pae.get
      )
    }
*/
}