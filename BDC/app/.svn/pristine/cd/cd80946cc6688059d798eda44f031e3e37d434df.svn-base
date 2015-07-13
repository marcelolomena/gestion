package services

import play.api.Play.current
import play.api.db.DB
import anorm.SqlParser._
import models._
import anorm._
import com.typesafe.plugin._
import anorm.SqlQueryResult

object PertService {

  def findAllProgram(): Seq[ProgramCombo] = {
    var sqlString = ""
    sqlString = "SELECT program_id,program_name from art_program where is_active=1"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(ProgramCombo.pCombo *)
    }
  }
  
  //exec xpert '17-06-2015',13,2,1000,238,'LOS MARES 2015',878
  //@fecha_inicio varchar(10), @id_platilla int, @tipo int, @cajero int,@id_programa int,@direccion varchar(255),@uid int

   def pert(fecha: String,plantilla: Int, tipo: Int,cajero: Int,programa: Int,direccion: String, usuario: Int) = {
    DB.withConnection { implicit connection =>
      SQL("EXEC xpert {fecha_inicio},{id_platilla},{tipo},{cajero},{id_programa},{direccion},{uid}").on(
        'fecha_inicio -> fecha, 'id_platilla -> plantilla,'tipo -> tipo,'cajero -> cajero,'id_programa -> programa,'direccion -> direccion,'uid -> usuario).executeQuery().as(XPert.pert *)
    }
  } 
  
  
}