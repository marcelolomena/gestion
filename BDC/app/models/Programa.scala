package models

import anorm._
import anorm.SqlParser._
import java.util.Date
import play.api.libs.json._

/**
 * @author marcelo
 *
 * d.division,t1.program_type,t2.sub_type,w.workflow_status,a.program_id,a.program_name,a.release_date
 */
case class Programa(
  program_id: Int,
  division: String,
  program_type: String,
  sub_type: String,
  workflow_status: String,
  program_name: String,
  program_description: String,
  program_code: Int,
  initiation_planned_date: Option[Date],
  closure_date: Option[Date],
  release_date: Option[Date],
  planned_hours: Double,
  pai: Double,
  pae: Double,
  spi: Double,
  cpi: Double,
  impact_type: String,
  sap_number: Option[String])

object Programa {
  val programa = {
    get[Int]("program_id") ~
      get[String]("division") ~
      get[String]("program_type") ~
      get[String]("sub_type") ~
      get[String]("workflow_status") ~
      get[String]("program_name") ~
      get[String]("program_description") ~
      get[Int]("program_code") ~
      get[Option[Date]]("initiation_planned_date") ~
      get[Option[Date]]("closure_date") ~
      get[Option[Date]]("release_date") ~
      get[Double]("planned_hours") ~
      get[Double]("pai") ~
      get[Double]("pae") ~
      get[Double]("spi") ~
      get[Double]("cpi") ~
      get[String]("impact_type") ~
      get[Option[String]]("sap_number") map {
        case program_id ~
          division ~
          program_type ~
          sub_type ~
          workflow_status ~
          program_name ~
          program_description ~
          program_code ~
          initiation_planned_date ~
          closure_date ~
          release_date ~
          planned_hours ~
          pai ~
          pae ~
          spi ~
          cpi ~
          impact_type ~
          sap_number => Programa(
          program_id,
          division,
          program_type,
          sub_type,
          workflow_status,
          program_name,
          program_description,
          program_code,
          initiation_planned_date,
          closure_date,
          release_date,
          planned_hours,
          pai,
          pae,
          spi,
          cpi,
          impact_type,
          sap_number)
      }

  }
  implicit val programaWrites = Json.writes[Programa]
}

case class Recurso(
  sno: Int,
  cantidad: Int,
  program_id: Int,
  programa: String,
  recurso: String,
  proyecto: String,
  pId: Int,
  tarea: String,
  tId: Int,
  subtarea: String,
  sub_task_id: Int,
  planeadas: Double,
  trabajadas: Double,
  porcentaje: Double,
  plan_start_date: Option[Date],
  plan_end_date: Option[Date],
  estado: Option[String])

object Recurso {
  val recurso = {
    get[Int]("sno") ~
      get[Int]("cantidad") ~
      get[Int]("program_id") ~
      get[String]("programa") ~
      get[String]("recurso") ~
      get[String]("proyecto") ~
      get[Int]("pId") ~
      get[String]("tarea") ~
      get[Int]("tId") ~
      get[String]("subtarea") ~
      get[Int]("sub_task_id") ~
      get[Double]("planeadas") ~
      get[Double]("trabajadas") ~
      get[Double]("porcentaje") ~
      get[Option[Date]]("plan_start_date") ~
      get[Option[Date]]("plan_end_date") ~
      get[Option[String]]("estado") map {
        case sno ~
          cantidad ~
          program_id ~
          programa ~
          recurso ~
          proyecto ~
          pId ~
          tarea ~
          tId ~
          subtarea ~
          sub_task_id ~
          planeadas ~
          trabajadas ~
          porcentaje ~
          plan_start_date ~
          plan_end_date ~
          estado => Recurso(
          sno,
          cantidad,
          program_id,
          programa,
          recurso,
          proyecto,
          pId,
          tarea,
          tId,
          subtarea,
          sub_task_id,
          planeadas,
          trabajadas,
          porcentaje,
          plan_start_date,
          plan_end_date,
          estado)
      }

  }
  implicit val recursoWrites = Json.writes[Recurso]
}

case class Asignado(
  uid: Int,
  nombre: String,
  asignado: Int)

object Asignado {
  val asignado = {
    get[Int]("uid") ~
      get[String]("nombre") ~
      get[Int]("estado") map {
        case uid ~
          nombre ~
          asignado => Asignado(
          uid,
          nombre,
          asignado)
      }

  }
  implicit val recursoWrites = Json.writes[Asignado]
}