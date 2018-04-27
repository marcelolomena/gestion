package services;

import play.api.Play.current
import play.api.db.DB;
import anorm.SqlParser._;
import models._;
import anorm._
import play.api.data.Form
import play.i18n._
import play.Logger
import java.util.Date;
object DivisionService extends CustomColumns {
  val langObj = new Lang(Lang.forCode("es-ES"))

  def findAllDivisionList(pagNo: String, recordOnPage: String): Seq[Divisions] = {

    val ini = recordOnPage.toInt * (pagNo.toInt - 1)
    val end = recordOnPage.toInt

    val sqlString =
      """
        |SELECT a.dId,a.division,a.user_id,a.is_deleted,a.updated_by,a.updation_date,a.idRRHH,b.codDivision,b.glosaDivision FROM art_division_master a
        |LEFT OUTER JOIN
        |(
        |SELECT codDivision,glosaDivision FROM RecursosHumanos
        |WHERE periodo=(SELECT MAX(periodo) FROM RecursosHumanos)
        |AND rutJefe=(SELECT numRut FROM RecursosHumanos WHERE cui=852 AND periodo=(SELECT MAX(periodo) FROM RecursosHumanos) AND glosaCargoAct NOT LIKE '%Secretaria%' AND glosaCargoAct NOT LIKE '%auxiliar%')
        |AND glosaCargoAct NOT LIKE '%Secretaria%'
        |AND glosaCargoAct NOT LIKE '%auxiliar%'
        |) b
        |ON a.idRRHH = b.codDivision
        |ORDER BY a.division OFFSET {ini} ROWS FETCH NEXT {end} ROWS ONLY
      """.stripMargin

    DB.withConnection { implicit connection =>
      SQL(sqlString).on('ini->ini,'end->end).as(Divisions.division *)
    }
  }

  def findAllDivisions: Seq[Divisions] = {
    var sqlString = ""
    sqlString = "SELECT  * from art_division_master where is_deleted = 0 order by division"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(Divisions.division *)
    }
  }

  def divisionCount(): Long = {
    DB.withConnection { implicit connection =>
      var sqlString = ""
      sqlString = "SELECT count(*) from art_division_master "
      val count: Long = SQL(sqlString).as(scalar[Long].single)
      count
    }
  }

  def saveDivision(division: Divisions): Long = {
    DB.withConnection { implicit connection =>
      val lastsaved = SQL(
        """
          insert into art_division_master ( division, user_id,updated_by,updation_date, is_deleted) values (
           {division},{user_id},{updated_by},{updation_date},{is_deleted})
          """).on(
          'division -> division.division.trim(),
          'user_id -> division.user_id,
          'updated_by -> division.updated_by,
          'updation_date -> new Date(),
          'is_deleted -> division.is_deleted,
          'idRRHH -> division.idRRHH).executeInsert(scalar[Long].singleOpt)
      lastsaved.last
    }
  }

  def updateDivision(division: Divisions): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_division_master
          set 
          division={division},
          user_id={user_id} ,
			    is_deleted={is_deleted},
          updated_by={updated_by},
          updation_date={updation_date},
          idRRHH={idRRHH}
          where dId={dId}
          """).on(
          'dId -> division.dId,
          'division -> division.division.trim(),
          'user_id -> division.user_id,
          'updated_by -> division.updated_by,
          'updation_date -> new Date(),
          'is_deleted -> division.is_deleted,
           'idRRHH -> division.codDivision).executeUpdate()
    }
  }

  def findDivisionById(dId: Integer) = {
    DB.withConnection { implicit connection =>

      val sqlString =
        """
          |SELECT a.dId,a.division,a.user_id,a.is_deleted,a.updated_by,a.updation_date,a.idRRHH,b.codDivision,b.glosaDivision FROM art_division_master a
          |LEFT OUTER JOIN
          |(
          |SELECT codDivision,glosaDivision FROM RecursosHumanos
          |WHERE periodo=(SELECT MAX(periodo) FROM RecursosHumanos)
          |AND rutJefe=(SELECT numRut FROM RecursosHumanos WHERE cui=852 AND periodo=(SELECT MAX(periodo) FROM RecursosHumanos) AND glosaCargoAct NOT LIKE '%Secretaria%' AND glosaCargoAct NOT LIKE '%auxiliar%')
          |AND glosaCargoAct NOT LIKE '%Secretaria%'
          |AND glosaCargoAct NOT LIKE '%auxiliar%'
          |) b
          |ON a.idRRHH = b.codDivision
          |WHERE dId = {dId}
        """.stripMargin

      SQL(sqlString).on('dId -> dId).as(Divisions.division.singleOpt)

    }
  }

  def findDivisionByTable(): Seq[DivisionsList] = {
    DB.withConnection { implicit connection =>

      val sqlString =
        """
          |SELECT codDivision,glosaDivision FROM RecursosHumanos
          |WHERE periodo=(SELECT MAX(periodo) FROM RecursosHumanos)
          |AND rutJefe=(SELECT numRut FROM RecursosHumanos WHERE cui=852 AND periodo=(SELECT MAX(periodo) FROM RecursosHumanos) AND glosaCargoAct NOT LIKE '%Secretaria%' AND glosaCargoAct NOT LIKE '%auxiliar%')
          |AND glosaCargoAct NOT LIKE '%Secretaria%'
          |AND glosaCargoAct NOT LIKE '%auxiliar%'
          |ORDER BY glosaDivision
        """.stripMargin

      SQL(sqlString).as(DivisionsList.divisionList *)

    }
  }

  /**
   * delete milestone information
   */

  def changeStatusDivisionStatus(id: Integer, is_deleted: Int, uid: Int): Int = {
    DB.withConnection { implicit connection =>
      SQL(
        """
          update art_division_master
          set 
			    is_deleted={is_deleted},
          updated_by={updated_by},
          updation_date={updation_date}
          where dId={dId}
          """).on(
          'dId -> id,
          'updated_by -> uid,
          'updation_date -> new Date(),
          'is_deleted -> is_deleted).executeUpdate()
    }
  }

  def findDivisionByName(division: String) = {
    val sqlString = "select * from art_division_master where is_deleted = 0 AND division = '" + division + "'"
    //println(sqlString)
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(Divisions.division *)
      result
    }
  }
  def findDivisionByNameActiveAndInactive(division: String) = {
    val sqlString = "select * from art_division_master where  division = '" + division + "'"
    //println(sqlString)
    DB.withConnection { implicit connection =>
      val result = SQL(sqlString).as(Divisions.division *)
      result
    }
  }

  def findDivisionByNameForEdit(division: String, division_id: String): Seq[Divisions] = {
    var sql = "select d.* from art_division_master d where d.is_deleted = 0  AND d.division='" + division.trim() + "' AND d.dId <>'" + division_id + "'"
    DB.withConnection { implicit connection =>
      val result = SQL(sql).as(Divisions.division *)
      result
    }
  }
  def validateDivisionForm(form: Form[Divisions]): Form[Divisions] = {
    var newform: Form[Divisions] = null
    val division_id = form.data.get("id").get.trim()
    // val descriptionlegth = form.data.get("description").get.trim().length()
    val division = form.data.get("division").get.trim()
    /*    if (descriptionlegth <= 4 || descriptionlegth >= 500) {
      newform = form.withError("description", Messages.get(langObj, ("error.description.minmax")))
    }*/

    val obj = findDivisionByNameForEdit(division, division_id)
    if (obj.size > 0) {
      newform = form.withError("division", Messages.get(langObj, "divison.divisionexist"))
    }

    if (newform != null) {
      newform
    } else {
      form
    }
  }

  def findAllDivision(): Seq[Divisions] = {
    var sqlString = ""
    sqlString = "SELECT  d.* from art_division_master d where d.is_deleted = 0"
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(Divisions.division *)
    }
  }

  def findAllDivisionCompatibility(): Seq[Divisions] = {

    var sqlString =
      """
        |SELECT a.dId,
        |a.division,
        |a.user_id,
        |a.is_deleted,
        |a.updated_by,
        |a.updation_date,
        |a.idRRHH,
        |b.codDivision,
        |b.glosaDivision FROM art_division_master a
        |LEFT OUTER JOIN
        |(
        |SELECT codDivision,glosaDivision FROM RecursosHumanos
        |WHERE periodo=(SELECT MAX(periodo) FROM RecursosHumanos)
        |AND rutJefe=(SELECT numRut FROM RecursosHumanos WHERE cui=852 AND periodo=(SELECT MAX(periodo) FROM RecursosHumanos) AND glosaCargoAct NOT LIKE '%Secretaria%' AND glosaCargoAct NOT LIKE '%auxiliar%')
        |AND glosaCargoAct NOT LIKE '%Secretaria%'
        |AND glosaCargoAct NOT LIKE '%auxiliar%'
        |) b
        |ON a.idRRHH = b.codDivision
        |WHERE a.is_deleted = 0
      """.stripMargin
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(Divisions.division *)
    }
  }

  def findAllDivisionsCompatibility(): Seq[Divisions] = {

    var sqlString =
      """
        |SELECT a.dId,
        |a.division,
        |a.user_id,
        |a.is_deleted,
        |a.updated_by,
        |a.updation_date,
        |a.idRRHH,
        |b.codDivision,
        |b.glosaDivision FROM art_division_master a
        |LEFT OUTER JOIN
        |(
        |SELECT codDivision,glosaDivision FROM RecursosHumanos
        |WHERE periodo=(SELECT MAX(periodo) FROM RecursosHumanos)
        |AND rutJefe=(SELECT numRut FROM RecursosHumanos WHERE cui=852 AND periodo=(SELECT MAX(periodo) FROM RecursosHumanos) AND glosaCargoAct NOT LIKE '%Secretaria%' AND glosaCargoAct NOT LIKE '%auxiliar%')
        |AND glosaCargoAct NOT LIKE '%Secretaria%'
        |AND glosaCargoAct NOT LIKE '%auxiliar%'
        |) b
        |ON a.idRRHH = b.codDivision
        |WHERE a.is_deleted = 0
        |ORDER BY a.division
      """.stripMargin
    DB.withConnection { implicit connection =>
      SQL(sqlString).as(Divisions.division *)
    }
  }



  def findIdDivisionRRHH(dId:Int): Option[Int] = {
    DB.withConnection { implicit connection =>
      SQL("SELECT idRRHH FROM art_division_master WHERE dId={dId}").on('dId->dId).as(scalar[Int].singleOpt)
    }
  }

  def findNewDivisionRRHH(dId:Int): Option[String] = {
    DB.withConnection { implicit connection =>
      val sqlstr =
        """
          |SELECT TOP 1 b.glosaDivision FROM art_division_master a
          |JOIN RecursosHumanos b
          |ON a.idRRHH = b.codDivision
          |WHERE a.dId = {dId}
          |AND b.periodo=(SELECT MAX(periodo) FROM RecursosHumanos)
        """.stripMargin

      SQL(sqlstr).on('dId->dId).as(scalar[String].singleOpt)
    }
  }

}