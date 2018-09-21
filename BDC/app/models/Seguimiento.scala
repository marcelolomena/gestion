package models

import anorm.SqlParser._
import anorm._
import java.util.Date

import play.api.libs.json._

/**/
case class ReportDocument(id: Int, 
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

object ReportDocument {
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
        hreal => ReportDocument(id, nivel, estado, codigo, programa, responsable, pfecini, pfecter, rfecini, rfecter, hplan, hreal)
      }
    
  }
  implicit val rptWrites = Json.writes[ReportDocument]
}


case class ListDocuments(id: Int,
                         file_name: String,
                         title: String,
                         fecha: Option[Date],
                         version: Int,
                         tipo: String,
                         parent_type: String,
                         extension: String,
                         encargado: String,
                         version_notes: String,
                         document_type:String
                         )

object ListDocuments {
  val rpt = {
    get[Int]("id") ~
      get[String]("file_name") ~
      get[String]("title") ~
      get[Option[Date]]("fecha") ~
      get[Int]("version") ~
      get[String]("tipo") ~
      get[String]("parent_type") ~
      get[String]("extension") ~
      get[String]("encargado") ~
      get[String]("version_notes") ~
      get[String]("document_type") map {
      case id ~
        file_name ~
        title ~
        fecha ~
        version ~
        tipo ~
        parent_type ~
        extension ~
        encargado ~
        version_notes ~
        document_type => ListDocuments(id, file_name, title, fecha, version, tipo, parent_type, extension, encargado, version_notes, document_type)
    }

  }
  implicit val rptWrites = Json.writes[ListDocuments]

  case class ListTypes(programa: Int,
                       id: Int,
                       nombre: String,
                       cantidad: Int,
                       description: String
                      )

  object ListTypes {
    val rpt = {
      get[Int]("programa") ~
        get[Int]("id") ~
        get[String]("nombre") ~
        get[Int]("cantidad") ~
        get[String]("description") map {
        case programa ~
          id ~
          nombre ~
          cantidad ~
          description => ListTypes(programa, id, nombre, cantidad, description)
      }

    }
    implicit val rptWrites = Json.writes[ListTypes]
  }

  case class PMOList(  id: Int,
                       nombre: String,
                       apellido: String
                      )

  object PMOList {
    val rpt = {
      get[Int]("id") ~
        get[String]("nombre") ~
        get[String]("apellido") map {
        case id ~
          nombre ~
          apellido  => PMOList(id, nombre, apellido)
      }

    }
    implicit val rptWrites = Json.writes[PMOList]
  }

  //program_id	program_code	program_name	responsable	workflow_status

  case class ProgramList(  program_id: Int,
                           program_code: Long,
                           program_name: String,
                           responsable:String,
                           workflow_status: String
                    )

  object ProgramList {
    val rpt = {
      get[Int]("program_id") ~
        get[Long]("program_code") ~
        get[String]("program_name") ~
        get[String]("responsable") ~
        get[String]("workflow_status") map {
        case program_id ~
          program_code ~
          program_name ~
          responsable ~
          workflow_status => ProgramList(program_id, program_code, program_name, responsable, workflow_status)
      }

    }
    implicit val rptWrites = Json.writes[ProgramList]
  }
}
